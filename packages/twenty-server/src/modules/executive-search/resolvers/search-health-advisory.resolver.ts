import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { SearchHealthAdvisoryDTO } from 'src/modules/executive-search/dtos/search-health-advisory.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { SearchHealthAdvisoryService } from 'src/modules/executive-search/services/search-health-advisory.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class SearchHealthAdvisoryResolver {
  constructor(
    private readonly searchHealthAdvisoryService: SearchHealthAdvisoryService,
  ) {}

  @Query(() => SearchHealthAdvisoryDTO)
  @UseGuards(NoPermissionGuard)
  async searchHealthAdvisory(
    @Args('searchAssignmentId', { type: () => String })
    searchAssignmentId: string,
  ): Promise<SearchHealthAdvisoryDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.searchHealthAdvisoryService.computeSearchHealth(
      searchAssignmentId,
      workspaceId,
      authContext,
    );
  }
}
