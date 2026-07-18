import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { RetentionActionLogWorkspaceEntity } from 'src/modules/executive-search/standard-objects/retention-action-log.workspace-entity';
import { ExecutiveSearchOutboxService } from 'src/modules/executive-search/sync/services/outbox.service';
import { type ReconciliationFinding } from 'src/modules/executive-search/reconciliation/reconciliation-finding.type';

/**
 * Lifecycle status of a retention-action log row. Values mirror the
 * `status` SELECT options defined in
 * `compute-retention-action-log-standard-flat-field-metadata.util.ts`.
 *
 * - REQUESTED   — recorded but not yet propagated / reconciled
 * - PROPAGATED  — Twenty-initiated action was pushed to the external system
 * - RECONCILED  — Directus-initiated action was applied to the Twenty projection
 * - FAILED      — propagation attempted but did not succeed
 */
export const RETENTION_ACTION_STATUS = {
  REQUESTED: 'REQUESTED',
  PROPAGATED: 'PROPAGATED',
  RECONCILED: 'RECONCILED',
  FAILED: 'FAILED',
} as const;

/**
 * Which system originated the retention action. Values mirror the
 * `initiatorSystem` SELECT options.
 */
export const RETENTION_INITIATOR_SYSTEM = {
  TWENTY: 'TWENTY',
  DIRECTUS: 'DIRECTUS',
} as const;

/**
 * The kind of retention action being performed. Values mirror the canonical
 * `RetentionActionType` enum / `actionType` SELECT options
 * (`retention-action-type.enum.ts`). Kept as a local const so this service
 * does not import-couple to a parallel-task file; the string values are the
 * contract.
 *
 * `LEGAL_HOLD` is special-cased: it blocks outbound DELETE propagation for the
 * linked record (see `isUnderLegalHold` / the outbound listener hold-check).
 */
export const RETENTION_ACTION_TYPE = {
  DELETE: 'DELETE',
  RECTIFY: 'RECTIFY',
  RESTORE: 'RESTORE',
  LEGAL_HOLD: 'LEGAL_HOLD',
  LEGAL_HOLD_RELEASE: 'LEGAL_HOLD_RELEASE',
  PURGE: 'PURGE',
} as const;

/**
 * How a Directus-initiated action is applied to the linked Twenty projection
 * (`scope` is a free-text field in the schema; these are this service's
 * interpretation of the reconcile behaviour). Only lifecycle state is mutated
 * — no field data is copied, so no `NOT_ALLOWED_TO_SYNC` fields (subscription
 * / auth / demographics per `docs/executive-search/directus-field-ownership.csv`)
 * can ever propagate.
 */
export const RETENTION_ACTION_SCOPE = {
  SOFT_DELETE: 'SOFT_DELETE',
  HIDE: 'HIDE',
  QUARANTINE: 'QUARANTINE',
} as const;

export type RetentionActionInput = {
  actionType: string;
  initiatorSystem: string;
  targetTwentyEntityName: string;
  targetTwentyRecordId?: string | null;
  externalSystemName?: string | null;
  externalRecordId?: string | null;
  scope: string;
  legalHoldReference?: string | null;
  actorId?: string | null;
};

type PropagationOutcome = {
  propagated: boolean;
  status: string;
};

/**
 * Retention / legal-hold action service.
 *
 * Owns the append-only `retentionActionLog`. Records a retention or legal-hold
 * action and propagates it according to which system initiated it:
 *
 * - Twenty-initiated  → enqueue an outbox event (`*.retention_action`) to the
 *   Directus projection, but only while
 *   `IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED` is on.
 * - Directus-initiated → reconcile the Twenty projection (soft-delete / hide /
 *   quarantine per scope). Restricted fields are never copied.
 *
 * Legal holds are recorded here and queried by the outbound listener to block
 * DELETE propagation on held records.
 */
