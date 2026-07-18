import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ExternalIdentityMatchQueueWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-identity-match-queue.workspace-entity';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';
import { IdentityMatchResolution } from 'src/modules/executive-search/common/enums/identity-match-resolution.enum';
import type { MatchResult } from 'src/modules/executive-search/migration/services/identity-matching.service';
import { pickBestCandidate } from 'src/modules/executive-search/migration/matchers/build-match-result.util';

/** Numeric rank for confidence comparison (higher = stronger). */
const CONFIDENCE_RANK: Record<IdentityMatchConfidence, number> = {
  [IdentityMatchConfidence.EXACT]: 4,
  [IdentityMatchConfidence.HIGH]: 3,
  [IdentityMatchConfidence.MEDIUM]: 2,
  [IdentityMatchConfidence.LOW]: 1,
  [IdentityMatchConfidence.NONE]: 0,
};

/**
 * Persists ambiguous identity matches (MEDIUM / LOW / NONE confidence or
 * multiple HIGH candidates) into `externalIdentityMatchQueue` for human
 * resolution. Resolution writes the definitive `externalEntityLink`.
 *
 * All write operations are workspace-scoped and idempotent: re-enqueuing a
 * previously resolved entry never resets the resolution.
 */
@Injectable()
export class AmbiguousMatchQueueService {
  private readonly logger = new Logger(AmbiguousMatchQueueService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Enqueue `MatchResult`s whose confidence is below EXACT or that have
   * multiple candidates.  Entries already in `RESOLVED_*` state are left
   * untouched.
   */
  async enqueueUnmatched(
    workspaceId: string,
    results: MatchResult[],
    externalEntityName: string,
  ): Promise<number> {
    let enqueued = 0;

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repo = await this.globalWorkspaceOrmManager.getRepository(
          workspaceId,
          ExternalIdentityMatchQueueWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        for (const result of results) {
          if (!this.shouldEnqueue(result)) {
            continue;
          }

          // Look for an existing entry on the unique external lookup index.
          const existing = await repo.findOne({
            where: {
              externalSystemName: 'directus',
              externalEntityName,
              externalRecordId: result.externalRecordId,
            },
          });

          if (existing && existing.resolutionState !== IdentityMatchResolution.PENDING) {
            continue;
          }

          const candidateMatches =
            result.candidates ??
            (result.matchedTwentyRecordId
              ? [
                  {
                    twentyEntityName: result.matchedTwentyEntityName,
                    twentyRecordId: result.matchedTwentyRecordId,
                    confidence: result.confidence,
                    reasons: result.reasons,
                  },
                ]
              : []);

          await repo.upsert(
            {
              id: existing?.id,
              externalSystemName: 'directus',
              externalEntityName,
              externalRecordId: result.externalRecordId,
              externalNaturalKey: result.externalRecordId,
              matchedTwentyEntityName: result.matchedTwentyEntityName ?? null,
              matchConfidence: result.confidence,
              candidateMatches,
              resolutionState: IdentityMatchResolution.PENDING,
              matchReasons: { reasons: result.reasons },
            },
            {
              conflictPaths: ['externalSystemName', 'externalEntityName', 'externalRecordId'],
            },
          );

          enqueued++;
        }
      },
    );

    this.logger.log(
      `Enqueued ${enqueued} ambiguous matches for "${externalEntityName}" in workspace ${workspaceId}`,
    );

    return enqueued;
  }

  /**
   * List pending queue entries, optionally filtered by Directus collection.
   */
  async listPending(
    workspaceId: string,
    pair?: string,
    limit = 100,
  ): Promise<ExternalIdentityMatchQueueWorkspaceEntity[]> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalIdentityMatchQueueWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const where: Record<string, unknown> = {
        resolutionState: IdentityMatchResolution.PENDING,
      };

      if (pair) {
        where.externalEntityName = pair;
      }

