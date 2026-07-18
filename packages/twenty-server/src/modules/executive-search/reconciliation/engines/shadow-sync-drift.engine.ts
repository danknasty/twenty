import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncInboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-inbox.workspace-entity';
import { INBOX_STATUS } from 'src/modules/executive-search/sync/services/inbox.service';
import { ReconcileArgs } from 'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { ReconciliationEngine } from 'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { ReconciliationFinding } from 'src/modules/executive-search/reconciliation/reconciliation-finding.type';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import {
  parseFieldOwnershipCsv,
  projectIdentityLink,
  type FieldOwnershipRule,
  type ProjectionDiff,
} from 'src/modules/executive-search/reconciliation/engines/identity-link-projection.dry-projecter';

/** Inbox event suffix used by the shadow-sync pipeline. */
const SHADOW_SYNC_EVENT_SUFFIX = '.shadow_sync';
const SHADOW_SYNC_EVENT_TYPE = 'shadow_sync';

/**
 * Path to the field-ownership authority CSV.  Expressed relative to the repo
 * root; resolved against `__dirname` by walking up to the repo root.  The
 * compiled `dist/` tree mirrors `src/`, so the same offset applies in prod.
 */
const FIELD_OWNERSHIP_CSV_REPO_RELATIVE_PATH =
  'docs/executive-search/directus-field-ownership.csv';
// engines -> reconciliation -> executive-search -> modules -> src
// -> twenty-server -> packages -> repo root
const REPO_ROOT_FROM_ENGINE_DIR = '../../../../../../../';

const TWENTY_AUTHORITATIVE = 'TWENTY_AUTHORITATIVE';

/**
 * Reconciliation engine that performs the no-writes comparison side of the
 * shadow-sync pipeline.
 *
 * It scans PENDING `.shadow_sync` inbox rows, dry-projects each one against the
 * current Twenty record (respecting field-ownership authorities), emits
 * `FIELD_DRIFT` findings, and marks the inbox rows `PROCESSED`.  It NEVER
 * applies the projection — domain data is never mutated.
 */
