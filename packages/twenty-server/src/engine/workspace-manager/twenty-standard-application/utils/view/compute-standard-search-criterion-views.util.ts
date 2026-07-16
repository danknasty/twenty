import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardSearchCriterionViews = (
  args: Omit<CreateStandardViewArgs<'searchCriterion'>, 'context'>,
): Record<string, FlatView> => {
  return {
    searchCriterionRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchCriterion',
      context: {
        viewName: 'searchCriterionRecordPageFields',
        name: 'Search Criterion Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
