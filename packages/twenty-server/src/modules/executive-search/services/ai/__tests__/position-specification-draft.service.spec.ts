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
import { PositionSpecificationDraftService } from 'src/modules/executive-search/services/ai/position-specification-draft.service';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

describe('PositionSpecificationDraftService', () => {
  let service: PositionSpecificationDraftService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionSpecificationDraftService,
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

    service = module.get<PositionSpecificationDraftService>(
      PositionSpecificationDraftService,
    );
    featureFlagService = module.get(FeatureFlagService);
    aiContextFirewallService = module.get(AiContextFirewallService);
  });

  describe('draftPositionSpec', () => {
    const mockInput = {
      roleTitle: 'Chief Technology Officer',
      clientCompany: 'TechCorp',
      requirements: [
        '10+ years in software engineering leadership',
        'Experience with cloud-native architectures',
      ],
      qualifications: [
        'MS in Computer Science preferred',
        'Previous CTO experience at Series B+ companies',
      ],
      compensation: '$300k-$400k + equity',
      reportingStructure: 'Reports to CEO',
    };

    it('returns null when AI candidate feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draftPositionSpec(
        'workspace-1',
        mockInput,
      );

      expect(result).toBeNull();
    });

    it('returns a labeled draft when feature flag is enabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPositionSpec(
        'workspace-1',
        mockInput,
      );

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
      expect(result!.content).toContain('Chief Technology Officer');
      expect(result!.content).toContain('TechCorp');
      expect(result!.status).toBe(AiDraftStatus.PENDING_REVIEW);
    });

    it('includes provenance metadata', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPositionSpec(
        'workspace-1',
        mockInput,
        'assign-456',
      );

      expect(result!.provenance.capability).toBe('POSITION_SPEC');
      expect(result!.provenance.subject).toBe('Chief Technology Officer');
      expect(result!.provenance.assignmentId).toBe('assign-456');
      expect(result!.provenance.model).toBe('gpt-4');
      expect(result!.provenance.promptVersion).toBe('1.0.0');
    });

    it('sanitizes input through AI context firewall', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.draftPositionSpec('workspace-1', mockInput);

      expect(aiContextFirewallService.filterProhibited).toHaveBeenCalled();
    });

    it('generates structured position spec content', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPositionSpec(
        'workspace-1',
        mockInput,
      );

      expect(result!.content).toContain('Position Specification Draft');
      expect(result!.content).toContain('Requirements');
      expect(result!.content).toContain('Qualifications');
      expect(result!.content).toContain('10+ years in software engineering');
    });
  });
});
