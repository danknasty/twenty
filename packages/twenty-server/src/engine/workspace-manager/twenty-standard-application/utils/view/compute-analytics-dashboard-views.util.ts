import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeAnalyticsDashboardViews = (
  args: Omit<CreateStandardViewArgs<'analyticsDashboard'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAnalyticsDashboards: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    analyticsDashboardRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'analyticsDashboardRecordPageFields',
        name: 'Analytics Dashboard Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
