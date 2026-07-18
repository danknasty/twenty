import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { DrainOutboxCronJob, OUTBOX_DRAIN_CRON_PATTERN } from 'src/engine/core-modules/transactional-outbox/crons/jobs/drain-outbox.cron.job';

@Command({
  name: 'cron:outbox:drain',
  description: 'Starts a cron job to drain the transactional outbox',
})
export class DrainOutboxCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: DrainOutboxCronJob.name,
      data: undefined,
      options: {
        repeat: {
          pattern: OUTBOX_DRAIN_CRON_PATTERN,
        },
      },
    });
  }
}
