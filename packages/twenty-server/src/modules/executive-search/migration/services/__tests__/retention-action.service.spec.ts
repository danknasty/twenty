import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  RETENTION_ACTION_SCOPE,
  RETENTION_ACTION_STATUS,
  RETENTION_ACTION_TYPE,
  RETENTION_INITIATOR_SYSTEM,
  RetentionActionService,
  type RetentionActionInput,
} from 'src/modules/executive-search/migration/services/retention-action.service';
import { ExecutiveSearchOutboxService } from 'src/modules/executive-search/sync/services/outbox.service';

const createMockRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  softDelete: jest.fn(),
});

const createMockOrmManager = (
  mockRepo: ReturnType<typeof createMockRepository>,
) => ({
  getRepository: jest.fn().mockResolvedValue(mockRepo),
  executeInWorkspaceContext: jest.fn(
    async <T>(fn: () => T | Promise<T>): Promise<T> => await fn(),
  ),
});

describe('RetentionActionService', () => {
  let service: RetentionActionService;
  let mockRepo: ReturnType<typeof createMockRepository>;
  let mockOrmManager: ReturnType<typeof createMockOrmManager>;
  let mockOutboxService: { enqueue: jest.Mock };
  let mockFeatureFlagService: { isFeatureEnabled: jest.Mock };

  const workspaceId = 'ws-1';

  const twentyInput: RetentionActionInput = {
    actionType: RETENTION_ACTION_TYPE.DELETE,
    initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
    targetTwentyEntityName: 'company',
    targetTwentyRecordId: 'rec-1',
    externalSystemName: 'DIRECTUS',
    externalRecordId: 'directus-1',
    scope: RETENTION_ACTION_SCOPE.SOFT_DELETE,
    legalHoldReference: null,
    actorId: 'actor-1',
  };

  const directusInput: RetentionActionInput = {
    actionType: RETENTION_ACTION_TYPE.DELETE,
    initiatorSystem: RETENTION_INITIATOR_SYSTEM.DIRECTUS,
    targetTwentyEntityName: 'company',
    targetTwentyRecordId: 'rec-1',
    externalSystemName: 'DIRECTUS',
    externalRecordId: 'directus-1',
    scope: RETENTION_ACTION_SCOPE.SOFT_DELETE,
    legalHoldReference: null,
    actorId: null,
  };

  beforeEach(async () => {
    mockRepo = createMockRepository();
    mockOrmManager = createMockOrmManager(mockRepo);
    mockOutboxService = { enqueue: jest.fn().mockResolvedValue({ id: 'out-1' }) };
    mockFeatureFlagService = { isFeatureEnabled: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetentionActionService,
        { provide: GlobalWorkspaceOrmManager, useValue: mockOrmManager },
        { provide: ExecutiveSearchOutboxService, useValue: mockOutboxService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
      ],
    }).compile();

    service = module.get(RetentionActionService);
  });

  describe('recordAndPropagate — append-only idempotency', () => {
    beforeEach(() => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.create.mockImplementation((payload) => ({
        id: 'ral-1',
        ...payload,
      }));
      mockRepo.save.mockImplementation(async (entity) => entity);
    });

    it('creates a REQUESTED row then transitions to PROPAGATED on success', async () => {
      await service.recordAndPropagate(workspaceId, twentyInput);

      // Append a REQUESTED row
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: RETENTION_ACTION_TYPE.DELETE,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
          status: RETENTION_ACTION_STATUS.REQUESTED,
          propagatedAt: null,
          sourceHash: expect.any(String),
        }),
      );
      expect(mockRepo.save).toHaveBeenCalledTimes(1);

      // Single-lifecycle status transition to PROPAGATED
      expect(mockRepo.update).toHaveBeenCalledWith(
        'ral-1',
        expect.objectContaining({
          status: RETENTION_ACTION_STATUS.PROPAGATED,
          propagatedAt: expect.any(String),
        }),
      );
    });

    it('a second append with the same natural key is a no-op and never updates', async () => {
      const propagatedRow = {
        id: 'ral-1',
        ...twentyInput,
        status: RETENTION_ACTION_STATUS.PROPAGATED,
        sourceHash: 'existing-hash',
      };

      // First call: not found. Second call: existing row returned.
      mockRepo.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(propagatedRow);

      await service.recordAndPropagate(workspaceId, twentyInput);

      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(mockRepo.update).toHaveBeenCalledTimes(1);
      expect(mockOutboxService.enqueue).toHaveBeenCalledTimes(1);

      // Second append (same natural key → same sourceHash) — append-only no-op.
      const result = await service.recordAndPropagate(workspaceId, twentyInput);

      expect(mockRepo.save).toHaveBeenCalledTimes(1); // unchanged
      expect(mockRepo.update).toHaveBeenCalledTimes(1); // unchanged — never updates existing
      expect(mockOutboxService.enqueue).toHaveBeenCalledTimes(1); // not re-propagated
      expect(result).toBe(propagatedRow);
    });

    it('dedupes by sourceHash even when field ordering differs in input', async () => {
      mockRepo.findOneBy.mockResolvedValue({
        id: 'ral-existing',
        status: RETENTION_ACTION_STATUS.PROPAGATED,
      });

      const reordered: RetentionActionInput = {
        scope: twentyInput.scope,
        legalHoldReference: twentyInput.legalHoldReference,
        targetTwentyRecordId: twentyInput.targetTwentyRecordId,
        actionType: twentyInput.actionType,
        initiatorSystem: twentyInput.initiatorSystem,
        targetTwentyEntityName: twentyInput.targetTwentyEntityName,
        externalSystemName: twentyInput.externalSystemName,
        externalRecordId: twentyInput.externalRecordId,
        actorId: twentyInput.actorId,
      };

      const first = await service.recordAndPropagate(workspaceId, reordered);
      const second = await service.recordAndPropagate(workspaceId, twentyInput);

      // Both calls hit the same sourceHash
      const firstHash = mockRepo.findOneBy.mock.calls[0][0].sourceHash;
      const secondHash = mockRepo.findOneBy.mock.calls[1][0].sourceHash;
      expect(firstHash).toBe(secondHash);
      expect(first).toBe(second);
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('recordAndPropagate — Twenty-initiated propagation', () => {
    beforeEach(() => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.create.mockImplementation((payload) => ({
        id: 'ral-1',
        ...payload,
      }));
      mockRepo.save.mockImplementation(async (entity) => entity);
    });

    it('enqueues an outbox event only when the outbound publish flag is ON', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.recordAndPropagate(workspaceId, twentyInput);

      expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED,
        workspaceId,
      );
      expect(mockOutboxService.enqueue).toHaveBeenCalledTimes(1);
      expect((result as { status: string }).status).toBe(
        RETENTION_ACTION_STATUS.PROPAGATED,
      );
    });

    it('does NOT enqueue when the outbound publish flag is OFF (stays REQUESTED)', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.recordAndPropagate(workspaceId, twentyInput);

      expect(mockOutboxService.enqueue).not.toHaveBeenCalled();
      // Status transition does not happen when propagation is skipped
      expect(mockRepo.update).not.toHaveBeenCalled();
      expect((result as { status: string }).status).toBe(
        RETENTION_ACTION_STATUS.REQUESTED,
      );
      expect((result as { propagatedAt: string | null }).propagatedAt).toBeNull();
    });

    it('uses the *.retention_action event type targeting the projection', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.recordAndPropagate(workspaceId, twentyInput);

      const call = mockOutboxService.enqueue.mock.calls[0][0];
      expect(call.eventType).toBe('company.retention_action');
      expect(call.entityName).toBe('company');
      expect(call.entityId).toBe('rec-1');
      expect(call.workspaceId).toBe(workspaceId);
      expect(call.domainIdempotencyKey).toContain('retention:');
    });

    it('never propagates restricted fields — payload is action metadata only', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.recordAndPropagate(workspaceId, twentyInput);

      const payload = mockOutboxService.enqueue.mock.calls[0][0].payload as Record<
        string,
        unknown
      >;

      // Only action-metadata keys are allowed in the payload.
      const allowedKeys = new Set([
        'actionType',
        'initiatorSystem',
        'targetTwentyEntityName',
        'targetTwentyRecordId',
        'externalSystemName',
        'externalRecordId',
        'scope',
        'legalHoldReference',
      ]);

      for (const key of Object.keys(payload)) {
        expect(allowedKeys.has(key)).toBe(true);
      }

      // Explicitly assert NOT_ALLOWED_TO_SYNC field classes are absent.
      expect(payload).not.toHaveProperty('subscriptionTier');
      expect(payload).not.toHaveProperty('password');
      expect(payload).not.toHaveProperty('birthdate');
      expect(payload).not.toHaveProperty('tfaSecret');
    });
  });

  describe('recordAndPropagate — Directus-initiated reconciliation', () => {
    beforeEach(() => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.create.mockImplementation((payload) => ({
        id: 'ral-1',
        ...payload,
      }));
      mockRepo.save.mockImplementation(async (entity) => entity);
    });

    it('soft-deletes the Twenty projection for scope SOFT_DELETE', async () => {
      const result = await service.recordAndPropagate(workspaceId, directusInput);

      expect(mockRepo.softDelete).toHaveBeenCalledWith('rec-1');
      // Directus-initiated never enqueues an outbox event
      expect(mockOutboxService.enqueue).not.toHaveBeenCalled();
      expect((result as { status: string }).status).toBe(
        RETENTION_ACTION_STATUS.RECONCILED,
      );
      expect(mockRepo.update).toHaveBeenCalledWith(
        'ral-1',
        expect.objectContaining({
          status: RETENTION_ACTION_STATUS.RECONCILED,
        }),
      );
    });

    it('hides the Twenty projection for scope HIDE', async () => {
      await service.recordAndPropagate(workspaceId, {
        ...directusInput,
        scope: RETENTION_ACTION_SCOPE.HIDE,
      });

      // The repository update call that sets visibility comes through the same
      // mock; find the projection-mutation update (not the status transition).
      const projectionUpdate = mockRepo.update.mock.calls.find(
        (call) => call[0] === 'rec-1' && (call[1] as { visibility?: string }).visibility,
      );
      expect(projectionUpdate).toBeDefined();
      expect((projectionUpdate![1] as { visibility: string }).visibility).toBe(
        'HIDDEN',
      );
    });

    it('quarantines the Twenty projection for scope QUARANTINE', async () => {
      await service.recordAndPropagate(workspaceId, {
        ...directusInput,
        scope: RETENTION_ACTION_SCOPE.QUARANTINE,
      });

      const projectionUpdate = mockRepo.update.mock.calls.find(
        (call) =>
          call[0] === 'rec-1' &&
          (call[1] as { retentionQuarantined?: boolean }).retentionQuarantined,
      );
      expect(projectionUpdate).toBeDefined();
      expect(
        (projectionUpdate![1] as { retentionQuarantined: boolean })
          .retentionQuarantined,
      ).toBe(true);
    });

    it('does not mutate the projection when targetTwentyRecordId is absent', async () => {
      await service.recordAndPropagate(workspaceId, {
        ...directusInput,
        targetTwentyRecordId: null,
      });

      expect(mockRepo.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('reconcileAll', () => {
    it('flags missing propagations (REQUESTED rows) as EXISTENCE findings', async () => {
      mockRepo.find.mockResolvedValue([
        {
          id: 'ral-1',
          actionType: RETENTION_ACTION_TYPE.DELETE,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
          targetTwentyEntityName: 'company',
          targetTwentyRecordId: 'rec-1',
          scope: RETENTION_ACTION_SCOPE.SOFT_DELETE,
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: '2026-07-18T00:00:00.000Z',
        },
        {
          id: 'ral-2',
          actionType: RETENTION_ACTION_TYPE.LEGAL_HOLD,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.DIRECTUS,
          targetTwentyEntityName: 'person',
          targetTwentyRecordId: 'person-1',
          scope: RETENTION_ACTION_SCOPE.QUARANTINE,
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: '2026-07-18T00:00:00.000Z',
        },
      ]);

      const findings = await service.reconcileAll(workspaceId);

      expect(findings).toHaveLength(2);
      expect(findings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            objectName: 'company',
            recordId: 'rec-1',
            kind: 'EXISTENCE',
            severity: 'MEDIUM',
            dryRunSafe: true,
          }),
          expect.objectContaining({
            objectName: 'person',
            recordId: 'person-1',
            kind: 'EXISTENCE',
            severity: 'HIGH', // legal hold is HIGH severity
            dryRunSafe: true,
          }),
        ]),
      );

      // Only REQUESTED rows are queried
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { status: RETENTION_ACTION_STATUS.REQUESTED },
        order: { requestedAt: 'ASC' },
      });
    });

    it('returns no findings when everything is propagated', async () => {
      mockRepo.find.mockResolvedValue([]);

      const findings = await service.reconcileAll(workspaceId);

      expect(findings).toEqual([]);
    });
  });

  describe('isUnderLegalHold', () => {
    it('returns true when a LEGAL_HOLD row exists for the record', async () => {
      mockRepo.find.mockResolvedValue([
        { id: 'ral-1', actionType: RETENTION_ACTION_TYPE.LEGAL_HOLD },
      ]);

      const result = await service.isUnderLegalHold(
        workspaceId,
        'company',
        'rec-1',
      );

      expect(result).toBe(true);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: {
          actionType: RETENTION_ACTION_TYPE.LEGAL_HOLD,
          targetTwentyEntityName: 'company',
          targetTwentyRecordId: 'rec-1',
        },
        take: 1,
      });
    });

    it('returns false when no LEGAL_HOLD row exists', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.isUnderLegalHold(
        workspaceId,
        'company',
        'rec-1',
      );

      expect(result).toBe(false);
    });
  });
});
