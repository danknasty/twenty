import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeSlateMembershipViews = (
  args: Omit<CreateStandardViewArgs<'slateMembership'>, 'context'>,
): Record<string, FlatView> => {
  return {
    slateMembershipRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'slateMembership',
      context: {
        viewName: 'slateMembershipRecordPageFields',
        name: 'Slate Membership Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
