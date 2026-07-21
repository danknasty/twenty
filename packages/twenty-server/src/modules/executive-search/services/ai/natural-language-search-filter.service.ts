import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Structured filter criterion produced by the NL-to-search-filter conversion.
 * These are displayed transparently to the user before execution.
 */
export interface SearchFilterCriterion {
  /** The field path on the executive profile to filter (e.g. "currentTitle", "careerExperiences.industry") */
  field: string;
  /** The operator for the filter (e.g. "eq", "contains", "in", "gte", "lte") */
  operator: 'eq' | 'contains' | 'in' | 'gte' | 'lte' | 'exists' | 'notExists';
  /** The value(s) to filter against */
  value: string | number | string[];
  /** Human-readable description of what this filter does (shown to user) */
  label: string;
}

/**
 * Result of a natural language query parse.
 */
export interface NaturalLanguageSearchFilterResult {
  /** The original natural language query */
  originalQuery: string;
  /** Structured filter criteria derived from the query */
  criteria: SearchFilterCriterion[];
  /** Human-readable explanation of the interpreted filters (shown to user) */
  explanation: string;
  /** Confidence score 0-1 indicating how well the query was understood */
  confidence: number;
  /** Unique trace identifier for provenance/audit trail */
  traceId: string;
  /** Whether this capability is currently enabled */
  isEnabled: boolean;
}

