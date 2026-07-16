import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ConvertOpportunityToAssignmentDTO } from 'src/modules/executive-search/dtos/convert-opportunity-to-assignment.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { ConvertOpportunityToAssignmentService } from 'src/modules/executive-search/services/convert-opportunity-to-assignment.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class ConvertOpportunityToAssignmentResolver {
  constructor(
    private readonly convertOpportunityToAssignmentService: ConvertOpportunityToAssignmentService,
  ) {}

  @Mutation(() => ConvertOpportunityToAssignmentDTO)
  @UseGuards(NoPermissionGuard)
  async convertOpportunityToAssignment(
    @Args('opportunityId', { type: () => UUIDScalarType })
    opportunityId: string,
  ): Promise<ConvertOpportunityToAssignmentDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.convertOpportunityToAssignmentService.convertOpportunityToAssignment(
      opportunityId,
      workspaceId,
      authContext,
    );
  }
}
