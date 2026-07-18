import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardAnalyticsMetricViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'analyticsMetric'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    allAnalyticsMetricsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'analyticsMetric',
        context: {
          viewName: 'allAnalyticsMetrics',
          viewFieldGroupName: 'general',
          name: 'General',
          position: 0,
          isVisible: true,
        },
      }),
  };
};
