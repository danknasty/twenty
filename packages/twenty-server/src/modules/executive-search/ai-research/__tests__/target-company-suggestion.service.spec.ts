import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { AiResearchKillSwitchService } from 'src/modules/executive-search/ai-research/services/ai-research-kill-switch.service';
import { TargetCompanySuggestionService } from 'src/modules/executive-search/ai-research/services/target-company-suggestion.service';

describe('TargetCompanySuggestionService', () => {
  let service: TargetCompanySuggestionService;
  let mockKillSwitchService: jest.Mocked<AiResearchKillSwitchService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  const workspaceId = 'test-workspace-id';
  const positionSpecId = 'pos-spec-1';
  const marketMapId = 'market-map-1';

  beforeEach(() => {
    mockKillSwitchService = {
      isCapabilityEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
    } as any;

    service = new TargetCompanySuggestionService(
      mockKillSwitchService,
      mockAiContextFirewallService,
    );
  });

  describe('generateSuggestions', () => {
    it('returns null when kill switch disables the capability', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(false);

      const result = await service.generateSuggestions(
        positionSpecId,
        'Looking for a CTO for our SaaS startup',
        marketMapId,
        workspaceId,
      );

      expect(result).toBeNull();
      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).not.toHaveBeenCalled();
    });

    it('generates suggestions from a tech / SaaS position spec', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.generateSuggestions(
        positionSpecId,
        'We need a CEO for our enterprise SaaS company based in the United States',
        marketMapId,
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.positionSpecId).toBe(positionSpecId);
      expect(result!.marketMapId).toBe(marketMapId);
      expect(result!.suggestions.length).toBeGreaterThan(0);
      expect(result!.methodology).toBeTruthy();
      expect(result!.caveats.length).toBeGreaterThan(0);
    });

    it('generates suggestions without a market map (marketMapId is null)', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.generateSuggestions(
        positionSpecId,
        'Seeking a CFO for a fintech growth company',
        null,
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.marketMapId).toBeNull();
      expect(result!.suggestions.length).toBeGreaterThan(0);
    });

    it('generates industry-specific suggestions', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.generateSuggestions(
        positionSpecId,
        'Looking for a COO in healthcare',
        marketMapId,
        workspaceId,
      );

      expect(result).not.toBeNull();

      // Should find healthcare industry
      const healthcareSuggestions = result!.suggestions.filter(
        (s) =>
          s.industry &&
          s.industry.toLowerCase().includes('healthcare'),
      );
      expect(healthcareSuggestions.length).toBeGreaterThan(0);
    });

    it('generates scale-specific suggestions', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.generateSuggestions(
        positionSpecId,
        'Looking for a CTO for a Series B startup',
        marketMapId,
        workspaceId,
      );

      expect(result).not.toBeNull();

      // Should find growth stage suggestions
      const growthSuggestions = result!.suggestions.filter(
        (s) =>
          s.rationale &&
          (s.rationale.toLowerCase().includes('growth') ||
            s.rationale.toLowerCase().includes('stage')),
      );
      expect(growthSuggestions.length).toBeGreaterThan(0);
    });

    it('deduplicates suggestions by company name', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.generateSuggestions(
        positionSpecId,
        'CEO for technology company in the technology sector',
        marketMapId,
        workspaceId,
      );

      expect(result).not.toBeNull();
      const names = result!.suggestions.map((s) => s.companyName);

      expect(new Set(names).size).toBe(names.length);
    });

    it('validates allowlist against AI context firewall', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      await service.generateSuggestions(
        positionSpecId,
        'CEO for SaaS company',
        marketMapId,
        workspaceId,
      );

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalled();
    });
  });
});
