import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type AnalyticsTimeWindow } from 'src/modules/executive-search/common/enums/analytics-time-window.enum';
import { type AnalyticsComputationStatus } from 'src/modules/executive-search/common/enums/analytics-computation-status.enum';

export class AnalyticsMetricSnapshotWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  metricId: string;
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string | null;
  granularity: AnalyticsTimeWindow;
  value: number | null;
  valueText: string | null;
  previousValue: number | null;
  delta: number | null;
  deltaPercent: number | null;
  targetValue: number | null;
  dimensions: Record<string, unknown> | null;
  sourceCount: number | null;
  computedAt: Date;
  computationStatus: AnalyticsComputationStatus;
  computationNotes: string | null;
  computedById: string | null;
}
