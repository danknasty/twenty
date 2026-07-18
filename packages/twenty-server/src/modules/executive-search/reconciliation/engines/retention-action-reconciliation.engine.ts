import { Injectable, Logger } from '@nestjs/common';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { RetentionActionLogWorkspaceEntity } from 'src/modules/executive-search/standard-objects/retention-action-log.workspace-entity';
import { type ReconcileArgs } from 'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { type ReconciliationEngine } from 'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { type ReconciliationFinding } from 'src/modules/executive-search/reconciliation/reconciliation-finding.type';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import {
  RETENTION_ACTION_STATUS,
  RETENTION_ACTION_TYPE,
} from 'src/modules/executive-search/migration/services/retention-action.service';

/**
 * Read-only reconciliation engine that cross-checks `retentionActionLog` rows
 * between the two systems.
 *
 * A retention action recorded in Twenty is expected to reach PROPAGATED
 * (Twenty-initiated) or RECONCILED (Directus-initiated). Rows that remain
 * REQUESTED represent missing propagations and are surfaced as findings:
 *
 * - EXISTENCE — the action exists in the Twenty log but was never mirrored to
 *   the external system (or never reconciled back). Legal holds are HIGH
 *   severity; everything else is MEDIUM.
 * - STALE — a REQUESTED row whose `requestedAt` is older than the staleness
 *   threshold, indicating a stuck propagation.
 *
 * This engine is dry-run / read-only by construction (it never mutates data).
 */
@Injectable()
export class RetentionActionReconciliationEngine implements ReconciliationEngine {
  readonly name = 'retention-action-reconciliation';

  private readonly logger = new Logger(RetentionActionReconciliationEngine.name);

  /**
   * Rows still REQUESTED past this age are flagged STALE (1 hour).
   */
  private readonly stalenessThresholdMs = 60 * 60 * 1000;

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    registry: ReconciliationEngineRegistry,
  ) {
    // Self-register so the engine is discoverable via ReconciliationEngineRegistry.
    registry.register(this);
  }

  async reconcile(args: ReconcileArgs): Promise<ReconciliationFinding[]> {
    const authContext = buildSystemAuthContext(args.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            args.workspaceId,
            RetentionActionLogWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const pending = await repository.find({
          where: { status: RETENTION_ACTION_STATUS.REQUESTED },
          order: { requestedAt: 'ASC' },
        });

        const findings: ReconciliationFinding[] = [];
        const now = Date.now();

        for (const row of pending) {
          const recordId = row.targetTwentyRecordId ?? row.id;
          const isLegalHold = row.actionType === RETENTION_ACTION_TYPE.LEGAL_HOLD;

          // EXISTENCE finding: action recorded in Twenty, never propagated.
          findings.push({
            objectName: row.targetTwentyEntityName,
            recordId,
            kind: 'EXISTENCE',
            severity: isLegalHold ? 'HIGH' : 'MEDIUM',
            detail:
              `Retention action ${row.actionType} (scope=${row.scope}, ` +
              `initiator=${row.initiatorSystem}) recorded at ${row.requestedAt} ` +
              `is still REQUESTED — missing propagation to external system`,
            dryRunSafe: true,
          });

          // STALE finding: REQUESTED beyond the staleness threshold.
          const requestedAtMs = Date.parse(row.requestedAt);

          if (
            !Number.isNaN(requestedAtMs) &&
            now - requestedAtMs > this.stalenessThresholdMs
          ) {
            findings.push({
              objectName: row.targetTwentyEntityName,
              recordId,
              kind: 'STALE',
              severity: isLegalHold ? 'HIGH' : 'MEDIUM',
              detail:
                `Retention action ${row.actionType} has been REQUESTED since ` +
                `${row.requestedAt} (older than staleness threshold)`,
              dryRunSafe: true,
            });
          }
        }

        this.logger.debug(
          `Retention-action reconciliation found ${findings.length} finding(s) across ${pending.length} pending row(s)`,
        );

        return findings;
      },
      authContext,
    );
  }
}
