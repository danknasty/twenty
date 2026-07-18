import {
  RETENTION_ACTION_STATUS,
  RETENTION_ACTION_TYPE,
  RETENTION_INITIATOR_SYSTEM,
} from 'src/modules/executive-search/migration/services/retention-action.service';
import { RetentionActionReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/retention-action-reconciliation.engine';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

const createMockRepository = () => ({
  find: jest.fn(),
});

const createMockOrmManager = (
  mockRepo: ReturnType<typeof createMockRepository>,
) => ({
  getRepository: jest.fn().mockResolvedValue(mockRepo),
  executeInWorkspaceContext: jest.fn(
    async <T>(fn: () => T | Promise<T>): Promise<T> => await fn(),
  ),
});

describe('RetentionActionReconciliationEngine', () => {
  let engine: RetentionActionReconciliationEngine;
  let registry: ReconciliationEngineRegistry;
  let mockRepo: ReturnType<typeof createMockRepository>;
  let mockOrmManager: ReturnType<typeof createMockOrmManager>;

  const workspaceId = 'ws-1';

  beforeEach(() => {
    mockRepo = createMockRepository();
    mockOrmManager = createMockOrmManager(mockRepo);
    registry = new ReconciliationEngineRegistry();

    engine = new RetentionActionReconciliationEngine(
      mockOrmManager as unknown as GlobalWorkspaceOrmManager,
      registry,
    );
  });

  it('has the expected engine name', () => {
    expect(engine.name).toBe('retention-action-reconciliation');
  });

  it('self-registers with ReconciliationEngineRegistry on construction', () => {
    expect(registry.list()).toContain('retention-action-reconciliation');
    expect(registry.get('retention-action-reconciliation')).toBe(engine);
  });

  describe('reconcile', () => {
    it('flags missing propagations as EXISTENCE findings and is read-only', async () => {
      mockRepo.find.mockResolvedValue([
        {
          id: 'ral-1',
          actionType: RETENTION_ACTION_TYPE.DELETE,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
          targetTwentyEntityName: 'company',
          targetTwentyRecordId: 'rec-1',
          scope: 'SOFT_DELETE',
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: '2026-07-18T00:00:00.000Z',
        },
      ]);

      const findings = await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      expect(findings).toHaveLength(1);
      expect(findings[0]).toEqual(
        expect.objectContaining({
          objectName: 'company',
          recordId: 'rec-1',
          kind: 'EXISTENCE',
          severity: 'MEDIUM',
          dryRunSafe: true,
        }),
      );

      // Read-only: only a find() is ever issued, no mutation
      expect((mockRepo as unknown as { update?: unknown }).update).toBeUndefined();
      expect((mockRepo as unknown as { save?: unknown }).save).toBeUndefined();
    });

    it('flags legal-hold missing propagations as HIGH severity', async () => {
      mockRepo.find.mockResolvedValue([
        {
          id: 'ral-2',
          actionType: RETENTION_ACTION_TYPE.LEGAL_HOLD,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.DIRECTUS,
          targetTwentyEntityName: 'person',
          targetTwentyRecordId: 'person-1',
          scope: 'QUARANTINE',
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: '2026-07-18T00:00:00.000Z',
        },
      ]);

      const findings = await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      expect(findings[0].severity).toBe('HIGH');
      expect(findings[0].kind).toBe('EXISTENCE');
    });

    it('adds a STALE finding for REQUESTED rows older than the threshold', async () => {
      // 2 hours ago — beyond the 1-hour staleness threshold
      const stale = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      mockRepo.find.mockResolvedValue([
        {
          id: 'ral-stale',
          actionType: RETENTION_ACTION_TYPE.DELETE,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
          targetTwentyEntityName: 'company',
          targetTwentyRecordId: 'rec-stale',
          scope: 'SOFT_DELETE',
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: stale,
        },
      ]);

      const findings = await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      const kinds = findings.map((f) => f.kind);
      expect(kinds).toContain('EXISTENCE');
      expect(kinds).toContain('STALE');
      const staleFinding = findings.find((f) => f.kind === 'STALE');
      expect(staleFinding?.dryRunSafe).toBe(true);
    });

    it('does NOT flag STALE for recently-requested rows', async () => {
      const recent = new Date().toISOString();
      mockRepo.find.mockResolvedValue([
        {
          id: 'ral-fresh',
          actionType: RETENTION_ACTION_TYPE.DELETE,
          initiatorSystem: RETENTION_INITIATOR_SYSTEM.TWENTY,
          targetTwentyEntityName: 'company',
          targetTwentyRecordId: 'rec-fresh',
          scope: 'SOFT_DELETE',
          status: RETENTION_ACTION_STATUS.REQUESTED,
          requestedAt: recent,
        },
      ]);

      const findings = await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      expect(findings.map((f) => f.kind)).toEqual(['EXISTENCE']);
    });

    it('returns no findings when there are no missing propagations', async () => {
      mockRepo.find.mockResolvedValue([]);

      const findings = await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      expect(findings).toEqual([]);
    });

    it('queries only REQUESTED rows ordered by requestedAt', async () => {
      mockRepo.find.mockResolvedValue([]);

      await engine.reconcile({
        workspaceId,
        objectName: 'retentionActionLog',
      });

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { status: RETENTION_ACTION_STATUS.REQUESTED },
        order: { requestedAt: 'ASC' },
      });
    });
  });
});
