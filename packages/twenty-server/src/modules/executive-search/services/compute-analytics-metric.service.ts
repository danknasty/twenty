import { Injectable } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ComputeAnalyticsMetricDTO } from 'src/modules/executive-search/dtos/compute-analytics-metric.dto';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AnalyticsDomainMetricWorkspaceEntity } from 'src/modules/executive-search/standard-objects/analytics-domain-metric.workspace-entity';
import { AnalyticsMetricSnapshotWorkspaceEntity } from 'src/modules/executive-search/standard-objects/analytics-metric-snapshot.workspace-entity';

@Injectable()
export class ComputeAnalyticsMetricService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async computeMetric(
    metricCode: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
    options?: {
      periodStart?: string;
      periodEnd?: string;
      dimensions?: string;
      forceRecompute?: boolean;
    },
  ): Promise<ComputeAnalyticsMetricDTO> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const forceRecompute = options?.forceRecompute ?? false;
        const periodStart = options?.periodStart ?? this.defaultPeriodStart();
        const periodEnd = options?.periodEnd ?? this.defaultPeriodEnd();
        const parsedDimensions: Record<string, unknown> | null =
          options?.dimensions ? JSON.parse(options.dimensions) : null;

        const metricRepo =
          await this.globalWorkspaceOrmManager.getRepository<AnalyticsDomainMetricWorkspaceEntity>(
            workspaceId,
            AnalyticsDomainMetricWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const metric = await metricRepo.findOne({
          where: { code: metricCode },
        });

        if (!metric) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.METRIC_NOT_FOUND,
            `Metric not found: ${metricCode}`,
          );
        }

        const snapshotRepo =
          await this.globalWorkspaceOrmManager.getRepository<AnalyticsMetricSnapshotWorkspaceEntity>(
            workspaceId,
            AnalyticsMetricSnapshotWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        if (!forceRecompute) {
          const existingSnapshot = await snapshotRepo.findOne({
            where: {
              metricId: metric.id,
              periodStart,
              periodEnd,
              dimensions: parsedDimensions,
              computationStatus: 'SUCCESS' as any,
            },
            order: { computedAt: 'DESC' as any },
          });

          if (existingSnapshot) {
            return {
              value: existingSnapshot.value,
              valueText: existingSnapshot.valueText,
              sourceCount: existingSnapshot.sourceCount,
              computedAt: this.formatDateOrString(
                existingSnapshot.computedAt,
              ),
              computationStatus: 'SUCCESS',
              snapshotId: existingSnapshot.id,
              periodStart: this.formatDateOrString(
                existingSnapshot.periodStart,
              ),
              periodEnd: this.formatDateOrString(existingSnapshot.periodEnd),
            };
          }
        }

        const now = new Date();
        const result = await this.computeMetricValue(
          metric,
          workspaceId,
          options,
          now,
        );
        const snapshot = await snapshotRepo.save({
          name: `${metric.name} — ${periodStart} to ${periodEnd}`,
          metricId: metric.id,
          periodStart: periodStart as any,
          periodEnd: periodEnd as any,
          periodLabel: this.formatPeriodLabel(periodStart, periodEnd),
          granularity: metric.timeWindow,
          value: result.value,
          valueText: result.valueText,
          sourceCount: result.sourceCount,
          computedAt: now as any,
          computationStatus: (result.error ? 'PARTIAL' : 'SUCCESS') as any,
          computationNotes: result.error ?? null,
          computedById: authContext.type === 'user'
            ? authContext.workspaceMemberId
            : null,
          dimensions: parsedDimensions as any,
        } as any);

        return {
          value: result.value,
          valueText: result.valueText,
          sourceCount: result.sourceCount,
          computedAt: now.toISOString(),
          computationStatus: result.error ? 'PARTIAL' : 'SUCCESS',
          snapshotId: snapshot.id,
          periodStart,
          periodEnd,
        };
      },
      authContext,
    );
  }

  private async computeMetricValue(
    metric: any,
    workspaceId: string,
    options: any,
    now: Date,
  ): Promise<{
    value: number | null;
    valueText: string | null;
    sourceCount: number | null;
    error?: string;
  }> {
    return {
      value: null,
      valueText: `${metric.code} computed at ${now.toISOString()}`,
      sourceCount: 0,
    };
  }

  /**
   * Safely formats a value that may be a Date or a string (e.g. DATE columns
   * stored as YYYY-MM-DD strings) into an ISO string. Returns null if the
   * value is null/undefined.
   */
  private formatDateOrString(value: any): string | null {
    if (value == null) return null;
    if (value instanceof Date) return value.toISOString();
    return String(value);
  }

  private defaultPeriodStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  }

  private defaultPeriodEnd(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatPeriodLabel(start: string, end: string): string {
    return `${start} to ${end}`;
  }
}
