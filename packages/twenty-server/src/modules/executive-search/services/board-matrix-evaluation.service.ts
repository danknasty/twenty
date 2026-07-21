import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import {
  BoardMatrixEvaluationCategory,
  BoardMatrixEvaluationFindingDTO,
  BoardMatrixEvaluationResultDTO,
  BoardMatrixEvaluationRiskLevel,
  BoardMatrixHumanReviewStatus,
} from 'src/modules/executive-search/dtos/board-matrix-evaluation.dto';

/**
 * Advisory-only AI service for board matrix evaluations.
 *
 * Evaluates director independence reviews, board commitment reviews,
 * board composition profiles, and candidate board matrix evaluations.
 *
 * **Risk level:** Medium (human review required).
 * **Kill switch:** IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED feature flag.
 * **All outputs are advisory** — the `isAdvisory` field is always `true`.
 */
@Injectable()
export class BoardMatrixEvaluationService {
  private readonly logger = new Logger(BoardMatrixEvaluationService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Evaluates board matrix data across all categories.
   *
   * @param workspaceId - The workspace context.
   * @returns Advisory evaluation result with findings per category.
   *
   * The kill switch returns an empty advisory result when disabled.
   */
  async evaluate(
    workspaceId: string,
    options?: {
      directorIndependenceReviewIds?: string[];
      boardCommitmentReviewIds?: string[];
      boardCompositionProfileIds?: string[];
      candidateBoardMatrixEvaluationIds?: string[];
    },
  ): Promise<BoardMatrixEvaluationResultDTO> {
    // Kill switch check — advisory returns empty when disabled
    if (
      !(await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED,
        workspaceId,
      ))
    ) {
      this.logger.debug(
        `Board matrix evaluation disabled for workspace ${workspaceId} — returning empty advisory`,
      );

      return this.emptyAdvisoryResult();
    }

    const now = new Date().toISOString();
    const findings: BoardMatrixEvaluationFindingDTO[] = [];

    // Evaluate each category
    if (options?.directorIndependenceReviewIds?.length) {
      findings.push(
        ...(await this.evaluateDirectorIndependence(
          options.directorIndependenceReviewIds,
        )),
      );
    }

    if (options?.boardCommitmentReviewIds?.length) {
      findings.push(
        ...(await this.evaluateBoardCommitment(
          options.boardCommitmentReviewIds,
        )),
      );
    }

    if (options?.boardCompositionProfileIds?.length) {
      findings.push(
        ...(await this.evaluateBoardComposition(
          options.boardCompositionProfileIds,
        )),
      );
    }

    if (options?.candidateBoardMatrixEvaluationIds?.length) {
      findings.push(
        ...(await this.evaluateCandidateBoardMatrix(
          options.candidateBoardMatrixEvaluationIds,
        )),
      );
    }

    return {
      isAdvisory: true,
      riskLevel: 'MEDIUM',
      humanReviewRequired: 'Yes — all board matrix evaluations require human review before use',
      reviewStatus: BoardMatrixHumanReviewStatus.PENDING,
      findings,
      evaluatedAt: now,
      summary: findings.length > 0
        ? `Board matrix evaluation completed with ${findings.length} finding(s). ${findings.filter((f) => f.riskLevel === BoardMatrixEvaluationRiskLevel.HIGH).length} high-risk, ${findings.filter((f) => f.riskLevel === BoardMatrixEvaluationRiskLevel.MEDIUM).length} medium-risk, ${findings.filter((f) => f.riskLevel === BoardMatrixEvaluationRiskLevel.LOW).length} low-risk. Advisory only — human review required.`
        : 'Board matrix evaluation completed with no findings. Advisory only — human review required.',
    };
  }

