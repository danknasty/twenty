import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchInboxService,
  INBOX_STATUS,
  isShadowSyncEvent,
} from 'src/modules/executive-search/sync/services/inbox.service';

const createMockRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

const createMockOrmManager = (
  mockRepo: ReturnType<typeof createMockRepository>,
) => ({
  getRepository: jest.fn().mockResolvedValue(mockRepo),
  executeInWorkspaceContext: jest.fn(async (fn: () => unknown) => await fn()),
});

describe('ExecutiveSearchInboxService', () => {
  let service: ExecutiveSearchInboxService;
  let inboxRepo: ReturnType<typeof createMockRepository>;
  // Separate mock for the outbox repository (used by isEcho)
  let outboxRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    inboxRepo = createMockRepository();
    outboxRepo = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutiveSearchInboxService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            getRepository: jest
              .fn()
              .mockImplementation(async (_wsId: string, entity: unknown) => {
                // Return inbox repo for inbox entities, outbox repo for outbox entities
                const entityName =
                  typeof entity === 'function' ? entity.name : '';
                return entityName.includes('Outbox') ? outboxRepo : inboxRepo;
              }),
            executeInWorkspaceContext: jest.fn(
              async (fn: () => unknown) => await fn(),
            ),
          },
        },
      ],
    }).compile();

    service = module.get(ExecutiveSearchInboxService);
  });

  const baseInput = {
    workspaceId: 'ws-1',
    externalEventId: 'ext-ev-1',
    externalSystemName: 'directus',
    eventType: 'executiveProfile.updated',
    entityName: 'executiveProfile',
    entityId: 'record-1',
    payload: { name: 'Test' },
  };

  describe('receive', () => {
    it('should persist a new inbox entry', async () => {
      inboxRepo.findOneBy.mockResolvedValue(null);
      inboxRepo.create.mockReturnValue({ id: 'in-1' });
      inboxRepo.save.mockResolvedValue({
        id: 'in-1',
        status: INBOX_STATUS.PENDING,
      });

      const result = await service.receive(baseInput);

      expect(inboxRepo.findOneBy).toHaveBeenCalledWith({
        externalEventId: 'ext-ev-1',
        externalSystemName: 'directus',
      });
      expect(inboxRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should mark duplicate events as DUPLICATE', async () => {
      const existing = { id: 'in-1', status: INBOX_STATUS.PENDING };
      inboxRepo.findOneBy.mockResolvedValue(existing);

      const result = await service.receive(baseInput);

      expect(inboxRepo.update).toHaveBeenCalledWith('in-1', {
        status: INBOX_STATUS.DUPLICATE,
      });
      expect(inboxRepo.save).not.toHaveBeenCalled();
      expect(result.status).toBe(INBOX_STATUS.DUPLICATE);
    });

    it('should not re-mark already processed events', async () => {
      const existing = { id: 'in-1', status: INBOX_STATUS.PROCESSED };
      inboxRepo.findOneBy.mockResolvedValue(existing);

      const result = await service.receive(baseInput);

      expect(inboxRepo.update).not.toHaveBeenCalled();
      expect(result).toBe(existing);
    });
  });

  describe('markProcessed', () => {
    it('should mark as PROCESSED with timestamp', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-07-15T12:00:00Z'));

      await service.markProcessed('ws-1', 'in-1');

      expect(inboxRepo.update).toHaveBeenCalledWith('in-1', {
        status: INBOX_STATUS.PROCESSED,
        processedAt: new Date('2026-07-15T12:00:00Z').toISOString(),
      });

      jest.useRealTimers();
    });
  });

  describe('markFailed', () => {
    it('should mark as FAILED with error', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-07-15T12:00:00Z'));

      await service.markFailed('ws-1', 'in-1', 'Schema drift');

      expect(inboxRepo.update).toHaveBeenCalledWith('in-1', {
        status: INBOX_STATUS.FAILED,
        error: 'Schema drift',
        processedAt: new Date('2026-07-15T12:00:00Z').toISOString(),
      });

      jest.useRealTimers();
    });
  });

  describe('isEcho', () => {
    it('should return true when eventId exists in outbox', async () => {
      outboxRepo.findOneBy.mockResolvedValue({
        id: 'out-1',
        eventId: 'ext-ev-1',
      });

      const result = await service.isEcho('ws-1', 'ext-ev-1');

      expect(outboxRepo.findOneBy).toHaveBeenCalledWith({
        eventId: 'ext-ev-1',
      });
      expect(result).toBe(true);
    });

    it('should return false when eventId does not exist in outbox', async () => {
      outboxRepo.findOneBy.mockResolvedValue(null);

      const result = await service.isEcho('ws-1', 'ext-ev-2');

      expect(result).toBe(false);
    });
  });

  describe('isShadowSyncEvent', () => {
    it('detects collection-scoped shadow_sync events', () => {
      expect(isShadowSyncEvent('executives.shadow_sync')).toBe(true);
      expect(isShadowSyncEvent('companies.shadow_sync')).toBe(true);
    });

    it('detects the bare shadow_sync event type', () => {
      expect(isShadowSyncEvent('shadow_sync')).toBe(true);
    });

    it('does not classify normal update events as shadow_sync', () => {
      expect(isShadowSyncEvent('executiveProfile.updated')).toBe(false);
      expect(isShadowSyncEvent('applications.created')).toBe(false);
    });
  });

  describe('apply (shadow_sync guard)', () => {
    it('never applies shadow_sync events (comparison-only)', async () => {
      const result = await service.apply('ws-1', {
        id: 'in-1',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-1',
      });

      expect(result.applied).toBe(false);
      expect(result.reason).toEqual(
        expect.stringContaining('comparison-only'),
      );
      // No persistence is invoked when skipping.
      expect(inboxRepo.update).not.toHaveBeenCalled();
      expect(inboxRepo.save).not.toHaveBeenCalled();
    });

    it('skips the bare shadow_sync event type too', async () => {
      const result = await service.apply('ws-1', {
        id: 'in-2',
        eventType: 'shadow_sync',
        entityName: 'executives',
        entityId: 'ext-2',
      });

      expect(result.applied).toBe(false);
    });

    it('falls through to the normal apply path for non-shadow events', async () => {
      const result = await service.apply('ws-1', {
        id: 'in-3',
        eventType: 'executiveProfile.updated',
        entityName: 'executiveProfile',
        entityId: 'ext-3',
      });

      expect(result.applied).toBe(true);
    });
  });
});
