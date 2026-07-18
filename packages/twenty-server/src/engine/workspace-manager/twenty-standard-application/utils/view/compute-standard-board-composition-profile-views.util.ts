import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardCompositionProfileViews = (
  args: Omit<CreateStandardViewArgs<'boardCompositionProfile'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allBoardCompositionProfiles: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardCompositionProfile',
      context: {
        viewName: 'allBoardCompositionProfiles',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    boardCompositionProfileRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardCompositionProfile',
      context: {
        viewName: 'boardCompositionProfileRecordPageFields',
        name: 'Board Composition Profile Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
