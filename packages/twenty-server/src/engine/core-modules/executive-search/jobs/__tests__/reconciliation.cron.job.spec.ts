/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { getQueueToken } from 'src/engine/core-modules/message-queue/utils/get-queue-token.util';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  RECONCILIATION_CRON_JOB_NAME,
  RECONCILIATION_RUNNER_JOB_NAME,
} from 'src/engine/core-modules/executive-search/executive-search.constants';
import { ReconciliationCronJob } from 'src/engine/core-modules/executive-search/jobs/reconciliation.cron.job';

describe('ReconciliationCronJob', () => {
  let job: ReconciliationCronJob;
  let mockSyncQueue: { add: jest.Mock };

  beforeEach(async () => {
    mockSyncQueue = { add: jest.fn().mockResolvedValue(undefined) };

    job = new ReconciliationCronJob(
      mockSyncQueue as unknown as MessageQueueService,
    );
  });

  it('should enqueue RECONCILIATION_RUNNER_JOB_NAME to syncQueue with workspaceId', async () => {
    await job.handle();

    expect(mockSyncQueue.add).toHaveBeenCalledTimes(1);
    expect(mockSyncQueue.add).toHaveBeenCalledWith(
      RECONCILIATION_RUNNER_JOB_NAME,
      {
        workspaceId: '00000000-0000-0000-0000-000000000001',
      },
    );
  });
});
