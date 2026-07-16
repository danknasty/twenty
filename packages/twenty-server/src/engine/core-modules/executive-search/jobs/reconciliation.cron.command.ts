/* @license Enterprise */

import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  RECONCILIATION_CRON_JOB_NAME,
  RECONCILIATION_CRON_PATTERN,
} from 'src/engine/core-modules/executive-search/executive-search.constants';

@Command({
  name: 'cron:executive-search:reconciliation',
  description: 'Register the reconciliation cron job',
})
export class ReconciliationCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly cronQueue: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.cronQueue.addCron<undefined>({
      jobName: RECONCILIATION_CRON_JOB_NAME,
      data: undefined,
      options: {
        repeat: { pattern: RECONCILIATION_CRON_PATTERN },
        priority: 7,
      },
    });
  }
}
