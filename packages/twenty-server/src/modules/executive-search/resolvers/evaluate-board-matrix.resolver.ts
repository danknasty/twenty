import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { EvaluateBoardMatrixDTO } from 'src/modules/executive-search/dtos/evaluate-board-matrix.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { BoardMatrixEvaluationService } from 'src/modules/executive-search/services/board-matrix-evaluation.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class EvaluateBoardMatrixResolver {
  constructor(
    private readonly boardMatrixEvaluationService: BoardMatrixEvaluationService,
  ) {}

  @Query(() => EvaluateBoardMatrixDTO)
  @UseGuards(NoPermissionGuard)
  async evaluateBoardMatrix(
    @Args('boardCompositionProfileId', { type: () => String })
    boardCompositionProfileId: string,
    @Args('candidacyId', { type: () => String })
    candidacyId: string,
  ): Promise<EvaluateBoardMatrixDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    const result =
      await this.boardMatrixEvaluationService.evaluateBoardMatrix(
        boardCompositionProfileId,
        candidacyId,
        workspaceId,
        authContext,
      );

    return { result };
  }
}
