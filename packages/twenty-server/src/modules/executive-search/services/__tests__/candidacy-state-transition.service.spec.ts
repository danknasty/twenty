import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CandidacyStateTransitionService } from 'src/modules/executive-search/services/candidacy-state-transition.service';
import { OffLimitsGuardService } from 'src/modules/executive-search/services/off-limits-guard.service';
import { CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

// Mock the workspace auth context so getWorkspaceId() resolves
jest.mock(
  'src/engine/core-modules/auth/storage/workspace-auth-context.storage',
  () => ({
    getWorkspaceAuthContext: jest.fn(() => ({
      workspace: { id: 'workspace-1' },
      type: 'system',
    })),
  }),
);

// Mock the module dependencies before any imports are evaluated
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => {
    const mockExecuteInWorkspaceContext = jest
      .fn()
      .mockImplementation(
        (fn: () => any, _authContext?: any) => fn(),
      );

    const mockGetRepository = jest.fn();
    const mockTransaction = jest
      .fn()
      .mockImplementation(
        async (cb: (manager: any) => Promise<any>) => cb({}),
      );

    return {
      GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
        executeInWorkspaceContext: mockExecuteInWorkspaceContext,
        getRepository: mockGetRepository,
        getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue({
          transaction: mockTransaction,
        }),
      })),
    };
  },
);

