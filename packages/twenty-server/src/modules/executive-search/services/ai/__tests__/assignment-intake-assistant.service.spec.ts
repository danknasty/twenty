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
import { AssignmentIntakeAssistantService } from 'src/modules/executive-search/services/ai/assignment-intake-assistant.service';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

describe('AssignmentIntakeAssistantService', () => {
  let service: AssignmentIntakeAssistantService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;
  let draftingGateService: DraftingGateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentIntakeAssistantService,
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

    service = module.get<AssignmentIntakeAssistantService>(
      AssignmentIntakeAssistantService,
    );
    featureFlagService = module.get(FeatureFlagService);
    aiContextFirewallService = module.get(AiContextFirewallService);
    draftingGateService = module.get(DraftingGateService);
  });

  describe('draftIntake', () => {
    const mockInput = {
      notes: 'Client is looking for a CFO with 15+ years experience.',
      clientCompany: 'Acme Corp',
      roleTitle: 'Chief Financial Officer',
    };

    it('returns null when AI candidate feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draftIntake('workspace-1', mockInput);

      expect(result).toBeNull();
    });

    it('returns a labeled draft when feature flag is enabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftIntake('workspace-1', mockInput);

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
      expect(result!.content).toContain('Acme Corp');
      expect(result!.status).toBe(AiDraftStatus.PENDING_REVIEW);
    });

    it('sanitizes input through AI context firewall', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.draftIntake('workspace-1', mockInput);

      expect(aiContextFirewallService.filterProhibited).toHaveBeenCalled();
    });

    it('includes provenance metadata in the result', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftIntake(
        'workspace-1',
        mockInput,
        'assign-123',
      );

      expect(result!.provenance.capability).toBe('ASSIGNMENT_INTAKE');
      expect(result!.provenance.subject).toBe('Chief Financial Officer');
      expect(result!.provenance.assignmentId).toBe('assign-123');
      expect(result!.provenance.model).toBe('gpt-4');
      expect(result!.provenance.promptVersion).toBe('1.0.0');
      expect(result!.provenance.inputHashes).toHaveLength(1);
      expect(result!.provenance.guardrailChecks).toContain(
        'ai_context_firewall_passed',
      );
    });

    it('uses the draft label constant', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftIntake('workspace-1', mockInput);

      expect(result!.content).toContain(
        DraftingGateService.DRAFT_LABEL,
      );
    });

    it('handles empty notes gracefully', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftIntake('workspace-1', {
        notes: '',
      });

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
    });
  });
});
