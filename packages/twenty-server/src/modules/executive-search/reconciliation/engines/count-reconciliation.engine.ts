import { Injectable, Logger, type Type } from '@nestjs/common';
import { type ObjectLiteral } from 'typeorm';

import { buildSystemAuthContext } from
  'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CompanyWorkspaceEntity } from
  'src/modules/company/standard-objects/company.workspace-entity';
import { PersonWorkspaceEntity } from
  'src/modules/person/standard-objects/person.workspace-entity';
import { SearchAssignmentWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { ExternalEntityLinkWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { DirectusClientService } from
  'src/modules/executive-search/directus/services/directus-client.service';
import type { ReconcileArgs, ReconciliationEngine } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { ReconciliationEngineRegistry } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import type {
  ReconciliationFinding,
  ReconciliationFindingSeverity,
} from
  'src/modules/executive-search/reconciliation/reconciliation-finding.type';

type CountPair = {
  externalCollection: string;
  twentyEntityName: string;
  entity: Type<ObjectLiteral>;
};

/**
 * The four Directus ↔ Twenty entity pairs that the executive-search
 * migration is expected to keep in sync.
 */
const COUNT_PAIRS: CountPair[] = [
  {
    externalCollection: 'executives',
    twentyEntityName: 'person',
    entity: PersonWorkspaceEntity,
  },
  {
    externalCollection: 'companies',
    twentyEntityName: 'company',
    entity: CompanyWorkspaceEntity,
  },
  {
    externalCollection: 'opportunities',
    twentyEntityName: 'searchAssignment',
    entity: SearchAssignmentWorkspaceEntity,
  },
  {
    externalCollection: 'applications',
    twentyEntityName: 'searchCandidacy',
    entity: SearchCandidacyWorkspaceEntity,
  },
];

/**
 * Count reconciliation engine.
 *
 * Read-only: compares record counts per Directus collection against the
 * corresponding Twenty repository, joining the two systems through the
 * `externalEntityLink` table to surface records that exist on only one side
 * (`onlyInExternal` / `onlyInTwenty`).
 *
 * All findings are `dryRunSafe: true` — this engine never mutates data.
 */
@Injectable()
export class CountReconciliationEngine implements ReconciliationEngine {
  readonly name = 'count-reconciliation';

  private readonly logger = new Logger(CountReconciliationEngine.name);

  private static readonly DIRECTUS_PAGE_SIZE = 500;

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly directusClient: DirectusClientService,
    registry: ReconciliationEngineRegistry,
  ) {
    registry.register(this);
  }

  // The engine enumerates all four pairs internally and ignores objectName.
  async reconcile(args: ReconcileArgs): Promise<ReconciliationFinding[]> {
    const authContext = buildSystemAuthContext(args.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const findings: ReconciliationFinding[] = [];

        for (const pair of COUNT_PAIRS) {
          const pairFindings = await this.reconcilePair(
            args.workspaceId,
            pair,
          );

          findings.push(...pairFindings);
        }

        return findings;
      },
      authContext,
    );
  }

  private async reconcilePair(
    workspaceId: string,
    pair: CountPair,
  ): Promise<ReconciliationFinding[]> {
    let externalIds: string[] = [];

    try {
      externalIds = await this.fetchDirectusIds(pair.externalCollection);
    } catch (error) {
      this.logger.warn(
        `Could not fetch Directus collection "${pair.externalCollection}" — skipping pair: ${this.formatError(error)}`,
      );

      return [];
    }

    const twentyRepository = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      pair.entity,
      { shouldBypassPermissionChecks: true },
    );

    const twentyRecords = await twentyRepository.find();
    const twentyIds = twentyRecords
      .map((record) => record.id)
      .filter((id): id is string => typeof id === 'string');

    const linkRepository =
      await this.globalWorkspaceOrmManager.getRepository<ExternalEntityLinkWorkspaceEntity>(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const links = await linkRepository.find({
      where: {
        externalEntityName: pair.externalCollection,
        twentyEntityName: pair.twentyEntityName,
      },
    });

    const linkedExternalIds = new Set(
      links
        .map((link) => link.externalRecordId)
        .filter((id): id is string => typeof id === 'string'),
    );
    const linkedTwentyIds = new Set(
      links
        .map((link) => link.twentyRecordId)
        .filter((id): id is string => typeof id === 'string'),
    );

    const onlyInExternal = externalIds.filter(
      (id) => !linkedExternalIds.has(id),
    );
    const onlyInTwenty = twentyIds.filter((id) => !linkedTwentyIds.has(id));

    const discrepancy = onlyInExternal.length + onlyInTwenty.length;

    if (discrepancy === 0) {
      return [];
    }

    const severity = this.severityFor(discrepancy);
    const findings: ReconciliationFinding[] = [];

    for (const externalId of onlyInExternal) {
      findings.push({
        objectName: pair.twentyEntityName,
        recordId: externalId,
        kind: 'EXISTENCE',
        severity,
        detail:
          `Directus "${pair.externalCollection}" record "${externalId}" has no matching ` +
          `${pair.twentyEntityName} link in Twenty ` +
          `(directus count: ${externalIds.length}, twenty count: ${twentyIds.length})`,
        dryRunSafe: true,
      });
    }

    for (const twentyId of onlyInTwenty) {
      findings.push({
        objectName: pair.twentyEntityName,
        recordId: twentyId,
        kind: 'EXISTENCE',
        severity,
        detail:
          `Twenty "${pair.twentyEntityName}" record "${twentyId}" has no matching ` +
          `Directus "${pair.externalCollection}" link ` +
          `(directus count: ${externalIds.length}, twenty count: ${twentyIds.length})`,
        dryRunSafe: true,
      });
    }

    return findings;
  }

  /**
   * Fetches every record id from a Directus collection via paginated reads.
   *
   * The Directus client only exposes the item array (not the `meta.totalCount`),
   * so the count is derived from the number of ids fetched. These same ids are
   * also required to perform the link-existence comparison.
   */
  private async fetchDirectusIds(collection: string): Promise<string[]> {
    const ids: string[] = [];
    let offset = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const items = await this.directusClient.getItems<{ id: string }>(
        collection,
        {
          fields: ['id'],
          limit: CountReconciliationEngine.DIRECTUS_PAGE_SIZE,
          offset,
        },
      );

      if (!items || items.length === 0) {
        break;
      }

      for (const item of items) {
        if (item && typeof item.id === 'string') {
          ids.push(item.id);
        }
      }

      if (items.length < CountReconciliationEngine.DIRECTUS_PAGE_SIZE) {
        break;
      }

      offset += CountReconciliationEngine.DIRECTUS_PAGE_SIZE;
    }

    return ids;
  }

  private severityFor(discrepancy: number): ReconciliationFindingSeverity {
    if (discrepancy > 100) {
      return 'HIGH';
    }

    if (discrepancy > 10) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