      return repo.find({ where, take: limit, order: { createdAt: 'ASC' } });
    });
  }

  /**
   * Resolve a queue entry by linking it to an existing Twenty record.
   * Writes the definitive `externalEntityLink` and marks the queue entry
   * resolved.
   */
  async resolveLink(
    workspaceId: string,
    queueId: string,
    twentyEntityName: string,
    twentyRecordId: string,
    actorId: string,
  ): Promise<void> {
    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const queueRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalIdentityMatchQueueWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );
      const linkRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const entry = await queueRepo.findOneOrFail({
        where: { id: queueId },
      });

      if (entry.resolutionState !== IdentityMatchResolution.PENDING) {
        throw new Error(
          `Queue entry ${queueId} is already resolved (${entry.resolutionState})`,
        );
      }

      // Write the link, respecting the "never overwrite non-null" rule.
      const existingLink = await linkRepo.findOne({
        where: {
          externalSystemName: entry.externalSystemName,
          externalEntityName: entry.externalEntityName,
          externalRecordId: entry.externalRecordId,
        },
      });

      if (existingLink) {
        // If an authoritative link already exists for a different target, refuse.
        if (
          existingLink.isAuthoritativeLink &&
          (existingLink.twentyEntityName !== twentyEntityName ||
            existingLink.twentyRecordId !== twentyRecordId)
        ) {
          throw new Error(
            `Cannot resolve queue entry ${queueId}: ` +
              `externalEntityLink already points to ${existingLink.twentyEntityName}:${existingLink.twentyRecordId}`,
          );
        }
      } else {
        await linkRepo.save({
          externalSystemName: entry.externalSystemName,
          externalEntityName: entry.externalEntityName,
          externalRecordId: entry.externalRecordId,
          twentyEntityName,
          twentyRecordId,
          authority: 'TWENTY_AUTHORITATIVE',
          isAuthoritativeLink: true,
          syncStatus: 'LINKED',
          conflictStatus: 'NONE',
          externalNaturalKey: entry.externalNaturalKey,
        });
      }

      await queueRepo.update(queueId, {
        resolutionState: IdentityMatchResolution.RESOLVED_LINKED,
        resolvedTwentyEntityName: twentyEntityName,
        resolvedTwentyRecordId: twentyRecordId,
        resolvedAt: new Date(),
        resolvedById: actorId,
      });
    });

    this.logger.log(
      `Resolved queue entry ${queueId} → linked to ${twentyEntityName}:${twentyRecordId}`,
    );
  }

  /**
   * Mark a queue entry as needing a NEW Twenty record (created later by the
   * backfill command).
   */
  async resolveNew(
    workspaceId: string,
    queueId: string,
    actorId: string,
  ): Promise<void> {
    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalIdentityMatchQueueWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const entry = await repo.findOneOrFail({
        where: { id: queueId },
      });

      if (entry.resolutionState !== IdentityMatchResolution.PENDING) {
        throw new Error(
          `Queue entry ${queueId} is already resolved (${entry.resolutionState})`,
        );
      }

      await repo.update(queueId, {
        resolutionState: IdentityMatchResolution.RESOLVED_NEW,
        resolvedAt: new Date(),
        resolvedById: actorId,
      });
    });

    this.logger.log(`Resolved queue entry ${queueId} → RESOLVED_NEW`);
  }

  /**
   * Skip a queue entry (no link, no record created).
   */
  async skip(
    workspaceId: string,
    queueId: string,
    actorId: string,
    reason: string,
  ): Promise<void> {
    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalIdentityMatchQueueWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const entry = await repo.findOneOrFail({
        where: { id: queueId },
      });

      if (entry.resolutionState !== IdentityMatchResolution.PENDING) {
        throw new Error(
          `Queue entry ${queueId} is already resolved (${entry.resolutionState})`,
        );
      }

      await repo.update(queueId, {
        resolutionState: IdentityMatchResolution.RESOLVED_SKIP,
        matchReasons: { skipReason: reason },
        resolvedAt: new Date(),
        resolvedById: actorId,
      });
    });

    this.logger.log(
      `Skipped queue entry ${queueId}: ${reason}`,
    );
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * Should this MatchResult be enqueued for human review?  Enqueue when:
   * - Confidence is below HIGH (MEDIUM, LOW, NONE), OR
   * - Multiple candidates exist (ambiguous match).
   */
  private shouldEnqueue(result: MatchResult): boolean {
    // Use numeric rank — string comparison is lexicographic, not by confidence ordering.
    if (CONFIDENCE_RANK[result.confidence] < CONFIDENCE_RANK[IdentityMatchConfidence.HIGH]) {
      return true;
    }

    if (result.candidates && result.candidates.length > 1) {
      return true;
    }

    return false;
  }
}
