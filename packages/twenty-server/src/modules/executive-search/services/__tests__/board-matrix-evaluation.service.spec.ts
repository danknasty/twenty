import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { BoardMatrixEvaluationService } from 'src/modules/executive-search/services/board-matrix-evaluation.service';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

// Mock GlobalWorkspaceOrmManager — same pattern as convert-opportunity-to-assignment.service.spec.ts
const mockExecuteInWorkspaceContext = jest
  .fn()
  .mockImplementation((fn: () => any, _authContext?: any) => fn());

const mockGetRepository = jest.fn();

jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
      executeInWorkspaceContext: mockExecuteInWorkspaceContext,
      getRepository: mockGetRepository,
    })),
  }),
);

describe('BoardMatrixEvaluationService', () => {
  let service: BoardMatrixEvaluationService;
  let mockProfileRepo: any;
  let mockCandidacyRepo: any;
  let mockCriteriaRepo: any;
  let mockEvalRepo: any;

  const workspaceId = 'workspace-1';
  const authContext = {
    type: 'user' as const,
    workspace: { id: workspaceId },
  } as any;

  const boardCompositionProfileId = 'profile-1';
  const candidacyId = 'candidacy-1';

  const mockProfile = {
    id: boardCompositionProfileId,
    name: 'Test Board Profile',
  };

  const mockCandidacy = {
    id: candidacyId,
    name: 'Test Candidate',
    status: 'SHORTLIST',
  };

  const mockCriteria = [
    { id: 'criterion-1', name: 'Industry Experience', weight: 5 },
    { id: 'criterion-2', name: 'Leadership', weight: 4 },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    mockProfileRepo = {
      findOne: jest.fn().mockResolvedValue(mockProfile),
    };

    mockCandidacyRepo = {
      findOne: jest.fn().mockResolvedValue(mockCandidacy),
    };

    mockCriteriaRepo = {
      find: jest.fn().mockResolvedValue(mockCriteria),
    };

    mockEvalRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockImplementation((record: any) =>
        Promise.resolve({
          id: record.id ?? 'eval-new',
          ...record,
        }),
      ),
    };

    mockGetRepository.mockImplementation(
      (_workspaceId: string, EntityClass: any) => {
        const name = EntityClass?.name ?? '';
        if (name.includes('BoardCompositionProfile')) return mockProfileRepo;
        if (name.includes('SearchCandidacy'))
          return mockCandidacyRepo;
        if (name.includes('BoardMatrixCriterion'))
          return mockCriteriaRepo;
        if (name.includes('CandidateBoardMatrixEvaluation'))
          return mockEvalRepo;
        return {};
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardMatrixEvaluationService, GlobalWorkspaceOrmManager],
    }).compile();

    service = module.get(BoardMatrixEvaluationService);
  });

  describe('evaluateBoardMatrix', () => {
    it('returns evaluation with PENDING_HUMAN_REVIEW status for each criterion', async () => {
      const result = await service.evaluateBoardMatrix(
        boardCompositionProfileId,
        candidacyId,
        workspaceId,
        authContext,
      );

      expect(result.status).toBe('PENDING_HUMAN_REVIEW');
      expect(result.boardCompositionProfileId).toBe(boardCompositionProfileId);
      expect(result.candidacyId).toBe(candidacyId);
      expect(result.criteria).toHaveLength(2);
      expect(result.criteria[0].score).toBeNull();
      expect(result.criteria[0].guardrailFlags).toContain('ADVISORY_ONLY');
      expect(result.criteria[0].evidenceSources).toEqual(
        expect.arrayContaining([expect.stringMatching(/^inputHash:/)]),
      );
      expect(result.evaluationId).toHaveLength(16); // SHA-256 truncated
    });

    it('throws NOT_FOUND when board composition profile is missing', async () => {
      mockProfileRepo.findOne.mockResolvedValue(null);

      await expect(
        service.evaluateBoardMatrix(
          boardCompositionProfileId,
          candidacyId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.evaluateBoardMatrix(
          boardCompositionProfileId,
          candidacyId,
          workspaceId,
          authContext,
        ),
      ).rejects.toMatchObject({
        code: ExecutiveSearchExceptionCode.NOT_FOUND,
      });
    });

    it('throws NOT_FOUND when candidacy is missing', async () => {
      mockCandidacyRepo.findOne.mockResolvedValue(null);

      await expect(
        service.evaluateBoardMatrix(
          boardCompositionProfileId,
          candidacyId,
          workspaceId,
          authContext,
        ),
      ).rejects.toMatchObject({
        code: ExecutiveSearchExceptionCode.NOT_FOUND,
      });
    });

    it('throws VALIDATION_FAILED when no criteria exist for the profile', async () => {
      mockCriteriaRepo.find.mockResolvedValue([]);

      await expect(
        service.evaluateBoardMatrix(
          boardCompositionProfileId,
          candidacyId,
          workspaceId,
          authContext,
        ),
      ).rejects.toMatchObject({
        code: ExecutiveSearchExceptionCode.VALIDATION_FAILED,
      });
    });

    it('upserts evaluation records — updates existing record if found', async () => {
      const existingEval = {
        id: 'existing-eval-1',
        score: null,
        maxScore: 5,
        notes: 'Previous notes',
        boardMatrixCriterionId: 'criterion-1',
        searchCandidacyId: candidacyId,
      };
      mockEvalRepo.findOne.mockResolvedValueOnce(existingEval);

      const result = await service.evaluateBoardMatrix(
        boardCompositionProfileId,
        candidacyId,
        workspaceId,
        authContext,
      );

      // Existing record should be saved with same id
      const saveCalls = mockEvalRepo.save.mock.calls;
      expect(saveCalls[0][0].id).toBe('existing-eval-1');
      expect(saveCalls[0][0].notes).toBe('Previous notes');
      expect(result.criteria).toHaveLength(2);
    });
  });
});
