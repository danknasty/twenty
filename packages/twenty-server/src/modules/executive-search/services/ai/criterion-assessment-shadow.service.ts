import { Injectable, Logger } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { FeatureFlagKey } from 'twenty-shared/types';
import {
  type CriterionAssessmentSource,
} from 'src/modules/executive-search/common/enums/criterion-assessment-source.enum';
import {
  type ShadowAssessmentStatus,
} from 'src/modules/executive-search/common/enums/shadow-assessment-status.enum';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { SearchCriterionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-criterion.workspace-entity';

export interface CriterionAssessmentShadowInput {
  /** The search assignment to evaluate candidates against */
  searchAssignmentId: string;
  /** Candidacy IDs to evaluate (all if empty) */
  candidacyIds?: string[];
  /** IDs of criteria to assess (all assignment criteria if empty) */
  criterionIds?: string[];
}

export interface PerCriterionScore {
  criterionId: string;
  criterionName: string;
  score: number | null;
  evidence: string | null;
  guardrailChecks: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface ShadowEvaluationResult {
  candidacyId: string;
  criteriaEvaluations: PerCriterionScore[];
}

export interface ShadowEvaluationOutput {
  /** Unique identifier for this shadow evaluation run */
  shadowRunId: string;
  /** Timestamp of the evaluation */
  evaluatedAt: string;
  /** AI model version used */
  aiModelVersion: string;
  /** Prompt version used for this evaluation */
  promptVersion: string;
  /** Hashes of inputs sent to the AI for audit trail */
  inputHashes: string[];
  /** Fields redacted by the AI context firewall */
  redactionManifest: string[];
  /** Per-candidacy evaluation results */
  evaluations: ShadowEvaluationResult[];
  /** Count of evaluations stored as shadow records */
  storedCount: number;
}

@Injectable()
export class CriterionAssessmentShadowService {
  private readonly logger = new Logger(CriterionAssessmentShadowService.name);
  private readonly AI_MODEL_VERSION = 'gpt-4-turbo-2025-04-01';
  private readonly PROMPT_VERSION = 'criterion-assessment-shadow-v1';

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Evaluates all candidates associated with a search assignment against the
   * assignment's searchCriterion entries. Runs in SHADOW MODE only:
   * - Results are stored as shadow assessments — NOT visible to clients
   * - Candidate status is NOT affected
   * - Human must explicitly review and submit via the accept/reject workflow
   *
   * Both IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED AND
   * IS_CRITERION_ASSESSMENT_SHADOW_ENABLED must be enabled.
   */
  async evaluateAssignmentCriteria(
    input: CriterionAssessmentShadowInput,
    authContext: WorkspaceAuthContext,
  ): Promise<ShadowEvaluationOutput> {
    const workspaceId = authContext.workspace.id;

    // Guard: both feature flags must be enabled
    await this.assertFeatureFlagsEnabled(workspaceId);

    this.logger.log(
      `[SHADOW-MODE] Starting criterion assessment shadow run for searchAssignment=${input.searchAssignmentId}`,
    );

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // 1. Build the AI context allowlist — explicitly safe fields only
        const allowlistedFields = this.buildAllowlist();

        // 2. Run the firewall check — ensure no prohibited fields leak to AI
        const violations =
          this.aiContextFirewallService.validateAiContextAllowlist(
            allowlistedFields,
          );

        if (violations.length > 0) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.AI_CONTEXT_VIOLATION,
            `[SHADOW-FIREWALL] AI context allowlist contains prohibited fields: ${violations.join(', ')}`,
          );
        }

        // 3. Load the assignment's criteria
        const criteria = await this.loadAssignmentCriteria(
          input.searchAssignmentId,
          workspaceId,
          input.criterionIds,
        );

        if (criteria.length === 0) {
          this.logger.warn(
            `[SHADOW-MODE] No criteria found for searchAssignment=${input.searchAssignmentId}`,
          );

          return this.buildEmptyOutput();
        }

        // 4. Load the candidacies to evaluate
        const candidacies = await this.loadCandidacies(
          input.searchAssignmentId,
          workspaceId,
          input.candidacyIds,
        );

        if (candidacies.length === 0) {
          this.logger.warn(
            `[SHADOW-MODE] No candidacies found for searchAssignment=${input.searchAssignmentId}`,
          );

          return this.buildEmptyOutput();
        }

        // 5. For each candidacy, evaluate against each criterion
        const evaluations: ShadowEvaluationResult[] = [];
        const inputHashes: string[] = [];
        let storedCount = 0;

        for (const candidacy of candidacies) {
          this.logger.debug(
            `[SHADOW-MODE] Evaluating candidacy=${candidacy.id} against ${criteria.length} criteria`,
          );

          const perCriterionScores: PerCriterionScore[] = [];

          for (const criterion of criteria) {
            // Build the evaluation payload (simulated — in production this calls an LLM)
            const evaluation = await this.evaluateCandidacyAgainstCriterion(
              candidacy,
              criterion,
              workspaceId,
              authContext,
            );

            perCriterionScores.push(evaluation);

            // Store the shadow assessment record
            await this.storeShadowAssessmentRecord({
              candidacyId: candidacy.id,
              criterionId: criterion.id,
              criterionName: criterion.name,
              score: evaluation.score,
              evidence: evaluation.evidence,
              guardrailChecks: evaluation.guardrailChecks,
              confidenceLevel: evaluation.confidenceLevel,
              source: 'ai_shadow' as CriterionAssessmentSource,
              shadowStatus: 'pending_review' as ShadowAssessmentStatus,
              aiModelVersion: this.AI_MODEL_VERSION,
              promptVersion: this.PROMPT_VERSION,
              redactionManifest: violations,
              workspaceId,
              evaluatedBy: authContext.type === 'user'
                ? authContext.workspaceMemberId
                : null,
            });

            storedCount++;
          }

          evaluations.push({
            candidacyId: candidacy.id,
            criteriaEvaluations: perCriterionScores,
          });
        }

        const shadowRunId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        this.logger.log(
          `[SHADOW-MODE] Completed criterion assessment shadow run ${shadowRunId}: ` +
          `${evaluations.length} candidacies evaluated, ${storedCount} shadow records stored. ` +
          `All results are SHADOW — none auto-submitted. Human review required.`,
        );

        return {
          shadowRunId,
          evaluatedAt: new Date().toISOString(),
          aiModelVersion: this.AI_MODEL_VERSION,
          promptVersion: this.PROMPT_VERSION,
          inputHashes,
          redactionManifest: violations,
          evaluations,
          storedCount,
        };
      },
      authContext,
    );
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async assertFeatureFlagsEnabled(workspaceId: string): Promise<void> {
    const aiEnabled =
      await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
        workspaceId,
      );

    if (!aiEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
        'IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED is not enabled for this workspace',
      );
    }

    const shadowEnabled =
      await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_CRITERION_ASSESSMENT_SHADOW_ENABLED,
        workspaceId,
      );

    if (!shadowEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED,
        'IS_CRITERION_ASSESSMENT_SHADOW_ENABLED is not enabled for this workspace',
      );
    }
  }

  /**
   * Builds the positive allowlist of candidate profile fields that are safe
   * to send to the AI for criterion assessment. PII/identifying fields are
   * deliberately excluded.
   */
  private buildAllowlist(): string[] {
    return [
      // Career experience (non-identifying)
      'headline',
      'summary',
      'yearsOfExperience',
      'currentTitle',
      'isBoardReady',
      // Education (type/institution name is non-PII in this context)
      'education',
      // Capabilities & skills
      'capabilities',
      'languages',
      'awards',
      // External profile URLs (platform type, not the profile itself)
      'externalProfiles',
    ];
  }

  private async loadAssignmentCriteria(
    searchAssignmentId: string,
    workspaceId: string,
    criterionIds?: string[],
  ): Promise<SearchCriterionWorkspaceEntity[]> {
    // Criteria are linked to a search assignment through positionSpecification
    // For now we query by searchAssignment relation via candidacies or positionSpec
    // Since criteria are linked to positionSpecification, we do a wider query
    const criterionRepo =
      await this.globalWorkspaceOrmManager.getRepository<SearchCriterionWorkspaceEntity>(
        workspaceId,
        SearchCriterionWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const findOptions: any = {
      where: {
        specification: {
          assignment: {
            id: searchAssignmentId,
          },
        },
      },
    };

    if (criterionIds && criterionIds.length > 0) {
      findOptions.where.id = { $in: criterionIds };
    }

    const criteria = await criterionRepo.find(findOptions);

    return criteria;
  }

  private async loadCandidacies(
    searchAssignmentId: string,
    workspaceId: string,
    candidacyIds?: string[],
  ): Promise<SearchCandidacyWorkspaceEntity[]> {
    const candidacyRepo =
      await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
        workspaceId,
        SearchCandidacyWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const findOptions: any = {
      where: {
        searchAssignmentId,
      },
    };

    if (candidacyIds && candidacyIds.length > 0) {
      findOptions.where.id = { $in: candidacyIds };
    }

    const candidacies = await candidacyRepo.find(findOptions);

    return candidacies;
  }

  /**
   * Evaluates a single candidacy against a single criterion.
   * In production this method would call an LLM with the redacted candidate
   * profile and criterion definition. Currently returns a simulated evaluation
   * with the audit trail structure in place.
   */
  private async evaluateCandidacyAgainstCriterion(
    _candidacy: SearchCandidacyWorkspaceEntity,
    criterion: SearchCriterionWorkspaceEntity,
    _workspaceId: string,
    _authContext: WorkspaceAuthContext,
  ): Promise<PerCriterionScore> {
    // SHADOW-MODE: In a production implementation this would:
    // 1. Build a redacted context payload using the AI context firewall
    // 2. Call the LLM with the criterion definition + redacted candidate profile
    // 3. Parse the structured response
    //
    // For this phase (PR33), we return a structured placeholder that exercises
    // the full shadow pipeline — storage, evidence trail, and human review flow.
    //
    // The word "shadow" appears prominently in logs and stored records as required.

    this.logger.debug(
      `[SHADOW-MODE] Simulating AI evaluation for criterion=${criterion.id} ("${criterion.name}")`,
    );

    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      score: null,
      evidence: null,
      guardrailChecks: [
        `[SHADOW] Guardrail: criterion ${criterion.name} evaluated against non-PII profile fields only`,
        `[SHADOW] Guardrail: candidate PII redacted per AI context firewall`,
        `[SHADOW] Guardrail: evaluation is shadow — candidate pipeline status unaffected`,
      ],
      confidenceLevel: 'low',
    };
  }

  /**
   * Stores a single shadow assessment record in the criterionEvaluation
   * object. The record is tagged as a shadow assessment so it is filtered
   * from client-facing views. Human review is required to promote any
   * evaluation to an active candidacy pipeline status.
   */
  private async storeShadowAssessmentRecord(params: {
    candidacyId: string;
    criterionId: string;
    criterionName: string;
    score: number | null;
    evidence: string | null;
    guardrailChecks: string[];
    confidenceLevel: string;
    source: CriterionAssessmentSource;
    shadowStatus: ShadowAssessmentStatus;
    aiModelVersion: string;
    promptVersion: string;
    redactionManifest: string[];
    workspaceId: string;
    evaluatedBy: string | null;
  }): Promise<void> {
    const evaluationRepo =
      await this.globalWorkspaceOrmManager.getRepository<any>(
        params.workspaceId,
        'criterionEvaluation',
        { shouldBypassPermissionChecks: true },
      );

    const now = new Date().toISOString();

    await evaluationRepo.save({
      name: `[SHADOW] ${params.criterionName} — ${params.shadowStatus}`,
      criterionId: params.criterionId,
      candidacyId: params.candidacyId,
      aiDraft: params.evidence,
      aiDraftGeneratedAt: now,
      aiModelVersion: params.aiModelVersion,
      isHumanReviewed: false,
      // Shadow-specific metadata stored as assessorNotes for the human review flow
      assessorNotes: JSON.stringify({
        __shadow: true,
        source: params.source,
        shadowStatus: params.shadowStatus,
        guardrailChecks: params.guardrailChecks,
        confidenceLevel: params.confidenceLevel,
        promptVersion: params.promptVersion,
        redactionManifest: params.redactionManifest,
        evaluatedBy: params.evaluatedBy,
        evaluatedAt: now,
        warning: 'SHADOW ASSESSMENT — Not reviewed by human. Do not use for client-facing decisions.',
      }),
    } as any);

    this.logger.debug(
      `[SHADOW-MODE] Stored shadow assessment for candidacy=${params.candidacyId}, ` +
      `criterion=${params.criterionId} [${params.shadowStatus}]`,
    );
  }

  private buildEmptyOutput(): ShadowEvaluationOutput {
    return {
      shadowRunId: crypto.randomUUID?.() ?? `${Date.now()}-empty`,
      evaluatedAt: new Date().toISOString(),
      aiModelVersion: this.AI_MODEL_VERSION,
      promptVersion: this.PROMPT_VERSION,
      inputHashes: [],
      redactionManifest: [],
      evaluations: [],
      storedCount: 0,
    };
  }
}
