/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

import { type ParsedSearchFilters } from '../interfaces/ai-research.types';

import { AiResearchKillSwitchService } from './ai-research-kill-switch.service';

/**
 * NaturalLanguageSearchFilterService
 *
 * Converts natural-language queries into structured search filters for:
 *   - researchCandidate
 *   - executiveProfile
 *   - targetCompany
 *
 * Risk: Low (transparent — user sees how the query was interpreted).
 * Human review: Transparent — filters are surfaced for user confirmation.
 */
@Injectable()
export class NaturalLanguageSearchFilterService {
  private readonly logger = new Logger(
    NaturalLanguageSearchFilterService.name,
  );

  private readonly ALLOWLIST = [
    'name',
    'currentTitle',
    'currentCompany',
    'tier',
    'status',
    'source',
    'fitScore',
    'headline',
    'yearsOfExperience',
    'location',
    'currentTitle',
    'companyName',
    'industry',
    'domain',
    'sizeBand',
    'attractiveness',
    'headquartersLocation',
  ];

  constructor(
    private readonly killSwitchService: AiResearchKillSwitchService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Parse a natural-language query into structured search filters.
   * Checks kill switches, validates against AI context firewall,
   * then extracts filters from the NL query.
   *
   * @returns ParsedSearchFilters or null if kill-switched off.
   */
  async parseQuery(
    query: string,
    workspaceId: string,
  ): Promise<ParsedSearchFilters | null> {
    // 1. Kill-switch check
    const enabled = await this.killSwitchService.isCapabilityEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_NL_SEARCH_FILTERS_ENABLED,
      workspaceId,
    );

    if (!enabled) {
      return null;
    }

    // 2. Validate allowlist against AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(this.ALLOWLIST);

    // 3. Parse the NL query into structured filters
    const filters = this.extractFilters(query);

    return {
      naturalLanguageQuery: query,
      filters,
      explanation: this.buildExplanation(query, filters),
    };
  }

  /**
   * Parse a natural-language query into structured search filters.
   * This is a deterministic parser that recognises common NL patterns.
   * In production, this could delegate to an AI model for richer parsing.
   */
  private extractFilters(
    query: string,
  ): ParsedSearchFilters['filters'] {
    const filters: ParsedSearchFilters['filters'] = [];
    const lower = query.toLowerCase();

    // Entity detection
    let entity = 'researchCandidate';

    if (
      lower.includes('company') ||
      lower.includes('target') ||
      lower.includes('organisation')
    ) {
      entity = 'targetCompany';
    } else if (
      lower.includes('executive') ||
      lower.includes('profile') ||
      lower.includes('candidate background')
    ) {
      entity = 'executiveProfile';
    }

    // Title matching
    const titlePatterns = [
      /\b(?:ceo|chief\s+executive)\b/i,
      /\b(?:cfo|chief\s+financial)\b/i,
      /\b(?:cto|chief\s+technology)\b/i,
      /\b(?:coo|chief\s+operating)\b/i,
      /\bvp\b|\bvice\s+president\b/i,
      /\b(?:director|head\s+of)\b/i,
    ];

    for (const pattern of titlePatterns) {
      const match = query.match(pattern);

      if (match) {
        filters.push({
          entity,
          field: 'currentTitle',
          operator: 'contains',
          value: match[0],
        });
      }
    }

    // Industry matching
    const industryPatterns = [
      /\b(?:tech|technology|software|saas)\b/i,
      /\b(?:finance|fintech|banking)\b/i,
      /\b(?:healthcare|biotech|pharma)\b/i,
      /\b(?:manufacturing|industrial)\b/i,
      /\b(?:retail|ecommerce)\b/i,
    ];

    for (const pattern of industryPatterns) {
      const match = query.match(pattern);

      if (match) {
        filters.push({
          entity: 'targetCompany',
          field: 'industry',
          operator: 'contains',
          value: match[0],
        });
      }
    }

    // Location matching
    const locationPattern = /\b(?:in|near|based\s+in|located\s+in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/;
    const locationMatch = query.match(locationPattern);

    if (locationMatch) {
      filters.push({
        entity,
        field: entity === 'executiveProfile' ? 'location' : 'headquartersLocation',
        operator: 'contains',
        value: locationMatch[1],
      });
    }

    // Tier matching
    if (lower.includes('tier 1') || lower.includes('top tier')) {
      filters.push({
        entity: 'targetCompany',
        field: 'tier',
        operator: 'eq',
        value: 'TIER_1',
      });
    } else if (lower.includes('tier 2') || lower.includes('second tier')) {
      filters.push({
        entity: 'targetCompany',
        field: 'tier',
        operator: 'eq',
        value: 'TIER_2',
      });
    } else if (lower.includes('tier 3') || lower.includes('third tier')) {
      filters.push({
        entity: 'targetCompany',
        field: 'tier',
        operator: 'eq',
        value: 'TIER_3',
      });
    }

    // Company name matching
    const companyPattern = /\b(?:at|from|working\s+at)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)*)/;
    const companyMatch = query.match(companyPattern);

    if (companyMatch) {
      filters.push({
        entity: 'researchCandidate',
        field: 'currentCompany',
        operator: 'contains',
        value: companyMatch[1],
      });
    }

    // Fit score thresholds
    const scorePattern = /fit\s+(?:score\s+)?(>=?|<=?|>|<|=)\s*(\d+)/i;
    const scoreMatch = query.match(scorePattern);

    if (scoreMatch) {
      const operatorMap: Record<string, 'eq' | 'gt' | 'gte' | 'lt' | 'lte'> = {
        '=': 'eq',
        '>': 'gt',
        '>=': 'gte',
        '<': 'lt',
        '<=': 'lte',
      };

      filters.push({
        entity: 'researchCandidate',
        field: 'fitScore',
        operator: operatorMap[scoreMatch[1]] ?? 'eq',
        value: parseInt(scoreMatch[2], 10),
      });
    }

    return filters;
  }

  /**
   * Build a human-readable explanation of how the query was parsed.
   */
  private buildExplanation(
    query: string,
    filters: ParsedSearchFilters['filters'],
  ): string {
    const parts: string[] = [];

    if (filters.length === 0) {
      return `No structured filters could be extracted from "${query}". Try rephrasing with specific criteria (title, industry, location, etc.).`;
    }

    for (const filter of filters) {
      parts.push(
        `${filter.entity}.${filter.field} ${filter.operator} "${filter.value}"`,
      );
    }

    return `Query parsed into ${filters.length} filter(s): ${parts.join('; ')}. Review and adjust before running the search.`;
  }
}
