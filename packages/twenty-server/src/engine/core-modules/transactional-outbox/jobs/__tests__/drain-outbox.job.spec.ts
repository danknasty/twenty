import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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
        {
          provide: getRepositoryToken(
            WorkspaceEventOutboxWorkspaceEntity,
            'workspace',
          ),
          useValue: mockRepository,
        },
      ],
    }).compile();

    job = await module.resolve<DrainOutboxJob>(DrainOutboxJob);
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('should do nothing when there are no pending entries', async () => {
    mockRepository.find.mockResolvedValue([]);

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { status: OutboxStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: 100,
    });
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

    mockRepository.find.mockResolvedValue([pendingEntry]);
    mockRepository.update.mockResolvedValue({});

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.find).toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenCalledWith('entry-1', {
      status: OutboxStatus.IN_PROGRESS,
      lastAttemptAt: expect.any(String),
      attemptCount: 1,
    });
    expect(
      mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
    ).toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenCalledWith('entry-1', {
      status: OutboxStatus.DELIVERED,
      deliveredAt: expect.any(String),
    });
  });

  it('should mark entry as DEAD_LETTERED after max attempts', async () => {
    const pendingEntry = {
      id: 'entry-2',
      eventName: 'company.updated',
      eventPayload: { id: '456' },
      status: OutboxStatus.PENDING,
      attemptCount: 4, // max is 5, so next attempt will reach it
    };

    mockRepository.find.mockResolvedValue([pendingEntry]);
    mockWorkspaceEventEmitter.emitDatabaseBatchEvent.mockImplementation(
      () => {
        throw new Error('Delivery failed');
      },
    );
    mockRepository.update.mockResolvedValue({});

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.update).toHaveBeenCalledWith('entry-2', {
      status: OutboxStatus.DEAD_LETTERED,
      lastAttemptAt: expect.any(String),
      attemptCount: 5,
      lastErrorMessage: 'Delivery failed',
    });
  });

  it('should re-enqueue entry as PENDING when below max attempts', async () => {
    const pendingEntry = {
      id: 'entry-3',
      eventName: 'opportunity.deleted',
      eventPayload: { id: '789' },
      status: OutboxStatus.PENDING,
      attemptCount: 1,
    };

    mockRepository.find.mockResolvedValue([pendingEntry]);
    mockWorkspaceEventEmitter.emitDatabaseBatchEvent.mockImplementation(
      () => {
        throw new Error('Temporary error');
      },
    );
    mockRepository.update.mockResolvedValue({});

    await job.handle({ workspaceId: 'workspace-1' });

    expect(mockRepository.update).toHaveBeenCalledWith('entry-3', {
      status: OutboxStatus.PENDING,
      lastAttemptAt: expect.any(String),
      attemptCount: 2,
      lastErrorMessage: 'Temporary error',
    });
  });
});
