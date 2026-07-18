import { Test, type TestingModule } from '@nestjs/testing';

import { type QueryRunner } from 'typeorm';

import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';
import { TransactionalOutboxService } from 'src/engine/core-modules/transactional-outbox/services/transactional-outbox.service';

describe('TransactionalOutboxService', () => {
  let service: TransactionalOutboxService;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    mockQueryRunner = {
      manager: {
        insert: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue(undefined),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionalOutboxService],
    }).compile();

    service = module.get<TransactionalOutboxService>(
      TransactionalOutboxService,
    );
  });

  describe('append', () => {
    it('should insert a PENDING row on the provided queryRunner', async () => {
      await service.append(
        {
          eventName: 'person.created',
          eventPayload: {
            name: 'person.created',
            workspaceId: 'workspace-1',
            objectMetadata: { id: 'obj-1' },
            events: [
              {
                objectMetadataId: 'obj-1',
                recordId: 'rec-1',
                diff: { name: 'John' },
                details: { before: null, after: { name: 'John' } },
              },
            ],
          },
          idempotencyKey: 'key-1',
        },
        mockQueryRunner,
      );

      expect(mockQueryRunner.manager.insert).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        expect.objectContaining({
          eventName: 'person.created',
          idempotencyKey: 'key-1',
          status: OutboxStatus.PENDING,
          attemptCount: 0,
        }),
      );
    });

    it('should set idempotencyKey to null when not provided', async () => {
      await service.append(
        {
          eventName: 'person.created',
          eventPayload: { events: [] },
        },
        mockQueryRunner,
      );

      expect(mockQueryRunner.manager.insert).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        expect.objectContaining({
          idempotencyKey: null,
        }),
      );
    });
  });

  describe('markInProgress', () => {
    it('should update the row to IN_PROGRESS status', async () => {
      await service.markInProgress('row-id-1', mockQueryRunner);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-id-1' },
        expect.objectContaining({
          status: OutboxStatus.IN_PROGRESS,
        }),
      );
    });
  });

  describe('markDelivered', () => {
    it('should update the row to DELIVERED status', async () => {
      await service.markDelivered('row-id-1', mockQueryRunner);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-id-1' },
        expect.objectContaining({
          status: OutboxStatus.DELIVERED,
        }),
      );
    });
  });

  describe('markFailed', () => {
    it('should mark as DEAD_LETTERED when nextAttemptAt is null', async () => {
      await service.markFailed(
        'row-id-1',
        5,
        null,
        'Too many retries',
        mockQueryRunner,
      );

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-id-1' },
        expect.objectContaining({
          status: OutboxStatus.DEAD_LETTERED,
          attemptCount: 5,
          lastErrorMessage: 'Too many retries',
        }),
      );
    });

    it('should set nextAttemptAt when not dead lettering', async () => {
      const nextAttemptAt = new Date(Date.now() + 60_000);

      await service.markFailed(
        'row-id-1',
        2,
        nextAttemptAt,
        'Temporary error',
        mockQueryRunner,
      );

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        'workspaceEventOutbox',
        { id: 'row-id-1' },
        expect.objectContaining({
          attemptCount: 2,
          nextAttemptAt,
          lastErrorMessage: 'Temporary error',
        }),
      );
    });
  });
});
