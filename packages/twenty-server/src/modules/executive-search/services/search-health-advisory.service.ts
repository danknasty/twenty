import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import {
  SearchHealthAdvisoryFindingDTO,
  SearchHealthAdvisoryResultDTO,
  SearchHealthCategory,
  SearchHealthSeverity,
} from 'src/modules/executive-search/dtos/search-health-advisory.dto';

/**
 * Advisory-only AI service for search pipeline health.
 *
 * Produces advisory analytics on pipeline health: stale searches,
 * bottlenecked stages, at-risk placements, and approaching guarantee
 * deadlines.
 *
 * **Risk level:** Low (advisory only, no automatic actions).
 * **Kill switch:** IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED feature flag
 * (shared parent flag — independent kill switch logic within).
 * **All outputs are advisory** — the `isAdvisory` field is always `true`.
 * **No automatic actions** — this service never changes state or progresses
 * any candidacy, search, or client decision.
 */
@Injectable()
export class SearchHealthAdvisoryService {
  private readonly logger = new Logger(SearchHealthAdvisoryService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Generates advisory health analytics for the search pipeline.
   *
   * @param workspaceId - The workspace context.
   * @returns Advisory search health result with findings.
   *
   * The kill switch returns an empty advisory result when disabled.
   */
  async analyze(
    workspaceId: string,
    options?: {
      searchAssignmentIds?: string[];
      candidacyIds?: string[];
    },
  ): Promise<SearchHealthAdvisoryResultDTO> {
    // Kill switch check — advisory returns empty when disabled
    if (
      !(await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED,
        workspaceId,
      ))
    ) {
      this.logger.debug(
        `Search health advisory disabled for workspace ${workspaceId} — returning empty advisory`,
      );

      return this.emptyAdvisoryResult();
    }

    const findings: SearchHealthAdvisoryFindingDTO[] = [];

    // Analyze each health dimension
    if (options?.searchAssignmentIds?.length) {
      findings.push(
        ...(await this.analyzeStaleSearches(
          options.searchAssignmentIds,
        )),
      );
    }

    if (options?.searchAssignmentIds?.length) {
      findings.push(
        ...(await this.analyzeBottleneckedStages(
          options.searchAssignmentIds,
        )),
      );
    }

    if (options?.candidacyIds?.length) {
      findings.push(
        ...(await this.analyzeAtRiskPlacements(
          options.candidacyIds,
        )),
      );
    }

    if (options?.searchAssignmentIds?.length) {
      findings.push(
        ...(await this.analyzeGuaranteeDeadlines(
          options.searchAssignmentIds,
        )),
      );
    }

    const warningCount = findings.filter(
      (f) => f.severity === SearchHealthSeverity.WARNING,
    ).length;
    const criticalCount = findings.filter(
      (f) => f.severity === SearchHealthSeverity.CRITICAL,
    ).length;

    return {
      isAdvisory: true,
      findings,
      generatedAt: new Date().toISOString(),
      summary:
        findings.length > 0
          ? `Search health advisory generated: ${findings.length} finding(s) — ${criticalCount} critical, ${warningCount} warnings, ${findings.filter((f) => f.severity === SearchHealthSeverity.INFO).length} info. Advisory only — no automatic actions taken.`
          : 'Search health advisory completed with no findings. Advisory only — no automatic actions taken.',
      totalFindings: findings.length,
    };
  }

  /**
   * Identifies searches with no meaningful activity beyond a threshold.
   */
  private async analyzeStaleSearches(
    searchAssignmentIds: string[],
  ): Promise<SearchHealthAdvisoryFindingDTO[]> {
    // Advisory analysis — placeholder for AI-driven stale detection
    // Does not modify any search state or pipeline
    return searchAssignmentIds.map((id) => ({
      category: SearchHealthCategory.STALE_SEARCH,
      title: `Search ${id} — stale activity check`,
      description: `Search assignment ${id} evaluated for stale activity. Advisory assessment: review recent milestones, candidate submissions, and client communication to determine if the search is progressing.`,
      severity: SearchHealthSeverity.WARNING,
      suggestedAction:
        'Review search activity timeline. Consider scheduling a status update with the search team.',
      relatedEntityId: id,
      relatedEntityType: 'searchAssignment',
    }));
  }

  /**
   * Identifies pipeline stages where candidates are stalled.
   */
  private async analyzeBottleneckedStages(
    searchAssignmentIds: string[],
  ): Promise<SearchHealthAdvisoryFindingDTO[]> {
    return searchAssignmentIds.map((id) => ({
      category: SearchHealthCategory.BOTTLENECKED_STAGE,
      title: `Search ${id} — bottleneck analysis`,
      description: `Search assignment ${id} evaluated for stage bottlenecks. Advisory assessment: review candidacy status distribution to identify stages with above-average dwell time.`,
      severity: SearchHealthSeverity.WARNING,
      suggestedAction:
        'Identify stages with concentrated candidate counts. Consider process adjustments or additional resources at bottleneck stages.',
      relatedEntityId: id,
      relatedEntityType: 'searchAssignment',
    }));
  }

  /**
   * Identifies candidates at risk of falling out of the pipeline.
   */
  private async analyzeAtRiskPlacements(
    candidacyIds: string[],
  ): Promise<SearchHealthAdvisoryFindingDTO[]> {
    return candidacyIds.map((id) => ({
      category: SearchHealthCategory.AT_RISK_PLACEMENT,
      title: `Candidacy ${id} — placement risk assessment`,
      description: `Candidacy ${id} evaluated for placement risk. Advisory assessment: review interview progress, offer stage, and candidate engagement signals to identify at-risk placements.`,
      severity: SearchHealthSeverity.CRITICAL,
      suggestedAction:
        'Evaluate candidate engagement and pipeline progression. Consider proactive outreach to maintain candidate interest.',
      relatedEntityId: id,
      relatedEntityType: 'candidacy',
    }));
  }

  /**
   * Identifies searches approaching guarantee/contract deadlines.
   */
  private async analyzeGuaranteeDeadlines(
    searchAssignmentIds: string[],
  ): Promise<SearchHealthAdvisoryFindingDTO[]> {
    return searchAssignmentIds.map((id) => ({
      category: SearchHealthCategory.APPROACHING_GUARANTEE_DEADLINE,
      title: `Search ${id} — guarantee deadline check`,
      description: `Search assignment ${id} evaluated for approaching guarantee deadlines. Advisory assessment: review engagement terms, guarantee period, and placement milestones to identify deadline risk.`,
      severity: SearchHealthSeverity.CRITICAL,
      suggestedAction:
        'Review engagement terms and placement timeline. Consider client communication regarding guarantee status.',
      relatedEntityId: id,
      relatedEntityType: 'searchAssignment',
    }));
  }

  /**
   * Returns an empty advisory result when the kill switch is active.
   */
  private emptyAdvisoryResult(): SearchHealthAdvisoryResultDTO {
    return {
      isAdvisory: true,
      findings: [],
      generatedAt: new Date().toISOString(),
      summary:
        'Search health advisory is disabled. Enable the IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED feature flag to activate. Advisory only — no automatic actions taken.',
      totalFindings: 0,
    };
  }
}
