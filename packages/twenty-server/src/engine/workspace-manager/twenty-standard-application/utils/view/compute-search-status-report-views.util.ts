import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeSearchStatusReportViews = (
  args: Omit<CreateStandardViewArgs<'searchStatusReport'>, 'context'>,
): Record<string, FlatView> => {
  return {
    searchStatusReportRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchStatusReport',
      context: {
        viewName: 'searchStatusReportRecordPageFields',
        name: 'Search Status Report Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
