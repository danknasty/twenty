import { Test, type TestingModule } from '@nestjs/testing';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { TargetCompanySuggestionService } from 'src/modules/executive-search/services/ai/target-company-suggestion.service';
import { PositionSpecificationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/position-specification.workspace-entity';
import { MarketMapWorkspaceEntity } from 'src/modules/executive-search/standard-objects/market-map.workspace-entity';
import { TargetCompanyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/target-company.workspace-entity';

// Mock FeatureFlagService to avoid importing the full engine dependency chain
jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => ({
  FeatureFlagService: jest.fn().mockImplementation(() => ({
    isFeatureEnabled: jest.fn(),
  })),
}));

// Mock GlobalWorkspaceOrmManager
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

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

describe('TargetCompanySuggestionService', () => {
  let service: TargetCompanySuggestionService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;
  let mockGlobalWorkspaceOrmManager: any;
  let mockPositionSpecRepo: any;
  let mockMarketMapRepo: any;
  let mockTargetCompanyRepo: any;

  const workspaceId = 'workspace-1';
  const positionSpecId = 'position-spec-1';
  const searchAssignmentId = 'assignment-1';

  const authContext = {
    type: 'user' as const,
    workspace: { id: workspaceId },
    workspaceMemberId: 'member-1',
    user: { id: 'user-1' } as any,
    userWorkspaceId: 'user-workspace-1',
    workspaceMember: { id: 'member-1' } as any,
  };

  beforeEach(async () => {
    mockFeatureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
      validateAiContextAllowlist: jest.fn(),
      filterProhibited: jest.fn(),
    } as any;

    mockPositionSpecRepo = {
      findOne: jest.fn(),
    };

    mockMarketMapRepo = {
      find: jest.fn(),
    };

    mockTargetCompanyRepo = {
      find: jest.fn(),
    };

    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation((fn: () => any) => fn()),
      getRepository: jest.fn().mockImplementation((_wsId, entity: any) => {
        if (entity === PositionSpecificationWorkspaceEntity) {
          return Promise.resolve(mockPositionSpecRepo);
        }
        if (entity === MarketMapWorkspaceEntity) {
          return Promise.resolve(mockMarketMapRepo);
        }
        if (entity === TargetCompanyWorkspaceEntity) {
          return Promise.resolve(mockTargetCompanyRepo);
        }
        return Promise.resolve({ find: jest.fn(), findOne: jest.fn() });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TargetCompanySuggestionService,
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

    service = module.get<TargetCompanySuggestionService>(
      TargetCompanySuggestionService,
    );
  });

  describe('suggestTargetCompanies', () => {
    it('returns isEnabled=false when feature flag is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.isEnabled).toBe(false);
      expect(result.suggestions).toEqual([]);
      expect(result.traceId).toBeTruthy();
    });

    it('returns suggestions from existing target companies', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const mockPositionSpec = {
        id: positionSpecId,
        name: 'VP of Engineering',
        requiredQualifications: '10+ years in SaaS',
        reportingLine: 'Reports to CTO',
      };

      const mockMarketMap = {
        id: 'market-map-1',
        name: 'SaaS Competitors',
      };

      const mockTargetCompanies = [
        {
          id: 'target-1',
          companyName: 'Acme SaaS Inc.',
          domain: 'acmesaas.com',
          industry: 'SaaS',
          tier: 'TARGET',
          attractiveness: 'HIGH',
          sizeBand: 'MID_MARKET',
          rationale: 'Strong engineering culture, likely to have VP Eng',
        },
        {
          id: 'target-2',
          companyName: 'TechCorp',
          domain: 'techcorp.io',
          industry: 'Enterprise Software',
          tier: 'SECONDARY',
          attractiveness: 'MEDIUM',
          sizeBand: 'LARGE',
          rationale: 'Expanding engineering team',
        },
      ];

      mockPositionSpecRepo.findOne.mockResolvedValue(mockPositionSpec);
      mockMarketMapRepo.find.mockResolvedValue([mockMarketMap]);
      mockTargetCompanyRepo.find.mockResolvedValue(mockTargetCompanies);

      const result = await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.isEnabled).toBe(true);
      expect(result.suggestions).toHaveLength(2);
      expect(result.positionSpecificationId).toBe(positionSpecId);
      expect(result.searchAssignmentId).toBe(searchAssignmentId);
      expect(result.traceId).toMatch(/^tgt-sug-/);

      // First suggestion should be TARGET tier
      expect(result.suggestions[0].tier).toBe('TARGET');
      expect(result.suggestions[0].companyName).toBe('Acme SaaS Inc.');
      expect(result.suggestions[0].industry).toBe('SaaS');
      expect(result.suggestions[0].confidence).toBe(0.85);

      // Second suggestion should be SECONDARY tier
      expect(result.suggestions[1].tier).toBe('SECONDARY');
      expect(result.suggestions[1].confidence).toBe(0.6);

      // Should have rationale
      expect(result.suggestions[0].rationale.length).toBeGreaterThan(0);
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.summary).toContain('Found 2 target companies');
    });

    it('returns empty suggestions when no market maps exist', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const mockPositionSpec = {
        id: positionSpecId,
        name: 'CFO',
      };

      mockPositionSpecRepo.findOne.mockResolvedValue(mockPositionSpec);
      mockMarketMapRepo.find.mockResolvedValue([]);

      const result = await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.suggestions).toHaveLength(0);
      expect(result.summary).toContain('No target companies found');
    });

    it('throws when position specification is not found', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      mockPositionSpecRepo.findOne.mockResolvedValue(null);

      await expect(
        service.suggestTargetCompanies(
          positionSpecId,
          searchAssignmentId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow();
    });

    it('calls AiContextFirewallService for input sanitization', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const mockPositionSpec = {
        id: positionSpecId,
        name: 'Test',
      };

      mockPositionSpecRepo.findOne.mockResolvedValue(mockPositionSpec);
      mockMarketMapRepo.find.mockResolvedValue([]);

      await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([
          'name',
          'keyResponsibilities',
          'requiredQualifications',
        ]),
      );
    });

    it('generates unique trace IDs', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result1 = await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );
      const result2 = await service.suggestTargetCompanies(
        positionSpecId,
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result1.traceId).not.toBe(result2.traceId);
    });
  });
});
