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

describe('SearchHealthAdvisoryService', () => {
  let service: any;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: any;
  let mockGlobalWorkspaceOrmManager: any;
  let mockAssignmentRepo: any;
  let mockCandidacyRepo: any;
  let mockOffLimitsRepo: any;

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

    const { SearchHealthAdvisoryService: SHAS } = require('../search-health-advisory.service');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SHAS,
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

    service = module.get(SHAS);
    mockGlobalWorkspaceOrmManager = module.get(GlobalWorkspaceOrmManager);
  });

  const mockInput = {
    searchAssignmentId: 'assignment-1',
  };

  it('should throw when umbrella AI feature flag is disabled', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );
  });

  it('should throw when search health AI feature flag is disabled', async () => {
    mockFeatureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
      }),
    );
  });

  it('should throw when search assignment is not found', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    mockAssignmentRepo = { findOne: jest.fn().mockResolvedValue(null) };
    mockGlobalWorkspaceOrmManager.getRepository.mockResolvedValue(mockAssignmentRepo);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrow(ExecutiveSearchException);

    await expect(
      service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
    ).rejects.toThrowError(
      expect.objectContaining({
        code: ExecutiveSearchExceptionCode.SEARCH_ASSIGNMENT_NOT_FOUND,
      }),
    );
  });

  it('should generate a complete advisory report with all sections', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

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
      { id: 'cand-1', status: 'ACTIVE', currentStage: 'SCREENING', searchAssignmentId: 'assignment-1' },
      { id: 'cand-2', status: 'ACTIVE', currentStage: 'INTERVIEW', searchAssignmentId: 'assignment-1' },
      { id: 'cand-3', status: 'ACTIVE', currentStage: 'SOURCED', searchAssignmentId: 'assignment-1' },
      { id: 'cand-4', status: 'CANCELLED', currentStage: null, searchAssignmentId: 'assignment-1' },
    ];

    const restrictions = [
      { id: 'rest-1', status: 'ACTIVE', clientName: 'Competitor Corp', clientCompanyId: 'company-1' },
      { id: 'rest-2', status: 'ACTIVE', clientName: 'Tech Rival Inc', clientCompanyId: 'company-1' },
    ];

    mockAssignmentRepo = { findOne: jest.fn().mockResolvedValue(assignment) };
    mockCandidacyRepo = { find: jest.fn().mockResolvedValue(candidacies) };
    mockOffLimitsRepo = { find: jest.fn().mockResolvedValue(restrictions) };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockAssignmentRepo)
      .mockResolvedValueOnce(mockCandidacyRepo)
      .mockResolvedValueOnce(mockOffLimitsRepo);

    const result = await service.generateAdvisory(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(result.assignmentId).toBe('assignment-1');
    expect(result.assignmentName).toBe('CTO Search');
    expect(result.generatedAt).toBeInstanceOf(Date);

    expect(result.advisoryLabel).toContain('ADVISORY ONLY');

    expect(result.pipelineVelocity.totalCandidates).toBe(4);
    expect(result.pipelineVelocity.activeCandidates).toBe(3);
    expect(result.pipelineVelocity.progressingToInterview).toBe(2);
    expect(typeof result.pipelineVelocity.velocityAssessment).toBe('string');

    expect(typeof result.candidatePoolDiversity.overallAssessment).toBe('string');
    expect(result.candidatePoolDiversity.overallAssessment).toContain('ADVISORY ONLY');
    expect(result.candidatePoolDiversity.dimensionNotes).toHaveLength(3);

    expect(result.timelineRisk.targetCloseDate).toBe('2026-09-30T00:00:00.000Z');
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(result.timelineRisk.riskLevel);
    expect(result.timelineRisk.riskFactors.length).toBeGreaterThanOrEqual(0);

    expect(result.offLimitsExposure.activeRestrictions).toBe(2);
    expect(result.offLimitsExposure.restrictedCompanies).toContain('Competitor Corp');
    expect(typeof result.offLimitsExposure.exposureAssessment).toBe('string');

    expect(result.marketCoverageGaps.coverageGaps.length).toBeGreaterThanOrEqual(1);
    expect(typeof result.marketCoverageGaps.coverageAssessment).toBe('string');
    expect(result.marketCoverageGaps.coverageAssessment).toContain('ADVISORY ONLY');
  });

  it('should produce LOW risk when pipeline is healthy', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const assignment = {
      id: 'assignment-2',
      name: 'Healthy Search',
      status: 'ACTIVE',
      targetCloseDate: new Date('2026-12-31T00:00:00.000Z'),
      clientCompanyId: 'company-2',
      createdBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
      updatedBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
    };

    const candidacies = [
      { id: 'c-1', status: 'ACTIVE', currentStage: 'INTERVIEW' },
      { id: 'c-2', status: 'ACTIVE', currentStage: 'FINAL' },
      { id: 'c-3', status: 'ACTIVE', currentStage: 'SCREENING' },
      { id: 'c-4', status: 'ACTIVE', currentStage: 'INTERVIEW' },
    ];

    mockAssignmentRepo = { findOne: jest.fn().mockResolvedValue(assignment) };
    mockCandidacyRepo = { find: jest.fn().mockResolvedValue(candidacies) };
    mockOffLimitsRepo = { find: jest.fn().mockResolvedValue([]) };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockAssignmentRepo)
      .mockResolvedValueOnce(mockCandidacyRepo)
      .mockResolvedValueOnce(mockOffLimitsRepo);

    const result = await service.generateAdvisory(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(result.pipelineVelocity.velocityAssessment).toContain('HEALTHY');
    expect(result.timelineRisk.riskLevel).toBe('LOW');
  });

  it('should call AI context firewall for input sanitization', async () => {
    mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

    const assignment = {
      id: 'assignment-1',
      name: 'Test Assignment',
      status: 'ACTIVE',
      createdBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
      updatedBy: { source: 'MANUAL', workspaceMemberId: 'member-1' },
    };

    mockAssignmentRepo = { findOne: jest.fn().mockResolvedValue(assignment) };
    mockCandidacyRepo = { find: jest.fn().mockResolvedValue([]) };
    mockOffLimitsRepo = { find: jest.fn().mockResolvedValue([]) };

    mockGlobalWorkspaceOrmManager.getRepository
      .mockResolvedValueOnce(mockAssignmentRepo)
      .mockResolvedValueOnce(mockCandidacyRepo)
      .mockResolvedValueOnce(mockOffLimitsRepo);

    await service.generateAdvisory(
      mockInput,
      mockWorkspaceId,
      mockAuthContext,
    );

    expect(
      mockAiContextFirewallService.assertAiContextAllowlistSafe,
    ).toHaveBeenCalledWith(
      expect.arrayContaining([
        'searchAssignmentId',
        'offLimitsRestriction.status',
      ]),
    );
  });

  it('should check umbrella flag before search health flag', async () => {
    mockFeatureFlagService.isFeatureEnabled
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await expect(
      service.generateAdvisory(
        { searchAssignmentId: 'any' },
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
