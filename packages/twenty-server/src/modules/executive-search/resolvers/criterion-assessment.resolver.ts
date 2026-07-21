import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Float, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { CriterionAssessmentService } from 'src/modules/executive-search/services/criterion-assessment.service';
import {
  GenerateCriterionAssessmentsResult,
  SubmitCriterionEvaluationResult,
} from 'src/modules/executive-search/dtos/criterion-assessment.dto';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class CriterionAssessmentResolver {
  constructor(
    private readonly criterionAssessmentService: CriterionAssessmentService,
  ) {}

  /**
   * Generate AI-powered criterion assessments for a candidacy in SHADOW MODE.
   * AI drafts evaluations against each search criterion — a human MUST review
   * and submit each one before it counts.
   *
   * Kill switch: IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED must be true.
   */
  @Mutation(() => GenerateCriterionAssessmentsResult)
  @UseGuards(NoPermissionGuard)
  async generateCriterionAssessments(
    @Args('candidacyId', { type: () => UUIDScalarType })
    candidacyId: string,
  ): Promise<GenerateCriterionAssessmentsResult> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.criterionAssessmentService.generateAssessments(
      candidacyId,
      workspaceId,
      authContext,
    );
  }

  /**
   * Human reviewer submits their professional judgment for an AI-drafted
   * criterion evaluation. Once submitted, the evaluation is marked as
   * human-reviewed and cannot be re-submitted.
   */
  @Mutation(() => SubmitCriterionEvaluationResult)
  @UseGuards(NoPermissionGuard)
  async submitCriterionEvaluation(
    @Args('evaluationId', { type: () => UUIDScalarType })
    evaluationId: string,
    @Args('rating', { type: () => Float })
    rating: number,
    @Args('assessorNotes', { type: () => String, nullable: true })
    assessorNotes: string | null,
  ): Promise<SubmitCriterionEvaluationResult> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.criterionAssessmentService.submitEvaluation(
      evaluationId,
      rating,
      assessorNotes,
      workspaceId,
      authContext,
    );
  }
}
