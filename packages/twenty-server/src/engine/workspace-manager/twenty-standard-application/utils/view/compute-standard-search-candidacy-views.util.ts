import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardSearchCandidacyViews = (
  args: Omit<CreateStandardViewArgs<'searchCandidacy'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allSearchCandidacies: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    searchCandidacyRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'searchCandidacyRecordPageFields',
        name: 'Search Candidacy Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
