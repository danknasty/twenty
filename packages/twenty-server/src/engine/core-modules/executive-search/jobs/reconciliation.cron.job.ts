/* @license Enterprise */

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  RECONCILIATION_CRON_JOB_NAME,
  RECONCILIATION_RUNNER_JOB_NAME,
} from 'src/engine/core-modules/executive-search/executive-search.constants';

@Processor(MessageQueue.cronQueue)
export class ReconciliationCronJob {
  constructor(
    @InjectMessageQueue(MessageQueue.syncQueue)
    private readonly syncQueue: MessageQueueService,
  ) {}

  @Process(RECONCILIATION_CRON_JOB_NAME)
  async handle(): Promise<void> {
    // TWO-HOP pattern: enqueue a per-workspace runner job
    // For now, use a single test workspace ID
    const testWorkspaceId = '00000000-0000-0000-0000-000000000001';

    await this.syncQueue.add(RECONCILIATION_RUNNER_JOB_NAME, {
      workspaceId: testWorkspaceId,
    });

    // In production (PR5+), iterate active workspaces and enqueue one per workspace
  }
}
