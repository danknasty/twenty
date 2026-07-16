/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { DeadLetterService } from 'src/engine/core-modules/executive-search/services/dead-letter.service';

describe('DeadLetterService', () => {
  let messageQueueService: jest.Mocked<MessageQueueService>;
  let deadLetterService: DeadLetterService;

  const workspaceId = 'ws-001';

  const deadLetterParams = {
    eventId: 'evt-001',
    idempotencyKey: 'idem-001',
    originalQueue: 'sync-queue',
    payload: { name: 'Jane' },
    lastErrorCode: 'VALIDATION_ERROR',
    attempts: 3,
  };

  beforeEach(() => {
    messageQueueService = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageQueueService>;

    deadLetterService = new DeadLetterService(messageQueueService);
  });

  afterEach(() => {
    deadLetterService._clearStore();
  });

  describe('moveToDeadLetter', () => {
    it('should persist a record with the correct fields', async () => {
      await deadLetterService.moveToDeadLetter(workspaceId, deadLetterParams);

      // Find the record by eventId to verify
      const record = await deadLetterService.findByEventId(
        workspaceId,
        deadLetterParams.eventId,
      );

      expect(record).toBeDefined();
      expect(record!.eventId).toBe('evt-001');
      expect(record!.idempotencyKey).toBe('idem-001');
      expect(record!.originalQueue).toBe('sync-queue');
      expect(record!.payload).toEqual({ name: 'Jane' });
      expect(record!.lastErrorCode).toBe('VALIDATION_ERROR');
      expect(record!.attempts).toBe(3);
      expect(record!.isReplayed).toBe(false);
      expect(record!.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('replay', () => {
    it('should mark isReplayed=true and set replayedAt', async () => {
      await deadLetterService.moveToDeadLetter(workspaceId, deadLetterParams);

      const record = await deadLetterService.findByEventId(
        workspaceId,
        deadLetterParams.eventId,
      );

      // Replay using the record's ID
      await deadLetterService.replay(workspaceId, record!.id);

      const replayed = await deadLetterService.findByEventId(
        workspaceId,
        deadLetterParams.eventId,
      );

      expect(replayed!.isReplayed).toBe(true);
      expect(replayed!.replayedAt).toBeInstanceOf(Date);
    });

    it('should re-enqueue the event to syncQueue via MessageQueueService', async () => {
      await deadLetterService.moveToDeadLetter(workspaceId, deadLetterParams);

      const record = await deadLetterService.findByEventId(
        workspaceId,
        deadLetterParams.eventId,
      );

      await deadLetterService.replay(workspaceId, record!.id);

      expect(messageQueueService.add).toHaveBeenCalledWith(
        'process-dead-letter-replay',
        {
          eventId: 'evt-001',
          idempotencyKey: 'idem-001',
          payload: { name: 'Jane' },
          originalQueue: 'sync-queue',
        },
        { retryLimit: 3 },
      );
    });

    it('should not re-enqueue if dead-letter entry is not found', async () => {
      await deadLetterService.replay(workspaceId, 'non-existent-id');

      expect(messageQueueService.add).not.toHaveBeenCalled();
    });

    it('should not re-enqueue if dead-letter entry was already replayed', async () => {
      await deadLetterService.moveToDeadLetter(workspaceId, deadLetterParams);

      const record = await deadLetterService.findByEventId(
        workspaceId,
        deadLetterParams.eventId,
      );

      // First replay
      await deadLetterService.replay(workspaceId, record!.id);
      expect(messageQueueService.add).toHaveBeenCalledTimes(1);

      // Second replay — should be idempotent
      await deadLetterService.replay(workspaceId, record!.id);
      expect(messageQueueService.add).toHaveBeenCalledTimes(1);
    });
  });
});
