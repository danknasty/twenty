import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CutoverService } from 'src/modules/executive-search/migration/services/cutover.service';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-outbox.workspace-entity';
import { CutoverStage } from 'src/modules/executive-search/common/enums/cutover-stage.enum';

type RollbackReport = {
  stage: CutoverStage;
  deactivatedLinks: number;
  outboundPaused: boolean;
  queuedEvents: number;
  revertedFields: string[];
  dryRun: boolean;
};

/**
 * Per-stage rollback primitives for executive search migration.
 *
 * Every operation is reversible and never deletes data:
 *  - Identity links are deactivated, not deleted.
 *  - Outbound projection is paused, not stopped (events queue).
 *  - Field ownership is reverted to the prior cutover stage via CutoverService.
 */
@Injectable()
export class RollbackService {
  private readonly logger = new Logger(RollbackService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly cutoverService: CutoverService,
  ) {}

  /**
   * Revert field ownership from the current stage back to `toStage`.
   */
  async revertFieldOwnership(
    workspaceId: string,
    toStage: CutoverStage,
    actorId: string,
    dryRun = false,
  ): Promise<{ revertedFields: string[]; dryRun: boolean }> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const currentStage = await this.cutoverService.getCurrentStage(workspaceId);

      this.logger.log(
        `Reverting field ownership from "${currentStage}" to "${toStage}" for workspace ${workspaceId}${dryRun ? ' [DRY RUN]' : ''}`,
      );

      const diff = await this.cutoverService.revertToStage(
        workspaceId,
        toStage,
        actorId,
        dryRun,
      );

      return {
        revertedFields: diff.changes.map((c) => c.collection),
        dryRun,
      };
    });
  }

  /**
   * Pause outbound projection by disabling the feature flag.
   * Events keep queuing in the outbox but delivery is short-circuited.
   * Returns the count of currently queued events.
   */
  async pauseOutbound(workspaceId: string): Promise<{ outboundPaused: boolean; queuedEvents: number }> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      // Set the feature flag to false at workspace level.
      // The OutboundProjectionService already checks IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED
      // and short-circuits when it's off.
      const flagRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        'featureFlag',
        { shouldBypassPermissionChecks: true },
      );

      await flagRepo.upsert(
        {
          workspaceId,
          key: 'IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED',
          value: false,
        },
        { conflictPaths: ['workspaceId', 'key'] },
      );

      // Count queued events in the outbox.
      const outboxRepo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalSyncOutboxWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const pendingCount = await outboxRepo.count({ where: { status: 'PENDING' } });

      this.logger.log(
        `Paused outbound for workspace ${workspaceId} — ${pendingCount} events queued`,
      );

      return { outboundPaused: true, queuedEvents: pendingCount };
    });
  }

  /**
   * Deactivate identity links for a workspace — set `isAuthoritativeLink=false`
   * and `syncStatus='DEACTIVATED'`.  NEVER deletes rows.
   *
   * @param filter Optional: filter by `twentyEntityName` or `externalEntityName`.
   */
  async deactivateIdentityLinks(
    workspaceId: string,
    filter?: { twentyEntityName?: string; externalEntityName?: string },
    dryRun = false,
  ): Promise<number> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repo = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalEntityLinkWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      const where: Record<string, unknown> = {
        isAuthoritativeLink: true,
        syncStatus: 'LINKED',
      };

      if (filter?.twentyEntityName) {
        where.twentyEntityName = filter.twentyEntityName;
      }

      if (filter?.externalEntityName) {
        where.externalEntityName = filter.externalEntityName;
      }

      if (dryRun) {
        const count = await repo.count({ where });
        this.logger.log(
          `[DRY RUN] Would deactivate ${count} identity links in workspace ${workspaceId}`,
        );
        return count;
      }

      const links = await repo.find({ where });

      for (const link of links) {
        await repo.update(link.id, {
          isAuthoritativeLink: false,
          syncStatus: 'DEACTIVATED',
        });
      }

      this.logger.log(
        `Deactivated ${links.length} identity links in workspace ${workspaceId}`,
      );

      return links.length;
    });
  }

  /**
   * Full rollback orchestration: revert ownership → pause outbound →
   * deactivate links.
   */
  async fullRollback(
    workspaceId: string,
    toStage: CutoverStage,
    actorId: string,
    dryRun = false,
  ): Promise<RollbackReport> {
    const ownershipResult = await this.revertFieldOwnership(
      workspaceId,
      toStage,
      actorId,
      dryRun,
    );

    const outboundResult = dryRun
      ? { outboundPaused: true, queuedEvents: 0 }
      : await this.pauseOutbound(workspaceId);

    const linkCount = await this.deactivateIdentityLinks(
      workspaceId,
      undefined,
      dryRun,
    );

    const report: RollbackReport = {
      stage: toStage,
      deactivatedLinks: linkCount,
      outboundPaused: outboundResult.outboundPaused,
      queuedEvents: outboundResult.queuedEvents,
      revertedFields: ownershipResult.revertedFields,
      dryRun,
    };

    this.logger.log(
      `Full rollback to "${toStage}" complete for workspace ${workspaceId}: ` +
        `${report.deactivatedLinks} links deactivated, ${report.queuedEvents} events queued`,
    );

    return report;
  }
}
