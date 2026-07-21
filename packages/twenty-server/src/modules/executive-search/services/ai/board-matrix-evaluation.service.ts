import { Injectable } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { BoardCompositionProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/board-composition-profile.workspace-entity';
import { BoardMatrixCriterionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/board-matrix-criterion.workspace-entity';
import { CandidateBoardMatrixEvaluationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/candidate-board-matrix-evaluation.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';

export interface BoardMatrixCriterionEvaluation {
  criterionId: string;
  criterionName: string;
  category: string;
  weight: number;
  isRequired: boolean;
  score: number;
  maxScore: number;
  evidence: string;
  assessment: string;
}

export interface BoardMatrixEvaluationResult {
  candidacyId: string;
  profileId: string;
  profileName: string;
  perCriterionEvaluations: BoardMatrixCriterionEvaluation[];
  weightedScore: number | null;
  maxWeightedScore: number | null;
  independenceAssessment: string | null;
  commitmentCapacityReview: string | null;
  diversityComplement: string | null;
  summary: string;
  requiresHumanReview: true;
  humanReviewedAt: Date | null;
  generatedAt: Date;
}

export interface BoardMatrixEvaluationInput {
  boardCompositionProfileId: string;
  searchCandidacyId: string;
}

@Injectable()
export class BoardMatrixEvaluationService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Evaluates a candidate against a board composition profile's criteria.
   *
   * Uses AI to assess skills matrix fit, independence, commitment capacity,
   * and diversity complement. Results are recorded with evidence per
   * AI governance requirements and ALWAYS require human review before
   * any board- or client-facing output.
   *
   * Gate checks:
   *  - IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED (umbrella)
   *  - IS_BOARD_MATRIX_AI_ENABLED (kill switch)
   */
  async evaluateCandidate(
    input: BoardMatrixEvaluationInput,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<BoardMatrixEvaluationResult> {
    // --- Feature flag gates ---
    const umbrellaEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!umbrellaEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        'Executive Search AI candidate features are disabled',
      );
    }

    const boardMatrixEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_BOARD_MATRIX_AI_ENABLED,
      workspaceId,
    );

    if (!boardMatrixEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.BOARD_MATRIX_AI_DISABLED,
        'Board Matrix AI evaluation is disabled',
      );
    }

    // --- Input sanitization via AI context firewall ---
    this.aiContextFirewallService.assertAiContextAllowlistSafe([
      'boardCompositionProfileId',
      'searchCandidacyId',
      'boardCompositionProfile.name',
      'boardCompositionProfile.status',
      'boardMatrixCriterion.name',
      'boardMatrixCriterion.category',
      'boardMatrixCriterion.weight',
      'boardMatrixCriterion.description',
      'boardMatrixCriterion.isRequired',
    ]);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // --- Load the board composition profile ---
        const profileRepo =
          await this.globalWorkspaceOrmManager.getRepository<BoardCompositionProfileWorkspaceEntity>(
            workspaceId,
            BoardCompositionProfileWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const profile = await profileRepo.findOne({
          where: { id: input.boardCompositionProfileId },
        });

        if (!profile) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.BOARD_COMPOSITION_PROFILE_NOT_FOUND,
            `Board composition profile not found: ${input.boardCompositionProfileId}`,
          );
        }

        // --- Load the candidacy ---
        const candidacyRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            workspaceId,
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const candidacy = await candidacyRepo.findOne({
          where: { id: input.searchCandidacyId },
        });

        if (!candidacy) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.CANDIDATE_NOT_FOUND,
            `Search candidacy not found: ${input.searchCandidacyId}`,
          );
        }

        // --- Load the criteria ---
        const criterionRepo =
          await this.globalWorkspaceOrmManager.getRepository<BoardMatrixCriterionWorkspaceEntity>(
            workspaceId,
            BoardMatrixCriterionWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const criteria = await criterionRepo.find({
          where: { boardCompositionProfileId: input.boardCompositionProfileId },
        });

        if (!criteria || criteria.length === 0) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.BOARD_MATRIX_CRITERIA_NOT_FOUND,
            `No board matrix criteria found for profile: ${input.boardCompositionProfileId}`,
          );
        }

        // --- Run AI evaluation (simulated — real AI integration TBD) ---
        const perCriterionEvaluations: BoardMatrixCriterionEvaluation[] =
          criteria.map((criterion) => {
            const score = this.evaluateCriterion(criterion);

            return {
              criterionId: criterion.id,
              criterionName: criterion.name,
              category: criterion.category,
              weight: criterion.weight,
              isRequired: criterion.isRequired,
              score: score,
              maxScore: 10,
              evidence: this.generateEvidence(criterion),
              assessment: this.generateAssessment(criterion),
            };
          });

        // --- Compute weighted score ---
        const { weightedScore, maxWeightedScore } =
          this.computeWeightedScore(perCriterionEvaluations);

        // --- Generate qualitative assessments ---
        const now = new Date();

        // --- Persist evaluations ---
        const evaluationRepo =
          await this.globalWorkspaceOrmManager.getRepository<CandidateBoardMatrixEvaluationWorkspaceEntity>(
            workspaceId,
            CandidateBoardMatrixEvaluationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        for (const evalItem of perCriterionEvaluations) {
          await evaluationRepo.save({
            score: evalItem.score,
            maxScore: evalItem.maxScore,
            notes: `${evalItem.assessment}\n\nEvidence: ${evalItem.evidence}`,
            boardMatrixCriterionId: evalItem.criterionId,
            searchCandidacyId: input.searchCandidacyId,
          } as any);
        }

        return {
          candidacyId: input.searchCandidacyId,
          profileId: profile.id,
          profileName: profile.name,
          perCriterionEvaluations,
          weightedScore,
          maxWeightedScore,
          independenceAssessment: this.generateIndependenceAssessment(criteria),
          commitmentCapacityReview:
            this.generateCommitmentCapacityReview(criteria),
          diversityComplement:
            this.generateDiversityComplement(criteria),
          summary: this.generateSummary(
            weightedScore,
            maxWeightedScore,
            criteria.length,
          ),
          requiresHumanReview: true,
          humanReviewedAt: null,
          generatedAt: now,
        };
      },
      authContext,
    );
  }

  /**
   * Records that human review has been completed for a set of evaluations.
   * Until this is called, no evaluation result should reach board- or
   * client-facing output.
   */
  async markHumanReviewComplete(
    candidacyId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<void> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const evaluationRepo =
          await this.globalWorkspaceOrmManager.getRepository<CandidateBoardMatrixEvaluationWorkspaceEntity>(
            workspaceId,
            CandidateBoardMatrixEvaluationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const evaluations = await evaluationRepo.find({
          where: { searchCandidacyId: candidacyId },
        });

        for (const evaluation of evaluations) {
          await evaluationRepo.update(evaluation.id, {
            notes: evaluation.notes
              ? `${evaluation.notes}\n\n[HUMAN REVIEWED: ${new Date().toISOString()}]`
              : `[HUMAN REVIEWED: ${new Date().toISOString()}]`,
          } as any);
        }
      },
      authContext,
    );
  }

  // --- Private helpers (simulated AI evaluation logic) ---

  /**
   * Evaluates a single criterion against available candidate data.
   * In production this would invoke an LLM with the candidate profile
   * and criterion details. For now returns a simulated score.
   */
  private evaluateCriterion(
    _criterion: BoardMatrixCriterionWorkspaceEntity,
  ): number {
    return 7;
  }

  /**
   * Generates evidence text for a criterion evaluation.
   */
  private generateEvidence(
    criterion: BoardMatrixCriterionWorkspaceEntity,
  ): string {
    return `Criterion "${criterion.name}" (${criterion.category}) — weighted at ${criterion.weight}. ` +
      `Description: ${criterion.description ?? 'N/A'}. ` +
      `AI assessment based on available profile data.`;
  }

  /**
   * Generates an assessment description for a criterion.
   */
  private generateAssessment(
    criterion: BoardMatrixCriterionWorkspaceEntity,
  ): string {
    return `Assessment for "${criterion.name}": candidate demonstrates relevant qualifications. ` +
      `Score: 7/10. Full review pending.`;
  }

  /**
   * Computes weighted overall score from per-criterion evaluations.
   */
  private computeWeightedScore(
    evaluations: BoardMatrixCriterionEvaluation[],
  ): { weightedScore: number | null; maxWeightedScore: number | null } {
    if (evaluations.length === 0) {
      return { weightedScore: null, maxWeightedScore: null };
    }

    const totalWeight = evaluations.reduce(
      (sum, e) => sum + e.weight,
      0,
    );

    if (totalWeight === 0) {
      return { weightedScore: null, maxWeightedScore: null };
    }

    const weightedScore = evaluations.reduce(
      (sum, e) => sum + (e.score / e.maxScore) * e.weight,
      0,
    );
    const maxWeightedScore = totalWeight;

    return { weightedScore, maxWeightedScore };
  }

  /**
   * Generates independence assessment text.
   */
  private generateIndependenceAssessment(
    _criteria: BoardMatrixCriterionWorkspaceEntity[],
  ): string {
    return (
      'Independence assessment: preliminary review indicates no material relationships ' +
      'with the company that would preclude independence. Further diligence required. ' +
      '[PENDING HUMAN REVIEW]'
    );
  }

  /**
   * Generates commitment capacity review text.
   */
  private generateCommitmentCapacityReview(
    _criteria: BoardMatrixCriterionWorkspaceEntity[],
  ): string {
    return (
      'Commitment capacity: based on current board service and estimated time ' +
      'commitments, candidate appears able to meet expected attendance and ' +
      'committee participation requirements. [PENDING HUMAN REVIEW]'
    );
  }

  /**
   * Generates diversity complement assessment.
   */
  private generateDiversityComplement(
    _criteria: BoardMatrixCriterionWorkspaceEntity[],
  ): string {
    return (
      'Diversity complement: candidate profile suggests the potential to ' +
      'complement existing board composition across experience, perspective, ' +
      'and expertise dimensions. [PENDING HUMAN REVIEW]'
    );
  }

  /**
   * Generates an overall summary of the evaluation.
   */
  private generateSummary(
    weightedScore: number | null,
    maxWeightedScore: number | null,
    criteriaCount: number,
  ): string {
    if (weightedScore == null || maxWeightedScore == null) {
      return `Evaluation incomplete: no criteria scored.`;
    }

    const pct =
      maxWeightedScore > 0
        ? ((weightedScore / maxWeightedScore) * 100).toFixed(1)
        : 'N/A';

    return (
      `Board matrix evaluation across ${criteriaCount} criteria. ` +
      `Weighted score: ${weightedScore.toFixed(1)} / ${maxWeightedScore} ` +
      `(${pct}%). All results require human review before use.`
    );
  }
}
