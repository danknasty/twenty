/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { OutboxRelayJob } from 'src/engine/core-modules/executive-search/jobs/outbox-relay.job';
import { OutboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/outbound-event-ledger.service';
import { OutboxService } from 'src/engine/core-modules/executive-search/services/outbox.service';
import { computeContentHash } from 'src/engine/core-modules/executive-search/utils/compute-content-hash.util';

describe('OutboxRelayJob', () => {
  let outboxService: jest.Mocked<OutboxService>;
  let outboundEventLedgerService: jest.Mocked<OutboundEventLedgerService>;
  let relayJob: OutboxRelayJob;

  const workspaceId = 'ws-001';

  const pendingEvents = [
    {
      id: 'evt-001',
      workspaceId,
      aggregateType: 'executive-profile',
      aggregateId: 'rec-001',
      eventType: 'executive-profile.created',
      payload: { name: 'Jane' },
      status: 'PENDING' as const,
      createdAt: new Date(),
      attempts: 0,
    },
    {
      id: 'evt-002',
      workspaceId,
      aggregateType: 'executive-award',
      aggregateId: 'rec-002',
      eventType: 'executive-award.updated',
      payload: { title: 'Best CEO' },
      status: 'PENDING' as const,
      createdAt: new Date(),
      attempts: 0,
    },
  ];

  beforeEach(() => {
    outboxService = {
      getPending: jest.fn(),
      markPublished: jest.fn(),
      markFailed: jest.fn(),
    } as unknown as jest.Mocked<OutboxService>;

    outboundEventLedgerService = {
      recordOutbound: jest.fn(),
      markSent: jest.fn(),
    } as unknown as jest.Mocked<OutboundEventLedgerService>;

    relayJob = new OutboxRelayJob(outboxService, outboundEventLedgerService);
  });

  it('should drain PENDING events and mark them as PUBLISHED', async () => {
    outboxService.getPending.mockResolvedValue(pendingEvents);

    await relayJob.handle({ workspaceId });

    // All events should have been published
    expect(outboxService.markPublished).toHaveBeenCalledTimes(2);
    expect(outboxService.markPublished).toHaveBeenCalledWith(
      workspaceId,
      'evt-001',
    );
    expect(outboxService.markPublished).toHaveBeenCalledWith(
      workspaceId,
      'evt-002',
    );

    // No events should have been marked as failed
    expect(outboxService.markFailed).not.toHaveBeenCalled();
  });

  it('should create an outbound ledger entry for each event with computed hashes', async () => {
    outboxService.getPending.mockResolvedValue(pendingEvents);

    await relayJob.handle({ workspaceId });

    expect(outboundEventLedgerService.recordOutbound).toHaveBeenCalledTimes(2);

    // First event — compute the expected hash from the real function
    const expectedHash1 = computeContentHash(pendingEvents[0].payload);
    expect(outboundEventLedgerService.recordOutbound).toHaveBeenCalledWith(
      workspaceId,
      {
        eventId: 'evt-001',
        eventType: 'executive-profile.created',
        targetCollection: 'executive-profile',
        targetRecordId: 'rec-001',
        beforeHash: undefined,
        afterHash: expectedHash1,
      },
    );

    // Second event
    const expectedHash2 = computeContentHash(pendingEvents[1].payload);
    expect(outboundEventLedgerService.recordOutbound).toHaveBeenCalledWith(
      workspaceId,
      {
        eventId: 'evt-002',
        eventType: 'executive-award.updated',
        targetCollection: 'executive-award',
        targetRecordId: 'rec-002',
        beforeHash: undefined,
        afterHash: expectedHash2,
      },
    );
  });

  it('should not mark published if ledger write fails', async () => {
    outboxService.getPending.mockResolvedValue([pendingEvents[0]]);
    outboundEventLedgerService.recordOutbound.mockRejectedValue(
      new Error('DB error'),
    );

    await relayJob.handle({ workspaceId });

    // Ledger write was attempted
    expect(outboundEventLedgerService.recordOutbound).toHaveBeenCalledTimes(1);

    // Event should NOT be marked as published
    expect(outboxService.markPublished).not.toHaveBeenCalled();

    // Event should be marked as FAILED
    expect(outboxService.markFailed).toHaveBeenCalledTimes(1);
    expect(outboxService.markFailed).toHaveBeenCalledWith(
      workspaceId,
      'evt-001',
    );
  });

  it('should continue processing remaining events when one fails', async () => {
    outboxService.getPending.mockResolvedValue(pendingEvents);

    // Make the first event's ledger write fail, second succeed
    outboundEventLedgerService.recordOutbound
      .mockRejectedValueOnce(new Error('DB error'))
      .mockResolvedValueOnce(undefined);

    await relayJob.handle({ workspaceId });

    // Both events should have been processed (one failed, one succeeded)
    expect(outboundEventLedgerService.recordOutbound).toHaveBeenCalledTimes(2);

    // First event: markFailed, NOT markPublished
    expect(outboxService.markFailed).toHaveBeenCalledWith(
      workspaceId,
      'evt-001',
    );
    expect(outboxService.markPublished).not.toHaveBeenCalledWith(
      workspaceId,
      'evt-001',
    );

    // Second event: markPublished, NOT markFailed
    expect(outboxService.markPublished).toHaveBeenCalledWith(
      workspaceId,
      'evt-002',
    );
  });

  it('should do nothing when no pending events exist', async () => {
    outboxService.getPending.mockResolvedValue([]);

    await relayJob.handle({ workspaceId });

    expect(outboundEventLedgerService.recordOutbound).not.toHaveBeenCalled();
    expect(outboxService.markPublished).not.toHaveBeenCalled();
    expect(outboxService.markFailed).not.toHaveBeenCalled();
  });
});
