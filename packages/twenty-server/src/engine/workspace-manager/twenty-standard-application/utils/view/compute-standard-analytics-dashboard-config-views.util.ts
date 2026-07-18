import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAnalyticsDashboardConfigViews = (
  args: Omit<CreateStandardViewArgs<'analyticsDashboardConfig'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAnalyticsDashboardConfigs: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsDashboardConfig',
      context: {
        viewName: 'allAnalyticsDashboardConfigs',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    analyticsDashboardConfigRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'analyticsDashboardConfig',
      context: {
        viewName: 'analyticsDashboardConfigRecordPageFields',
        name: 'Analytics Dashboard Config Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
