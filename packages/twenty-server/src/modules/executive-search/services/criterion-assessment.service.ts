import { Injectable, Logger } from '@nestjs/common';

import { generateText } from 'ai';
import { FeatureFlagKey } from 'twenty-shared/types';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { UsageOperationType } from 'src/engine/core-modules/usage/enums/usage-operation-type.enum';
import { AiBillingService } from 'src/engine/metadata-modules/ai/ai-billing/services/ai-billing.service';
import { AiModelRegistryService } from 'src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { SearchCriterionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-criterion.workspace-entity';
import { PositionSpecificationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/position-specification.workspace-entity';
import { CriterionEvaluationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/criterion-evaluation.workspace-entity';
import { ExecutiveProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-profile.workspace-entity';
import { AiPromptTemplateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-prompt-template.workspace-entity';

import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { AiPromptCategory } from 'src/modules/executive-search/common/enums/ai-prompt-category.enum';

import { type GenerateCriterionAssessmentsResult } from 'src/modules/executive-search/dtos/criterion-assessment.dto';

/**
 * Approved allowlist of candidate/criterion fields safe to include in AI context.
 * These are deliberately narrow — no demographics, secrets, or commercial data.
 */
const ASSESSMENT_ALLOWLIST = [
  'searchCandidacy.name',
  'searchCandidacy.stage',
  'searchCriterion.name',
  'searchCriterion.description',
  'searchCriterion.category',
  'searchCriterion.weight',
  'searchCriterion.isRequired',
  'executiveProfile.yearsOfExperience',
  'executiveProfile.functionalAreas',
  'executiveProfile.industrySectors',
];

@Injectable()
export class CriterionAssessmentService {
  private readonly logger = new Logger(CriterionAssessmentService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiModelRegistryService: AiModelRegistryService,
    private readonly aiBillingService: AiBillingService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Generate AI-powered criterion assessments for a candidacy in SHADOW MODE.
   * AI drafts evaluations against each search criterion. Results are never
   * auto-applied — a human must review and submit each one.
   */
  async generateAssessments(
    candidacyId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<GenerateCriterionAssessmentsResult> {
    // 1. Kill switch — IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED must be true
    const aiEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!aiEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.OPERATION_REQUIRES_FEATURE_FLAG,
        'AI candidate features are not enabled. Enable IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED.',
      );
    }

    // 2. Firewall assertion — validate allowlist
    this.aiContextFirewallService.assertAiContextAllowlistSafe(
      ASSESSMENT_ALLOWLIST,
    );

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // 3. Load candidacy
        const candidacyRepository =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            workspaceId,
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const candidacy = await candidacyRepository.findOne({
          where: { id: candidacyId },
        });

        if (!candidacy) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            `SearchCandidacy ${candidacyId} not found`,
          );
        }

        // 4. Load assignment → positionSpecification → criteria chain
        if (!candidacy.searchAssignmentId) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.INVALID_STATE,
            `SearchCandidacy ${candidacyId} has no assignment`,
          );
        }

        const positionSpecRepository =
          await this.globalWorkspaceOrmManager.getRepository<PositionSpecificationWorkspaceEntity>(
            workspaceId,
            PositionSpecificationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const positionSpec = await positionSpecRepository.findOne({
          where: { assignmentId: candidacy.searchAssignmentId },
        });

        if (!positionSpec) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            "No position specification found for this candidacy's assignment",
          );
        }

        const criterionRepository =
          await this.globalWorkspaceOrmManager.getRepository<SearchCriterionWorkspaceEntity>(
            workspaceId,
            SearchCriterionWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const criteria = await criterionRepository.find({
          where: { specificationId: positionSpec.id },
        });

        if (criteria.length === 0) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.INVALID_STATE,
            'No search criteria found for the position specification',
          );
        }

        // 5. Load registered AI model
        const registeredModel =
          this.aiModelRegistryService.resolveModelForAgent(null);

        // 6. Load CRITERION_ASSESSMENT prompt template
        const promptTemplateRepository =
          await this.globalWorkspaceOrmManager.getRepository<AiPromptTemplateWorkspaceEntity>(
            workspaceId,
            AiPromptTemplateWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const promptTemplate = await promptTemplateRepository.findOne({
          where: {
            category: AiPromptCategory.CRITERION_ASSESSMENT,
            isActive: true,
            isApproved: true,
          },
        });

        const systemPrompt =
          promptTemplate?.promptText ?? this.getDefaultSystemPrompt();

        const modelVersion = promptTemplate?.version ?? 'default';

        // 7. Load executive profile for candidate context
        let executiveProfile: ExecutiveProfileWorkspaceEntity | null = null;

        if (candidacy.executiveProfileId) {
          const profileRepository =
            await this.globalWorkspaceOrmManager.getRepository<ExecutiveProfileWorkspaceEntity>(
              workspaceId,
              ExecutiveProfileWorkspaceEntity,
              { shouldBypassPermissionChecks: true },
            );

          executiveProfile = await profileRepository.findOne({
            where: { id: candidacy.executiveProfileId },
          });
        }

        // 8. Build candidate context from allowlisted fields
        const candidateContext = this.buildCandidateContext(
          candidacy,
          executiveProfile,
        );

        // 9. For each criterion, call AI and create draft evaluations
        const evaluationRepository =
          await this.globalWorkspaceOrmManager.getRepository<CriterionEvaluationWorkspaceEntity>(
            workspaceId,
            CriterionEvaluationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const results: GenerateCriterionAssessmentsResult['evaluations'] = [];

        for (const criterion of criteria) {
          const userPrompt = this.buildCriterionPrompt(
            criterion,
            candidateContext,
          );

          let aiResponse: string;
          let inputTokens = 0;
          let outputTokens = 0;

          try {
            const result = await generateText({
              model: registeredModel.model,
              system: systemPrompt,
              prompt: userPrompt,
            });

            aiResponse = result.text;
            inputTokens = result.usage?.inputTokens ?? 0;
            outputTokens = result.usage?.outputTokens ?? 0;
          } catch (error) {
            this.logger.error(
              `AI call failed for criterion ${criterion.id}: ${String(error)}`,
            );

            throw new ExecutiveSearchException(
              ExecutiveSearchExceptionCode.INTERNAL_ERROR,
              `AI assessment failed for criterion "${criterion.name}": ${String(error)}`,
            );
          }

          // Parse structured JSON from AI response
          const parsed = this.parseCriterionAssessment(
            aiResponse,
            criterion.name,
          );

          // Create draft evaluation (shadow mode — NOT human reviewed)
          const insertResult = await evaluationRepository.insert({
            name: `${criterion.name} — AI Draft`,
            rating: parsed.rating,
            evidenceSummary: parsed.evidenceSummary ?? null,
            evidenceReferences: parsed.evidenceReferences ?? null,
            aiDraft: aiResponse,
            aiDraftGeneratedAt: new Date(),
            aiModelVersion: modelVersion,
            isHumanReviewed: false,
            assessorNotes: null,
            candidacyId,
            criterionId: criterion.id,
            assessmentId: null,
          } as any);
          // oxlint-disable-next-line typescript/no-explicit-any

          const evaluationId = insertResult.identifiers[0]?.id as string;

          results.push({
            evaluationId,
            criterionName: criterion.name,
            aiRating: parsed.rating,
            isHumanReviewed: false,
          });

          // Bill for AI usage
          void this.aiBillingService.calculateAndBillUsage(
            registeredModel.modelId,
            {
              usage: { inputTokens, outputTokens },
              cacheCreationTokens: 0,
            },
            workspaceId,
            UsageOperationType.AI_WORKFLOW_TOKEN,
            null,
            authContext.type === 'user'
              ? ((authContext as any).userWorkspaceId ?? null)
              : null,
          );
        }

        return {
          candidacyId,
          evaluationCount: results.length,
          evaluations: results,
        };
      },
      authContext,
    );
  }

  /**
   * Human reviewer submits their professional judgment for an AI-drafted evaluation.
   * Once submitted, the evaluation is marked as human-reviewed and the AI draft
   * is superseded by the human's rating and notes.
   */
  async submitEvaluation(
    evaluationId: string,
    rating: number,
    assessorNotes: string | null,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<{ evaluationId: string; isHumanReviewed: boolean }> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const evaluationRepository =
          await this.globalWorkspaceOrmManager.getRepository<CriterionEvaluationWorkspaceEntity>(
            workspaceId,
            CriterionEvaluationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const evaluation = await evaluationRepository.findOne({
          where: { id: evaluationId },
        });

        if (!evaluation) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            `CriterionEvaluation ${evaluationId} not found`,
          );
        }

        if (evaluation.isHumanReviewed) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.INVALID_STATE,
            'This evaluation has already been reviewed by a human',
          );
        }

        // Update with human's professional judgment
        await evaluationRepository.update({ id: evaluationId }, {
          rating,
          assessorNotes: assessorNotes ?? null,
          isHumanReviewed: true,
        } as any);
        // oxlint-disable-next-line typescript/no-explicit-any

        return { evaluationId, isHumanReviewed: true };
      },
      authContext,
    );
  }

  // ── Private helpers ──────────────────────────────────────────────

  private buildCandidateContext(
    candidacy: SearchCandidacyWorkspaceEntity,
    executiveProfile: ExecutiveProfileWorkspaceEntity | null,
  ): Record<string, unknown> {
    return {
      name: (candidacy as any).name ?? null,
      status: (candidacy as any).status ?? null,
      stage: (candidacy as any).currentStage ?? null,
      yearsOfExperience: executiveProfile?.yearsOfExperience ?? null,
    };
  }

  private buildCriterionPrompt(
    criterion: SearchCriterionWorkspaceEntity,
    candidateContext: Record<string, unknown>,
  ): string {
    return `Evaluate the following candidate against this search criterion.

Criterion: ${criterion.name}
Description: ${criterion.description ?? 'No description provided'}
Category: ${(criterion as any).category ?? 'Unknown'}
Weight: ${(criterion as any).weight ?? 'Unweighted'}
Required: ${(criterion as any).isRequired ? 'Yes' : 'No'}

Candidate context:
${JSON.stringify(candidateContext, null, 2)}

Return a JSON object with:
- "rating": number from 1-5 (1=does not meet, 5=exceeds)
- "evidenceSummary": string summarizing the evidence for this rating
- "evidenceReferences": string listing specific evidence sources

Respond with ONLY the JSON object, no other text.`;
  }

  private parseCriterionAssessment(
    aiResponse: string,
    criterionName: string,
  ): {
    rating: number | null;
    evidenceSummary: string | null;
    evidenceReferences: string | null;
  } {
    try {
      // Strip markdown code fences if present
      const cleaned = aiResponse
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        rating: typeof parsed.rating === 'number' ? parsed.rating : null,
        evidenceSummary:
          typeof parsed.evidenceSummary === 'string'
            ? parsed.evidenceSummary
            : null,
        evidenceReferences:
          typeof parsed.evidenceReferences === 'string'
            ? parsed.evidenceReferences
            : null,
      };
    } catch {
      this.logger.warn(
        `Failed to parse AI JSON for criterion "${criterionName}". Response: ${aiResponse.slice(0, 200)}`,
      );

      return { rating: null, evidenceSummary: null, evidenceReferences: null };
    }
  }

  private getDefaultSystemPrompt(): string {
    return `You are a professional executive search assessor evaluating a candidate against a specific search criterion. Your assessment is a DRAFT only — a human reviewer makes the final decision.

Rules:
- Evaluate based on the evidence provided in the candidate context
- Be specific and evidence-based — no vague language
- Rate honestly: 1=does not meet, 3=meets, 5=exceeds
- Include specific evidence references
- Never infer protected characteristics (race, gender, age, religion, etc.)
- Never use culture-fit or personality-based assessments
- Your output is labeled as an AI draft — it does not count as human submission

Respond with ONLY a JSON object containing rating, evidenceSummary, and evidenceReferences.`;
  }
}
