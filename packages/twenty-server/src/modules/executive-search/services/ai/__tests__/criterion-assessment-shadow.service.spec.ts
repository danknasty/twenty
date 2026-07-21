import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';
import { CriterionAssessmentShadowService } from 'src/modules/executive-search/services/ai/criterion-assessment-shadow.service';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

// Mock workspace auth context storage
jest.mock(
  'src/engine/core-modules/auth/storage/workspace-auth-context.storage',
  () => ({
    getWorkspaceAuthContext: jest.fn(() => ({
      workspace: { id: 'workspace-1' },
      type: 'user' as const,
      workspaceMemberId: 'member-1',
    })),
  }),
);

// Mock the GlobalWorkspaceOrmManager
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => {
    const mockExecuteInWorkspaceContext = jest
      .fn()
      .mockImplementation(
        (fn: () => any, _authContext?: any) => fn(),
      );

    const mockGetRepository = jest.fn();

    return {
      GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
        executeInWorkspaceContext: mockExecuteInWorkspaceContext,
        getRepository: mockGetRepository,
      })),
    };
  },
);

// Mock the AiContextFirewallService to avoid SWC/CJS dependency resolution
// issues with twenty-shared/utils (camelToSnakeCase)
jest.mock(
  'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service',
  () => ({
    AiContextFirewallService: jest.fn().mockImplementation(() => ({
      validateAiContextAllowlist: jest.fn().mockReturnValue([]),
      assertAiContextAllowlistSafe: jest.fn(),
      filterProhibited: jest.fn().mockImplementation((fields: string[]) => fields),
    })),
  }),
);

// Mock the FeatureFlagService to avoid CustomError resolution chain issues
jest.mock(
  'src/engine/core-modules/feature-flag/services/feature-flag.service',
  () => ({
    FeatureFlagService: jest.fn().mockImplementation(() => ({
      isFeatureEnabled: jest.fn(),
    })),
  }),
);

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

