import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { EXECUTIVE_SHADOW_SYNC_DRIFT_CRON_PATTERN } from 'src/modules/executive-search/migration/jobs/executive-shadow-sync-drift.cron.pattern';
import { EXECUTIVE_SHADOW_SYNC_DRIFT_JOB_NAME } from 'src/modules/executive-search/migration/jobs/executive-shadow-sync-drift.job';

@Command({
  name: 'cron:executive-search:shadow-sync-drift',
  description: 'Starts a cron job to sweep shadow-sync inbox rows for drift',
})
export class ExecutiveShadowSyncDriftCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: EXECUTIVE_SHADOW_SYNC_DRIFT_JOB_NAME,
      data: undefined,
      options: {
        repeat: { pattern: EXECUTIVE_SHADOW_SYNC_DRIFT_CRON_PATTERN },
      },
    });
  }
}
