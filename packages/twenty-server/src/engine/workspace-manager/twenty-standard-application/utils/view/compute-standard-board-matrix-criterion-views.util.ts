import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardMatrixCriterionViews = (
  args: Omit<CreateStandardViewArgs<'boardMatrixCriterion'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allBoardMatrixCriteria: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardMatrixCriterion',
      context: {
        viewName: 'allBoardMatrixCriteria',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    boardMatrixCriterionRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardMatrixCriterion',
      context: {
        viewName: 'boardMatrixCriterionRecordPageFields',
        name: 'Board Matrix Criterion Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