describe('CandidacyStateTransitionService', () => {
  let service: CandidacyStateTransitionService;
  let mockCandidacyRepository: any;
  let mockStageEventRepository: any;
  let mockConflictCheckRepository: any;
  let mockGlobalWorkspaceOrmManager: any;
  let mockOffLimitsGuardService: any;
  let mockTransactionImpl: any;

  const setupRepositories = () => {
    mockCandidacyRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    mockStageEventRepository = {
      insert: jest.fn(),
    };
    mockConflictCheckRepository = {
      find: jest.fn(),
    };

    const repositoryMap: Record<string, any> = {
      searchCandidacy: mockCandidacyRepository,
      SearchCandidacyWorkspaceEntity: mockCandidacyRepository,
      candidacyStageEvent: mockStageEventRepository,
      CandidacyStageEventWorkspaceEntity: mockStageEventRepository,
      conflictCheck: mockConflictCheckRepository,
    };

    mockGlobalWorkspaceOrmManager.getRepository.mockImplementation(
      (_workspaceId: string, entityOrName: any, _options?: any) => {
        const key =
          typeof entityOrName === 'string'
            ? entityOrName
            : entityOrName.name;

        return Promise.resolve(repositoryMap[key]);
      },
    );
  };

  beforeEach(async () => {
    mockTransactionImpl = jest
      .fn()
      .mockImplementation(
        async (cb: (manager: any) => Promise<any>) => cb({}),
      );

    // Create mock orm manager with fresh callbacks
    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation(
          (fn: () => any, _authContext?: any) => fn(),
        ),
      getRepository: jest.fn(),
      getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue({
        transaction: mockTransactionImpl,
      }),
    };

    mockOffLimitsGuardService = {
      check: jest.fn().mockResolvedValue({ status: 'CLEAR' }),
    };

    setupRepositories();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidacyStateTransitionService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
        {
          provide: OffLimitsGuardService,
          useValue: mockOffLimitsGuardService,
        },
      ],
    }).compile();

    service = module.get<CandidacyStateTransitionService>(
      CandidacyStateTransitionService,
    );
  });

  // ---------------------------------------------------------------------------
  // validateTransition
  // ---------------------------------------------------------------------------
  describe('validateTransition', () => {
    describe('valid transitions', () => {
      it('IDENTIFIED → RESEARCHING', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.IDENTIFIED,
            CandidacyStatus.RESEARCHING,
          ),
        ).toBe(true);
      });

      it('IDENTIFIED → OFF_LIMITS', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.IDENTIFIED,
            CandidacyStatus.OFF_LIMITS,
          ),
        ).toBe(true);
      });

      it('IDENTIFIED → CONFLICT', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.IDENTIFIED,
            CandidacyStatus.CONFLICT,
          ),
        ).toBe(true);
      });

      it('RESEARCHING → RESEARCH_COMPLETE', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.RESEARCHING,
            CandidacyStatus.RESEARCH_COMPLETE,
          ),
        ).toBe(true);
      });

      it('RESEARCH_COMPLETE → CONTACT_PLANNED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.RESEARCH_COMPLETE,
            CandidacyStatus.CONTACT_PLANNED,
          ),
        ).toBe(true);
      });

      it('CONTACT_PLANNED → APPROACHED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.CONTACT_PLANNED,
            CandidacyStatus.APPROACHED,
          ),
        ).toBe(true);
      });

      it('APPROACHED → NO_RESPONSE', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.APPROACHED,
            CandidacyStatus.NO_RESPONSE,
          ),
        ).toBe(true);
      });

      it('APPROACHED → DECLINED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.APPROACHED,
            CandidacyStatus.DECLINED,
          ),
        ).toBe(true);
      });

      it('APPROACHED → INTERESTED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.APPROACHED,
            CandidacyStatus.INTERESTED,
          ),
        ).toBe(true);
      });

      it('INTERESTED → QUALIFYING', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.INTERESTED,
            CandidacyStatus.QUALIFYING,
          ),
        ).toBe(true);
      });

      it('QUALIFYING → QUALIFIED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.QUALIFYING,
            CandidacyStatus.QUALIFIED,
          ),
        ).toBe(true);
      });

      it('QUALIFIED → LONGLIST', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.QUALIFIED,
            CandidacyStatus.LONGLIST,
          ),
        ).toBe(true);
      });

      it('LONGLIST → CALIBRATION', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.LONGLIST,
            CandidacyStatus.CALIBRATION,
          ),
        ).toBe(true);
      });

      it('CALIBRATION → PRESENTED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.CALIBRATION,
            CandidacyStatus.PRESENTED,
          ),
        ).toBe(true);
      });

      it('PRESENTED → CLIENT_HOLD', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.PRESENTED,
            CandidacyStatus.CLIENT_HOLD,
          ),
        ).toBe(true);
      });

      it('PRESENTED → SHORTLIST', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.PRESENTED,
            CandidacyStatus.SHORTLIST,
          ),
        ).toBe(true);
      });

      it('CLIENT_HOLD → SHORTLIST', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.CLIENT_HOLD,
            CandidacyStatus.SHORTLIST,
          ),
        ).toBe(true);
      });

      it('SHORTLIST → CLIENT_INTERVIEW', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.SHORTLIST,
            CandidacyStatus.CLIENT_INTERVIEW,
          ),
        ).toBe(true);
      });

      it('CLIENT_INTERVIEW → FINALIST', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.CLIENT_INTERVIEW,
            CandidacyStatus.FINALIST,
          ),
        ).toBe(true);
      });

      it('FINALIST → REFERENCES_STAGE', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.FINALIST,
            CandidacyStatus.REFERENCES_STAGE,
          ),
        ).toBe(true);
      });

      it('REFERENCES_STAGE → DILIGENCE', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.REFERENCES_STAGE,
            CandidacyStatus.DILIGENCE,
          ),
        ).toBe(true);
      });

      it('DILIGENCE → OFFER_NEGOTIATION', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.DILIGENCE,
            CandidacyStatus.OFFER_NEGOTIATION,
          ),
        ).toBe(true);
      });

      it('OFFER_NEGOTIATION → PLACED', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.OFFER_NEGOTIATION,
            CandidacyStatus.PLACED,
          ),
        ).toBe(true);
      });

      it('NO_RESPONSE → FUTURE_FIT', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.NO_RESPONSE,
            CandidacyStatus.FUTURE_FIT,
          ),
        ).toBe(true);
      });

      it('DECLINED → FUTURE_FIT', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.DECLINED,
            CandidacyStatus.FUTURE_FIT,
          ),
        ).toBe(true);
      });
    });

    describe('invalid transitions', () => {
      it('IDENTIFIED → APPROACHED returns false', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.IDENTIFIED,
            CandidacyStatus.APPROACHED,
          ),
        ).toBe(false);
      });

      it('RESEARCHING → IDENTIFIED returns false (no backward)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.RESEARCHING,
            CandidacyStatus.IDENTIFIED,
          ),
        ).toBe(false);
      });

      it('PLACED → any status returns false (terminal)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.PLACED,
            CandidacyStatus.ACTIVE as any,
          ),
        ).toBe(false);
      });

      it('OFF_LIMITS → any status returns false (terminal)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.OFF_LIMITS,
            CandidacyStatus.RESEARCHING,
          ),
        ).toBe(false);
      });

      it('CONFLICT → any status returns false (terminal)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.CONFLICT,
            CandidacyStatus.INTERESTED,
          ),
        ).toBe(false);
      });

      it('FUTURE_FIT → any status returns false (terminal)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.FUTURE_FIT,
            CandidacyStatus.APPROACHED,
          ),
        ).toBe(false);
      });

      it('APPROACHED → QUALIFYING returns false (must go through INTERESTED)', () => {
        expect(
          service.validateTransition(
            CandidacyStatus.APPROACHED,
            CandidacyStatus.QUALIFYING,
          ),
        ).toBe(false);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // getAllowedTransitions
  // ---------------------------------------------------------------------------
  describe('getAllowedTransitions', () => {
    it('returns the correct allowed transitions from IDENTIFIED', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.IDENTIFIED);

      expect(allowed).toEqual([
        CandidacyStatus.RESEARCHING,
        CandidacyStatus.OFF_LIMITS,
        CandidacyStatus.CONFLICT,
      ]);
    });

    it('returns empty array for terminal state PLACED', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.PLACED);

      expect(allowed).toEqual([]);
    });

    it('returns empty array for terminal state OFF_LIMITS', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.OFF_LIMITS);

      expect(allowed).toEqual([]);
    });

    it('returns empty array for terminal state CONFLICT', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.CONFLICT);

      expect(allowed).toEqual([]);
    });

    it('returns empty array for terminal state FUTURE_FIT', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.FUTURE_FIT);

      expect(allowed).toEqual([]);
    });

    it('returns NO_RESPONSE and DECLINED and INTERESTED from APPROACHED', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.APPROACHED);

      expect(allowed).toEqual([
        CandidacyStatus.NO_RESPONSE,
        CandidacyStatus.DECLINED,
        CandidacyStatus.INTERESTED,
      ]);
    });

    it('returns CLIENT_HOLD and SHORTLIST from PRESENTED', () => {
      const allowed = service.getAllowedTransitions(CandidacyStatus.PRESENTED);

      expect(allowed).toEqual([
        CandidacyStatus.CLIENT_HOLD,
        CandidacyStatus.SHORTLIST,
      ]);
    });
  });

  // ---------------------------------------------------------------------------
  // transition
  // ---------------------------------------------------------------------------
  describe('transition', () => {
    const baseCandidacy = {
      id: 'candidacy-1',
      status: CandidacyStatus.IDENTIFIED,
      personId: 'person-1',
      currentCompanyId: null,
      searchAssignmentId: null,
      fitScore: null,
      notes: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      deletedAt: null,
    };

    it('should perform a valid transition and return a stage event', async () => {
      mockCandidacyRepository.update.mockResolvedValue({ affected: 1 });
      mockStageEventRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'event-1' }],
      });

      const result = await service.transition(
        baseCandidacy,
        CandidacyStatus.RESEARCHING,
        'actor-1',
        'user',
        'Starting research phase',
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: 'event-1',
          candidacyId: 'candidacy-1',
          stageFrom: CandidacyStatus.IDENTIFIED,
          stageTo: CandidacyStatus.RESEARCHING,
          transitionedById: 'actor-1',
          actorKind: 'user',
          reason: 'Starting research phase',
        }),
      );

      expect(mockCandidacyRepository.update).toHaveBeenCalledWith(
        { id: 'candidacy-1' },
        { status: CandidacyStatus.RESEARCHING },
        expect.anything(),
      );

      expect(mockStageEventRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          candidacyId: 'candidacy-1',
          stageFrom: CandidacyStatus.IDENTIFIED,
          stageTo: CandidacyStatus.RESEARCHING,
          transitionedById: 'actor-1',
          actorKind: 'user',
          reason: 'Starting research phase',
        }),
        expect.anything(),
      );
    });

    it('should use null for optional actor fields when not provided', async () => {
      mockCandidacyRepository.update.mockResolvedValue({ affected: 1 });
      mockStageEventRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'event-2' }],
      });

      const result = await service.transition(
        baseCandidacy,
        CandidacyStatus.RESEARCHING,
      );

      expect(result.transitionedById).toBeNull();
      expect(result.actorKind).toBeNull();
      expect(result.reason).toBeNull();
    });

    it('should throw INVALID_STATUS_TRANSITION for illegal transition', async () => {
      await expect(
        service.transition(baseCandidacy, CandidacyStatus.APPROACHED),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION,
        }),
      );

      expect(mockCandidacyRepository.update).not.toHaveBeenCalled();
      expect(mockStageEventRepository.insert).not.toHaveBeenCalled();
    });

    it('should throw for terminal state transitions', async () => {
      const placedCandidacy = { ...baseCandidacy, status: CandidacyStatus.PLACED };

      await expect(
        service.transition(placedCandidacy, CandidacyStatus.PLACED),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION,
        }),
      );
    });

    it('should wrap all writes in an atomic transaction', async () => {
      mockCandidacyRepository.update.mockResolvedValue({ affected: 1 });
      mockStageEventRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'event-3' }],
      });

      await service.transition(
        baseCandidacy,
        CandidacyStatus.RESEARCHING,
        'actor-2',
      );

      expect(mockTransactionImpl).toHaveBeenCalled();
    });

    it('should rollback writes when a repository save fails mid-transaction', async () => {
      mockCandidacyRepository.update.mockResolvedValue({ affected: 1 });
      mockStageEventRepository.insert.mockRejectedValue(
        new Error('DB failure'),
      );

      await expect(
        service.transition(
          baseCandidacy,
          CandidacyStatus.RESEARCHING,
          'actor-3',
        ),
      ).rejects.toThrow('DB failure');
    });

    it('should perform transitions through all non-terminal stages', async () => {
      const stageSequence: Array<{
        from: CandidacyStatus;
        to: CandidacyStatus;
      }> = [
        { from: CandidacyStatus.IDENTIFIED, to: CandidacyStatus.RESEARCHING },
        {
          from: CandidacyStatus.RESEARCHING,
          to: CandidacyStatus.RESEARCH_COMPLETE,
        },
        {
          from: CandidacyStatus.RESEARCH_COMPLETE,
          to: CandidacyStatus.CONTACT_PLANNED,
        },
        {
          from: CandidacyStatus.CONTACT_PLANNED,
          to: CandidacyStatus.APPROACHED,
        },
        { from: CandidacyStatus.APPROACHED, to: CandidacyStatus.INTERESTED },
        { from: CandidacyStatus.INTERESTED, to: CandidacyStatus.QUALIFYING },
        { from: CandidacyStatus.QUALIFYING, to: CandidacyStatus.QUALIFIED },
        { from: CandidacyStatus.QUALIFIED, to: CandidacyStatus.LONGLIST },
        { from: CandidacyStatus.LONGLIST, to: CandidacyStatus.CALIBRATION },
        { from: CandidacyStatus.CALIBRATION, to: CandidacyStatus.PRESENTED },
        { from: CandidacyStatus.PRESENTED, to: CandidacyStatus.SHORTLIST },
        {
          from: CandidacyStatus.SHORTLIST,
          to: CandidacyStatus.CLIENT_INTERVIEW,
        },
        {
          from: CandidacyStatus.CLIENT_INTERVIEW,
          to: CandidacyStatus.FINALIST,
        },
        {
          from: CandidacyStatus.FINALIST,
          to: CandidacyStatus.REFERENCES_STAGE,
        },
        {
          from: CandidacyStatus.REFERENCES_STAGE,
          to: CandidacyStatus.DILIGENCE,
        },
        {
          from: CandidacyStatus.DILIGENCE,
          to: CandidacyStatus.OFFER_NEGOTIATION,
        },
        {
          from: CandidacyStatus.OFFER_NEGOTIATION,
          to: CandidacyStatus.PLACED,
        },
      ];

      for (const { from, to } of stageSequence) {
        mockCandidacyRepository.update.mockResolvedValue({ affected: 1 });
        mockStageEventRepository.insert.mockResolvedValue({
          identifiers: [{ id: 'event-seq' }],
        });

        const result = await service.transition(
          { ...baseCandidacy, status: from },
          to,
          'actor-seq',
        );

        expect(result.stageFrom).toBe(from);
        expect(result.stageTo).toBe(to);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // checkOffLimitsAndConflicts
  // ---------------------------------------------------------------------------
  describe('checkOffLimitsAndConflicts', () => {
    it('returns { blocked: false } when no candidacy exists', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue(null);

      const result = await service.checkOffLimitsAndConflicts('nonexistent');

      expect(result).toEqual({ blocked: false });
    });

    it('returns { blocked: false } when off-limits check is CLEAR and no conflicts', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue({
        id: 'candidacy-1',
        personId: 'person-1',
        currentCompanyId: 'company-1',
      });
      mockOffLimitsGuardService.check.mockResolvedValue({
        status: 'CLEAR',
      });
      mockConflictCheckRepository.find.mockResolvedValue([]);

      const result = await service.checkOffLimitsAndConflicts('candidacy-1');

      expect(result).toEqual({ blocked: false });
    });

    it('returns blocked when off-limits check does not return CLEAR', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue({
        id: 'candidacy-1',
        personId: 'person-1',
        currentCompanyId: 'company-1',
      });
      mockOffLimitsGuardService.check.mockResolvedValue({
        status: 'BLOCKED',
      });

      const result = await service.checkOffLimitsAndConflicts('candidacy-1');

      expect(result).toEqual({
        blocked: true,
        reason: 'Off-limits restriction blocks this candidacy',
      });
    });

    it('returns blocked when a CONFIRMED conflict check exists for the person', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue({
        id: 'candidacy-1',
        personId: 'person-1',
        currentCompanyId: 'company-1',
      });
      mockOffLimitsGuardService.check.mockResolvedValue({
        status: 'CLEAR',
      });
      mockConflictCheckRepository.find.mockResolvedValue([
        {
          id: 'conflict-1',
          subjectPersonId: 'person-1',
          outcome: 'CONFIRMED',
          outcomeReason: 'Candidate works at competing firm',
        },
      ]);

      const result = await service.checkOffLimitsAndConflicts('candidacy-1');

      expect(result).toEqual({
        blocked: true,
        reason: 'Candidate works at competing firm',
      });
    });

    it('uses generic reason when conflict has no outcomeReason', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue({
        id: 'candidacy-1',
        personId: 'person-1',
        currentCompanyId: 'company-1',
      });
      mockOffLimitsGuardService.check.mockResolvedValue({
        status: 'CLEAR',
      });
      mockConflictCheckRepository.find.mockResolvedValue([
        {
          id: 'conflict-2',
          subjectPersonId: 'person-1',
          outcome: 'CONFIRMED',
          outcomeReason: null,
        },
      ]);

      const result = await service.checkOffLimitsAndConflicts('candidacy-1');

      expect(result).toEqual({
        blocked: true,
        reason: 'Conflict detected',
      });
    });

    it('does not block for non-CONFIRMED conflict outcomes', async () => {
      mockCandidacyRepository.findOne.mockResolvedValue({
        id: 'candidacy-1',
        personId: 'person-1',
        currentCompanyId: 'company-1',
      });
      mockOffLimitsGuardService.check.mockResolvedValue({
        status: 'CLEAR',
      });
      mockConflictCheckRepository.find.mockResolvedValue([
        {
          id: 'conflict-3',
          subjectPersonId: 'person-1',
          outcome: 'CLEAR',
          outcomeReason: 'No conflict found',
        },
      ]);

      const result = await service.checkOffLimitsAndConflicts('candidacy-1');

      expect(result).toEqual({ blocked: false });
    });
  });
});