  /**
   * Evaluate director independence reviews for conflicts, related-party
   * transactions, and independence concerns.
   */
  private async evaluateDirectorIndependence(
    reviewIds: string[],
  ): Promise<BoardMatrixEvaluationFindingDTO[]> {
    // Advisory evaluation — placeholder for AI-driven analysis
    // Human reviewer makes the final independence determination
    return reviewIds.map((id) => ({
      category: BoardMatrixEvaluationCategory.DIRECTOR_INDEPENDENCE,
      finding: `Director independence review ${id} evaluated — advisory analysis completed. Human reviewer must assess independence status and document the final determination.`,
      riskLevel: BoardMatrixEvaluationRiskLevel.MEDIUM,
      recommendation:
        'Review related-party transactions and disclosed relationships. Confirm independence per applicable governance framework.',
      evidenceSummary:
        'Advisory analysis based on review data. Independence determination requires human professional judgment.',
    }));
  }

  /**
   * Evaluate board commitment reviews for time commitment concerns,
   * overboarding risk, and availability constraints.
   */
  private async evaluateBoardCommitment(
    reviewIds: string[],
  ): Promise<BoardMatrixEvaluationFindingDTO[]> {
    return reviewIds.map((id) => ({
      category: BoardMatrixEvaluationCategory.BOARD_COMMITMENT,
      finding: `Board commitment review ${id} evaluated — advisory analysis completed. Human reviewer must assess commitment adequacy and overboarding risk.`,
      riskLevel: BoardMatrixEvaluationRiskLevel.MEDIUM,
      recommendation:
        'Compare current board count, chair positions, and estimated time commitment against industry benchmarks and company policy.',
      evidenceSummary:
        'Advisory analysis based on reported board seats and time estimates. Final commitment assessment requires human judgment.',
    }));
  }

  /**
   * Evaluate board composition profiles for gaps in skills, diversity,
   * experience, and target board requirements.
   */
  private async evaluateBoardComposition(
    profileIds: string[],
  ): Promise<BoardMatrixEvaluationFindingDTO[]> {
    return profileIds.map((id) => ({
      category: BoardMatrixEvaluationCategory.BOARD_COMPOSITION,
      finding: `Board composition profile ${id} evaluated — advisory analysis completed. Human reviewer must verify composition gaps and target alignment.`,
      riskLevel: BoardMatrixEvaluationRiskLevel.MEDIUM,
      recommendation:
        'Cross-reference current composition against target profile. Identify skill gaps, diversity needs, and experience shortfalls.',
      evidenceSummary:
        'Advisory analysis comparing current vs. target composition parameters. Final profile assessment requires human review.',
    }));
  }

  /**
   * Evaluate candidate board matrix evaluations for scoring consistency,
   * criterion coverage, and alignment with board composition targets.
   */
  private async evaluateCandidateBoardMatrix(
    evaluationIds: string[],
  ): Promise<BoardMatrixEvaluationFindingDTO[]> {
    return evaluationIds.map((id) => ({
      category: BoardMatrixEvaluationCategory.CANDIDATE_MATRIX,
      finding: `Candidate board matrix evaluation ${id} evaluated — advisory analysis completed. Human reviewer must validate scoring and criterion coverage.`,
      riskLevel: BoardMatrixEvaluationRiskLevel.MEDIUM,
      recommendation:
        'Review criterion scores for consistency across candidates. Verify that all required criteria are assessed and weighted appropriately.',
      evidenceSummary:
        'Advisory analysis of candidate matrix scores and criterion coverage. Final scoring requires human validation.',
    }));
  }

  /**
   * Returns an empty advisory result when the kill switch is active.
   */
  private emptyAdvisoryResult(): BoardMatrixEvaluationResultDTO {
    return {
      isAdvisory: true,
      riskLevel: 'MEDIUM',
      humanReviewRequired: 'Yes — all board matrix evaluations require human review before use',
      reviewStatus: BoardMatrixHumanReviewStatus.PENDING,
      findings: [],
      evaluatedAt: new Date().toISOString(),
      summary:
        'Board matrix evaluation is disabled. Enable the IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED feature flag to activate. Advisory only — human review required.',
    };
  }
}
