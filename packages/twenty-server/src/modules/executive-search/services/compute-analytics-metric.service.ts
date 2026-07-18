import { Injectable } from '@nestjs/common';

import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { ComputeAnalyticsMetricDTO } from 'src/modules/executive-search/dtos/compute-analytics-metric.dto';

@Injectable()
export class ComputeAnalyticsMetricService {
  constructor(
    private readonly twentyORMModule: TwentyORMModule,
  ) {}

  async computeMetric(
    metricCode: string,
    workspaceId: string,
    authContext: any,
    options?: {
      periodStart?: string;
      periodEnd?: string;
      dimensions?: string;
      forceRecompute?: boolean;
    },
  ): Promise<ComputeAnalyticsMetricDTO> {
    const forceRecompute = options?.forceRecompute ?? false;
    const periodStart = options?.periodStart ?? this.defaultPeriodStart();
    const periodEnd = options?.periodEnd ?? this.defaultPeriodEnd();

    const workspaceDataSource = await this.twentyORMModule.getWorkspaceDataSource(workspaceId);
    const analyticsDomainMetricRepo = workspaceDataSource.getRepository('analyticsDomainMetric');

    const metric = await analyticsDomainMetricRepo.findOne({ where: { code: metricCode } });
    if (!metric) {
      throw new Error(`Metric not found: ${metricCode}`);
    }

    const snapshotRepo = workspaceDataSource.getRepository('analyticsMetricSnapshot');
    if (!forceRecompute) {
      const existingSnapshot = await snapshotRepo.findOne({
        where: {
          metricId: metric.id,
          periodStart,
          periodEnd,
          dimensions: options?.dimensions ?? null,
          computationStatus: 'SUCCESS',
        },
        order: { computedAt: 'DESC' },
      });
      if (existingSnapshot) {
        return {
          value: existingSnapshot.value,
          valueText: existingSnapshot.valueText,
          sourceCount: existingSnapshot.sourceCount,
          computedAt: existingSnapshot.computedAt?.toISOString() ?? new Date().toISOString(),
          computationStatus: 'SUCCESS',
          snapshotId: existingSnapshot.id,
          periodStart: existingSnapshot.periodStart?.toISOString() ?? null,
          periodEnd: existingSnapshot.periodEnd?.toISOString() ?? null,
        };
      }
    }

    const now = new Date();
    const result = await this.computeMetricValue(metric, workspaceDataSource, options, now);
    const snapshot = await snapshotRepo.save({
      name: `${metric.name} — ${periodStart} to ${periodEnd}`,
      metricId: metric.id,
      periodStart,
      periodEnd,
      periodLabel: this.formatPeriodLabel(periodStart, periodEnd),
      granularity: metric.timeWindow,
      value: result.value,
      valueText: result.valueText,
      sourceCount: result.sourceCount,
      computedAt: now,
      computationStatus: result.error ? 'PARTIAL' : 'SUCCESS',
      computationNotes: result.error ?? null,
      computedById: authContext.workspaceMemberId ?? null,
      dimensions: options?.dimensions ?? null,
    });

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
  }

  private async computeMetricValue(
    metric: any,
    dataSource: any,
    options: any,
    now: Date,
  ): Promise<{ value: number | null; valueText: string | null; sourceCount: number | null; error?: string }> {
    return {
      value: null,
      valueText: `${metric.code} computed at ${now.toISOString()}`,
      sourceCount: 0,
    };
  }

  private defaultPeriodStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  private defaultPeriodEnd(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatPeriodLabel(start: string, end: string): string {
    return `${start} to ${end}`;
  }
}
