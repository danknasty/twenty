import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { OffLimitsRestrictionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/off-limits-restriction.workspace-entity';
import { SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';

import { SearchHealthAdvisoryService } from '../search-health-advisory.service';

describe('SearchHealthAdvisoryService', () => {
  let service: SearchHealthAdvisoryService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;
  let globalWorkspaceOrmManager: jest.Mocked<GlobalWorkspaceOrmManager>;

  const mockWorkspaceId = 'workspace-1';
  const mockAuthContext = { type: 'user' as const, workspaceMemberId: 'member-1' };

  beforeEach(async () => {
    featureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    aiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
    } as any;

    globalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest.fn(),
      getRepository: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchHealthAdvisoryService,
        {
          provide: FeatureFlagService,
          useValue: featureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: aiContextFirewallService,
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: globalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get<SearchHealthAdvisoryService>(
      SearchHealthAdvisoryService,
    );
  });

  describe('generateAdvisory', () => {
    const mockInput = {
      searchAssignmentId: 'assignment-1',
    };

    it('should throw when umbrella AI feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      await expect(
        service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        }),
      );
    });

    it('should throw when search health AI feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true)  // umbrella flag
        .mockResolvedValueOnce(false); // search health flag

      await expect(
        service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.generateAdvisory(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.SEARCH_HEALTH_AI_DISABLED,
        }),
      );
    });

    it('should throw when search assignment is not found', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const mockAssignmentRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      globalWorkspaceOrmManager.getRepository.mockResolvedValue(
        mockAssignmentRepo,
      );
      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

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
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const assignment: SearchAssignmentWorkspaceEntity = {
        id: 'assignment-1',
        name: 'CTO Search',
        status: 'ACTIVE' as any,
        startDate: new Date('2026-01-15'),
        targetCloseDate: new Date('2026-09-30'),
        clientCompanyId: 'company-1',
        createdBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
        updatedBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
      } as any;

      const candidacies: SearchCandidacyWorkspaceEntity[] = [
        {
          id: 'cand-1',
          status: 'ACTIVE' as any,
          currentStage: 'SCREENING',
          searchAssignmentId: 'assignment-1',
        } as any,
        {
          id: 'cand-2',
          status: 'ACTIVE' as any,
          currentStage: 'INTERVIEW',
          searchAssignmentId: 'assignment-1',
        } as any,
        {
          id: 'cand-3',
          status: 'ACTIVE' as any,
          currentStage: 'SOURCED',
          searchAssignmentId: 'assignment-1',
        } as any,
        {
          id: 'cand-4',
          status: 'CANCELLED' as any,
          currentStage: null,
          searchAssignmentId: 'assignment-1',
        } as any,
      ];

      const restrictions: OffLimitsRestrictionWorkspaceEntity[] = [
        {
          id: 'rest-1',
          status: 'ACTIVE' as any,
          clientName: 'Competitor Corp',
          clientCompanyId: 'company-1',
        } as any,
        {
          id: 'rest-2',
          status: 'ACTIVE' as any,
          clientName: 'Tech Rival Inc',
          clientCompanyId: 'company-1',
        } as any,
      ];

      const mockAssignmentRepo = {
        findOne: jest.fn().mockResolvedValue(assignment),
      };
      const mockCandidacyRepo = {
        find: jest.fn().mockResolvedValue(candidacies),
      };
      const mockOffLimitsRepo = {
        find: jest.fn().mockResolvedValue(restrictions),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockAssignmentRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockOffLimitsRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      const result = await service.generateAdvisory(
        mockInput,
        mockWorkspaceId,
        mockAuthContext,
      );

      // Verify structure
      expect(result.assignmentId).toBe('assignment-1');
      expect(result.assignmentName).toBe('CTO Search');
      expect(result.generatedAt).toBeInstanceOf(Date);

      // Verify advisory label
      expect(result.advisoryLabel).toContain('ADVISORY ONLY');

      // Pipeline velocity
      expect(result.pipelineVelocity.totalCandidates).toBe(4);
      expect(result.pipelineVelocity.activeCandidates).toBe(3);
      expect(result.pipelineVelocity.progressingToInterview).toBe(2);
      expect(typeof result.pipelineVelocity.velocityAssessment).toBe('string');

      // Candidate pool diversity
      expect(typeof result.candidatePoolDiversity.overallAssessment).toBe(
        'string',
      );
      expect(
        result.candidatePoolDiversity.overallAssessment,
      ).toContain('ADVISORY ONLY');
      expect(result.candidatePoolDiversity.dimensionNotes).toHaveLength(3);

      // Timeline risk
      expect(result.timelineRisk.targetCloseDate).toBe(
        '2026-09-30T00:00:00.000Z',
      );
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(result.timelineRisk.riskLevel);
      expect(result.timelineRisk.riskFactors.length).toBeGreaterThanOrEqual(0);

      // Off-limits exposure
      expect(result.offLimitsExposure.activeRestrictions).toBe(2);
      expect(result.offLimitsExposure.restrictedCompanies).toContain(
        'Competitor Corp',
      );
      expect(typeof result.offLimitsExposure.exposureAssessment).toBe('string');

      // Market coverage gaps
      expect(result.marketCoverageGaps.coverageGaps.length).toBeGreaterThanOrEqual(
        1,
      );
      expect(typeof result.marketCoverageGaps.coverageAssessment).toBe('string');
      expect(
        result.marketCoverageGaps.coverageAssessment,
      ).toContain('ADVISORY ONLY');
    });

    it('should produce LOW risk when pipeline is healthy', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const assignment: SearchAssignmentWorkspaceEntity = {
        id: 'assignment-2',
        name: 'Healthy Search',
        status: 'ACTIVE' as any,
        targetCloseDate: new Date('2026-12-31'),
        clientCompanyId: 'company-2',
        createdBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
        updatedBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
      } as any;

      // 10 active, progressing candidates = healthy pipeline
      const candidacies: SearchCandidacyWorkspaceEntity[] = [
        {
          id: 'c-1',
          status: 'ACTIVE' as any,
          currentStage: 'INTERVIEW',
        } as any,
        {
          id: 'c-2',
          status: 'ACTIVE' as any,
          currentStage: 'FINAL',
        } as any,
        {
          id: 'c-3',
          status: 'ACTIVE' as any,
          currentStage: 'SCREENING',
        } as any,
        {
          id: 'c-4',
          status: 'ACTIVE' as any,
          currentStage: 'INTERVIEW',
        } as any,
      ];

      const mockAssignmentRepo = {
        findOne: jest.fn().mockResolvedValue(assignment),
      };
      const mockCandidacyRepo = {
        find: jest.fn().mockResolvedValue(candidacies),
      };
      const mockOffLimitsRepo = {
        find: jest.fn().mockResolvedValue([]),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockAssignmentRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockOffLimitsRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      const result = await service.generateAdvisory(
        mockInput,
        mockWorkspaceId,
        mockAuthContext,
      );

      expect(result.pipelineVelocity.velocityAssessment).toContain('HEALTHY');
      expect(result.timelineRisk.riskLevel).toBe('LOW');
    });

    it('should call AI context firewall for input sanitization', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const assignment: SearchAssignmentWorkspaceEntity = {
        id: 'assignment-1',
        name: 'Test Assignment',
        status: 'ACTIVE' as any,
        createdBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
        updatedBy: { source: 'MANUAL' as any, workspaceMemberId: 'member-1' },
      } as any;

      const mockAssignmentRepo = {
        findOne: jest.fn().mockResolvedValue(assignment),
      };
      const mockCandidacyRepo = {
        find: jest.fn().mockResolvedValue([]),
      };
      const mockOffLimitsRepo = {
        find: jest.fn().mockResolvedValue([]),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockAssignmentRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockOffLimitsRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      await service.generateAdvisory(
        mockInput,
        mockWorkspaceId,
        mockAuthContext,
      );

      expect(
        aiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([
          'searchAssignmentId',
          'offLimitsRestriction.status',
        ]),
      );
    });
  });

  describe('feature flag checking order', () => {
    it('should check umbrella flag before search health flag', async () => {
      featureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(false) // umbrella flag returns false
        .mockResolvedValueOnce(true); // search health flag would return true

      await expect(
        service.generateAdvisory(
          { searchAssignmentId: 'any' },
          mockWorkspaceId,
          mockAuthContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        }),
      );

      // Should NOT have checked the search health flag
      expect(featureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(1);
    });
  });
});
