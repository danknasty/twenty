import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';

jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => {
  return {
    FeatureFlagService: jest.fn().mockImplementation(() => ({
      isFeatureEnabled: jest.fn(),
    })),
  };
});

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { DraftingGateService } from 'src/modules/executive-search/services/ai/drafting-gate.service';
import { ResearchStrategyDraftService } from 'src/modules/executive-search/services/ai/research-strategy-draft.service';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

describe('ResearchStrategyDraftService', () => {
  let service: ResearchStrategyDraftService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchStrategyDraftService,
        {
          provide: FeatureFlagService,
          useValue: {
            isFeatureEnabled: jest.fn(),
          },
        },
        {
          provide: AiContextFirewallService,
          useValue: {
            filterProhibited: jest.fn().mockImplementation((fields) => fields),
            validateAiContextAllowlist: jest.fn().mockReturnValue([]),
            assertAiContextAllowlistSafe: jest.fn(),
          },
        },
        DraftingGateService,
      ],
    }).compile();

    service = module.get<ResearchStrategyDraftService>(
      ResearchStrategyDraftService,
    );
    featureFlagService = module.get(FeatureFlagService);
    aiContextFirewallService = module.get(AiContextFirewallService);
  });

  describe('draftResearchStrategy', () => {
    const mockInput = {
      roleTitle: 'VP of Engineering',
      targetIndustry: 'Enterprise SaaS',
      targetGeography: 'North America',
      keySkills: [
        'Engineering leadership',
        'Platform architecture',
        'Agile methodology',
      ],
      targetCompanies: [
        'Snowflake',
        'Databricks',
        'Confluent',
      ],
      companySizeBand: '$500M-$2B revenue',
    };

    it('returns null when AI candidate feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draftResearchStrategy(
        'workspace-1',
        mockInput,
      );

      expect(result).toBeNull();
    });

    it('returns a labeled draft when feature flag is enabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftResearchStrategy(
        'workspace-1',
        mockInput,
      );

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
      expect(result!.content).toContain('VP of Engineering');
      expect(result!.content).toContain('Enterprise SaaS');
      expect(result!.status).toBe(AiDraftStatus.PENDING_REVIEW);
    });

    it('includes provenance metadata', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftResearchStrategy(
        'workspace-1',
        mockInput,
        'assign-789',
      );

      expect(result!.provenance.capability).toBe('RESEARCH_STRATEGY');
      expect(result!.provenance.subject).toBe('VP of Engineering');
      expect(result!.provenance.assignmentId).toBe('assign-789');
      expect(result!.provenance.model).toBe('gpt-4');
      expect(result!.provenance.promptVersion).toBe('1.0.0');
    });

    it('includes target companies as input refs', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftResearchStrategy(
        'workspace-1',
        mockInput,
      );

      expect(result!.provenance.inputRefs).toContain('Snowflake');
      expect(result!.provenance.inputRefs).toContain('Databricks');
    });

    it('sanitizes input through AI context firewall', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.draftResearchStrategy('workspace-1', mockInput);

      expect(aiContextFirewallService.filterProhibited).toHaveBeenCalled();
    });

    it('generates structured research strategy content', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftResearchStrategy(
        'workspace-1',
        mockInput,
      );

      expect(result!.content).toContain('Research Strategy Draft');
      expect(result!.content).toContain('Target Industry');
      expect(result!.content).toContain('Sourcing Approach');
    });
  });
});