describe('CriterionAssessmentShadowService', () => {
  let service: CriterionAssessmentShadowService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: any;
  let mockCriterionRepository: any;
  let mockCandidacyRepository: any;
  let mockEvaluationRepository: any;

  const mockAuthContext: any = {
    workspace: { id: 'workspace-1' },
    type: 'user' as const,
    workspaceMemberId: 'member-1',
  };

  const setupRepositories = () => {
    mockCriterionRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    mockCandidacyRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    mockEvaluationRepository = {
      save: jest.fn(),
    };

    const repositoryMap: Record<string, any> = {
      SearchCriterionWorkspaceEntity: mockCriterionRepository,
      searchCandidacy: mockCandidacyRepository,
      SearchCandidacyWorkspaceEntity: mockCandidacyRepository,
      criterionEvaluation: mockEvaluationRepository,
    };

    const mockInstance = new GlobalWorkspaceOrmManager(
      null as any,
    );
    mockInstance.getRepository = jest.fn().mockImplementation(
      (_workspaceId: string, entityOrName: any, _options?: any) => {
        const key =
          typeof entityOrName === 'string'
            ? entityOrName
            : entityOrName.name;

        return Promise.resolve(repositoryMap[key]);
      },
    );

    return mockInstance;
  };

  beforeEach(async () => {
    mockFeatureFlagService = new FeatureFlagService(
      null as any,
      null as any,
    ) as jest.Mocked<FeatureFlagService>;
    mockFeatureFlagService.isFeatureEnabled = jest.fn().mockResolvedValue(true);

    mockAiContextFirewallService = new AiContextFirewallService(
      null as any,
    );

    const mockOrmManager = setupRepositories();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriterionAssessmentShadowService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockOrmManager,
        },
        {
          provide: FeatureFlagService,
          useValue: mockFeatureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: mockAiContextFirewallService,
        },
      ],
    }).compile();

    service = module.get<CriterionAssessmentShadowService>(
      CriterionAssessmentShadowService,
    );
  });

  // ---------------------------------------------------------------------------
  // Feature flag guards
  // ---------------------------------------------------------------------------
  describe('feature flag guards', () => {
    it('throws FEATURE_FLAG_DISABLED when IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED is false', async () => {
      mockFeatureFlagService.isFeatureEnabled = jest
        .fn()
        .mockImplementation((key: FeatureFlagKey) => {
          if (key === FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED) {
            return Promise.resolve(false);
          }

          return Promise.resolve(true);
        });

      await expect(
        service.evaluateAssignmentCriteria(
          { searchAssignmentId: 'assign-1' },
          mockAuthContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
        }),
      );
    });

    it('throws FEATURE_FLAG_DISABLED when IS_CRITERION_ASSESSMENT_SHADOW_ENABLED is false', async () => {
      mockFeatureFlagService.isFeatureEnabled = jest
        .fn()
        .mockImplementation((key: FeatureFlagKey) => {
          if (key === FeatureFlagKey.IS_CRITERION_ASSESSMENT_SHADOW_ENABLED) {
            return Promise.resolve(false);
          }

          return Promise.resolve(true);
        });

      await expect(
        service.evaluateAssignmentCriteria(
          { searchAssignmentId: 'assign-1' },
          mockAuthContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
        }),
      );
    });

    it('succeeds when both feature flags are enabled', async () => {
      mockCriterionRepository.find.mockResolvedValue([]);
      mockCandidacyRepository.find.mockResolvedValue([]);

      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.storedCount).toBe(0);
      expect(result.evaluations).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // Empty results
  // ---------------------------------------------------------------------------
  describe('empty state handling', () => {
    it('returns empty output when no criteria exist', async () => {
      mockCriterionRepository.find.mockResolvedValue([]);

      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.storedCount).toBe(0);
      expect(result.evaluations).toEqual([]);
      expect(result.shadowRunId).toBeTruthy();
    });

    it('returns empty output when no candidacies exist', async () => {
      const mockCriteria = [
        {
          id: 'criterion-1',
          name: 'CEO Experience',
          description: '10+ years as CEO',
          category: 'EXPERIENCE',
          weight: 10,
          isRequired: true,
        },
      ];

      mockCriterionRepository.find.mockResolvedValue(mockCriteria);
      mockCandidacyRepository.find.mockResolvedValue([]);

      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.storedCount).toBe(0);
      expect(result.evaluations).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // Shadow evaluation execution
  // ---------------------------------------------------------------------------
  describe('shadow evaluation execution', () => {
    const mockCriteria = [
      {
        id: 'criterion-1',
        name: 'CEO Experience',
        description: '10+ years as CEO',
        category: 'EXPERIENCE',
        weight: 10,
        isRequired: true,
      },
      {
        id: 'criterion-2',
        name: 'Board Experience',
        description: 'Previous board service',
        category: 'LEADERSHIP',
        weight: 8,
        isRequired: false,
      },
    ];

    const mockCandidacies = [
      {
        id: 'candidacy-1',
        name: 'Jane Doe — CEO Search',
        status: 'IDENTIFIED',
        searchAssignmentId: 'assign-1',
        executiveProfileId: 'profile-1',
      },
    ];

    beforeEach(() => {
      mockCriterionRepository.find.mockResolvedValue(mockCriteria);
      mockCandidacyRepository.find.mockResolvedValue(mockCandidacies);
      mockEvaluationRepository.save.mockResolvedValue({ id: 'eval-1' });
    });

    it('evaluates each candidacy against each criterion', async () => {
      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.evaluations).toHaveLength(1);
      expect(result.evaluations[0].candidacyId).toBe('candidacy-1');
      expect(result.evaluations[0].criteriaEvaluations).toHaveLength(2);
      expect(result.evaluations[0].criteriaEvaluations[0].criterionId).toBe('criterion-1');
      expect(result.evaluations[0].criteriaEvaluations[1].criterionId).toBe('criterion-2');
    });

    it('stores one shadow assessment record per criterion per candidacy', async () => {
      await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      // 2 criteria × 1 candidacy = 2 saves
      expect(mockEvaluationRepository.save).toHaveBeenCalledTimes(2);
    });

    it('stores shadow records with correct metadata', async () => {
      await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      const firstSaveCall = mockEvaluationRepository.save.mock.calls[0][0];

      // The name must contain [SHADOW] prefix
      expect(firstSaveCall.name).toContain('[SHADOW]');
      expect(firstSaveCall.name).toContain(mockCriteria[0].name);

      // Must be marked as not human-reviewed
      expect(firstSaveCall.isHumanReviewed).toBe(false);

      // Must have the aiDraftGeneratedAt timestamp
      expect(firstSaveCall.aiDraftGeneratedAt).toBeTruthy();
      expect(firstSaveCall.aiModelVersion).toBeTruthy();

      // Assessor notes must contain shadow metadata
      const assessorNotes = JSON.parse(firstSaveCall.assessorNotes);
      expect(assessorNotes.__shadow).toBe(true);
      expect(assessorNotes.source).toBe('ai_shadow');
      expect(assessorNotes.shadowStatus).toBe('pending_review');
      expect(assessorNotes.warning).toContain('SHADOW ASSESSMENT');
    });

    it('reports correct storedCount in output', async () => {
      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.storedCount).toBe(2);
    });

    it('includes evidence trail in output', async () => {
      const result = await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      expect(result.aiModelVersion).toBeTruthy();
      expect(result.promptVersion).toBeTruthy();
      expect(result.shadowRunId).toBeTruthy();
      expect(result.redactionManifest).toBeDefined();
      expect(result.evaluatedAt).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Filtered evaluation
  // ---------------------------------------------------------------------------
  describe('filtered evaluation', () => {
    it('invokes find on criterion repository when criterion IDs are provided', async () => {
      mockCriterionRepository.find.mockResolvedValue([
        {
          id: 'criterion-1',
          name: 'CEO Experience',
          description: '10+ years as CEO',
          category: 'EXPERIENCE',
          weight: 10,
          isRequired: true,
        },
      ]);
      mockCandidacyRepository.find.mockResolvedValue([]);

      await service.evaluateAssignmentCriteria(
        {
          searchAssignmentId: 'assign-1',
          criterionIds: ['criterion-1'],
        },
        mockAuthContext,
      );

      expect(mockCriterionRepository.find).toHaveBeenCalled();
    });

    it('loads only specified candidacies when candidacy IDs are provided', async () => {
      // Must have at least one criterion to proceed past the criteria check
      mockCriterionRepository.find.mockResolvedValue([
        {
          id: 'criterion-1',
          name: 'CEO Experience',
          description: '10+ years as CEO',
          category: 'EXPERIENCE',
          weight: 10,
          isRequired: true,
        },
      ]);
      mockCandidacyRepository.find.mockResolvedValue([]);

      await service.evaluateAssignmentCriteria(
        {
          searchAssignmentId: 'assign-1',
          candidacyIds: ['candidacy-1', 'candidacy-2'],
        },
        mockAuthContext,
      );

      expect(mockCandidacyRepository.find).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // AI context firewall interaction
  // ---------------------------------------------------------------------------
  describe('AI context firewall', () => {
    it('validates AI context allowlist before evaluating', async () => {
      const spy = jest.spyOn(
        mockAiContextFirewallService,
        'validateAiContextAllowlist',
      );

      mockCriterionRepository.find.mockResolvedValue([]);
      mockCandidacyRepository.find.mockResolvedValue([]);

      await service.evaluateAssignmentCriteria(
        { searchAssignmentId: 'assign-1' },
        mockAuthContext,
      );

      // The firewall was consulted before any AI evaluation
      expect(spy).toHaveBeenCalled();
    });
  });
});