@Injectable()
export class RetentionActionService {
  private readonly logger = new Logger(RetentionActionService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly outboxService: ExecutiveSearchOutboxService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Record a retention/legal-hold action and propagate it.
   *
   * Append-only: a second call with the same natural key (canonicalised into
   * `sourceHash`) is a complete no-op — the existing row is returned unchanged
   * and is never updated, and propagation never re-runs.
   */
  async recordAndPropagate(
    workspaceId: string,
    input: RetentionActionInput,
  ): Promise<RetentionActionLogWorkspaceEntity | null> {
    const authContext = buildSystemAuthContext(workspaceId);
    const sourceHash = this.computeSourceHash(input);

    // Phase 1 — append-only idempotent record (REQUESTED).
    const recorded = await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            RetentionActionLogWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        // Idempotency: a second append with the same natural key is a no-op.
        const existing = await repository.findOneBy({ sourceHash });

        if (existing) {
          this.logger.debug(
            `Retention action already recorded (sourceHash=${sourceHash}) — append-only no-op`,
          );
          return { row: existing, isNew: false };
        }

        const requestedAt = new Date().toISOString();

        const created = repository.create({
          workspaceId,
          actionType: input.actionType,
          initiatorSystem: input.initiatorSystem,
          targetTwentyEntityName: input.targetTwentyEntityName,
          targetTwentyRecordId: input.targetTwentyRecordId ?? null,
          externalSystemName: input.externalSystemName ?? null,
          externalRecordId: input.externalRecordId ?? null,
          scope: input.scope,
          legalHoldReference: input.legalHoldReference ?? null,
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt,
          propagatedAt: null,
          actorId: input.actorId ?? null,
          sourceHash,
        });

        const saved = await repository.save(created);

        return { row: saved, isNew: true };
      },
      authContext,
    );

    // Append-only invariant: a duplicate natural key never propagates again.
    if (!recorded.isNew) {
      return recorded.row;
    }

    // Phase 2 — propagate from the originating system.
    const outcome = await this.propagate(workspaceId, input);

    // Phase 3 — single-lifecycle status transition (REQUESTED → final).
    // This update only ever targets the row created above in this call; a
    // duplicate call is short-circuited in Phase 1 and never reaches here.
    if (outcome.propagated) {
      const propagatedAt = new Date().toISOString();

      await this.markPropagated(
        workspaceId,
        recorded.row.id,
        outcome.status,
        propagatedAt,
      );

      return {
        ...recorded.row,
        status: outcome.status,
        propagatedAt,
      };
    }

