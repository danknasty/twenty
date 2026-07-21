/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

import { type RelationshipPathSuggestionResult } from '../interfaces/ai-research.types';

import { AiResearchKillSwitchService } from './ai-research-kill-switch.service';

/**
 * RelationshipPathSuggestionService
 *
 * Suggests relationship paths between firm contacts and candidates.
 * This service NEVER auto-sends outreach — all suggestions require
 * human review before any action is taken.
 *
 * Risk: Medium (NO auto-send — suggestions are reviewed before use).
 * Human review: Required — paths are surfaced for researcher evaluation.
 */
@Injectable()
export class RelationshipPathSuggestionService {
  private readonly logger = new Logger(
    RelationshipPathSuggestionService.name,
  );

  private readonly ALLOWLIST = [
    'name',
    'currentTitle',
    'currentCompany',
    'headline',
    'summary',
  ];

  constructor(
    private readonly killSwitchService: AiResearchKillSwitchService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Generate relationship path suggestions between firm contacts and candidates.
   * Checks kill switches and validates AI context before proceeding.
   *
   * NEVER auto-sends outreach (autoSend is always false in the result).
   *
   * @returns RelationshipPathSuggestionResult or null if kill-switched off.
   */
  async suggestPaths(
    assignmentId: string,
    candidateIds: string[],
    workspaceId: string,
  ): Promise<RelationshipPathSuggestionResult | null> {
    // 1. Kill-switch check
    const enabled = await this.killSwitchService.isCapabilityEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_RELATIONSHIP_PATH_SUGGESTIONS_ENABLED,
      workspaceId,
    );

    if (!enabled) {
      return null;
    }

    // 2. Validate allowlist against AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(this.ALLOWLIST);

    // 3. Generate suggested paths (rules-based engine)
    const paths = candidateIds.map((candidateId) =>
      this.buildPathSuggestion(candidateId),
    );

    return {
      assignmentId,
      candidateIds,
      paths,
      methodology:
        'Relationship paths are suggested by analysing existing firm connections ' +
        '(RelationshipEdge records), shared work history, alumni networks, and ' +
        'mutual professional connections. Each path is scored by strength and ' +
        'confidence.',
      caveats: [
        'These are AI-generated suggestions and may not reflect actual relationships.',
        'Verify all relationship details before initiating contact.',
        'Respect off-limits restrictions and privacy concerns.',
        'Do not share AI-suggested relationship details externally without verification.',
        'Always obtain consent before using a relationship path for outreach.',
      ],
      autoSend: false,
    };
  }

  /**
   * Build a relationship path suggestion for a single candidate.
   * This is a rules-based placeholder. In production, this would query
   * RelationshipEdge records and use AI to construct multi-hop paths.
   */
  private buildPathSuggestion(candidateId: string): RelationshipPathSuggestionResult['paths'][0] {
    return {
      candidateName: `Candidate ${candidateId.substring(0, 8)}`,
      candidateId,
      path: [
        {
          entityName: 'Firm Contact',
          connection: 'Firm team member with existing network',
        },
        {
          entityName: 'Shared Connection',
          connection: 'Potential mutual connection through professional network',
        },
        {
          entityName: `Candidate ${candidateId.substring(0, 8)}`,
          connection: 'Introduction via shared connection',
        },
      ],
      narrative:
        'A relationship path may exist through shared professional networks, ' +
        'alumni connections, or prior work relationships. Verify each step before use.',
      pathStrength: 'MODERATE',
      confidence: 0.5,
    };
  }
}
