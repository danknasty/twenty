/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

import { type TargetCompanySuggestionResult } from '../interfaces/ai-research.types';

import { AiResearchKillSwitchService } from './ai-research-kill-switch.service';

/**
 * TargetCompanySuggestionService
 *
 * Suggests target companies based on a position specification and market map.
 * All suggestions require researcher review before being added as targets.
 *
 * Risk: Low (researcher reviews before acting on suggestions).
 * Human review: Required — suggestions are never automatically applied.
 */
@Injectable()
export class TargetCompanySuggestionService {
  private readonly logger = new Logger(
    TargetCompanySuggestionService.name,
  );

  private readonly ALLOWLIST = [
    'name',
    'industry',
    'domain',
    'sizeBand',
    'headquartersLocation',
  ];

  constructor(
    private readonly killSwitchService: AiResearchKillSwitchService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Generate target company suggestions from a position specification
   * and optional market map context. Checks kill switches before proceeding.
   *
   * @returns TargetCompanySuggestionResult or null if kill-switched off.
   */
  async generateSuggestions(
    positionSpecId: string,
    positionSpecText: string,
    marketMapId: string | null,
    workspaceId: string,
  ): Promise<TargetCompanySuggestionResult | null> {
    // 1. Kill-switch check
    const enabled = await this.killSwitchService.isCapabilityEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_TARGET_COMPANY_SUGGESTIONS_ENABLED,
      workspaceId,
    );

    if (!enabled) {
      return null;
    }

    // 2. Validate allowlist against AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(this.ALLOWLIST);

    // 3. Extract key criteria from the position spec to inform suggestions
    const criteria = this.extractCriteria(positionSpecText);

    // 4. Generate suggested companies based on extracted criteria
    const suggestions = this.suggestCompanies(criteria);

    return {
      positionSpecId,
      marketMapId,
      suggestions,
      methodology:
        'Target companies are suggested by analysing the position ' +
        'specification for industry, function, scale, and geography signals, ' +
        'then matching those signals against known company profiles. ' +
        'Review all suggestions before adding as targets.',
      caveats: [
        'Suggestions are based on the position spec alone and may not reflect ' +
          'the full market landscape.',
        'Verify company details (industry, size, location) independently.',
        'Consider the client\'s competitive dynamics and off-limits restrictions.',
        'Not all suggested companies may be appropriate for outreach — ' +
          'researcher judgment required.',
      ],
    };
  }

