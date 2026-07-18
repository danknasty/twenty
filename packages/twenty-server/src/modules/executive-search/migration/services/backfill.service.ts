import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { IdentityMatchingService } from 'src/modules/executive-search/migration/services/identity-matching.service';
import type { MatchResult } from 'src/modules/executive-search/migration/services/identity-matching.service';
import { AmbiguousMatchQueueService } from 'src/modules/executive-search/migration/services/ambiguous-match-queue.service';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalIdentityMatchQueueWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-identity-match-queue.workspace-entity';
import { ExternalSyncCheckpointWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-checkpoint.workspace-entity';
import { ExternalSyncReconciliationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-reconciliation.workspace-entity';
import { CandidacyStageEventWorkspaceEntity } from 'src/modules/executive-search/standard-objects/candidacy-stage-event.workspace-entity';
import { IdentityMatchResolution } from 'src/modules/executive-search/common/enums/identity-match-resolution.enum';
import { DirectusClientService } from 'src/modules/executive-search/directus/services/directus-client.service';

/**
 * Ordered pairs to backfill.  Order matters: executives → companies →
 * opportunities → applications, so FK targets are in place before references.
 */
const BACKFILL_PAIRS = [
  {
    directusCollection: 'executives',
    twentyEntityName: 'person',
    matcherType: 'executive' as const,
  },
  {
    directusCollection: 'companies',
    twentyEntityName: 'company',
    matcherType: 'company' as const,
  },
  {
    directusCollection: 'opportunities',
    twentyEntityName: 'searchAssignment',
    matcherType: 'opportunity' as const,
  },
  {
    directusCollection: 'applications',
    twentyEntityName: 'searchCandidacy',
    matcherType: 'application' as const,
  },
];

type BackfillReport = {
  creates: number;
  links: number;
  conflicts: number;
  skips: number;
  errors: number;
  stageEvents: number;
  crossRefs: number;
};

/**
 * Idempotent, resumable backfill orchestrator.
 *
 * Runs the full Phase 17 migration sequence for a workspace:
 *  1. Identity-match each Directus collection against Twenty.
 *  2. EXACT/HIGH → write `externalEntityLink` + create missing Twenty rows.
 *  3. MEDIUM/LOW/multi → enqueue for human resolution (Task 3).
 *  4. Append Directus `candidate_stage_events` to `candidacyStageEvent`.
 *  5. Backfill interviews, references, and AI cross-refs.
 *
 * Checkpoints track progress per pair so the process can be resumed.
 */
@Injectable()
export class BackfillService {
  private readonly logger = new Logger(BackfillService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly identityMatchingService: IdentityMatchingService,
    private readonly ambiguousMatchQueueService: AmbiguousMatchQueueService,
    private readonly directusClient: DirectusClientService,
  ) {}

  /**
   * Run the backfill for a workspace.  If `dryRun` is true, nothing is
   * written — only the report is produced.
   */
  async backfill(workspaceId: string, dryRun = false): Promise<BackfillReport> {
    const report: BackfillReport = {
      creates: 0,
      links: 0,
      conflicts: 0,
      skips: 0,
      errors: 0,
      stageEvents: 0,
      crossRefs: 0,
    };

    for (const pair of BACKFILL_PAIRS) {
      const checkpointKey = `_phase17_pair:${pair.directusCollection}`;

      if (await this.isPairComplete(workspaceId, checkpointKey)) {
        this.logger.log(
          `Skipping pair "${pair.directusCollection}" — already complete in workspace ${workspaceId}`,
        );
        continue;
      }

      try {
        await this.backfillPair(workspaceId, pair, checkpointKey, report, dryRun);
      } catch (error) {
        this.logger.error(
          `Backfill failed for pair "${pair.directusCollection}" in workspace ${workspaceId}: ${String(error)}`,
        );
        report.errors++;
      }
    }

    if (!dryRun) {
      await this.persistReport(workspaceId, report);
    }

    return report;
  }

  // ---------------------------------------------------------------------------
  // Per-pair backfill
  // ---------------------------------------------------------------------------

  private async backfillPair(
    workspaceId: string,
    pair: (typeof BACKFILL_PAIRS)[number],
    checkpointKey: string,
    report: BackfillReport,
    dryRun: boolean,
  ): Promise<void> {
    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      this.logger.log(
        `Matching "${pair.directusCollection}" → "${pair.twentyEntityName}" in workspace ${workspaceId}`,
      );

      const results = await this.identityMatchingService.matchWorkspace(
        workspaceId,
        pair,
      );

      const exact: MatchResult[] = [];
      const ambiguous: MatchResult[] = [];

      for (const r of results) {
        if (
          r.confidence === 'EXACT' &&
          r.matchedTwentyRecordId &&
          (r.candidates?.length ?? 0) <= 1
        ) {
          exact.push(r);
        } else {
          ambiguous.push(r);
        }
      }

      // 1. Auto-resolve EXACT/HIGH single matches.
      for (const r of exact) {
        if (dryRun) {
          report.links++;
          continue;
        }

        try {
          await this.upsertLinkAndRecord(workspaceId, pair, r);
          report.links++;
        } catch (error) {
          this.logger.error(
            `Failed to link ${r.externalRecordId}: ${String(error)}`,
          );
          report.errors++;
        }
      }

      // 2. Enqueue ambiguous matches.
      if (ambiguous.length > 0) {
        if (dryRun) {
          report.skips += ambiguous.length;
        } else {
          const enqueued = await this.ambiguousMatchQueueService.enqueueUnmatched(
            workspaceId,
            ambiguous,
            pair.directusCollection,
          );
          report.skips += enqueued;
        }
      }

      // 3. Backfill resolved NEW entries (set by human via queue).
      if (!dryRun) {
        await this.backfillResolvedNewEntries(workspaceId, pair, report);
      }

      // 4. Append candidate stage events.
      if (!dryRun) {
        const stageCount = await this.backfillStageEvents(
          workspaceId,
          pair,
        );
        report.stageEvents += stageCount;
      }

      // 5. Backfill cross-references (interviews, references, AI).
      if (!dryRun) {
        const crossRefCount = await this.backfillCrossReferences(
          workspaceId,
          pair,
        );
        report.crossRefs += crossRefCount;
      }

      // 6. Mark pair complete.
      if (!dryRun) {
        await this.markPairComplete(workspaceId, checkpointKey);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Link + record creation
  // ---------------------------------------------------------------------------

  private async upsertLinkAndRecord(
    workspaceId: string,
    pair: (typeof BACKFILL_PAIRS)[number],
    result: MatchResult,
  ): Promise<void> {
    const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalEntityLinkWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    // Check for existing link (idempotency guard).
    const existingLink = await linkRepo.findOne({
      where: {
        externalSystemName: 'directus',
        externalEntityName: pair.directusCollection,
        externalRecordId: result.externalRecordId,
      },
    });

    if (existingLink?.isAuthoritativeLink) {
      return;
    }

    let twentyRecordId = result.matchedTwentyRecordId;

    // If no Twenty record matched, create one.
    if (!twentyRecordId) {
      twentyRecordId = await this.createTwentyRecord(
        workspaceId,
        pair.twentyEntityName,
      );
    }

    await linkRepo.upsert(
      {
        id: existingLink?.id,
        externalSystemName: 'directus',
        externalEntityName: pair.directusCollection,
        externalRecordId: result.externalRecordId,
        twentyEntityName: pair.twentyEntityName,
        twentyRecordId,
        authority: 'DIRECTUS_AUTHORITATIVE',
        isAuthoritativeLink: true,
        syncStatus: 'LINKED',
        conflictStatus: 'NONE',
        externalNaturalKey: result.externalRecordId,
        sourceHash: '',
        lastInboundSyncAt: new Date(),
      },
      {
        conflictPaths: [
          'externalSystemName',
          'externalEntityName',
          'externalRecordId',
        ],
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Resolved NEW entries
  // ---------------------------------------------------------------------------

  private async backfillResolvedNewEntries(
    workspaceId: string,
    pair: (typeof BACKFILL_PAIRS)[number],
    report: BackfillReport,
  ): Promise<void> {
    const queueRepo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalIdentityMatchQueueWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    const resolvedNew = await queueRepo.find({
      where: {
        externalEntityName: pair.directusCollection,
        resolutionState: IdentityMatchResolution.RESOLVED_NEW,
      },
    });

    for (const entry of resolvedNew) {
      try {
        const twentyRecordId = await this.createTwentyRecord(
          workspaceId,
          pair.twentyEntityName,
        );

        const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
          workspaceId,
          ExternalEntityLinkWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        await linkRepo.save({
          externalSystemName: 'directus',
          externalEntityName: pair.directusCollection,
          externalRecordId: entry.externalRecordId,
          twentyEntityName: pair.twentyEntityName,
          twentyRecordId,
          authority: 'DIRECTUS_AUTHORITATIVE',
          isAuthoritativeLink: true,
          syncStatus: 'LINKED',
          conflictStatus: 'NONE',
          externalNaturalKey: entry.externalNaturalKey,
          sourceHash: '',
        });

        report.creates++;
      } catch (error) {
        this.logger.error(
          `Failed to create Twenty record for queue entry ${entry.id}: ${String(error)}`,
        );
        report.errors++;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Stage event backfill
  // ---------------------------------------------------------------------------

  private async backfillStageEvents(
    workspaceId: string,
    pair: (typeof BACKFILL_PAIRS)[number],
  ): Promise<number> {
    if (pair.directusCollection !== 'applications') {
      return 0;
    }

    let appended = 0;

    try {
      const stageEvents = await this.directusClient.getItems(
        'candidate_stage_events',
      );

      const stageRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        CandidacyStageEventWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      for (const event of stageEvents) {
        const directusEventId = String(event.id ?? '');

        // Look up the application → searchCandidacy link.
        const appExternalId = String(
          event.application ?? event.application_id ?? '',
        );

        if (!appExternalId) {
          continue;
        }

        const appLink = await linkRepo.findOne({
          where: {
            externalSystemName: 'directus',
            externalEntityName: 'applications',
            externalRecordId: appExternalId,
          },
        });

        if (!appLink?.twentyRecordId) {
          continue;
        }

        // Idempotency: check if this Directus event was already backfilled.
        const existingEvents = await stageRepo.find({
          where: { candidacyId: appLink.twentyRecordId },
        });

        const alreadyBackfilled = existingEvents.some(
          (e) =>
            e.notes?.includes(`"sourceEventId":"${directusEventId}"`),
        );

        if (alreadyBackfilled) {
          continue;
        }

        await stageRepo.save({
          candidacyId: appLink.twentyRecordId,
          stage: String(event.stage ?? event.stageTo ?? ''),
          stageFrom: String(event.stageFrom ?? event.previousStage ?? '') || null,
          stageTo: String(event.stageTo ?? event.stage ?? ''),
          transitionedAt: new Date(
            event.transitionedAt ?? event.date_created ?? Date.now(),
          ),
          reason: String(event.reason ?? '') || null,
          notes: `{"sourceEventId":"${directusEventId}"}`,
          isCandidateVisible: true,
        });

        appended++;
      }
    } catch (error) {
      this.logger.error(
        `Failed to backfill stage events for workspace ${workspaceId}: ${String(error)}`,
      );
    }

    return appended;
  }

  // ---------------------------------------------------------------------------
  // Cross-reference backfill (interviews, references, AI)
  // ---------------------------------------------------------------------------

  private async backfillCrossReferences(
    workspaceId: string,
    pair: (typeof BACKFILL_PAIRS)[number],
  ): Promise<number> {
    let count = 0;

    // Backfill interviews from `scheduled_interviews`.
    if (pair.directusCollection === 'applications') {
      count += await this.backfillByCollection(
        workspaceId,
        'scheduled_interviews',
        'searchInterview',
      );
    }

    // Backfill reference checks from `application_reference_*`.
    if (pair.directusCollection === 'applications') {
      count += await this.backfillByCollection(
        workspaceId,
        'application_reference_checks',
        'referenceCheck',
      );
    }

    // Backfill AI analysis collections as externalEntityLink only (LEGACY).
    const aiCollections = [
      'ai_analysis_results',
      'ai_application_analysis',
      'assessment_runs',
      'executive_opportunity_dossier_items',
    ];

    for (const collection of aiCollections) {
      count += await this.backfillAIAsLinkOnly(workspaceId, collection);
    }

    return count;
  }

  private async backfillByCollection(
    workspaceId: string,
    directusCollection: string,
    targetEntity: string,
  ): Promise<number> {
    let count = 0;

    try {
      const items = await this.directusClient.getItems(directusCollection);

      const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      for (const item of items) {
        const externalId = String(item.id ?? '');

        const existingLink = await linkRepo.findOne({
          where: {
            externalSystemName: 'directus',
            externalEntityName: directusCollection,
            externalRecordId: externalId,
          },
        });

        if (existingLink) {
          continue;
        }

        await linkRepo.save({
          externalSystemName: 'directus',
          externalEntityName: directusCollection,
          externalRecordId: externalId,
          twentyEntityName: targetEntity,
          twentyRecordId: null,
          authority: 'DIRECTUS_AUTHORITATIVE',
          isAuthoritativeLink: false,
          syncStatus: 'LINKED',
          conflictStatus: 'NONE',
          externalNaturalKey: externalId,
          sourceHash: '',
        });

        count++;
      }
    } catch (error) {
      this.logger.warn(
        `Failed to backfill "${directusCollection}" in workspace ${workspaceId}: ${String(error)}`,
      );
    }

    return count;
  }

  private async backfillAIAsLinkOnly(
    workspaceId: string,
    collection: string,
  ): Promise<number> {
    let count = 0;

    try {
      const items = await this.directusClient.getItems(collection);

      const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      for (const item of items) {
        const externalId = String(item.id ?? '');

        const existingLink = await linkRepo.findOne({
          where: {
            externalSystemName: 'directus',
            externalEntityName: collection,
            externalRecordId: externalId,
          },
        });

        if (existingLink) {
          continue;
        }

        // AI records are LEGACY — store as externalEntityLink only, twentyEntityName=null.
        await linkRepo.save({
          externalSystemName: 'directus',
          externalEntityName: collection,
          externalRecordId: externalId,
          twentyEntityName: null,
          twentyRecordId: null,
          authority: 'LEGACY',
          isAuthoritativeLink: false,
          syncStatus: 'LINKED',
          conflictStatus: 'NONE',
          externalNaturalKey: externalId,
          sourceHash: '',
        });

        count++;
      }
    } catch {
      // Collections may not exist in all Directus instances; that's fine.
    }

    return count;
  }

  // ---------------------------------------------------------------------------
  // Helper: create a minimal Twenty record
  // ---------------------------------------------------------------------------

  private async createTwentyRecord(
    workspaceId: string,
    entityName: string,
  ): Promise<string> {
    const repo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      entityName,
      { shouldBypassPermissionChecks: true },
    );

    // Minimal payload: the `name` field works for most entities.
    // Entities without a `name` column will need pair-specific handling
    // in future refinements; for now, let the save fail with a clear error.
    let payload: Record<string, unknown> = { name: `[Migration] ${entityName}` };

    // Person entity uses a JSON name column, not a flat TEXT.
    if (entityName === 'person') {
      payload = {
        name: { firstName: '[Migration]', lastName: entityName },
      };
    }

    const saved = await repo.save(payload);
    const record = Array.isArray(saved) ? saved[0] : saved;

    if (!record?.id) {
      throw new Error(
        `Failed to create ${entityName} record: no id returned from save`,
      );
    }

    return String(record.id);
  }

  // ---------------------------------------------------------------------------
  // Checkpoint management
  // ---------------------------------------------------------------------------

  private async isPairComplete(
    workspaceId: string,
    entityName: string,
  ): Promise<boolean> {
    const checkpointRepo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalSyncCheckpointWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    const checkpoint = await checkpointRepo.findOne({
      where: {
        externalSystemName: 'directus',
        entityName,
        status: 'COMPLETED',
      },
    });

    return checkpoint !== null;
  }

  private async markPairComplete(
    workspaceId: string,
    entityName: string,
  ): Promise<void> {
    const checkpointRepo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalSyncCheckpointWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    await checkpointRepo.upsert(
      {
        externalSystemName: 'directus',
        entityName,
        lastExternalEventId: new Date().toISOString(),
        lastSyncStartedAt: new Date().toISOString(),
        lastSyncCompletedAt: new Date().toISOString(),
        status: 'COMPLETED',
      },
      {
        conflictPaths: ['externalSystemName', 'entityName'],
      },
    );
  }

  private async persistReport(
    workspaceId: string,
    report: BackfillReport,
  ): Promise<void> {
    const reconRepo = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalSyncReconciliationWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    await reconRepo.save({
      status: 'COMPLETED',
      findings: JSON.stringify(report),
      externalSystemName: 'directus',
    });
  }
}
