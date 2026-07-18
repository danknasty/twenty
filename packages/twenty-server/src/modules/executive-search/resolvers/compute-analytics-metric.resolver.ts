import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ComputeAnalyticsMetricDTO } from 'src/modules/executive-search/dtos/compute-analytics-metric.dto';
import { ExecutiveSearchGraphqlApiExceptionFilter } from 'src/modules/executive-search/exceptions/executive-search-graphql-api-exception.filter';
import { ComputeAnalyticsMetricService } from 'src/modules/executive-search/services/compute-analytics-metric.service';

@MetadataResolver()
@UseFilters(ExecutiveSearchGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
export class ComputeAnalyticsMetricResolver {
  constructor(
    private readonly computeAnalyticsMetricService: ComputeAnalyticsMetricService,
  ) {}

  @Query(() => ComputeAnalyticsMetricDTO)
  @UseGuards(NoPermissionGuard)
  async computeAnalyticsMetric(
    @Args('metricCode', { type: () => String })
    metricCode: string,
    @Args('periodStart', { type: () => String, nullable: true })
    periodStart?: string,
    @Args('periodEnd', { type: () => String, nullable: true })
    periodEnd?: string,
    @Args('dimensions', { type: () => String, nullable: true })
    dimensions?: string,
    @Args('forceRecompute', { type: () => Boolean, nullable: true })
    forceRecompute?: boolean,
  ): Promise<ComputeAnalyticsMetricDTO> {
    const authContext = getWorkspaceAuthContext();
    const workspaceId = authContext.workspace.id;

    return this.computeAnalyticsMetricService.computeMetric(
      metricCode,
      workspaceId,
      authContext,
      { periodStart, periodEnd, dimensions, forceRecompute },
    );
  }
}
