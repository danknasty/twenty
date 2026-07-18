import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardExternalIdentityMatchQueueViews = (
  args: Omit<CreateStandardViewArgs<'externalIdentityMatchQueue'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allExternalIdentityMatchQueues: createStandardViewFlatMetadata({
      ...args,
      objectName: 'externalIdentityMatchQueue',
      context: {
        viewName: 'allExternalIdentityMatchQueues',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    externalIdentityMatchQueueRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'externalIdentityMatchQueue',
      context: {
        viewName: 'externalIdentityMatchQueueRecordPageFields',
        name: 'External Identity Match Queue Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