@Injectable()
export class ShadowSyncDriftReconciliationEngine
  implements ReconciliationEngine
{
  readonly name = 'shadow-sync-drift';

  private readonly logger = new Logger(ShadowSyncDriftReconciliationEngine.name);
  private fieldOwnershipCache: Record<string, FieldOwnershipRule> | null = null;

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    registry: ReconciliationEngineRegistry,
  ) {
    // Self-register so callers can resolve the engine by name from the registry.
    registry.register(this);
  }

  async reconcile(args: ReconcileArgs): Promise<ReconciliationFinding[]> {
    const authContext = buildSystemAuthContext(args.workspaceId);
    const fieldOwnership = this.loadFieldOwnership();

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const inboxRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            args.workspaceId,
            ExternalSyncInboxWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const linkRepository =
          await this.globalWorkspaceOrmManager.getRepository(
            args.workspaceId,
            ExternalEntityLinkWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const pendingRows = (await inboxRepository.find({
          where: { status: INBOX_STATUS.PENDING },
          order: { createdAt: 'ASC' },
          take: 500,
        })) as ExternalSyncInboxWorkspaceEntity[];

        const shadowRows = pendingRows.filter((row) =>
          this.isShadowSyncEvent(row.eventType),
        );

        const findings: ReconciliationFinding[] = [];

        for (const row of shadowRows) {
          const rowFindings = await this.compareRow({
            workspaceId: args.workspaceId,
            inboxRow: row,
            linkRepository,
            fieldOwnership,
          });

          findings.push(...rowFindings);

          // Comparison-only: mark the inbox row processed.  No domain write.
          await inboxRepository.update(row.id, {
            status: INBOX_STATUS.PROCESSED,
            processedAt: new Date().toISOString(),
          } as any);
        }

        if (findings.length > 0) {
          this.logger.log(
            `Emitted ${findings.length} FIELD_DRIFT finding(s) across ${shadowRows.length} shadow-sync row(s) for workspace ${args.workspaceId}`,
          );
        }

        return findings;
      },
      authContext,
    );
  }

  private async compareRow(args: {
    workspaceId: string;
    inboxRow: ExternalSyncInboxWorkspaceEntity;
    linkRepository: any;
    fieldOwnership: Record<string, FieldOwnershipRule>;
  }): Promise<ReconciliationFinding[]> {
    const { inboxRow, linkRepository, fieldOwnership } = args;

    const link = (await linkRepository.findOneBy({
      externalSystemName: inboxRow.externalSystemName,
      externalEntityName: inboxRow.entityName,
      externalRecordId: inboxRow.entityId,
    })) as ExternalEntityLinkWorkspaceEntity | null;

    if (!link) {
      // No matching link — nothing to project against.  Comparison-only, so we
      // simply emit nothing for this row.
      this.logger.debug(
        `No externalEntityLink for shadow-sync event ${inboxRow.id} (${inboxRow.entityName}/${inboxRow.entityId})`,
      );
      return [];
    }

    const currentRecord = await this.loadCurrentRecord(
      args.workspaceId,
      link.twentyEntityName,
      link.twentyRecordId,
    );

    const diffs = projectIdentityLink({
      payload: inboxRow.payload ?? {},
      link: {
        twentyEntityName: link.twentyEntityName,
        twentyRecordId: link.twentyRecordId,
        externalSystemName: link.externalSystemName,
        externalEntityName: link.externalEntityName,
        externalRecordId: link.externalRecordId,
      },
      currentRecord,
      fieldOwnership,
    });

    if (diffs.length === 0) {
      return [];
    }

    const severity = this.severityFor(diffs);

    return [
      {
        objectName: link.twentyEntityName || inboxRow.entityName,
        recordId: link.twentyRecordId || inboxRow.entityId,
        kind: 'FIELD_DRIFT',
        severity,
        detail: this.describeDrift(inboxRow, diffs),
        dryRunSafe: true,
      },
    ];
  }

  private async loadCurrentRecord(
    workspaceId: string,
    twentyEntityName: string,
    twentyRecordId: string,
  ): Promise<Record<string, unknown> | null> {
    if (!twentyEntityName || !twentyRecordId) {
      return null;
    }

    try {
      const repository = await this.globalWorkspaceOrmManager.getRepository<any>(
        workspaceId,
        twentyEntityName,
        { shouldBypassPermissionChecks: true },
      );

      const record = await repository.findOneBy({ id: twentyRecordId });

      return record ? (record as Record<string, unknown>) : null;
    } catch (err) {
      this.logger.warn(
        `Unable to load current record ${twentyEntityName}/${twentyRecordId}: ${err instanceof Error ? err.message : 'unknown'}`,
      );
      return null;
    }
  }

  /**
   * Severity derives from the drifted-field count and classification.  A drift
   * on a Twenty-authoritative field is always HIGH (the external system is
   * conflicting with data Twenty owns).
   */
  private severityFor(diffs: ProjectionDiff[]): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (diffs.some((diff) => diff.authority === TWENTY_AUTHORITATIVE)) {
      return 'HIGH';
    }

    if (diffs.length >= 4) {
      return 'HIGH';
    }

    if (diffs.length >= 2) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  private describeDrift(
    inboxRow: ExternalSyncInboxWorkspaceEntity,
    diffs: ProjectionDiff[],
  ): string {
    const summary = diffs
      .map(
        (diff) =>
          `${diff.fieldName} (${diff.authority})`,
      )
      .join(', ');

    return `Shadow-sync drift on ${inboxRow.entityName}/${inboxRow.entityId}: ${diffs.length} field(s) differ — ${summary}`;
  }

  private isShadowSyncEvent(eventType: string): boolean {
    return (
      eventType === SHADOW_SYNC_EVENT_TYPE ||
      eventType.endsWith(SHADOW_SYNC_EVENT_SUFFIX)
    );
  }

  /**
   * Load and cache the parsed field-ownership CSV.  The path is resolved
   * relative to the repo root (the compiled `dist/` tree mirrors `src/`, so the
   * same relative offset applies in production).  Falls back to an empty map —
   * yielding no comparable fields and therefore no findings — when the file is
   * unavailable, keeping the engine safe and side-effect-free.
   */
  protected loadFieldOwnership(): Record<string, FieldOwnershipRule> {
    if (this.fieldOwnershipCache !== null) {
      return this.fieldOwnershipCache;
    }

    const candidates = [
      path.resolve(
        __dirname,
        REPO_ROOT_FROM_ENGINE_DIR,
        FIELD_OWNERSHIP_CSV_REPO_RELATIVE_PATH,
      ),
      path.resolve(
        process.cwd(),
        FIELD_OWNERSHIP_CSV_REPO_RELATIVE_PATH,
      ),
    ];

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) {
          const csv = fs.readFileSync(candidate, 'utf8');
          this.fieldOwnershipCache = parseFieldOwnershipCsv(csv);
          return this.fieldOwnershipCache;
        }
      } catch (err) {
        this.logger.warn(
          `Failed to read field-ownership CSV at ${candidate}: ${err instanceof Error ? err.message : 'unknown'}`,
        );
      }
    }

    this.logger.warn(
      'Field-ownership CSV not found — shadow-sync drift comparison will yield no comparable fields',
    );
    this.fieldOwnershipCache = {};
    return this.fieldOwnershipCache;
  }
}
