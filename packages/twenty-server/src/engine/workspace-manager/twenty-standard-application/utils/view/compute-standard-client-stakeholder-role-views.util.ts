import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardClientStakeholderRoleViews = (
  args: Omit<CreateStandardViewArgs<'clientStakeholderRole'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allClientStakeholderRoles: createStandardViewFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconUsers',
      },
    }),
    clientStakeholderRoleRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'clientStakeholderRoleRecordPageFields',
        name: 'Client Stakeholder Role Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
