import { Injectable, Logger } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import {
  type SearchHealthAdvisoryDTO,
  type SearchHealthMetricDTO,
} from 'src/modules/executive-search/dtos/search-health-advisory.dto';

const PIPELINE_HEALTH_METRICS: Array<{
  code: string;
  label: string;
  compute: (counts: Record<string, number>) => {
    value: number | null;
    valueText: string | null;
    trend: string | null;
    advisory: string | null;
    severity: string | null;
  };
}> = [
  {
    code: 'candidacy_pipeline_depth',
    label: 'Pipeline Depth',
    compute: (counts) => {
      const v = counts.total ?? 0;
      const advisory =
        v < 3
          ? 'Pipeline is thin — consider expanding research outreach'
          : v < 6
            ? 'Pipeline depth is adequate'
            : 'Pipeline depth is healthy';
      return {
        value: v,
        valueText: `${v} candidates`,
        trend: null,
        advisory,
        severity: v < 3 ? 'WARNING' : 'OK',
      };
    },
  },
  {
    code: 'stage_conversion_rate',
    label: 'Interview Conversion Rate',
    compute: (counts) => {
      const interviewed = counts.interviewed ?? 0;
      const total = counts.total ?? 1;
      const rate = total > 0 ? interviewed / total : 0;
      return {
        value: rate,
        valueText: `${(rate * 100).toFixed(1)}%`,
        trend: null,
        advisory:
          rate < 0.3
            ? 'Low interview conversion — review screening criteria'
            : 'Conversion rate is within expected range',
        severity: rate < 0.3 ? 'WARNING' : 'OK',
      };
    },
  },
  {
    code: 'avg_time_in_stage',
    label: 'Average Time in Stage (days)',
    compute: (_counts) => ({
      value: null,
      valueText: null,
      trend: null,
      advisory: 'Time-in-stage tracking requires candidacy stage event history',
      severity: 'INFO',
    }),
  },
  {
    code: 'placement_rate',
    label: 'Placement Rate',
    compute: (counts) => {
      const placed = counts.placed ?? 0;
      const total = counts.total ?? 1;
      const rate = total > 0 ? placed / total : 0;
      return {
        value: rate,
        valueText: `${(rate * 100).toFixed(1)}%`,
        trend: null,
        advisory:
          rate < 0.2
            ? 'Placement rate is below target — review evaluation criteria'
            : 'Placement rate is healthy',
        severity: rate < 0.2 ? 'WARNING' : 'OK',
      };
    },
  },
  {
    code: 'candidate_diversity_index',
    label: 'Diversity Index',
    compute: (_counts) => ({
      value: null,
      valueText: 'Advisory-only metric',
      trend: null,
      advisory:
        'Diversity index requires demographic data — not computed in advisory mode',
      severity: 'INFO',
    }),
  },
];

@Injectable()
export class SearchHealthAdvisoryService {
  private readonly logger = new Logger(SearchHealthAdvisoryService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async computeSearchHealth(
    searchAssignmentId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<SearchHealthAdvisoryDTO> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const assignmentRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchAssignmentWorkspaceEntity>(
            workspaceId,
            SearchAssignmentWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const assignment = await assignmentRepo.findOne({
          where: { id: searchAssignmentId },
        });

        if (!assignment) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            `Search assignment not found: ${searchAssignmentId}`,
          );
        }

        const candidacyRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            workspaceId,
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const candidacies = await candidacyRepo.find({
          where: { searchAssignmentId },
        });

        const counts: Record<string, number> = {
          total: candidacies.length,
          interviewed: 0,
          placed: 0,
        };

        const metrics: SearchHealthMetricDTO[] = PIPELINE_HEALTH_METRICS.map(
          ({ code, label, compute }) => {
            const result = compute(counts);
            return {
              metricCode: code,
              label,
              value: result.value,
              valueText: result.valueText,
              trend: result.trend,
              advisory: result.advisory,
              severity: result.severity,
            };
          },
        );

        const warnings = metrics.filter((m) => m.severity === 'WARNING').length;
        const overallHealth =
          warnings === 0
            ? 'HEALTHY'
            : warnings <= 1
              ? 'CAUTION'
              : 'ATTENTION_NEEDED';

        const summaryAdvisory =
          overallHealth === 'HEALTHY'
            ? 'All pipeline metrics are within healthy ranges.'
            : `${warnings} metric${warnings > 1 ? 's' : ''} may need attention. Review detailed metrics for action items.`;

        this.logger.log(
          `Search health computed for assignment ${searchAssignmentId}: ${overallHealth} (${candidacies.length} candidates)`,
        );

        return {
          searchAssignmentId,
          metrics,
          overallHealth,
          summaryAdvisory,
          computedAt: new Date().toISOString(),
        };
      },
      authContext,
    );
  }
}
