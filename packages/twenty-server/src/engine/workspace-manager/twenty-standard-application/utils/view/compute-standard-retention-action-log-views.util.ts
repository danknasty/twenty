import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardRetentionActionLogViews = (
  args: Omit<CreateStandardViewArgs<'retentionActionLog'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allRetentionActionLogs: createStandardViewFlatMetadata({
      ...args,
      objectName: 'retentionActionLog',
      context: {
        viewName: 'allRetentionActionLogs',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    retentionActionLogRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'retentionActionLog',
      context: {
        viewName: 'retentionActionLogRecordPageFields',
        name: 'Retention Action Log Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
