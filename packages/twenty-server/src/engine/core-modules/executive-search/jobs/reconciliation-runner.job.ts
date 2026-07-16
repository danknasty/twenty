/* @license Enterprise */

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { ReconciliationService } from 'src/engine/core-modules/executive-search/services/reconciliation.service';
import { RECONCILIATION_RUNNER_JOB_NAME } from 'src/engine/core-modules/executive-search/executive-search.constants';

@Processor(MessageQueue.syncQueue)
export class ReconciliationRunnerJob {
  constructor(
    private readonly reconciliationService: ReconciliationService,
  ) {}

  @Process(RECONCILIATION_RUNNER_JOB_NAME)
  async handle(data: { workspaceId: string }): Promise<void> {
    const { workspaceId } = data;
    await this.reconciliationService.startRun(workspaceId);
  }
}
