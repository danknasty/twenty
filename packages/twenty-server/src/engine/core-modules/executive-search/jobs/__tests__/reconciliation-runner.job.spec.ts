/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { ReconciliationService } from 'src/engine/core-modules/executive-search/services/reconciliation.service';
import { ReconciliationRunnerJob } from 'src/engine/core-modules/executive-search/jobs/reconciliation-runner.job';
import { RECONCILIATION_RUNNER_JOB_NAME } from 'src/engine/core-modules/executive-search/executive-search.constants';

describe('ReconciliationRunnerJob', () => {
  let job: ReconciliationRunnerJob;
  let mockReconciliationService: { startRun: jest.Mock };

  beforeEach(async () => {
    mockReconciliationService = {
      startRun: jest.fn().mockResolvedValue({
        runId: 'test-run-id',
        status: 'COMPLETED',
        findingsCount: 0,
      }),
    };

    job = new ReconciliationRunnerJob(
      mockReconciliationService as unknown as ReconciliationService,
    );
  });

  it('should call reconciliationService.startRun with the correct workspaceId', async () => {
    const workspaceId = 'ws-001';

    await job.handle({ workspaceId });

    expect(mockReconciliationService.startRun).toHaveBeenCalledTimes(1);
    expect(mockReconciliationService.startRun).toHaveBeenCalledWith(
      workspaceId,
    );
  });
});
