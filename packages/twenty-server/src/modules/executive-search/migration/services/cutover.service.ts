import { Injectable, Logger } from '@nestjs/common';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CutoverStage } from 'src/modules/executive-search/common/enums/cutover-stage.enum';
import { FieldOwnershipAuthority } from 'src/modules/executive-search/common/enums/field-ownership-authority.enum';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import {
  authoritiesAtStage,
  FIELD_OWNERSHIP_COLLECTIONS,
  FIELD_OWNERSHIP_ROWS,
  stageRank,
} from 'src/modules/executive-search/migration/services/field-ownership-config';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncCheckpointWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-checkpoint.workspace-entity';
import { ExternalSyncReconciliationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-reconciliation.workspace-entity';

/** External system name used for the Directus integration everywhere. */
const EXTERNAL_SYSTEM_NAME = 'directus';

/**
 * Synthetic entity name under which the active cutover stage is persisted in
 * `externalSyncCheckpoint`. No real consumer queries `lastExternalEventId` for
 * this entity name, so overloading that column to carry a JSON stage ledger is
 * safe (see task 7 spec).
 */
const CUTOVER_STAGE_ENTITY_NAME = '_cutover_stage';

const CUTOVER_AUDIT_STATUS = 'COMPLETED' as const;

/** One collection's ownership transition produced by a cutover operation. */
export interface CutoverChange {
  collection: string;
  previousAuthority: FieldOwnershipAuthority | null;
  nextAuthority: FieldOwnershipAuthority | null;
  previousStage: CutoverStage | null;
  nextStage: CutoverStage;
}

/** Result of an {@link CutoverService.applyStage} / {@link CutoverService.revertToStage} call. */
export interface CutoverResult {
  action: 'apply' | 'revert';
  fromStage: CutoverStage;
  toStage: CutoverStage;
  dryRun: boolean;
  changes: CutoverChange[];
  /** Number of `externalEntityLink` rows updated (0 for dry-run). */
  linkCount: number;
}

/** Authoritative ownership state for a collection at a given stage. */
interface CollectionState {
  authority: FieldOwnershipAuthority | null;
  cutoverStage: CutoverStage;
}

/** Serialized cutover ledger stored in `externalSyncCheckpoint.lastExternalEventId`. */
interface CutoverLedger {
  currentStage: CutoverStage;
  appliedStages: CutoverStage[];
  history: Array<{
    action: 'apply' | 'revert';
    stage: CutoverStage;
    actorId: string;
    appliedAt: string;
  }>;
}

/**
 * Field-ownership cutover service.
 *
 * Drives the staged transfer of field ownership from Directus to Twenty
 * (see `docs/executive-search/09-migration-and-backfill.md`, "Cut over field
 * ownership in controlled stages"). The active stage is persisted in
 * `externalSyncCheckpoint` (entityName `_cutover_stage`); applying a stage
 * rewrites `externalEntityLink.authority` + `metadata.cutoverStage` for the
 * links whose field groups transfer at that stage, and records an audit entry
 * in `externalSyncReconciliation.findings`.
 *
 * Follows the dominant DI pattern (no `authContext` parameter on the public
 * methods): each method builds a system auth context internally and runs inside
 * `executeInWorkspaceContext`, with repositories fetched with
 * `shouldBypassPermissionChecks: true`.
 */
@Injectable()
export class CutoverService {
  private readonly logger = new Logger(CutoverService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Read the currently-applied cutover stage. Defaults to
   * {@link CutoverStage.STAGE_0_READONLY} when no checkpoint exists.
   */
  async getCurrentStage(workspaceId: string): Promise<CutoverStage> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => this.readCurrentStage(workspaceId),
      authContext,
    );
  }

  /**
   * Advance field ownership to `stage`. `stage` must rank strictly above the
   * current stage; to move backward use {@link revertToStage}. Every field
   * group whose transferring stage falls between the current stage and `stage`
   * (inclusive) is applied, so a single call can catch up across stages.
   *
   * When `dryRun` is true the computed diff is returned without any writes.
   */
  async applyStage(
    workspaceId: string,
    stage: CutoverStage,
    actorId: string,
    dryRun = false,
  ): Promise<CutoverResult> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const currentStage = await this.readCurrentStage(workspaceId);

        if (stageRank(stage) <= stageRank(currentStage)) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.CUTOVER_STAGE_REGRESSION,
            `Cannot apply ${stage}: current stage is ${currentStage} ` +
              `(applyStage only advances forward; use revertToStage to go back)`,
          );
        }

        const changes = this.diffStates(
          this.statesAtStage(currentStage),
          this.statesAtStage(stage),
        );

        if (dryRun) {
          return {
            action: 'apply',
            fromStage: currentStage,
            toStage: stage,
            dryRun: true,
            changes,
            linkCount: 0,
          };
        }

        const linkCount = await this.applyChanges(workspaceId, changes);

        await this.persistCheckpoint(workspaceId, stage, actorId, 'apply');
        await this.writeAudit(
          workspaceId,
          'apply',
          currentStage,
          stage,
          actorId,
          changes,
        );

        this.logger.log(
          `Applied cutover ${currentStage} → ${stage} (${changes.length} collection(s), ${linkCount} link(s))`,
        );

        return {
          action: 'apply',
          fromStage: currentStage,
          toStage: stage,
          dryRun: false,
          changes,
          linkCount,
        };
      },
      authContext,
    );
  }

  /**
   * Walk ownership back to `stage`. `stage` must rank strictly below the
   * current stage; field groups are flipped to the authority values that were
   * in effect at `stage`. Used by the Task 9 rollback path.
   *
   * When `dryRun` is true the computed diff is returned without any writes.
   */
  async revertToStage(
    workspaceId: string,
    stage: CutoverStage,
    actorId: string,
    dryRun = false,
  ): Promise<CutoverResult> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const currentStage = await this.readCurrentStage(workspaceId);

        if (stageRank(stage) >= stageRank(currentStage)) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.CUTOVER_INVALID_REVERT,
            `Cannot revert to ${stage}: current stage is ${currentStage} ` +
              `(revertToStage only walks back)`,
          );
        }

        const changes = this.diffStates(
          this.statesAtStage(currentStage),
          this.statesAtStage(stage),
        );

        if (dryRun) {
          return {
            action: 'revert',
            fromStage: currentStage,
            toStage: stage,
            dryRun: true,
            changes,
            linkCount: 0,
          };
        }

        const linkCount = await this.applyChanges(workspaceId, changes);

        await this.persistCheckpoint(workspaceId, stage, actorId, 'revert');
        await this.writeAudit(
          workspaceId,
          'revert',
          currentStage,
          stage,
          actorId,
          changes,
        );

        this.logger.log(
          `Reverted cutover ${currentStage} → ${stage} (${changes.length} collection(s), ${linkCount} link(s))`,
        );

        return {
          action: 'revert',
          fromStage: currentStage,
          toStage: stage,
          dryRun: false,
          changes,
          linkCount,
        };
      },
      authContext,
    );
  }

  // ---- internals ----------------------------------------------------------

  /** Read the persisted current stage (default STAGE_0_READONLY). */
  private async readCurrentStage(workspaceId: string): Promise<CutoverStage> {
    const checkpoint = await this.findCheckpoint(workspaceId);

    return this.parseLedger(checkpoint?.lastExternalEventId).currentStage;
  }

  private async findCheckpoint(
    workspaceId: string,
  ): Promise<ExternalSyncCheckpointWorkspaceEntity | null> {
    const repository =
      await this.globalWorkspaceOrmManager.getRepository<ExternalSyncCheckpointWorkspaceEntity>(
        workspaceId,
        ExternalSyncCheckpointWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    return repository.findOne({
      where: {
        externalSystemName: EXTERNAL_SYSTEM_NAME,
        entityName: CUTOVER_STAGE_ENTITY_NAME,
      },
    });
  }

  /**
   * The authoritative ownership state of every collection once `stage` has been
   * applied. Collections with no transferring row at or before `stage` resolve
   * to a cleared authority at the read-only baseline (revert target).
   */
  private statesAtStage(stage: CutoverStage): Map<string, CollectionState> {
    const inEffect = new Map<
      string,
      { authority: FieldOwnershipAuthority; cutoverStage: CutoverStage }
    >(
      authoritiesAtStage(FIELD_OWNERSHIP_ROWS, stage).map((state) => [
        state.collection,
        { authority: state.authority, cutoverStage: state.cutoverStage },
      ]),
    );

    const states = new Map<string, CollectionState>();

    for (const collection of FIELD_OWNERSHIP_COLLECTIONS) {
      const inStage = inEffect.get(collection);

      states.set(
        collection,
        inStage ?? {
          authority: null,
          cutoverStage: CutoverStage.STAGE_0_READONLY,
        },
      );
    }

    return states;
  }

  /**
   * Compute the per-collection transitions between two state maps. Only
   * collections whose authority or cutover stage actually changes are emitted.
   */
  private diffStates(
    previous: Map<string, CollectionState>,
    next: Map<string, CollectionState>,
  ): CutoverChange[] {
    const changes: CutoverChange[] = [];

    for (const [collection, nextState] of next) {
      const previousState = previous.get(collection);

      if (
        !previousState ||
        previousState.authority !== nextState.authority ||
        previousState.cutoverStage !== nextState.cutoverStage
      ) {
        changes.push({
          collection,
          previousAuthority: previousState?.authority ?? null,
          nextAuthority: nextState.authority,
          previousStage: previousState?.cutoverStage ?? null,
          nextStage: nextState.cutoverStage,
        });
      }
    }

    return changes;
  }

  /** Apply a set of transitions to the matching `externalEntityLink` rows. */
  private async applyChanges(
    workspaceId: string,
    changes: CutoverChange[],
  ): Promise<number> {
    if (changes.length === 0) {
      return 0;
    }

    const repository =
      await this.globalWorkspaceOrmManager.getRepository<ExternalEntityLinkWorkspaceEntity>(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    let linkCount = 0;

    for (const change of changes) {
      const links = await repository.find({
        where: {
          externalSystemName: EXTERNAL_SYSTEM_NAME,
          externalEntityName: change.collection,
        },
      });

      for (const link of links) {
        const mergedMetadata = {
          ...link.metadata,
          cutoverStage: change.nextStage,
        };

        await repository.update(link.id, {
          authority: change.nextAuthority ?? '',
          metadata: mergedMetadata,
        } as any);
        linkCount++;
      }
    }

    return linkCount;
  }

  /** Upsert the cutover checkpoint with the updated stage ledger. */
  private async persistCheckpoint(
    workspaceId: string,
    toStage: CutoverStage,
    actorId: string,
    action: 'apply' | 'revert',
  ): Promise<void> {
    const repository =
      await this.globalWorkspaceOrmManager.getRepository<ExternalSyncCheckpointWorkspaceEntity>(
        workspaceId,
        ExternalSyncCheckpointWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const existing = await repository.findOne({
      where: {
        externalSystemName: EXTERNAL_SYSTEM_NAME,
        entityName: CUTOVER_STAGE_ENTITY_NAME,
      },
    });

    const previousLedger = this.parseLedger(existing?.lastExternalEventId);
    const now = new Date().toISOString();

    // `appliedStages` reflects the stages active at the new current stage
    // (`toStage`), regardless of direction.
    const ledger: CutoverLedger = {
      currentStage: toStage,
      appliedStages: CUTOVER_STAGE_ORDER_UP_TO(toStage),
      history: [
        ...previousLedger.history,
        { action, stage: toStage, actorId, appliedAt: now },
      ],
    };

    const payload = {
      workspaceId,
      externalSystemName: EXTERNAL_SYSTEM_NAME,
      entityName: CUTOVER_STAGE_ENTITY_NAME,
      lastExternalEventId: JSON.stringify(ledger),
      lastExternalEventTimestamp: now,
      lastSyncCompletedAt: now,
      status: 'ACTIVE',
    } as any;

    if (existing) {
      await repository.update(existing.id, payload);
    } else {
      await repository.insert(payload);
    }
  }

  /** Append a cutover audit entry to `externalSyncReconciliation.findings`. */
  private async writeAudit(
    workspaceId: string,
    action: 'apply' | 'revert',
    fromStage: CutoverStage,
    toStage: CutoverStage,
    actorId: string,
    changes: CutoverChange[],
  ): Promise<void> {
    const repository =
      await this.globalWorkspaceOrmManager.getRepository<ExternalSyncReconciliationWorkspaceEntity>(
        workspaceId,
        ExternalSyncReconciliationWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const now = new Date().toISOString();

    await repository.insert({
      workspaceId,
      externalSystemName: EXTERNAL_SYSTEM_NAME,
      entityName: CUTOVER_STAGE_ENTITY_NAME,
      startedAt: now,
      completedAt: now,
      status: CUTOVER_AUDIT_STATUS,
      totalCompared: changes.length,
      matched: 0,
      onlyInTwenty: 0,
      onlyInExternal: 0,
      differenceCount: changes.length,
      findings: {
        cutoverAction: action,
        fromStage,
        toStage,
        actorId,
        appliedAt: now,
        changes,
      } as Record<string, unknown>,
    } as any);
  }

  /** Parse a persisted ledger JSON, defaulting to STAGE_0_READONLY. */
  private parseLedger(raw: string | null | undefined): CutoverLedger {
    const defaultLedger: CutoverLedger = {
      currentStage: CutoverStage.STAGE_0_READONLY,
      appliedStages: [CutoverStage.STAGE_0_READONLY],
      history: [],
    };

    if (!raw) {
      return defaultLedger;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<CutoverLedger>;
      const currentStage = parsed.currentStage;

      if (!isCutoverStage(currentStage)) {
        return defaultLedger;
      }

      return {
        currentStage,
        appliedStages: Array.isArray(parsed.appliedStages)
          ? parsed.appliedStages.filter(isCutoverStage)
          : CUTOVER_STAGE_ORDER_UP_TO(currentStage),
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    } catch {
      return defaultLedger;
    }
  }
}

/** All cutover stages up to and including `stage`, in progression order. */
function CUTOVER_STAGE_ORDER_UP_TO(stage: CutoverStage): CutoverStage[] {
  const ordered: CutoverStage[] = [
    CutoverStage.STAGE_0_READONLY,
    CutoverStage.STAGE_1_LINKS,
    CutoverStage.STAGE_2_INBOUND,
    CutoverStage.STAGE_3_OUTBOUND_NARROW,
    CutoverStage.STAGE_4_FULL,
  ];

  return ordered.slice(0, stageRank(stage) + 1);
}

function isCutoverStage(value: unknown): value is CutoverStage {
  return (
    typeof value === 'string' &&
    Object.values(CutoverStage).includes(value as CutoverStage)
  );
}
