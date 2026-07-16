import { Test, type TestingModule } from '@nestjs/testing';

import { WorkspaceEventOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/workspace-event-outbox.workspace-entity';
import {
  DrainOutboxJob,
  type DrainOutboxJobData,
} from 'src/engine/core-modules/transactional-outbox/jobs/drain-outbox.job';
import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

type MockRepository = {
  find: jest.Mock;
  update: jest.Mock;
};

describe('DrainOutboxJob', () => {
  let job: DrainOutboxJob;
  let mockRepository: MockRepository;
  let mockWorkspaceEventEmitter: { emitDatabaseBatchEvent: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      update: jest.fn(),
    };

    mockWorkspaceEventEmitter = {
      emitDatabaseBatchEvent: jest.fn(),
    };

    const mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation(
          (fn: () => Promise<void>, _authContext: any) => fn(),
        ),
      getRepository: jest.fn().mockResolvedValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrainOutboxJob,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
        {
          provide: WorkspaceEventEmitter,
          useValue: mockWorkspaceEventEmitter,
        },
      ],
    }).compile();

    job = await module.resolve<DrainOutboxJob>(DrainOutboxJob);
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('should do nothing when there are no pending entries', async () => {
    // Stale find returns empty
    mockRepository.find.mockResolvedValueOnce([]);
    // Pending find returns empty
    mockRepository.find.mockResolvedValueOnce([]);

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.find).toHaveBeenCalledTimes(2);
    expect(mockRepository.update).not.toHaveBeenCalled();
    expect(
      mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
    ).not.toHaveBeenCalled();
  });

  it('should process pending entries and mark them as DELIVERED', async () => {
    const pendingEntry = {
      id: 'entry-1',
      eventName: 'person.created',
      eventPayload: { id: '123', name: 'John' },
      status: OutboxStatus.PENDING,
      attemptCount: 0,
    };

    // Stale find returns empty
    mockRepository.find.mockResolvedValueOnce([]);
    // Pending find returns the entry
    mockRepository.find.mockResolvedValueOnce([pendingEntry]);
    // Atomic claim succeeds
    mockRepository.update.mockResolvedValue({ affected: 1 });

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.find).toHaveBeenCalledTimes(2);
    // Atomic claim with conditional update
    expect(mockRepository.update).toHaveBeenNthCalledWith(
      1,
      { id: 'entry-1', status: OutboxStatus.PENDING },
      {
        status: OutboxStatus.IN_PROGRESS,
        lastAttemptAt: expect.any(String),
        attemptCount: 1,
      },
    );
    expect(
      mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
    ).toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenNthCalledWith(
      2,
      'entry-1',
      {
        status: OutboxStatus.DELIVERED,
        deliveredAt: expect.any(String),
      },
    );
  });

  it('should mark entry as DEAD_LETTERED after max attempts', async () => {
    const pendingEntry = {
      id: 'entry-2',
      eventName: 'company.updated',
      eventPayload: { id: '456' },
      status: OutboxStatus.PENDING,
      attemptCount: 4, // max is 5, so next attempt will reach it
    };

    // Stale find returns empty
    mockRepository.find.mockResolvedValueOnce([]);
    // Pending find returns the entry
    mockRepository.find.mockResolvedValueOnce([pendingEntry]);
    // Atomic claim succeeds
    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockWorkspaceEventEmitter.emitDatabaseBatchEvent.mockImplementation(
      () => {
        throw new Error('Delivery failed');
      },
    );

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.update).toHaveBeenCalledWith('entry-2', {
      status: OutboxStatus.DEAD_LETTERED,
      lastAttemptAt: expect.any(String),
      attemptCount: 5,
      lastErrorMessage: 'Delivery failed',
    });
  });

  it('should re-enqueue entry as PENDING with backoff when below max attempts', async () => {
    const pendingEntry = {
      id: 'entry-3',
      eventName: 'opportunity.deleted',
      eventPayload: { id: '789' },
      status: OutboxStatus.PENDING,
      attemptCount: 1,
    };

    // Stale find returns empty
    mockRepository.find.mockResolvedValueOnce([]);
    // Pending find returns the entry
    mockRepository.find.mockResolvedValueOnce([pendingEntry]);
    // Atomic claim succeeds
    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockWorkspaceEventEmitter.emitDatabaseBatchEvent.mockImplementation(
      () => {
        throw new Error('Temporary error');
      },
    );

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.update).toHaveBeenCalledWith('entry-3', {
      status: OutboxStatus.PENDING,
      lastAttemptAt: expect.any(String),
      attemptCount: 2,
      lastErrorMessage: 'Temporary error',
      nextAttemptAt: expect.any(String),
    });
  });
});
