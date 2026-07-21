import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { AiResearchKillSwitchService } from 'src/modules/executive-search/ai-research/services/ai-research-kill-switch.service';
import { NaturalLanguageSearchFilterService } from 'src/modules/executive-search/ai-research/services/natural-language-search-filter.service';

describe('NaturalLanguageSearchFilterService', () => {
  let service: NaturalLanguageSearchFilterService;
  let mockKillSwitchService: jest.Mocked<AiResearchKillSwitchService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    mockKillSwitchService = {
      isCapabilityEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
    } as any;

    service = new NaturalLanguageSearchFilterService(
      mockKillSwitchService,
      mockAiContextFirewallService,
    );
  });

  describe('parseQuery', () => {
    it('parses a CEO title query into filters', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'Find CEOs in the technology sector',
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.naturalLanguageQuery).toBe(
        'Find CEOs in the technology sector',
      );
      expect(result!.filters.length).toBeGreaterThan(0);

      const ceoFilter = result!.filters.find(
        (f) => f.field === 'currentTitle' && f.operator === 'contains',
      );
      expect(ceoFilter).toBeDefined();
      expect(ceoFilter!.value).toMatch(/ceo/i);

      const industryFilter = result!.filters.find(
        (f) => f.field === 'industry',
      );
      expect(industryFilter).toBeDefined();
      expect(industryFilter!.value).toMatch(/tech/i);
    });

    it('returns null when kill switch disables the capability', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(false);

      const result = await service.parseQuery(
        'Find CFOs in healthcare',
        workspaceId,
      );

      expect(result).toBeNull();
      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).not.toHaveBeenCalled();
    });

    it('detects location filters from NL query', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'Find VPs based in San Francisco',
        workspaceId,
      );

      expect(result).not.toBeNull();
      const locationFilter = result!.filters.find(
        (f) => f.field === 'location' || f.field === 'headquartersLocation',
      );
      expect(locationFilter).toBeDefined();
      expect(locationFilter!.value).toContain('San Francisco');
    });

    it('detects tier filters', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'Tier 1 target companies',
        workspaceId,
      );

      expect(result).not.toBeNull();
      const tierFilter = result!.filters.find((f) => f.field === 'tier');
      expect(tierFilter).toBeDefined();
      expect(tierFilter!.value).toBe('TIER_1');
    });

    it('detects fit score thresholds', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'candidates with fit score >= 80',
        workspaceId,
      );

      expect(result).not.toBeNull();
      const scoreFilter = result!.filters.find(
        (f) => f.field === 'fitScore',
      );
      expect(scoreFilter).toBeDefined();
      expect(scoreFilter!.operator).toBe('gte');
      expect(scoreFilter!.value).toBe(80);
    });

    it('returns empty filters for unrecognisable query with explanation', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery('random text', workspaceId);

      expect(result).not.toBeNull();
      expect(result!.filters).toHaveLength(0);
      expect(result!.explanation).toContain('No structured filters');
    });

    it('validates allowlist against AI context firewall', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      await service.parseQuery('Find CTOs', workspaceId);

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalled();
    });

    it('parses company-followed-by-name pattern', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'Find directors at Google in fintech',
        workspaceId,
      );

      expect(result).not.toBeNull();
      const companyFilter = result!.filters.find(
        (f) => f.field === 'currentCompany',
      );
      expect(companyFilter).toBeDefined();
      expect(companyFilter!.value).toContain('Google');
    });
  });
});
