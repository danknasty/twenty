import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeAnalyticsMetricViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'analyticsMetric'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allAnalyticsMetricsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 180,
      },
    }),
    allAnalyticsMetricsMetricType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'analyticsMetric',
        context: {
          viewName: 'allAnalyticsMetrics',
          viewFieldName: 'metricType',
          fieldName: 'metricType',
          position: 1,
          isVisible: true,
          size: 150,
        },
      }),
    allAnalyticsMetricsSourceObjectName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'analyticsMetric',
        context: {
          viewName: 'allAnalyticsMetrics',
          viewFieldName: 'sourceObjectName',
          fieldName: 'sourceObjectName',
          position: 2,
          isVisible: true,
          size: 150,
        },
      }),
    allAnalyticsMetricsUnit: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'unit',
        fieldName: 'unit',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allAnalyticsMetricsIsActive: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'isActive',
        fieldName: 'isActive',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
    allAnalyticsMetricsPosition: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'position',
        fieldName: 'position',
        position: 5,
        isVisible: true,
        size: 120,
      },
    }),
    allAnalyticsMetricsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    allAnalyticsMetricsCreatedBy: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        viewFieldName: 'createdBy',
        fieldName: 'createdBy',
        position: 7,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