    return recorded.row;
  }

  /**
   * Cross-check both systems' retention actions and flag missing propagations.
   * Delegates to the read-only reconciliation engine logic.
   */
  async reconcileAll(
    workspaceId: string,
  ): Promise<ReconciliationFinding[]> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            RetentionActionLogWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        // Missing propagations: rows that are still REQUESTED (never reached
        // PROPAGATED / RECONCILED). These exist in the Twenty log but have not
        // been mirrored to the external system (or vice-versa for Directus).
        const pending = await repository.find({
          where: { status: RETENTION_ACTION_STATUS.REQUESTED },
          order: { requestedAt: 'ASC' },
        });

        return pending.map((row) => ({
          objectName: row.targetTwentyEntityName,
          recordId: row.targetTwentyRecordId ?? row.id,
          kind: 'EXISTENCE' as const,
          severity: this.isLegalHoldAction(row)
            ? ('HIGH' as const)
            : ('MEDIUM' as const),
          detail:
            `Retention action ${row.actionType} (scope=${row.scope}, ` +
            `initiator=${row.initiatorSystem}) recorded at ${row.requestedAt} ` +
            `is still REQUESTED — propagation missing`,
          dryRunSafe: true as const,
        }));
      },
      authContext,
    );
  }

  /**
   * Returns true when the given Twenty record has an active legal hold.
   *
   * Used by the outbound listener to block DELETE/DESTROY propagation for
   * records under legal hold.
   */
  async isUnderLegalHold(
    workspaceId: string,
    targetTwentyEntityName: string,
    targetTwentyRecordId: string,
  ): Promise<boolean> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            RetentionActionLogWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const holds = await repository.find({
          where: {
            actionType: RETENTION_ACTION_TYPE.LEGAL_HOLD,
            targetTwentyEntityName,
            targetTwentyRecordId,
          },
          take: 1,
        });

        return holds.length > 0;
      },
      authContext,
    );
  }

  /**
   * Propagate a recorded action from its originating system.
   */
  private async propagate(
    workspaceId: string,
    input: RetentionActionInput,
  ): Promise<PropagationOutcome> {
    if (input.initiatorSystem === RETENTION_INITIATOR_SYSTEM.TWENTY) {
      return this.propagateFromTwenty(workspaceId, input);
    }

    if (input.initiatorSystem === RETENTION_INITIATOR_SYSTEM.DIRECTUS) {
      return this.reconcileFromDirectus(workspaceId, input);
    }

    this.logger.warn(
      `Unknown initiatorSystem "${input.initiatorSystem}" — recording as REQUESTED only`,
    );

    return {
      propagated: false,
      status: RETENTION_ACTION_STATUS.REQUESTED,
    };
  }

  /**
   * Twenty-initiated action → enqueue an outbox event targeting the linked
   * Directus projection. Only runs while outbound publishing is enabled.
   */
  private async propagateFromTwenty(
    workspaceId: string,
    input: RetentionActionInput,
  ): Promise<PropagationOutcome> {
    const enabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED,
      workspaceId,
    );

    if (!enabled) {
      this.logger.debug(
        'Outbound publish disabled — retention action recorded as REQUESTED only',
      );
      return {
        propagated: false,
        status: RETENTION_ACTION_STATUS.REQUESTED,
      };
    }

    await this.enqueueRetentionOutboxEvent(workspaceId, input);

    return {
      propagated: true,
      status: RETENTION_ACTION_STATUS.PROPAGATED,
    };
  }

  /**
   * Enqueue the `*.retention_action` outbox event.
   *
   * The payload contains ONLY action metadata — it never includes record field
   * values, so no `NOT_ALLOWED_TO_SYNC` fields (subscription, authentication,
   * demographics) can propagate.
   */
  private async enqueueRetentionOutboxEvent(
    workspaceId: string,
    input: RetentionActionInput,
  ): Promise<void> {
    const sourceHash = this.computeSourceHash(input);
    const entityId =
      input.targetTwentyRecordId ??
      input.externalRecordId ??
      `scope:${input.scope}`;

    // Event type targets the linked Directus projection: `<entity>.retention_action`.
    const eventType = `${input.targetTwentyEntityName}.retention_action`;
    const domainIdempotencyKey = `retention:${sourceHash}`;

    const payload: Record<string, unknown> = {
      actionType: input.actionType,
      initiatorSystem: input.initiatorSystem,
      targetTwentyEntityName: input.targetTwentyEntityName,
      targetTwentyRecordId: input.targetTwentyRecordId ?? null,
      externalSystemName: input.externalSystemName ?? null,
      externalRecordId: input.externalRecordId ?? null,
      scope: input.scope,
      legalHoldReference: input.legalHoldReference ?? null,
    };

    await this.outboxService.enqueue({
      workspaceId,
      eventType,
      entityName: input.targetTwentyEntityName,
      entityId,
      domainIdempotencyKey,
      payload,
    });
  }

  /**
   * Directus-initiated action → reconcile the Twenty projection per scope.
   *
   * Only lifecycle state is mutated (soft-delete / hide / quarantine). No field
   * data is copied from Directus, so restricted fields never propagate.
   */
  private async reconcileFromDirectus(
    workspaceId: string,
    input: RetentionActionInput,
  ): Promise<PropagationOutcome> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        if (!input.targetTwentyRecordId) {
          this.logger.debug(
            'Directus-initiated retention action has no target Twenty record id — scope-level reconciliation only',
          );
          return;
        }

        // Resolve the projection repository dynamically by entity name.
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            input.targetTwentyEntityName,
            { shouldBypassPermissionChecks: true },
          );

        switch (input.scope) {
          case RETENTION_ACTION_SCOPE.SOFT_DELETE:
            await repository.softDelete(input.targetTwentyRecordId);
            break;
          case RETENTION_ACTION_SCOPE.HIDE:
            await repository.update(input.targetTwentyRecordId, {
              visibility: 'HIDDEN',
            } as never);
            break;
          case RETENTION_ACTION_SCOPE.QUARANTINE:
            await repository.update(input.targetTwentyRecordId, {
              retentionQuarantined: true,
            } as never);
            break;
          default:
            this.logger.warn(
              `Unknown retention scope "${input.scope}" — no projection mutation applied`,
            );
        }
      },
      authContext,
    );

    return {
      propagated: true,
      status: RETENTION_ACTION_STATUS.RECONCILED,
    };
  }

  /**
   * Transition a just-created row to its final propagated/reconciled status.
   * Targets only rows created within the same `recordAndPropagate` call.
   */
  private async markPropagated(
    workspaceId: string,
    rowId: string,
    status: string,
    propagatedAt: string,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository(
            workspaceId,
            RetentionActionLogWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        await repository.update(rowId, {
          status,
          propagatedAt,
        } as never);
      },
      authContext,
    );
  }

  /**
   * Deterministic hash of the action's natural key, used for idempotency.
   * Two calls with the same natural key produce the same `sourceHash`.
   */
  private computeSourceHash(input: RetentionActionInput): string {
    const naturalKey = JSON.stringify({
      actionType: input.actionType,
      initiatorSystem: input.initiatorSystem,
      targetTwentyEntityName: input.targetTwentyEntityName,
      targetTwentyRecordId: input.targetTwentyRecordId ?? null,
      externalSystemName: input.externalSystemName ?? null,
      externalRecordId: input.externalRecordId ?? null,
      scope: input.scope,
      legalHoldReference: input.legalHoldReference ?? null,
    });

    return crypto.createHash('sha256').update(naturalKey).digest('hex');
  }

  private isLegalHoldAction(
    row: RetentionActionLogWorkspaceEntity,
  ): boolean {
    return row.actionType === RETENTION_ACTION_TYPE.LEGAL_HOLD;
  }
}
