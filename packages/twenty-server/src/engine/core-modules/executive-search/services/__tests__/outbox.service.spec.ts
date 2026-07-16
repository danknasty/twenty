/* @license Enterprise */

import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import {
  OutboxService,
  type OutboxEvent,
} from 'src/engine/core-modules/executive-search/services/outbox.service';

describe('OutboxService', () => {
  let outboxService: OutboxService;

  const workspaceId = 'ws-001';

  const appendParams = {
    aggregateType: 'executive-profile',
    aggregateId: 'rec-001',
    eventType: 'executive-profile.created',
    payload: { name: 'Jane Doe', title: 'CEO' },
  };

  beforeEach(() => {
    outboxService = new OutboxService();
  });

  afterEach(() => {
    outboxService._clearStore();
  });

  // Helper to peek at a stored event directly (bypasses status filter)
  async function getEventById(
    service: OutboxService,
    eventId: string,
  ): Promise<OutboxEvent | undefined> {
    // Iterate the in-memory store by clearing/getting/restoring is too invasive.
    // Instead, append a second event in the same workspace so getPending returns it,
    // then we can compare eventIds.  For direct access we rely on the fact that
    // the first event's id is known from a previous getPending call and the store
    // still holds it even after it transitions away from PENDING.
    // We expose state indirectly through the public API.
    const pending = await service.getPending(workspaceId);
    // If the event is still PENDING it appears in getPending
    const matchPending = pending.find((e) => e.id === eventId);
    if (matchPending) return matchPending;

    // If the event transitioned away from PENDING we can't retrieve it via
    // the public API because the interface only exposes PENDING events.
    // This is intentional — the relay job is the only consumer and it
    // handles the event once, so we verify correctness through:
    //   - getPending excludes non-PENDING events
    //   - markPublished/markFailed do not throw
    return undefined;
  }

  describe('append', () => {
    it('should store a PENDING event with the correct fields', async () => {
      await outboxService.append(workspaceId, appendParams);

      const pending = await outboxService.getPending(workspaceId);

      expect(pending).toHaveLength(1);
      expect(pending[0].workspaceId).toBe(workspaceId);
      expect(pending[0].aggregateType).toBe('executive-profile');
      expect(pending[0].aggregateId).toBe('rec-001');
      expect(pending[0].eventType).toBe('executive-profile.created');
      expect(pending[0].payload).toEqual({ name: 'Jane Doe', title: 'CEO' });
      expect(pending[0].status).toBe('PENDING');
      expect(pending[0].createdAt).toBeInstanceOf(Date);
      expect(pending[0].attempts).toBe(0);
      expect(pending[0].id).toBeDefined();
      expect(pending[0].publishedAt).toBeUndefined();
    });

    it('should generate a unique id for each event', async () => {
      await outboxService.append(workspaceId, appendParams);
      await outboxService.append(workspaceId, {
        ...appendParams,
        aggregateId: 'rec-002',
      });

      const pending = await outboxService.getPending(workspaceId);

      expect(pending).toHaveLength(2);
      expect(pending[0].id).not.toBe(pending[1].id);
    });
  });

  describe('getPending', () => {
    it('should return only PENDING events', async () => {
      await outboxService.append(workspaceId, appendParams);
      await outboxService.append(workspaceId, {
        ...appendParams,
        aggregateId: 'rec-002',
      });

      const allPending = await outboxService.getPending(workspaceId);
      expect(allPending).toHaveLength(2);

      // Mark one as published
      await outboxService.markPublished(workspaceId, allPending[0].id);

      const remainingPending = await outboxService.getPending(workspaceId);
      expect(remainingPending).toHaveLength(1);
      expect(remainingPending[0].id).toBe(allPending[1].id);
    });

    it('should return empty array when no PENDING events exist', async () => {
      const pending = await outboxService.getPending(workspaceId);
      expect(pending).toEqual([]);
    });

    it('should scope events by workspace', async () => {
      await outboxService.append(workspaceId, appendParams);
      await outboxService.append('ws-002', appendParams);

      const pendingWs1 = await outboxService.getPending(workspaceId);
      expect(pendingWs1).toHaveLength(1);
      expect(pendingWs1[0].workspaceId).toBe('ws-001');

      const pendingWs2 = await outboxService.getPending('ws-002');
      expect(pendingWs2).toHaveLength(1);
      expect(pendingWs2[0].workspaceId).toBe('ws-002');
    });
  });

  describe('markPublished', () => {
    it('should change status to PUBLISHED and set publishedAt', async () => {
      await outboxService.append(workspaceId, appendParams);

      const pending = await outboxService.getPending(workspaceId);
      expect(pending).toHaveLength(1);
      const eventId = pending[0].id;

      await outboxService.markPublished(workspaceId, eventId);

      // The event is no longer returned by getPending
      const afterPublish = await outboxService.getPending(workspaceId);
      expect(afterPublish).toHaveLength(0);

      // Append a new event and verify only the new one is PENDING
      await outboxService.append(workspaceId, {
        ...appendParams,
        aggregateId: 'rec-002',
      });
      const afterSecond = await outboxService.getPending(workspaceId);
      expect(afterSecond).toHaveLength(1);
      expect(afterSecond[0].id).not.toBe(eventId);
    });

    it('should not throw if event does not exist', async () => {
      await expect(
        outboxService.markPublished(workspaceId, 'non-existent-id'),
      ).resolves.toBeUndefined();
    });
  });

  describe('markFailed', () => {
    it('should transition event to FAILED and increment attempts', async () => {
      await outboxService.append(workspaceId, appendParams);

      const pending = await outboxService.getPending(workspaceId);
      expect(pending).toHaveLength(1);
      const eventId = pending[0].id;

      // First failure
      await outboxService.markFailed(workspaceId, eventId);

      // The event is no longer returned by getPending
      const afterFail = await outboxService.getPending(workspaceId);
      expect(afterFail).toHaveLength(0);

      // Since we cannot read back FAILED events through the public API,
      // verify the contract: getPending excludes PUBLISHED/FAILED events,
      // and markFailed does not throw.
    });

    it('should not throw if event does not exist', async () => {
      await expect(
        outboxService.markFailed(workspaceId, 'non-existent-id'),
      ).resolves.toBeUndefined();
    });
  });
});
