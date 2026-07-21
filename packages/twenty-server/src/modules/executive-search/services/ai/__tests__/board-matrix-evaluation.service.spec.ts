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

jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => {
    const mockExecuteInWorkspaceContext = jest
      .fn()
      .mockImplementation((fn: () => any) => fn());
    return {
      GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
        executeInWorkspaceContext: mockExecuteInWorkspaceContext,
        getRepository: jest.fn(),
      })),
    };
  },
);

jest.mock(
  'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service',
  () => ({
    AiContextFirewallService: jest.fn().mockImplementation(() => ({
      validateAiContextAllowlist: jest.fn().mockReturnValue([]),
      assertAiContextAllowlistSafe: jest.fn(),
      filterProhibited: jest.fn((fields: string[]) => fields),
    })),
  }),
);

jest.mock(
  'src/engine/core-modules/feature-flag/services/feature-flag.service',
  () => ({
    FeatureFlagService: jest.fn().mockImplementation(() => ({
      isFeatureEnabled: jest.fn(),
    })),
  }),
);

let ExecutiveSearchException: any;
let ExecutiveSearchExceptionCode: any;

describe('BoardMatrixEvaluationService', () => {
  let service: any;
  const mocks: any = {};

  const mockWorkspaceId = 'workspace-1';
  const mockAuthContext: any = {
    workspace: { id: 'workspace-1' },
    type: 'user',
    workspaceMemberId: 'member-1',
  };

  beforeAll(() => {
    const excModule = require('src/modules/executive-search/exceptions/executive-search.exception');
    ExecutiveSearchException = excModule.ExecutiveSearchException;
    ExecutiveSearchExceptionCode = excModule.ExecutiveSearchExceptionCode;

    mocks.featureFlagService = { isFeatureEnabled: jest.fn() };
    mocks.aiContextFirewallService = {
      validateAiContextAllowlist: jest.fn().mockReturnValue([]),
      assertAiContextAllowlistSafe: jest.fn(),
      filterProhibited: jest.fn((fields: string[]) => fields),
    };
    mocks.globalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest.fn((fn: any) => fn()),
      getRepository: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mocks.globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
      (fn: any) => fn(),
    );
    const {
      BoardMatrixEvaluationService: BMES,
    } = require('../board-matrix-evaluation.service');
    service = new BMES(
      mocks.globalWorkspaceOrmManager,
      mocks.featureFlagService,
      mocks.aiContextFirewallService,
    );
  });

  const mockInput = {
    boardCompositionProfileId: 'profile-1',
    searchCandidacyId: 'candidacy-1',
  };

  it('should throw when umbrella AI feature flag is disabled', async () => {
    mocks.featureFlagService.isFeatureEnabled.mockResolvedValue(false);

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
    mocks.featureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);
  });

  it('should successfully evaluate a candidate against criteria', async () => {
    mocks.featureFlagService.isFeatureEnabled.mockResolvedValue(true);

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

    mocks.globalWorkspaceOrmManager.getRepository
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
    mocks.globalWorkspaceOrmManager.getRepository.mockResolvedValue(
      mockEvalRepo,
    );

    await service.markHumanReviewComplete(
      'candidacy-1',
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(mockEvalRepo.update).toHaveBeenCalledTimes(1);
  });
});
