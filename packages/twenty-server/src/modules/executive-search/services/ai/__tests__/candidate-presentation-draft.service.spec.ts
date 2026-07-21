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
import { CandidatePresentationDraftService } from 'src/modules/executive-search/services/ai/candidate-presentation-draft.service';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

describe('CandidatePresentationDraftService', () => {
  let service: CandidatePresentationDraftService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatePresentationDraftService,
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

    service = module.get<CandidatePresentationDraftService>(
      CandidatePresentationDraftService,
    );
    featureFlagService = module.get(FeatureFlagService);
    aiContextFirewallService = module.get(AiContextFirewallService);
  });

  describe('draftPresentation', () => {
    const mockInput = {
      candidateName: 'Jane Smith',
      currentRole: 'CFO',
      currentCompany: 'MegaCorp Inc',
      backgroundSummary:
        'Jane has 20+ years of financial leadership experience...',
      strengths: [
        'Strategic financial planning',
        'M&A integration experience',
        'Board-level communication',
      ],
      yearsOfExperience: 20,
      education: 'MBA, Harvard Business School',
      achievements: [
        'Led $2B IPO process',
        'Reduced operational costs by 30%',
      ],
      fitRationale:
        "Jane's experience scaling high-growth companies aligns perfectly...",
      compensationNotes: 'Expects $400k-$500k base + equity',
    };

    it('throws when client consent is not obtained', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await expect(
        service.draftPresentation('workspace-1', mockInput, false),
      ).rejects.toThrow('Client consent is required');
    });

    it('returns null when AI candidate feature flag is disabled (with consent)', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
      );

      expect(result).toBeNull();
    });

    it('returns a labeled draft when consent obtained and flag enabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
      );

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
      expect(result!.content).toContain('Jane Smith');
      expect(result!.content).toContain('MegaCorp Inc');
      expect(result!.status).toBe(AiDraftStatus.PENDING_REVIEW);
    });

    it('includes provenance metadata', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
        'assign-202',
      );

      expect(result!.provenance.capability).toBe('CANDIDATE_PRESENTATION');
      expect(result!.provenance.subject).toBe('Jane Smith');
      expect(result!.provenance.assignmentId).toBe('assign-202');
      expect(result!.provenance.model).toBe('gpt-4');
      expect(result!.provenance.promptVersion).toBe('1.0.0');
    });

    it('includes client consent in guardrail checks', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
      );

      expect(result!.provenance.guardrailChecks).toContain(
        'client_consent_obtained',
      );
    });

    it('sets visibility to client_facing', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
      );

      expect(result!.provenance.visibility).toBe('client_facing');
    });

    it('sanitizes input through AI context firewall', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.draftPresentation('workspace-1', mockInput, true);

      expect(aiContextFirewallService.filterProhibited).toHaveBeenCalled();
    });

    it('includes strengths, achievements, and fit rationale in output', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftPresentation(
        'workspace-1',
        mockInput,
        true,
      );

      expect(result!.content).toContain('Candidate Presentation Draft');
      expect(result!.content).toContain('Background Summary');
      expect(result!.content).toContain('Key Strengths');
      expect(result!.content).toContain('Fit Rationale');
      expect(result!.content).toContain('Strategic financial planning');
      expect(result!.content).toContain('Led $2B IPO process');
    });
  });
});
