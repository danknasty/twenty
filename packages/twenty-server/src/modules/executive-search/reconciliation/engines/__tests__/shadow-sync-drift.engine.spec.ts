import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncInboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-inbox.workspace-entity';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import { ShadowSyncDriftReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/shadow-sync-drift.engine';

describe('ShadowSyncDriftReconciliationEngine', () => {
  let engine: ShadowSyncDriftReconciliationEngine;
  let registry: ReconciliationEngineRegistry;

  let inboxRepo: {
    find: jest.Mock;
    update: jest.Mock;
    save: jest.Mock;
  };
  let linkRepo: { findOneBy: jest.Mock };
  let recordRepo: { findOneBy: jest.Mock; update: jest.Mock; save: jest.Mock };
  let mockGetRepository: jest.Mock;

  const fieldOwnership = {
    name: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
    email: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
    city: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
    zip: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
    ats_uuid: {
      authority: 'TWENTY_AUTHORITATIVE',
      syncDirection: 'Outbound_verified',
    },
    password: {
      authority: 'DIRECTUS_AUTHORITATIVE',
      syncDirection: 'NOT_ALLOWED_TO_SYNC',
    },
  };

  beforeEach(async () => {
    inboxRepo = {
      find: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    };
    linkRepo = { findOneBy: jest.fn() };
    recordRepo = {
      findOneBy: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockGetRepository = jest.fn().mockImplementation(
      async (
        _workspaceId: string,
        entity: unknown,
      ) => {
        const name = typeof entity === 'function' ? entity.name : String(entity);

        if (name === ExternalSyncInboxWorkspaceEntity.name) {
          return inboxRepo;
        }

        if (name === ExternalEntityLinkWorkspaceEntity.name) {
          return linkRepo;
        }

        // Any dynamic twentyEntityName lands on the domain record repo.
        return recordRepo;
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReconciliationEngineRegistry,
        ShadowSyncDriftReconciliationEngine,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            executeInWorkspaceContext: jest.fn(
              (fn: () => unknown) => fn(),
            ),
            getRepository: mockGetRepository,
          },
        },
      ],
    }).compile();

    engine = module.get(ShadowSyncDriftReconciliationEngine);
    registry = module.get(ReconciliationEngineRegistry);

    // Deterministic field ownership — decoupled from the on-disk CSV.
    jest
      .spyOn(engine as any, 'loadFieldOwnership')
      .mockReturnValue(fieldOwnership);
  });

  it('self-registers under the shadow-sync-drift name', () => {
    expect(registry.list()).toContain('shadow-sync-drift');
    expect(registry.get('shadow-sync-drift')).toBe(engine);
  });

  it('emits FIELD_DRIFT findings and marks the inbox row PROCESSED', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-1',
        workspaceId: 'ws-1',
        externalEventId: 'shadow-executives-ext-1',
        externalSystemName: 'directus',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-1',
        payload: { name: 'Jane Doe', email: 'same@example.com' },
        status: 'PENDING',
      },
    ]);
    linkRepo.findOneBy.mockResolvedValue({
      id: 'link-1',
      twentyEntityName: 'executiveProfile',
      twentyRecordId: 'twenty-rec-1',
      externalSystemName: 'directus',
      externalEntityName: 'executives',
      externalRecordId: 'ext-1',
      authority: 'DIRECTUS_AUTHORITATIVE',
    });
    recordRepo.findOneBy.mockResolvedValue({
      id: 'twenty-rec-1',
      name: 'Jane Smith',
      email: 'same@example.com',
    });

    const findings = await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    // name differs (inbound) -> drift. email matches -> no drift.
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('FIELD_DRIFT');
    expect(findings[0].severity).toBe('LOW');
    expect(findings[0].objectName).toBe('executiveProfile');
    expect(findings[0].recordId).toBe('twenty-rec-1');
    expect(findings[0].dryRunSafe).toBe(true);
    expect(findings[0].detail).toContain('name');
    expect(findings[0].detail).not.toContain('email');

    // Inbox row is marked PROCESSED (operational bookkeeping only).
    expect(inboxRepo.update).toHaveBeenCalledTimes(1);
    expect(inboxRepo.update).toHaveBeenCalledWith(
      'in-1',
      expect.objectContaining({ status: 'PROCESSED' }),
    );
  });

  it('escalates severity to HIGH on a Twenty-authoritative field conflict', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-2',
        externalSystemName: 'directus',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-2',
        payload: { ats_uuid: 'external-wants-to-overwrite' },
        status: 'PENDING',
      },
    ]);
    linkRepo.findOneBy.mockResolvedValue({
      id: 'link-2',
      twentyEntityName: 'executiveProfile',
      twentyRecordId: 'twenty-rec-2',
      externalSystemName: 'directus',
      externalEntityName: 'executives',
      externalRecordId: 'ext-2',
      authority: 'TWENTY_AUTHORITATIVE',
    });
    recordRepo.findOneBy.mockResolvedValue({
      id: 'twenty-rec-2',
      ats_uuid: 'twenty-rec-2',
    });

    const findings = await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('HIGH');
  });

  it('writes nothing to domain records (never applies the projection)', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-3',
        externalSystemName: 'directus',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-3',
        payload: { name: 'New Name' },
        status: 'PENDING',
      },
    ]);
    linkRepo.findOneBy.mockResolvedValue({
      id: 'link-3',
      twentyEntityName: 'executiveProfile',
      twentyRecordId: 'twenty-rec-3',
      externalSystemName: 'directus',
      externalEntityName: 'executives',
      externalRecordId: 'ext-3',
      authority: 'DIRECTUS_AUTHORITATIVE',
    });
    recordRepo.findOneBy.mockResolvedValue({
      id: 'twenty-rec-3',
      name: 'Old Name',
    });

    await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    // The current (domain) record is read but never mutated.
    expect(recordRepo.update).not.toHaveBeenCalled();
    expect(recordRepo.save).not.toHaveBeenCalled();
    // The link is read but never mutated.
    expect((linkRepo as any).update).toBeUndefined();
    // Only the inbox operational status was written.
    expect(inboxRepo.update).toHaveBeenCalledTimes(1);
  });

  it('emits no findings when values match and still marks the row PROCESSED', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-4',
        externalSystemName: 'directus',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-4',
        payload: { name: 'Jane Doe' },
        status: 'PENDING',
      },
    ]);
    linkRepo.findOneBy.mockResolvedValue({
      id: 'link-4',
      twentyEntityName: 'executiveProfile',
      twentyRecordId: 'twenty-rec-4',
      externalSystemName: 'directus',
      externalEntityName: 'executives',
      externalRecordId: 'ext-4',
      authority: 'DIRECTUS_AUTHORITATIVE',
    });
    recordRepo.findOneBy.mockResolvedValue({
      id: 'twenty-rec-4',
      name: 'Jane Doe',
    });

    const findings = await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    expect(findings).toEqual([]);
    expect(inboxRepo.update).toHaveBeenCalledWith(
      'in-4',
      expect.objectContaining({ status: 'PROCESSED' }),
    );
  });

  it('skips projection but still marks PROCESSED when no link exists', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-5',
        externalSystemName: 'directus',
        eventType: 'executives.shadow_sync',
        entityName: 'executives',
        entityId: 'ext-5',
        payload: { name: 'Orphan' },
        status: 'PENDING',
      },
    ]);
    linkRepo.findOneBy.mockResolvedValue(null);

    const findings = await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    expect(findings).toEqual([]);
    expect(recordRepo.findOneBy).not.toHaveBeenCalled();
    expect(inboxRepo.update).toHaveBeenCalledWith(
      'in-5',
      expect.objectContaining({ status: 'PROCESSED' }),
    );
  });

  it('ignores non-shadow inbox rows', async () => {
    inboxRepo.find.mockResolvedValue([
      {
        id: 'in-6',
        externalSystemName: 'directus',
        eventType: 'executiveProfile.updated',
        entityName: 'executiveProfile',
        entityId: 'ext-6',
        payload: { name: 'Whatever' },
        status: 'PENDING',
      },
    ]);

    const findings = await engine.reconcile({
      workspaceId: 'ws-1',
      objectName: 'externalSyncInbox',
    });

    expect(findings).toEqual([]);
    expect(inboxRepo.update).not.toHaveBeenCalled();
  });
});
