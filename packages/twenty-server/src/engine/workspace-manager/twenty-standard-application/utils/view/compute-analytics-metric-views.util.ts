import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeAnalyticsMetricViews = (
  args: Omit<CreateStandardViewArgs<'analyticsMetric'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAnalyticsMetrics: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'allAnalyticsMetrics',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    analyticsMetricRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsMetric',
      context: {
        viewName: 'analyticsMetricRecordPageFields',
        name: 'Analytics Metric Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