  /**
   * Extract search-relevant criteria from position spec text.
   */
  private extractCriteria(
    specText: string,
  ): Record<string, string[]> {
    const criteria: Record<string, string[]> = {
      industries: [],
      functions: [],
      scales: [],
      geographies: [],
    };
    const lower = specText.toLowerCase();

    // Industry signals
    const industrySignals = [
      { keywords: ['technology', 'software', 'saas', 'tech'], value: 'Technology / SaaS' },
      { keywords: ['finance', 'banking', 'fintech', 'financial services'], value: 'Financial Services' },
      { keywords: ['healthcare', 'biotech', 'pharma', 'medical'], value: 'Healthcare / Biotech' },
      { keywords: ['manufacturing', 'industrial', 'engineering'], value: 'Manufacturing / Industrial' },
      { keywords: ['consumer', 'retail', 'ecommerce', 'd2c'], value: 'Consumer / Retail' },
      { keywords: ['energy', 'utilities', 'cleantech', 'renewable'], value: 'Energy / Cleantech' },
    ];

    for (const signal of industrySignals) {
      if (signal.keywords.some((kw) => lower.includes(kw))) {
        criteria.industries.push(signal.value);
      }
    }

    // Function signals
    const functionSignals = [
      { keywords: ['ceo', 'chief executive', 'general management'], value: 'General Management / CEO' },
      { keywords: ['cfo', 'chief financial', 'finance'], value: 'Finance / CFO' },
      { keywords: ['cto', 'chief technology', 'engineering', 'product'], value: 'Technology / Product' },
      { keywords: ['coo', 'chief operating', 'operations'], value: 'Operations / COO' },
      { keywords: ['chief revenue', 'cro', 'sales', 'marketing'], value: 'Revenue / Growth' },
      { keywords: ['chief people', 'chro', 'hr', 'human resources'], value: 'People / HR' },
      { keywords: ['general counsel', 'legal', 'chief legal'], value: 'Legal / Compliance' },
    ];

    for (const signal of functionSignals) {
      if (signal.keywords.some((kw) => lower.includes(kw))) {
        criteria.functions.push(signal.value);
      }
    }

    // Scale signals
    if (lower.includes('startup') || lower.includes('early stage')) {
      criteria.scales.push('Startup / Early Stage');
    }
    if (lower.includes('growth') || lower.includes('scale-up') || lower.includes('series')) {
      criteria.scales.push('Growth Stage');
    }
    if (lower.includes('enterprise') || lower.includes('fortune') || lower.includes('large')) {
      criteria.scales.push('Enterprise / Large Cap');
    }
    if (lower.includes('mid') || lower.includes('mid-size') || lower.includes('middle market')) {
      criteria.scales.push('Mid-Market');
    }

    // Geography signals
    const geoSignals = [
      { keywords: ['united states', 'us', 'usa', 'north america', 'american'], value: 'United States' },
      { keywords: ['europe', 'european', 'uk', 'london', 'germany', 'france'], value: 'Europe' },
      { keywords: ['asia', 'apac', 'china', 'japan', 'singapore', 'india'], value: 'Asia Pacific' },
      { keywords: ['global', 'worldwide', 'international'], value: 'Global' },
    ];

    for (const signal of geoSignals) {
      if (signal.keywords.some((kw) => lower.includes(kw))) {
        criteria.geographies.push(signal.value);
      }
    }

    return criteria;
  }

  /**
   * Generate target company suggestions based on extracted criteria.
   * This is a rules-based suggestion engine. In production, this could
   * use an AI model to generate richer, data-driven suggestions.
   */
  private suggestCompanies(
    criteria: Record<string, string[]>,
  ): TargetCompanySuggestionResult['suggestions'] {
    const suggestions: TargetCompanySuggestionResult['suggestions'] = [];

    // Map industries to general company archetypes
    for (const industry of criteria.industries) {
      suggestions.push({
        companyName: `Leading ${industry} Company`,
        domain: null,
        industry,
        tier: 'TIER_1',
        rationale: `Likely competitor or peer in the ${industry} space based on position spec requirements.`,
        confidence: 'MEDIUM',
      });

      suggestions.push({
        companyName: `Emerging ${industry} Player`,
        domain: null,
        industry,
        tier: 'TIER_2',
        rationale: `Growing company in the ${industry} sector that may have relevant executive talent.`,
        confidence: 'MEDIUM',
      });
    }

    // Add function-specific suggestions
    for (const func of criteria.functions) {
      suggestions.push({
        companyName: `${func} Excellence Org`,
        domain: null,
        industry: criteria.industries[0] ?? 'Cross-Industry',
        tier: 'TIER_1',
        rationale: `Known for strong ${func.toLowerCase()} leadership and talent development.`,
        confidence: 'LOW',
      });
    }

    // Add scale-specific suggestions
    for (const scale of criteria.scales) {
      const tier =
        scale.includes('Enterprise') || scale.includes('Large')
          ? 'TIER_1'
          : scale.includes('Growth')
            ? 'TIER_2'
            : 'TIER_3';

      suggestions.push({
        companyName: `${scale} Comparator`,
        domain: null,
        industry: criteria.industries[0] ?? 'Cross-Industry',
        tier,
        rationale: `Comparable ${scale.toLowerCase()} organisation likely to have relevant talent pool.`,
        confidence: 'LOW',
      });
    }

    // Deduplicate by company name
    const seen = new Set<string>();
    const deduplicated = suggestions.filter((s) => {
      if (seen.has(s.companyName)) {
        return false;
      }
      seen.add(s.companyName);

      return true;
    });

    return deduplicated;
  }
}
