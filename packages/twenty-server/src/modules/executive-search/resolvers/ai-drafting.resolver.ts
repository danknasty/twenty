import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { AiDraftRequestDTO } from 'src/modules/executive-search/dtos/ai-drafting/ai-draft-request.dto';
import { AiDraftResultDTO } from 'src/modules/executive-search/dtos/ai-drafting/ai-draft-result.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { AiDraftingService } from 'src/modules/executive-search/services/ai-drafting.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class AiDraftingResolver {
  constructor(
    private readonly aiDraftingService: AiDraftingService,
  ) {}

  /**
   * Generate an AI draft for any of the 5 PR31 drafting capabilities:
   *   - ASSIGNMENT_INTAKE (assignment intake assistant — Low risk)
   *   - POSITION_SPEC (position specification draft — Low risk)
   *   - RESEARCH_STRATEGY (research strategy draft — Low risk)
   *   - STATUS_REPORT (status report draft — Low risk, Partner review)
   *   - CANDIDATE_PRESENTATION (candidate presentation draft — Medium risk)
   *
   * All drafts require human review before use. Returns gate metadata
   * (requiresHumanReview, guardrailResults) from the appAgents registry.
   */
  @Mutation(() => AiDraftResultDTO)
  @UseGuards(NoPermissionGuard)
  async generateAiDraft(
    @Args('input', { type: () => AiDraftRequestDTO })
    input: AiDraftRequestDTO,
  ): Promise<AiDraftResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.aiDraftingService.generateDraft(
      input,
      workspaceId,
      authContext,
    );
  }
}
