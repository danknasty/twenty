import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';
import { BoardMatrixEvaluationService } from 'src/modules/executive-search/services/ai/board-matrix-evaluation.service';
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
      .mockImplementation((fn: () => any, _authContext?: any) => fn());

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
      filterProhibited: jest
        .fn()
        .mockImplementation((fields: string[]) => fields),
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

describe('BoardMatrixEvaluationService', () => {
  let service: BoardMatrixEvaluationService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: any;
  let mockGlobalWorkspaceOrmManager: any;

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
      filterProhibited: jest
        .fn()
        .mockImplementation((fields: string[]) => fields),
    };

    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation((fn: any) => fn()),
      getRepository: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardMatrixEvaluationService,
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
          useValue: mockGlobalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get(BoardMatrixEvaluationService);
  });

  const mockInput = {
    boardCompositionProfileId: 'profile-1',
    searchCandidacyId: 'candidacy-1',
  };

  it('should throw when umbrella AI feature flag is disabled', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(
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
    ).rejects.toThrow(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );
  });

  it('should successfully evaluate a candidate against criteria', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const criteria = [
      {
        id: 'crit-1',
        name: 'Financial Expertise',
        category: 'FINANCIAL_EXPERTISE',
        weight: 0.4,
        description: 'CFO',
        isRequired: true,
        boardCompositionProfileId: 'profile-1',
      },
      {
        id: 'crit-2',
        name: 'Industry',
        category: 'INDUSTRY_KNOWLEDGE',
        weight: 0.6,
        description: 'SaaS',
        isRequired: true,
        boardCompositionProfileId: 'profile-1',
      },
    ];

    const mockProfileRepo = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: 'profile-1', name: 'Tech Board' }),
    };
    const mockCandidacyRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'candidacy-1' }),
    };
    const mockCriterionRepo = { find: jest.fn().mockResolvedValue(criteria) };
    const mockEvalRepo = {
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
    };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockProfileRepo)
      .mockResolvedValueOnce(mockCandidacyRepo)
      .mockResolvedValueOnce(mockCriterionRepo)
      .mockResolvedValueOnce(mockEvalRepo);

    const result = await service.evaluateCandidate(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(result.candidacyId).toBe('candidacy-1');
    expect(result.perCriterionEvaluations).toHaveLength(2);
    expect(result.requiresHumanReview).toBe(true);
  });

  it('should update evaluation records with human review timestamp', async () => {
    const mockEvalRepo = {
      find: jest.fn().mockResolvedValue([{ id: 'eval-1', notes: 'Test' }]),
      update: jest.fn().mockResolvedValue({}),
    };
    mockGlobalWorkspaceOrmManager.getRepository.mockResolvedValue(mockEvalRepo);

    await service.markHumanReviewComplete(
      'candidacy-1',
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(mockEvalRepo.update).toHaveBeenCalledTimes(1);
  });
});
