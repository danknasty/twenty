import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAnalyticsMetricSnapshotViews = (
  args: Omit<CreateStandardViewArgs<'analyticsMetricSnapshot'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAnalyticsMetricSnapshots: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsMetricSnapshot',
      context: {
        viewName: 'allAnalyticsMetricSnapshots',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    analyticsMetricSnapshotRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsMetricSnapshot',
      context: {
        viewName: 'analyticsMetricSnapshotRecordPageFields',
        name: 'Analytics Metric Snapshot Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
