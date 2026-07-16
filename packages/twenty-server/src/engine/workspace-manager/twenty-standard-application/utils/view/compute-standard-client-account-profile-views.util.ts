import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardClientAccountProfileViews = (
  args: Omit<CreateStandardViewArgs<'clientAccountProfile'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allClientAccountProfiles: createStandardViewFlatMetadata({
      ...args,
      objectName: 'clientAccountProfile',
      context: {
        viewName: 'allClientAccountProfiles',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    clientAccountProfileRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'clientAccountProfile',
      context: {
        viewName: 'clientAccountProfileRecordPageFields',
        name: 'Client Account Profile Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
