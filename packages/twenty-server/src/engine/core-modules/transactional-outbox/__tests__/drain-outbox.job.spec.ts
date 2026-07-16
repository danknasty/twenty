import { Test, type TestingModule } from '@nestjs/testing';

import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';
import {
  DrainOutboxJob,
  OUTBOX_DRAIN_BATCH_SIZE,
  OUTBOX_MAX_ATTEMPTS,
} from 'src/engine/core-modules/transactional-outbox/jobs/drain-outbox.job';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

describe('DrainOutboxJob', () => {
  let job: DrainOutboxJob;
  let mockWorkspaceEventEmitter: jest.Mocked<WorkspaceEventEmitter>;
  let mockGlobalWorkspaceOrmManager: jest.Mocked<GlobalWorkspaceOrmManager>;
  let mockQueryRunner: any;
  let mockDataSource: any;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: {
        query: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest.fn((fn) => fn()),
      getGlobalWorkspaceDataSource: jest
        .fn()
        .mockResolvedValue(mockDataSource),
    } as unknown as jest.Mocked<GlobalWorkspaceOrmManager>;

    mockWorkspaceEventEmitter = {
      emitDatabaseBatchEvent: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceEventEmitter>;

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

  describe('handle', () => {
    const workspaceId = 'workspace-1';
    const mockPendingRow = {
      id: 'row-1',
      eventName: 'executiveProfile.created',
      eventPayload: JSON.stringify({
        name: 'executiveProfile.created',
        workspaceId,
        objectMetadata: { id: 'obj-1', nameSingular: 'executiveProfile' },
        events: [
          {
            recordId: 'rec-1',
            properties: {
              after: { name: 'John Doe' },
            },
          },
        ],
      }),
      status: OutboxStatus.PENDING,
      attemptCount: 0,
    };

    it('should deserialize and call emitDatabaseBatchEvent with correct shape', async () => {
      mockQueryRunner.manager.query.mockResolvedValue([mockPendingRow]);

      await job.handle({ workspaceId });

      expect(
        mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
      ).toHaveBeenCalledWith({
        objectMetadataNameSingular: 'executiveProfile',
        action: 'created',
        events: mockPendingRow.eventPayload
          ? JSON.parse(mockPendingRow.eventPayload).events
          : [],
        objectMetadata: {
          id: 'obj-1',
          nameSingular: 'executiveProfile',
        },
        workspaceId,
      });
    });

    it('should mark row as DELIVERED on success', async () => {
      mockQueryRunner.manager.query.mockResolvedValue([mockPendingRow]);

      await job.handle({ workspaceId });

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-1' },
        expect.objectContaining({
          status: OutboxStatus.DELIVERED,
        }),
      );
    });

    it('should mark as IN_PROGRESS before processing', async () => {
      mockQueryRunner.manager.query.mockResolvedValue([mockPendingRow]);

      await job.handle({ workspaceId });

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-1' },
        expect.objectContaining({
          status: OutboxStatus.IN_PROGRESS,
        }),
      );
    });

    it('should mark as DEAD_LETTERED after max attempts', async () => {
      const deadLetterRow = {
        ...mockPendingRow,
        attemptCount: OUTBOX_MAX_ATTEMPTS - 1,
      };

      mockWorkspaceEventEmitter.emitDatabaseBatchEvent.mockImplementation(
        () => {
          throw new Error('Delivery failed');
        },
      );
      mockQueryRunner.manager.query.mockResolvedValue([deadLetterRow]);

      await job.handle({ workspaceId });

      expect(mockQueryRunner.manager.update).toHaveBeenLastCalledWith(
        'workspaceEventOutbox',
        { id: 'row-1' },
        expect.objectContaining({
          status: OutboxStatus.DEAD_LETTERED,
        }),
      );
    });

    it('should re-process PENDING rows after simulated pre-mark crash (at-least-once)', async () => {
      // Simulate a crash after processing but before commit (transaction rollback)
      mockQueryRunner.manager.query.mockResolvedValue([mockPendingRow]);
      mockQueryRunner.commitTransaction.mockRejectedValueOnce(
        new Error('Connection lost'),
      );

      await job.handle({ workspaceId });

      expect(
        mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
      ).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      // Row stays PENDING because transaction was rolled back
      // On next drain cycle, the PENDING row is picked up again
    });

    it('should drain nothing when no PENDING rows', async () => {
      mockQueryRunner.manager.query.mockResolvedValue([]);

      await job.handle({ workspaceId });

      expect(
        mockWorkspaceEventEmitter.emitDatabaseBatchEvent,
      ).not.toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should use the configured batch size', async () => {
      mockQueryRunner.manager.query.mockResolvedValue([]);

      await job.handle({ workspaceId });

      expect(mockQueryRunner.manager.query).toHaveBeenCalledWith(
        expect.any(String),
        [OutboxStatus.PENDING, OUTBOX_DRAIN_BATCH_SIZE],
      );
    });
  });
});
