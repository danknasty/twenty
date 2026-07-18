import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type AnalyticsDashboardScope } from 'src/modules/executive-search/common/enums/analytics-dashboard-scope.enum';
import { type AnalyticsDashboardAudience } from 'src/modules/executive-search/common/enums/analytics-dashboard-audience.enum';
import { type AnalyticsTimeWindow } from 'src/modules/executive-search/common/enums/analytics-time-window.enum';
import { type AnalyticsRefreshFrequency } from 'src/modules/executive-search/common/enums/analytics-refresh-frequency.enum';
import { type AnalyticsMetricStatus } from 'src/modules/executive-search/common/enums/analytics-metric-status.enum';

export class AnalyticsDashboardConfigWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  scope: AnalyticsDashboardScope;
  audience: AnalyticsDashboardAudience;
  metricCodes: Record<string, unknown> | null;
  layout: Record<string, unknown> | null;
  filters: Record<string, unknown> | null;
  defaultTimeRange: AnalyticsTimeWindow;
  refreshFrequency: AnalyticsRefreshFrequency;
  isShared: boolean;
  status: AnalyticsMetricStatus;
  ownerWorkspaceMemberId: string | null;
}
