import { Test, type TestingModule } from '@nestjs/testing';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { NaturalLanguageSearchFilterService } from 'src/modules/executive-search/services/ai/natural-language-search-filter.service';

// Mock FeatureFlagService to avoid importing the full engine dependency chain
jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => ({
  FeatureFlagService: jest.fn().mockImplementation(() => ({
    isFeatureEnabled: jest.fn(),
  })),
}));

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';

describe('NaturalLanguageSearchFilterService', () => {
  let service: NaturalLanguageSearchFilterService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  const workspaceId = 'workspace-1';

  beforeEach(async () => {
    mockFeatureFlagService = new FeatureFlagService() as jest.Mocked<FeatureFlagService>;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
      validateAiContextAllowlist: jest.fn(),
      filterProhibited: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NaturalLanguageSearchFilterService,
        {
          provide: FeatureFlagService,
          useValue: mockFeatureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: mockAiContextFirewallService,
        },
      ],
    }).compile();

    service = module.get<NaturalLanguageSearchFilterService>(
      NaturalLanguageSearchFilterService,
    );
  });

  describe('parseQuery', () => {
    it('returns isEnabled=false when feature flag is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.parseQuery('SaaS CFO', workspaceId);

      expect(result.isEnabled).toBe(false);
      expect(result.criteria).toEqual([]);
      expect(result.traceId).toBeTruthy();
      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).not.toHaveBeenCalled();
    });

    it('returns structured criteria for "SaaS CFOs who have taken companies public"', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'SaaS CFOs who have taken companies public',
        workspaceId,
      );

      expect(result.isEnabled).toBe(true);
      expect(result.originalQuery).toBe(
        'SaaS CFOs who have taken companies public',
      );
      expect(result.traceId).toMatch(/^nl-search-/);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.criteria.length).toBeGreaterThanOrEqual(2);

      // Should detect CFO title
      expect(
        result.criteria.some(
          (c) => c.field === 'currentTitle' && c.operator === 'contains' && c.value === 'CFO',
        ),
      ).toBe(true);

      // Should detect SaaS industry
      expect(
        result.criteria.some(
          (c) =>
            c.field === 'careerExperiences.industry' &&
            c.operator === 'contains' &&
            c.value === 'SaaS',
        ),
      ).toBe(true);

      // Should detect IPO / public offering experience
      expect(
        result.criteria.some(
          (c) =>
            c.field === 'capabilities.name' &&
            c.operator === 'contains' &&
            c.value === 'IPO',
        ),
      ).toBe(true);

      // Should have a human-readable explanation
      expect(result.explanation.length).toBeGreaterThan(0);
      expect(result.explanation).toContain('Your search');
    });

    it('parses CEO role query correctly', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'show me FinTech CEOs',
        workspaceId,
      );

      // Should detect CEO
      expect(
        result.criteria.some(
          (c) =>
            c.field === 'currentTitle' &&
            c.operator === 'contains' &&
            c.value === 'CEO',
        ),
      ).toBe(true);

      // Should detect FinTech industry
      expect(
        result.criteria.some(
          (c) =>
            c.field === 'careerExperiences.industry' &&
            c.operator === 'contains' &&
            c.value === 'FinTech',
        ),
      ).toBe(true);

      expect(result.confidence).toBeGreaterThan(0);
    });

    it('parses board director query', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'board members with international experience',
        workspaceId,
      );

      expect(
        result.criteria.some(
          (c) =>
            c.field === 'currentTitle' &&
            c.operator === 'contains' &&
            c.value === 'Board Director',
        ),
      ).toBe(true);

      expect(
        result.criteria.some(
          (c) =>
            c.field === 'capabilities.name' &&
            c.operator === 'contains' &&
            c.value === 'Global Operations',
        ),
      ).toBe(true);
    });

    it('parses experience level query', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.parseQuery(
        'CTOs with 10+ years of experience',
        workspaceId,
      );

      expect(
        result.criteria.some(
          (c) =>
            c.field === 'currentTitle' &&
            c.operator === 'contains' &&
            c.value === 'CTO',
        ),
      ).toBe(true);

      expect(
        result.criteria.some(
          (c) =>
            c.field === 'yearsOfExperience' &&
            c.operator === 'gte' &&
            c.value === 10,
        ),
      ).toBe(true);
    });

    it('returns empty criteria for unrecognizable query', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.parseQuery('xyzzy', workspaceId);

      expect(result.criteria).toEqual([]);
      expect(result.confidence).toBe(0);
      expect(result.explanation).toContain(
        'did not produce any structured search filters',
      );
    });

    it('calls AiContextFirewallService.assertAiContextAllowlistSafe when enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.parseQuery('SaaS CFO', workspaceId);

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalledWith(
        expect.arrayContaining(['currentTitle', 'careerExperiences.industry']),
      );
    });

    it('generates unique trace IDs across invocations', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result1 = await service.parseQuery('SaaS CFO', workspaceId);
      const result2 = await service.parseQuery('AI CTO', workspaceId);

      expect(result1.traceId).not.toBe(result2.traceId);
    });
  });
});
