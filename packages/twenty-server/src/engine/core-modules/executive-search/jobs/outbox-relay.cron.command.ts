/* @license Enterprise */

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { OUTBOX_RELAY_JOB_NAME } from 'src/engine/core-modules/executive-search/executive-search.constants';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'cron:executive-search:outbox-relay',
  description: 'Register the outbox relay cron job',
})
export class OutboxRelayCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.outboxRelayQueue)
    private readonly outboxRelayQueue: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.outboxRelayQueue.addCron(
      OUTBOX_RELAY_JOB_NAME,
      '*/1 * * * *', // Every minute
      undefined, // no data — job handles workspace iteration
      { priority: 7 },
    );
  }
}
