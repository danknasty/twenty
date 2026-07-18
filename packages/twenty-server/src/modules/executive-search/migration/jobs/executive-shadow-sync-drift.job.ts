import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { FeatureFlagKey } from 'twenty-shared/types';
import { EXECUTIVE_SHADOW_SYNC_DRIFT_CRON_PATTERN } from 'src/modules/executive-search/migration/jobs/executive-shadow-sync-drift.cron.pattern';
import { ShadowSyncDriftReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/shadow-sync-drift.engine';

export const EXECUTIVE_SHADOW_SYNC_DRIFT_JOB_NAME =
  'ExecutiveShadowSyncDriftJob';

/**
 * Periodically sweeps the shadow-sync inbox for each enabled workspace and runs
 * the no-writes drift comparison.  Findings are returned by the engine but
 * nothing is applied — this job exists only to keep the drift signal fresh.
 */
@Processor(MessageQueue.cronQueue)
export class ExecutiveShadowSyncDriftJob {
  private readonly logger = new Logger(ExecutiveShadowSyncDriftJob.name);

  constructor(
    private readonly driftEngine: ShadowSyncDriftReconciliationEngine,
    private readonly featureFlagService: FeatureFlagService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  @Process(EXECUTIVE_SHADOW_SYNC_DRIFT_JOB_NAME)
  @SentryCronMonitor(
    EXECUTIVE_SHADOW_SYNC_DRIFT_JOB_NAME,
    EXECUTIVE_SHADOW_SYNC_DRIFT_CRON_PATTERN,
  )
  async handle(): Promise<void> {
    const workspaces = await this.workspaceRepository.find({
      select: ['id'],
    });

    for (const workspace of workspaces) {
      try {
        if (
          !(await this.featureFlagService.isFeatureEnabled(
            FeatureFlagKey.IS_EXECUTIVE_SEARCH_SHADOW_SYNC_ENABLED,
            workspace.id,
          ))
        ) {
          continue;
        }

        const findings = await this.driftEngine.reconcile({
          workspaceId: workspace.id,
          objectName: 'externalSyncInbox',
        });

        if (findings.length > 0) {
          this.logger.log(
            `Shadow-sync drift sweep emitted ${findings.length} finding(s) for workspace ${workspace.id}`,
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error';
        this.logger.error(
          `Shadow-sync drift sweep failed for workspace ${workspace.id}: ${message}`,
        );
      }
    }
  }
}
