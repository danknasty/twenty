import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import {
  AmbiguousMatchQueueEntryDTO,
  ResolveAmbiguousMatchResultDTO,
} from 'src/modules/executive-search/dtos/ambiguous-match-queue.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { AmbiguousMatchQueueService } from 'src/modules/executive-search/migration/services/ambiguous-match-queue.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class AmbiguousMatchQueueResolver {
  constructor(
    private readonly queueService: AmbiguousMatchQueueService,
  ) {}

  @Query(() => [AmbiguousMatchQueueEntryDTO])
  @UseGuards(NoPermissionGuard)
  async ambiguousMatchQueuePending(
    @Args('pair', { type: () => String, nullable: true })
    pair?: string,
    @Args('limit', { type: () => Number, nullable: true })
    limit?: number,
  ): Promise<AmbiguousMatchQueueEntryDTO[]> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.queueService.listPending(workspaceId, pair, limit ?? 100);
  }

  @Mutation(() => ResolveAmbiguousMatchResultDTO)
  @UseGuards(NoPermissionGuard)
  async resolveAmbiguousMatchLink(
    @Args('queueId', { type: () => UUIDScalarType })
    queueId: string,
    @Args('twentyEntityName', { type: () => String })
    twentyEntityName: string,
    @Args('twentyRecordId', { type: () => UUIDScalarType })
    twentyRecordId: string,
  ): Promise<ResolveAmbiguousMatchResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    await this.queueService.resolveLink(
      workspaceId,
      queueId,
      twentyEntityName,
      twentyRecordId,
      authContext.user?.id ?? 'system',
    );

    return {
      queueId,
      resolutionState: 'RESOLVED_LINKED' as const,
    };
  }

  @Mutation(() => ResolveAmbiguousMatchResultDTO)
  @UseGuards(NoPermissionGuard)
  async resolveAmbiguousMatchNew(
    @Args('queueId', { type: () => UUIDScalarType })
    queueId: string,
  ): Promise<ResolveAmbiguousMatchResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    await this.queueService.resolveNew(
      workspaceId,
      queueId,
      authContext.user?.id ?? 'system',
    );

    return {
      queueId,
      resolutionState: 'RESOLVED_NEW' as const,
    };
  }

  @Mutation(() => ResolveAmbiguousMatchResultDTO)
  @UseGuards(NoPermissionGuard)
  async skipAmbiguousMatch(
    @Args('queueId', { type: () => UUIDScalarType })
    queueId: string,
    @Args('reason', { type: () => String, nullable: true })
    reason?: string,
  ): Promise<ResolveAmbiguousMatchResultDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    await this.queueService.skip(
      workspaceId,
      queueId,
      authContext.user?.id ?? 'system',
      reason ?? 'Skipped via UI',
    );

    return {
      queueId,
      resolutionState: 'RESOLVED_SKIP' as const,
    };
  }
}