@Injectable()
export class NaturalLanguageSearchFilterService {
  private readonly logger = new Logger(NaturalLanguageSearchFilterService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Converts a natural-language search query into structured filter criteria
   * for executive profile searches. Results are purely advisory and shown to
   * the user for transparency before any search is executed.
   *
   * Kill switch: the IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED feature flag
   * gates this capability. When disabled, the result will have isEnabled=false.
   */
  async parseQuery(
    query: string,
    workspaceId: string,
  ): Promise<NaturalLanguageSearchFilterResult> {
    const traceId = this.generateTraceId();

    // 1. Kill switch: check feature flag
    const isEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!isEnabled) {
      return {
        originalQuery: query,
        criteria: [],
        explanation:
          'AI-powered search filter parsing is currently disabled for this workspace.',
        confidence: 0,
        traceId,
        isEnabled: false,
      };
    }

    // 2. Sanitize input through AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe([
      'currentTitle',
      'headline',
      'summary',
      'location',
      'yearsOfExperience',
      'currentTitle',
      'careerExperiences.industry',
      'careerExperiences.companyName',
      'capabilities.name',
      'capabilities.category',
      'educations.degree',
      'boardServices.boardType',
      'boardServices.companyName',
    ]);

    // 3. Parse the natural-language query into structured criteria
    const criteria = this.parseQueryIntoCriteria(query);

    // 4. Build a human-readable explanation
    const explanation = this.buildExplanation(query, criteria);
    const confidence = this.estimateConfidence(criteria);

    return {
      originalQuery: query,
      criteria,
      explanation,
      confidence,
      traceId,
      isEnabled: true,
    };
  }

  /**
   * Parse a natural-language query into structured filter criteria.
   * Uses keyword/phrase classification to extract meaningful filters.
   * This is intentionally rule-based and transparent — all filters are
   * returned to the user for review before execution.
   */
  private parseQueryIntoCriteria(query: string): SearchFilterCriterion[] {
    const lowerQuery = query.toLowerCase();
    const criteria: SearchFilterCriterion[] = [];

    // Role / title classification
    const rolePatterns = [
      { pattern: /\bceos?\b|\bchief\s+executive\b/i, title: 'CEO' },
      { pattern: /\bcfos?\b|\bchief\s+financial\b/i, title: 'CFO' },
      { pattern: /\bctos?\b|\bchief\s+technology\b/i, title: 'CTO' },
      { pattern: /\bcoos?\b|\bchief\s+operating\b/i, title: 'COO' },
      {
        pattern: /\bcmos?\b|\bchief\s+marketing\b|\bchief\s+revenue\b/i,
        title: 'CMO',
      },
      { pattern: /\bchros?\b|\bchief\s+hr\b|\bchief\s+people\b/i, title: 'CHRO' },
      { pattern: /\bcios?\b|\bchief\s+information\b/i, title: 'CIO' },
      {
        pattern: /\bgeneral\s+counsels?\b|\bchief\s+legal\b/i,
        title: 'General Counsel',
      },
      { pattern: /\bvps?\b|\bvice\s+president\b|\bsenior\s+vps?\b|\bevps?\b/i, title: 'VP' },
      { pattern: /\bboard\s+members?\b|\bboard\s+directors?\b|\bnon.executive\b/i, title: 'Board Director' },
      { pattern: /\bchairman\b|\bchairperson\b|\bchairs?\b/i, title: 'Chairperson' },
      {
        pattern: /\bfounders?\b|\bco.founders?\b/i,
        title: 'Founder',
      },
    ];

    for (const { pattern, title } of rolePatterns) {
      if (pattern.test(lowerQuery)) {
        criteria.push({
          field: 'currentTitle',
          operator: 'contains',
          value: title,
          label: `Current title contains "${title}"`,
        });
      }
    }

    // Industry classification
    const industryPatterns = [
      { pattern: /\bsaas\b|\bsoftware as a service\b/i, industry: 'SaaS' },
      { pattern: /\bfintech\b|\bfinancial technology\b/i, industry: 'FinTech' },
      { pattern: /\bhealthtech\b|\bhealthcare\b|\bhealth\b/i, industry: 'Healthcare' },
      {
        pattern: /\benterprise software\b|\benterprise tech\b/i,
        industry: 'Enterprise Software',
      },
      { pattern: /\bai\b|\bartificial intelligence\b|\bml\b|\bmachine learning\b/i, industry: 'AI/ML' },
      {
        pattern: /\bcybersecurity\b|\bsecurity\b|\bcyber\b/i,
        industry: 'Cybersecurity',
      },
      { pattern: /\be.commerce\b|\bretail tech\b/i, industry: 'E-Commerce' },
      {
        pattern: /\bedtech\b|\beducation tech\b/i,
        industry: 'EdTech',
      },
      { pattern: /\bcleantech\b|\bclimate\b|\brenewable\b/i, industry: 'CleanTech' },
      { pattern: /\bproptech\b|\breal estate tech\b/i, industry: 'PropTech' },
      { pattern: /\blegaltech\b|\blegal tech\b/i, industry: 'LegalTech' },
      { pattern: /\bbanking\b|\binvestment\b|\bprivate equity\b|\bventure capital\b/i, industry: 'Financial Services' },
      {
        pattern: /\bmanufacturing\b|\bindustrial\b/i,
        industry: 'Manufacturing',
      },
      { pattern: /\bconsumer\b|\bb2c\b/i, industry: 'Consumer' },
    ];

    for (const { pattern, industry } of industryPatterns) {
      if (pattern.test(lowerQuery)) {
        criteria.push({
          field: 'careerExperiences.industry',
          operator: 'contains',
          value: industry,
          label: `Industry experience includes "${industry}"`,
        });
      }
    }

    // Experience level detection
    const experiencePatterns = [
      {
        pattern: /\b(\d+)\+?\s*years?\s*(of\s*)?experience\b/i,
        field: 'yearsOfExperience' as const,
        operator: 'gte' as const,
      },
      {
        pattern: /\b(\d+)\s*-\s*(\d+)\s*years?\s*(of\s*)?experience\b/i,
        field: 'yearsOfExperience' as const,
        operator: 'in' as const,
      },
    ];

    for (const { pattern, field, operator } of experiencePatterns) {
      const match = query.match(pattern);
      if (match) {
        if (operator === 'gte') {
          const years = parseInt(match[1], 10);
          criteria.push({
            field,
            operator,
            value: years,
            label: `At least ${years} years of experience`,
          });
        } else if (operator === 'in') {
          criteria.push({
            field,
            operator: 'gte',
            value: parseInt(match[1], 10),
            label: `Experience between ${match[1]} and ${match[2]} years`,
          });
          criteria.push({
            field,
            operator: 'lte',
            value: parseInt(match[2], 10),
            label: `Experience between ${match[1]} and ${match[2]} years`,
          });
        }
      }
    }

    // "Taken companies public" / IPO experience
    if (
      /\bipo\b|\btaken\s.*\bpublic\b|\bwent\s+public\b|\bpublic\s+offering\b/i.test(
        lowerQuery,
      )
    ) {
      criteria.push({
        field: 'capabilities.name',
        operator: 'contains',
        value: 'IPO',
        label: 'Has IPO / public offering experience',
      });
    }

    // Public company experience
    if (/\bpublic\s+company\b|\bpublicly\s+traded\b/i.test(lowerQuery)) {
      criteria.push({
        field: 'careerExperiences.companyType',
        operator: 'eq',
        value: 'Public',
        label: 'Experience at publicly traded companies',
      });
    }

    // International / global experience
    if (/\binternational\b|\bglobal\b|\bmultinational\b|\bmulti.national\b/i.test(lowerQuery)) {
      criteria.push({
        field: 'capabilities.name',
        operator: 'contains',
        value: 'Global Operations',
        label: 'Has global or international experience',
      });
    }

    // Location
    const locationMatch = query.match(
      /\b in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,
    );
    if (locationMatch) {
      criteria.push({
        field: 'location',
        operator: 'contains',
        value: locationMatch[1],
        label: `Located in or near "${locationMatch[1]}"`,
      });
    }

    // Board experience
    if (
      /\bboard\b|\bboard member\b|\bdirector\b/i.test(lowerQuery) &&
      !criteria.some((c) => c.field === 'currentTitle' && c.value === 'Board Director')
    ) {
      criteria.push({
        field: 'boardServices.boardType',
        operator: 'exists',
        value: 'true',
        label: 'Has board service experience',
      });
    }

    return criteria;
  }

  /**
   * Build a human-readable explanation of the parsed filters for user transparency.
   */
  private buildExplanation(
    query: string,
    criteria: SearchFilterCriterion[],
  ): string {
    if (criteria.length === 0) {
      return `The query "${query}" did not produce any structured search filters. Try a more descriptive query such as "SaaS CFOs with IPO experience".`;
    }

    const parts = criteria.map((c) => c.label);

    return `Your search "${query}" was interpreted as: ${parts.join('; ')}. These filters are shown here for your review before execution. You may adjust them before running the search.`;
  }

  /**
   * Estimate confidence based on how many criteria were extracted relative to
   * the query length/complexity.
   */
  private estimateConfidence(criteria: SearchFilterCriterion[]): number {
    if (criteria.length === 0) return 0;
    if (criteria.length >= 4) return 0.9;
    if (criteria.length >= 2) return 0.7;
    return 0.5;
  }

  /**
   * Generate a unique trace ID for audit/provenance tracking.
   */
  private generateTraceId(): string {
    return `nl-search-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}
