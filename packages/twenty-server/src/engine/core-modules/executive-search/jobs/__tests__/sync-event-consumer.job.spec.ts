/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { SyncEventConsumerJob } from 'src/engine/core-modules/executive-search/jobs/sync-event-consumer.job';
import { DeadLetterService } from 'src/engine/core-modules/executive-search/services/dead-letter.service';
import { IdempotencyService } from 'src/engine/core-modules/executive-search/services/idempotency.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';

const workspaceId = '123e4567-e89b-4d3e-a456-426614174000';

const baseEvent: ExternalSyncEvent = {
  eventId: 'evt-001',
  eventType: 'executive.updated',
  eventVersion: 1,
  sourceSystem: 'DIRECTUS',
  sourceCollection: 'executives',
  sourceRecordId: 'dir-exec-42',
  sourceUpdatedAt: '2026-07-15T16:00:00Z',
  sourceHash: 'abc123',
  workspaceKey: workspaceId,
  correlationId: 'corr-001',
  causationId: null,
  idempotencyKey: 'idem-001',
  occurredAt: '2026-07-15T16:00:01Z',
  actor: { type: 'CANDIDATE', id: 'dir-exec-42' },
  changedFields: ['current_title'],
  payload: null,
};

describe('SyncEventConsumerJob', () => {
  let idempotencyService: jest.Mocked<IdempotencyService>;
  let inboundEventLedgerService: jest.Mocked<InboundEventLedgerService>;
  let deadLetterService: jest.Mocked<DeadLetterService>;
  let job: SyncEventConsumerJob;

  beforeEach(() => {
    idempotencyService = {
      checkAndRecord: jest.fn(),
    } as unknown as jest.Mocked<IdempotencyService>;

    inboundEventLedgerService = {
      markProcessing: jest.fn(),
      markProcessed: jest.fn(),
      markDeadLettered: jest.fn(),
    } as unknown as jest.Mocked<InboundEventLedgerService>;

    deadLetterService = {
      moveToDeadLetter: jest.fn(),
    } as unknown as jest.Mocked<DeadLetterService>;

    job = new SyncEventConsumerJob(
      idempotencyService,
      inboundEventLedgerService,
      deadLetterService,
    );
  });

  describe('Success path', () => {
    it('should mark PROCESSED when processing succeeds', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'new',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
      expect(inboundEventLedgerService.markProcessed).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
      expect(deadLetterService.moveToDeadLetter).not.toHaveBeenCalled();
    });
  });

  describe('Already PROCESSED (idempotency)', () => {
    it('should skip and ack when idempotency returns alreadyProcessed', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'alreadyProcessed',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).not.toHaveBeenCalled();
      expect(inboundEventLedgerService.markProcessed).not.toHaveBeenCalled();
      expect(deadLetterService.moveToDeadLetter).not.toHaveBeenCalled();
    });
  });

  describe('Crash recovery (RECEIVED status)', () => {
    it('should resume processing when event has RECEIVED status', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'retry',
        currentStatus: 'RECEIVED',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
      expect(inboundEventLedgerService.markProcessed).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
    });
  });

  describe('Echo-loop prevention (sourceSystem TWENTY)', () => {
    it('should skip events originating from Twenty', async () => {
      const twentyEvent = { ...baseEvent, sourceSystem: 'TWENTY' as const };

      await job.handle({ workspaceId, event: twentyEvent });

      expect(
        idempotencyService.checkAndRecord,
      ).not.toHaveBeenCalled();
      expect(
        inboundEventLedgerService.markProcessing,
      ).not.toHaveBeenCalled();
      expect(
        inboundEventLedgerService.markProcessed,
      ).not.toHaveBeenCalled();
    });
  });

  describe('Processing error → dead-lettered', () => {
    it('should move to dead letter and re-throw on processing error', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'new',
      });

      // Mock processInboundEvent to throw (we can't spy on private methods,
      // so we rely on the actual behavior - the processInboundEvent is a
      // no-op, so this test verifies the error handling path through a
      // different approach)
      jest
        .spyOn(job as any, 'processInboundEvent')
        .mockRejectedValue(new Error('Processing failure'));

      await expect(
        job.handle({ workspaceId, event: baseEvent }),
      ).rejects.toThrow('Processing failure');

      expect(deadLetterService.moveToDeadLetter).toHaveBeenCalledWith(
        workspaceId,
        expect.objectContaining({
          eventId: baseEvent.eventId,
          idempotencyKey: baseEvent.idempotencyKey,
          originalQueue: 'sync-queue',
          lastErrorCode: 'PROCESSING_ERROR',
        }),
      );
      expect(
        inboundEventLedgerService.markDeadLettered,
      ).toHaveBeenCalledWith(workspaceId, baseEvent.eventId);
    });
  });

  describe('Idempotency "retry" (PROCESSING status)', () => {
    it('should resume processing for PROCESSING status', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'retry',
        currentStatus: 'PROCESSING',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
      expect(inboundEventLedgerService.markProcessed).toHaveBeenCalledWith(
        workspaceId,
        baseEvent.eventId,
      );
    });
  });

  describe('Idempotency "retry" (FAILED/DEAD_LETTERED status)', () => {
    it('should resume processing when event has FAILED status', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'retry',
        currentStatus: 'FAILED',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).toHaveBeenCalled();
      expect(inboundEventLedgerService.markProcessed).toHaveBeenCalled();
    });

    it('should resume processing when event has DEAD_LETTERED status', async () => {
      idempotencyService.checkAndRecord.mockResolvedValue({
        outcome: 'retry',
        currentStatus: 'DEAD_LETTERED',
      });

      await job.handle({ workspaceId, event: baseEvent });

      expect(inboundEventLedgerService.markProcessing).toHaveBeenCalled();
      expect(inboundEventLedgerService.markProcessed).toHaveBeenCalled();
    });
  });
});
