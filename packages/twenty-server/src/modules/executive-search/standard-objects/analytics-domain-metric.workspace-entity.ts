import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type AnalyticsMetricCategory } from 'src/modules/executive-search/common/enums/analytics-metric-category.enum';
import { type AnalyticsAggregationType } from 'src/modules/executive-search/common/enums/analytics-aggregation-type.enum';
import { type AnalyticsMetricValueType } from 'src/modules/executive-search/common/enums/analytics-metric-value-type.enum';
import { type AnalyticsTimeWindow } from 'src/modules/executive-search/common/enums/analytics-time-window.enum';
import { type AnalyticsMetricStatus } from 'src/modules/executive-search/common/enums/analytics-metric-status.enum';

export class AnalyticsDomainMetricWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  code: string;
  description: string | null;
  category: AnalyticsMetricCategory;
  aggregationType: AnalyticsAggregationType;
  valueType: AnalyticsMetricValueType;
  timeWindow: AnalyticsTimeWindow;
  sourceObject: string | null;
  computationDescription: string | null;
  unit: string | null;
  status: AnalyticsMetricStatus;
  isConfidential: boolean;
  tags: string | null;
  ownerWorkspaceMemberId: string | null;
}
