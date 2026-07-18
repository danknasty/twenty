import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CutoverStage } from 'src/modules/executive-search/common/enums/cutover-stage.enum';
import { FieldOwnershipAuthority } from 'src/modules/executive-search/common/enums/field-ownership-authority.enum';
import {
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { CutoverService } from 'src/modules/executive-search/migration/services/cutover.service';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncCheckpointWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-checkpoint.workspace-entity';
import { ExternalSyncReconciliationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-reconciliation.workspace-entity';

// Mock the GlobalWorkspaceOrmManager module before any imports are evaluated:
// importing the real manager pulls in the twenty-config chain, which crashes
// under jest (CustomError base class is undefined). The actual behaviour is
// supplied via a useValue provider in the TestingModule below.
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
      executeInWorkspaceContext: jest.fn(),
      getRepository: jest.fn(),
    })),
  }),
);

const WORKSPACE_ID = 'workspace-1';
const ACTOR_ID = 'actor-1';

const stageLedger = (currentStage: CutoverStage) =>
  JSON.stringify({
    currentStage,
    appliedStages: [],
    history: [],
  });

describe('CutoverService', () => {
  let service: CutoverService;
  let mockGlobalWorkspaceOrmManager: any;
  let checkpointRepository: any;
  let linkRepository: any;
  let reconciliationRepository: any;

  beforeEach(async () => {
    checkpointRepository = {
      findOne: jest.fn(),
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 'cp-1' }] }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    linkRepository = {
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    reconciliationRepository = {
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 'rec-1' }] }),
    };

    const repositoryMap: Record<string, any> = {
      [ExternalSyncCheckpointWorkspaceEntity.name]: checkpointRepository,
      [ExternalEntityLinkWorkspaceEntity.name]: linkRepository,
      [ExternalSyncReconciliationWorkspaceEntity.name]:
        reconciliationRepository,
    };

    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation((fn: () => any) => fn()),
      getRepository: jest
        .fn()
        .mockImplementation((_workspaceId: string, entity: any) =>
          Promise.resolve(repositoryMap[entity.name]),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CutoverService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get<CutoverService>(CutoverService);
  });

  describe('getCurrentStage', () => {
    it('defaults to STAGE_0_READONLY when no checkpoint exists', async () => {
      checkpointRepository.findOne.mockResolvedValue(null);

      const stage = await service.getCurrentStage(WORKSPACE_ID);

      expect(stage).toBe(CutoverStage.STAGE_0_READONLY);
    });

    it('reads the persisted current stage from the checkpoint ledger', async () => {
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: stageLedger(CutoverStage.STAGE_2_INBOUND),
      });

      const stage = await service.getCurrentStage(WORKSPACE_ID);

      expect(stage).toBe(CutoverStage.STAGE_2_INBOUND);
    });

    it('falls back to STAGE_0_READONLY on malformed ledger JSON', async () => {
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: 'not-json',
      });

      const stage = await service.getCurrentStage(WORKSPACE_ID);

      expect(stage).toBe(CutoverStage.STAGE_0_READONLY);
    });

    it('queries the checkpoint for the directus / _cutover_stage row', async () => {
      checkpointRepository.findOne.mockResolvedValue(null);

      await service.getCurrentStage(WORKSPACE_ID);

      expect(checkpointRepository.findOne).toHaveBeenCalledWith({
        where: {
          externalSystemName: 'directus',
          entityName: '_cutover_stage',
        },
      });
    });
  });

  describe('applyStage — advancing from STAGE_0', () => {
    beforeEach(() => {
      checkpointRepository.findOne.mockResolvedValue(null);
      // Two links for executives, one for opportunities.
      linkRepository.find.mockImplementation(({ where }: any) => {
        if (where.externalEntityName === 'executives') {
          return Promise.resolve([
            { id: 'link-exec-1', metadata: { foo: 'bar' } },
            { id: 'link-exec-2', metadata: null },
          ]);
        }

        return Promise.resolve([{ id: `link-${where.externalEntityName}` }]);
      });
    });

    it('advances the checkpoint to the requested stage and updates authority', async () => {
      const result = await service.applyStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_1_LINKS,
        ACTOR_ID,
      );

      expect(result.action).toBe('apply');
      expect(result.fromStage).toBe(CutoverStage.STAGE_0_READONLY);
      expect(result.toStage).toBe(CutoverStage.STAGE_1_LINKS);
      expect(result.dryRun).toBe(false);

      // executives, companies, opportunities transfer at STAGE_1.
      const changedCollections = result.changes
        .map((c) => c.collection)
        .sort();

      expect(changedCollections).toEqual([
        'companies',
        'executives',
        'opportunities',
      ]);

      // The ats_uuid identity rows are TWENTY_AUTHORITATIVE.
      const executives = result.changes.find(
        (c) => c.collection === 'executives',
      );

      expect(executives?.nextAuthority).toBe(
        FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
      );
      expect(executives?.nextStage).toBe(CutoverStage.STAGE_1_LINKS);

      // Two executive links + one companies + one opportunities = 4 updates.
      expect(result.linkCount).toBe(4);

      // Checkpoint persisted with the new stage ledger.
      expect(checkpointRepository.insert).toHaveBeenCalledTimes(1);
      const insertedPayload = checkpointRepository.insert.mock.calls[0][0];

      expect(insertedPayload.entityName).toBe('_cutover_stage');
      const ledger = JSON.parse(insertedPayload.lastExternalEventId);

      expect(ledger.currentStage).toBe(CutoverStage.STAGE_1_LINKS);

      // Audit written to reconciliation findings.
      expect(reconciliationRepository.insert).toHaveBeenCalledTimes(1);
      const auditPayload = reconciliationRepository.insert.mock.calls[0][0];

      expect(auditPayload.findings.cutoverAction).toBe('apply');
      expect(auditPayload.findings.toStage).toBe(CutoverStage.STAGE_1_LINKS);
    });

    it('writes authority + cutoverStage onto the matching links', async () => {
      await service.applyStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_1_LINKS,
        ACTOR_ID,
      );

      // The executives link keeps its prior metadata and gains cutoverStage.
      expect(linkRepository.update).toHaveBeenCalledWith(
        'link-exec-1',
        expect.objectContaining({
          authority: FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
          metadata: expect.objectContaining({
            foo: 'bar',
            cutoverStage: CutoverStage.STAGE_1_LINKS,
          }),
        }),
      );
    });

    it('refuses to apply a stage that does not advance past the current stage', async () => {
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: stageLedger(CutoverStage.STAGE_2_INBOUND),
      });

      await expect(
        service.applyStage(WORKSPACE_ID, CutoverStage.STAGE_1_LINKS, ACTOR_ID),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.CUTOVER_STAGE_REGRESSION,
        }),
      );

      // Nothing written when the transition is rejected.
      expect(linkRepository.update).not.toHaveBeenCalled();
      expect(checkpointRepository.insert).not.toHaveBeenCalled();
      expect(checkpointRepository.update).not.toHaveBeenCalled();
    });

    it('refuses to re-apply the current stage', async () => {
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: stageLedger(CutoverStage.STAGE_1_LINKS),
      });

      await expect(
        service.applyStage(WORKSPACE_ID, CutoverStage.STAGE_1_LINKS, ACTOR_ID),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.CUTOVER_STAGE_REGRESSION,
        }),
      );
    });
  });

  describe('applyStage — dry-run', () => {
    beforeEach(() => {
      checkpointRepository.findOne.mockResolvedValue(null);
    });

    it('returns the diff without writing anything', async () => {
      const result = await service.applyStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_2_INBOUND,
        ACTOR_ID,
        true,
      );

      expect(result.dryRun).toBe(true);
      expect(result.toStage).toBe(CutoverStage.STAGE_2_INBOUND);
      // Catching up to STAGE_2 touches every collection that has transferred
      // by then (executives, companies, opportunities, applications,
      // scheduled_interviews).
      expect(result.changes.map((c) => c.collection).sort()).toEqual([
        'applications',
        'companies',
        'executives',
        'opportunities',
        'scheduled_interviews',
      ]);
      expect(result.linkCount).toBe(0);

      // No writes of any kind.
      expect(linkRepository.update).not.toHaveBeenCalled();
      expect(linkRepository.find).not.toHaveBeenCalled();
      expect(checkpointRepository.insert).not.toHaveBeenCalled();
      expect(checkpointRepository.update).not.toHaveBeenCalled();
      expect(reconciliationRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('revertToStage', () => {
    beforeEach(() => {
      // Currently at STAGE_1.
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: stageLedger(CutoverStage.STAGE_1_LINKS),
      });
      linkRepository.find.mockResolvedValue([
        { id: 'link-x', metadata: { cutoverStage: CutoverStage.STAGE_1_LINKS } },
      ]);
    });

    it('restores the prior authorities when walking back', async () => {
      const result = await service.revertToStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_0_READONLY,
        ACTOR_ID,
      );

      expect(result.action).toBe('revert');
      expect(result.fromStage).toBe(CutoverStage.STAGE_1_LINKS);
      expect(result.toStage).toBe(CutoverStage.STAGE_0_READONLY);

      // executives reverts from TWENTY (ats_uuid) back to DIRECTUS
      // (its baseline guardrail authority at STAGE_0).
      const executives = result.changes.find(
        (c) => c.collection === 'executives',
      );

      expect(executives?.previousAuthority).toBe(
        FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
      );
      expect(executives?.nextAuthority).toBe(
        FieldOwnershipAuthority.DIRECTUS_AUTHORITATIVE,
      );
      expect(executives?.nextStage).toBe(CutoverStage.STAGE_0_READONLY);

      // opportunities has no baseline row, so reverting clears its authority.
      const opportunities = result.changes.find(
        (c) => c.collection === 'opportunities',
      );

      expect(opportunities?.nextAuthority).toBeNull();
      expect(opportunities?.nextStage).toBe(CutoverStage.STAGE_0_READONLY);

      // Writes occurred (not a dry-run).
      expect(linkRepository.update).toHaveBeenCalled();
      expect(checkpointRepository.update).toHaveBeenCalled();

      const ledger = JSON.parse(
        checkpointRepository.update.mock.calls[0][1].lastExternalEventId,
      );

      expect(ledger.currentStage).toBe(CutoverStage.STAGE_0_READONLY);
    });

    it('writes the reverted authority + cutoverStage onto links', async () => {
      await service.revertToStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_0_READONLY,
        ACTOR_ID,
      );

      expect(linkRepository.update).toHaveBeenCalledWith(
        'link-x',
        expect.objectContaining({
          authority: expect.any(String),
          metadata: expect.objectContaining({
            cutoverStage: CutoverStage.STAGE_0_READONLY,
          }),
        }),
      );
    });

    it('refuses to revert forward (to a stage at or above current)', async () => {
      await expect(
        service.revertToStage(
          WORKSPACE_ID,
          CutoverStage.STAGE_2_INBOUND,
          ACTOR_ID,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.CUTOVER_INVALID_REVERT,
        }),
      );

      expect(linkRepository.update).not.toHaveBeenCalled();
      expect(checkpointRepository.update).not.toHaveBeenCalled();
    });

    it('returns a diff without writing in dry-run mode', async () => {
      const result = await service.revertToStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_0_READONLY,
        ACTOR_ID,
        true,
      );

      expect(result.dryRun).toBe(true);
      expect(result.linkCount).toBe(0);
      expect(linkRepository.update).not.toHaveBeenCalled();
      expect(checkpointRepository.update).not.toHaveBeenCalled();
      expect(reconciliationRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('full forward + back cycle', () => {
    it('apply then revert returns executives to its baseline authority', async () => {
      // STAGE_0 baseline.
      checkpointRepository.findOne.mockResolvedValue(null);

      await service.applyStage(WORKSPACE_ID, CutoverStage.STAGE_1_LINKS, ACTOR_ID);

      // Now simulate the persisted STAGE_1 checkpoint for the revert.
      checkpointRepository.findOne.mockResolvedValue({
        id: 'cp-1',
        lastExternalEventId: stageLedger(CutoverStage.STAGE_1_LINKS),
      });

      const reverted = await service.revertToStage(
        WORKSPACE_ID,
        CutoverStage.STAGE_0_READONLY,
        ACTOR_ID,
      );

      const executives = reverted.changes.find(
        (c) => c.collection === 'executives',
      );

      // Round-trips back to the STAGE_0 baseline authority.
      expect(executives?.nextAuthority).toBe(
        FieldOwnershipAuthority.DIRECTUS_AUTHORITATIVE,
      );
    });
  });
});
