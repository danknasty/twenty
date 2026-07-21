import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAppAgentsViews = (
  args: Omit<CreateStandardViewArgs<'appAgents'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAppAgents: createStandardViewFlatMetadata({
      ...args,
      objectName: 'appAgents',
      context: {
        viewName: 'allAppAgents',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    appAgentsRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'appAgents',
      context: {
        viewName: 'appAgentsRecordPageFields',
        name: 'App Agents Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
