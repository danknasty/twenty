/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { IdempotencyService } from 'src/engine/core-modules/executive-search/services/idempotency.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';

describe('IdempotencyService', () => {
  let inboundEventLedgerService: jest.Mocked<InboundEventLedgerService>;
  let idempotencyService: IdempotencyService;

  const workspaceId = 'ws-001';

  const baseEvent: ExternalSyncEvent = {
    eventId: 'evt-001',
    eventType: 'items.create',
    eventVersion: 1,
    sourceSystem: 'DIRECTUS',
    sourceCollection: 'executives',
    sourceRecordId: 'rec-001',
    sourceUpdatedAt: '2026-07-16T00:00:00Z',
    sourceHash: null,
    workspaceKey: 'ws-key-001',
    correlationId: 'corr-001',
    causationId: null,
    idempotencyKey: 'idem-001',
    occurredAt: '2026-07-16T00:00:00Z',
    actor: null,
    changedFields: null,
    payload: { name: 'Jane' },
  };

  beforeEach(() => {
    inboundEventLedgerService = {
      findByEventId: jest.fn(),
      recordReceipt: jest.fn(),
    } as unknown as jest.Mocked<InboundEventLedgerService>;

    idempotencyService = new IdempotencyService(inboundEventLedgerService);
  });

  it('should return "new" when no existing row exists', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue(null);

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({ outcome: 'new' });
    expect(inboundEventLedgerService.recordReceipt).toHaveBeenCalledWith(
      workspaceId,
      baseEvent,
    );
  });

  it('should return "alreadyProcessed" when existing row has status PROCESSED', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue({
      status: 'PROCESSED',
    });

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({ outcome: 'alreadyProcessed' });
    expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
  });

  it('should return "retry" when existing row has status RECEIVED', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue({
      status: 'RECEIVED',
    });

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({ outcome: 'retry', currentStatus: 'RECEIVED' });
    expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
  });

  it('should return "retry" when existing row has status PROCESSING', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue({
      status: 'PROCESSING',
    });

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({
      outcome: 'retry',
      currentStatus: 'PROCESSING',
    });
    expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
  });

  it('should return "retry" when existing row has status FAILED', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue({
      status: 'FAILED',
    });

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({ outcome: 'retry', currentStatus: 'FAILED' });
  });

  it('should return "retry" when existing row has status DEAD_LETTERED', async () => {
    inboundEventLedgerService.findByEventId.mockResolvedValue({
      status: 'DEAD_LETTERED',
    });

    const result = await idempotencyService.checkAndRecord(
      workspaceId,
      baseEvent,
    );

    expect(result).toEqual({
      outcome: 'retry',
      currentStatus: 'DEAD_LETTERED',
    });
  });
});
