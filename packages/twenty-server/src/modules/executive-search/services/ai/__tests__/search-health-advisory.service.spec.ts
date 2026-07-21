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

describe('SearchHealthAdvisoryService', () => {
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
    mocks.globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation((fn: any) => fn());
    const { SearchHealthAdvisoryService: SHAS } = require('../search-health-advisory.service');
    service = new SHAS(
      mocks.globalWorkspaceOrmManager,
      mocks.featureFlagService,
      mocks.aiContextFirewallService,
    );
  });

  const mockInput = { searchAssignmentId: 'assignment-1' };

  it('should throw when umbrella AI feature flag is disabled', async () => {
    mocks.featureFlagService.isFeatureEnabled.mockResolvedValue(false);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);
  });

  it('should throw when search health AI feature flag is disabled', async () => {
    mocks.featureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);
  });

  it('should generate a complete advisory report', async () => {
    mocks.featureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const assignment = {
      id: 'assignment-1',
      name: 'CTO Search',
      status: 'ACTIVE',
      startDate: new Date('2026-01-15T00:00:00.000Z'),
      targetCloseDate: new Date('2026-09-30T00:00:00.000Z'),
      clientCompanyId: 'company-1',
      createdBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
      updatedBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
    };

    const candidacies = [
      { id: 'cand-1', status: 'ACTIVE', currentStage: 'SCREENING' },
      { id: 'cand-2', status: 'ACTIVE', currentStage: 'INTERVIEW' },
    ];

    const restrictions = [
      { id: 'rest-1', status: 'ACTIVE', clientName: 'Competitor Corp' },
    ];

    const mockAssignmentRepo = { findOne: jest.fn().mockResolvedValue(assignment) };
    const mockCandidacyRepo = { find: jest.fn().mockResolvedValue(candidacies) };
    const mockOffLimitsRepo = { find: jest.fn().mockResolvedValue(restrictions) };

    mocks.globalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockAssignmentRepo)
      .mockResolvedValueOnce(mockCandidacyRepo)
      .mockResolvedValueOnce(mockOffLimitsRepo);

    const result = await service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext);

    expect(result.assignmentId).toBe('assignment-1');
    expect(result.generatedAt).toBeInstanceOf(Date);
    expect(result.advisoryLabel).toContain('ADVISORY ONLY');
  });
});
