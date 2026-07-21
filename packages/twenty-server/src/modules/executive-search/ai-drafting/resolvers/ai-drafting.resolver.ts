import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { AiDraftResultDTO } from 'src/modules/executive-search/ai-drafting/dtos/ai-draft-result.dto';
import {
  DraftAssignmentIntakeInputDTO,
  DraftPositionSpecInputDTO,
  DraftResearchStrategyInputDTO,
  DraftStatusReportInputDTO,
  DraftCandidatePresentationInputDTO,
} from 'src/modules/executive-search/ai-drafting/dtos/draft-mutation-inputs.dto';
import { AssignmentIntakeDraftService } from 'src/modules/executive-search/ai-drafting/services/assignment-intake-draft.service';
import { PositionSpecDraftService } from 'src/modules/executive-search/ai-drafting/services/position-spec-draft.service';
import { ResearchStrategyDraftService } from 'src/modules/executive-search/ai-drafting/services/research-strategy-draft.service';
import { StatusReportDraftService } from 'src/modules/executive-search/ai-drafting/services/status-report-draft.service';
import { CandidatePresentationDraftService } from 'src/modules/executive-search/ai-drafting/services/candidate-presentation-draft.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class AiDraftingResolver {
  constructor(
    private readonly assignmentIntakeDraftService: AssignmentIntakeDraftService,
    private readonly positionSpecDraftService: PositionSpecDraftService,
    private readonly researchStrategyDraftService: ResearchStrategyDraftService,
    private readonly statusReportDraftService: StatusReportDraftService,
    private readonly candidatePresentationDraftService: CandidatePresentationDraftService,
  ) {}

  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async draftAssignmentIntake(
    @Args('input', { type: () => DraftAssignmentIntakeInputDTO })
    input: DraftAssignmentIntakeInputDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.assignmentIntakeDraftService.draft(workspaceId, {
      conversationNotes: input.conversationNotes,
      opportunityId: input.opportunityId,
      clientCompanyId: input.clientCompanyId,
    });
  }

  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async draftPositionSpecification(
    @Args('input', { type: () => DraftPositionSpecInputDTO })
    input: DraftPositionSpecInputDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.positionSpecDraftService.draft(workspaceId, {
      assignmentId: input.assignmentId,
      additionalContext: input.additionalContext,
    });
  }

  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async draftResearchStrategy(
    @Args('input', { type: () => DraftResearchStrategyInputDTO })
    input: DraftResearchStrategyInputDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.researchStrategyDraftService.draft(workspaceId, {
      positionSpecId: input.positionSpecId,
      marketMapId: input.marketMapId,
      researcherNotes: input.researcherNotes,
    });
  }

  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async draftStatusReport(
    @Args('input', { type: () => DraftStatusReportInputDTO })
    input: DraftStatusReportInputDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.statusReportDraftService.draft(workspaceId, {
      assignmentId: input.assignmentId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    });
  }

  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async draftCandidatePresentation(
    @Args('input', { type: () => DraftCandidatePresentationInputDTO })
    input: DraftCandidatePresentationInputDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.candidatePresentationDraftService.draft(workspaceId, {
      candidacyId: input.candidacyId,
      assignmentId: input.assignmentId,
      presentationContext: input.presentationContext,
      candidateConsented: input.candidateConsented,
    });
  }
}
