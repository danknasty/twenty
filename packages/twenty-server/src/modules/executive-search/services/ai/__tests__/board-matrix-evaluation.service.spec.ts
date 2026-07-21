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

import { Test, type TestingModule } from '@nestjs/testing';

import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

describe('BoardMatrixEvaluationService', () => {
  let service: any;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: any;
  let mockGlobalWorkspaceOrmManager: any;
  let mockProfileRepository: any;
  let mockCandidacyRepository: any;
  let mockCriterionRepository: any;
  let mockEvalRepository: any;

  const mockWorkspaceId = 'workspace-1';
  const mockAuthContext: any = {
    workspace: { id: 'workspace-1' },
    type: 'user' as const,
    workspaceMemberId: 'member-1',
  };

  beforeEach(async () => {
    mockFeatureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      validateAiContextAllowlist: jest.fn().mockReturnValue([]),
      assertAiContextAllowlistSafe: jest.fn(),
      filterProhibited: jest.fn().mockImplementation((fields: string[]) => fields),
    };

    mockProfileRepository = {
      findOne: jest.fn(),
    };
    mockCandidacyRepository = {
      findOne: jest.fn(),
    };
    mockCriterionRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    mockEvalRepository = {
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const { BoardMatrixEvaluationService: BMES } = require('../board-matrix-evaluation.service');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BMES,
        {
          provide: FeatureFlagService,
          useValue: mockFeatureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: mockAiContextFirewallService,
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            executeInWorkspaceContext: async (fn: any) => fn(),
            getRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(BMES);
    mockGlobalWorkspaceOrmManager = module.get(GlobalWorkspaceOrmManager);
  });

  const mockInput = {
    boardCompositionProfileId: 'profile-1',
    searchCandidacyId: 'candidacy-1',
  };

  it('should throw when umbrella AI feature flag is disabled', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );
  });

  it('should throw when board matrix AI feature flag is disabled', async () => {
    mockFeatureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );
  });

  it('should throw when board composition profile is not found', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockProfileRepository)
      .mockResolvedValueOnce(mockCandidacyRepository)
      .mockResolvedValueOnce(mockCriterionRepository)
      .mockResolvedValueOnce(mockEvalRepository);

    mockProfileRepository.findOne.mockResolvedValue(null);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.BOARD_COMPOSITION_PROFILE_NOT_FOUND,
      }),
    );
  });

  it('should throw when no criteria found for profile', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const profile = { id: 'profile-1', name: 'Test Profile' };
    const candidacy = { id: 'candidacy-1' };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockProfileRepository)
      .mockResolvedValueOnce(mockCandidacyRepository)
      .mockResolvedValueOnce(mockCriterionRepository)
      .mockResolvedValueOnce(mockEvalRepository);

    mockProfileRepository.findOne.mockResolvedValue(profile);
    mockCandidacyRepository.findOne.mockResolvedValue(candidacy);
    mockCriterionRepository.find.mockResolvedValue([]);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.BOARD_MATRIX_CRITERIA_NOT_FOUND,
      }),
    );
  });

  it('should successfully evaluate a candidate against criteria', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const profile = {
      id: 'profile-1',
      name: 'Tech Board Profile',
      status: 'ACTIVE',
    };
    const candidacy = { id: 'candidacy-1' };
    const criteria: any[] = [
      {
        id: 'crit-1',
        name: 'Financial Expertise',
        category: 'FINANCIAL_EXPERTISE',
        weight: 0.4,
        description: 'CFO or audit committee experience',
        isRequired: true,
        boardCompositionProfileId: 'profile-1',
      },
      {
        id: 'crit-2',
        name: 'Industry Knowledge',
        category: 'INDUSTRY_KNOWLEDGE',
        weight: 0.3,
        description: 'Deep SaaS industry experience',
        isRequired: false,
        boardCompositionProfileId: 'profile-1',
      },
      {
        id: 'crit-3',
        name: 'Independence',
        category: 'INDEPENDENCE',
        weight: 0.3,
        description: 'No material relationships with company',
        isRequired: true,
        boardCompositionProfileId: 'profile-1',
      },
    ];

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockProfileRepository)
      .mockResolvedValueOnce(mockCandidacyRepository)
      .mockResolvedValueOnce(mockCriterionRepository)
      .mockResolvedValueOnce(mockEvalRepository);

    mockProfileRepository.findOne.mockResolvedValue(profile);
    mockCandidacyRepository.findOne.mockResolvedValue(candidacy);
    mockCriterionRepository.find.mockResolvedValue(criteria);
    mockEvalRepository.save.mockResolvedValue({});
    mockEvalRepository.find.mockResolvedValue([]);

    const result = await service.evaluateCandidate(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(result.candidacyId).toBe('candidacy-1');
    expect(result.profileId).toBe('profile-1');
    expect(result.profileName).toBe('Tech Board Profile');
    expect(result.perCriterionEvaluations).toHaveLength(3);
    expect(result.requiresHumanReview).toBe(true);
    expect(result.humanReviewedAt).toBeNull();
    expect(result.weightedScore).not.toBeNull();
    expect(result.maxWeightedScore).not.toBeNull();
    expect(typeof result.summary).toBe('string');
    expect(typeof result.independenceAssessment).toBe('string');
    expect(typeof result.commitmentCapacityReview).toBe('string');
    expect(typeof result.diversityComplement).toBe('string');

    for (const evalItem of result.perCriterionEvaluations) {
      expect(evalItem.score).toBe(7);
      expect(evalItem.maxScore).toBe(10);
      expect(evalItem.evidence).toContain(evalItem.criterionName);
      expect(evalItem.assessment).toContain(evalItem.criterionName);
    }

    expect(mockEvalRepository.save).toHaveBeenCalledTimes(3);

    expect(result.weightedScore).toBeCloseTo(
      (7 / 10) * 0.4 + (7 / 10) * 0.3 + (7 / 10) * 0.3,
    );
    expect(result.maxWeightedScore).toBe(1.0);
  });

  it('should call AI context firewall for input sanitization', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const profile = { id: 'profile-1', name: 'Test Profile' };
    const candidacy = { id: 'candidacy-1' };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockProfileRepository)
      .mockResolvedValueOnce(mockCandidacyRepository)
      .mockResolvedValueOnce(mockCriterionRepository)
      .mockResolvedValueOnce(mockEvalRepository);

    mockProfileRepository.findOne.mockResolvedValue(profile);
    mockCandidacyRepository.findOne.mockResolvedValue(candidacy);
    mockCriterionRepository.find.mockResolvedValue([{
      id: 'crit-1',
      name: 'Test',
      category: 'OTHER',
      weight: 1,
      description: 'Test',
      isRequired: false,
      boardCompositionProfileId: 'profile-1',
    }]);
    mockEvalRepository.save.mockResolvedValue({});
    mockEvalRepository.find.mockResolvedValue([]);

    await service.evaluateCandidate(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(
      mockAiContextFirewallService.assertAiContextAllowlistSafe,
    ).toHaveBeenCalledWith(
      expect.arrayContaining([
        'boardCompositionProfileId',
        'searchCandidacyId',
      ]),
    );
  });

  it('should update evaluation records with human review timestamp', async () => {
    mockGlobalWorkspaceOrmManager.getRepository.mockResolvedValue(mockEvalRepository);

    mockEvalRepository.find.mockResolvedValue([
      { id: 'eval-1', notes: 'Initial notes' },
      { id: 'eval-2', notes: null },
    ]);
    mockEvalRepository.update.mockResolvedValue({});

    await service.markHumanReviewComplete(
      'candidacy-1',
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(mockEvalRepository.find).toHaveBeenCalledWith({
      where: { searchCandidacyId: 'candidacy-1' },
    });
    expect(mockEvalRepository.update).toHaveBeenCalledTimes(2);
    expect(mockEvalRepository.update).toHaveBeenCalledWith(
      'eval-1',
      expect.objectContaining({
        notes: expect.stringContaining('HUMAN REVIEWED'),
      }),
    );
  });

  it('should check umbrella flag before board matrix flag', async () => {
    mockFeatureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await expect(
      service.evaluateCandidate(
        { boardCompositionProfileId: 'any', searchCandidacyId: 'any' },
        mockWorkspaceId,
        mockAuthContext,
      ),
    ).rejects.toThrow(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );

    expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(1);
  });
});
