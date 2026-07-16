import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardSearchAssignmentViews = (
  args: Omit<CreateStandardViewArgs<'searchAssignment'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allSearchAssignments: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    byStatus: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        name: 'By Status',
        type: ViewType.KANBAN,
        key: ViewKey.INDEX,
        position: 1,
        icon: 'IconList',
      },
    }),
    searchAssignmentRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'searchAssignmentRecordPageFields',
        name: 'Search Assignment Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
