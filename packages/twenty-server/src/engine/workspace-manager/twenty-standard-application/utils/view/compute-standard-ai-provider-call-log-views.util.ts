import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAiProviderCallLogViews = (
  args: Omit<CreateStandardViewArgs<'aiProviderCallLog'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAiProviderCallLogs: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiProviderCallLog',
      context: {
        viewName: 'allAiProviderCallLogs',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    aiProviderCallLogRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiProviderCallLog',
      context: {
        viewName: 'aiProviderCallLogRecordPageFields',
        name: 'AI Provider Call Log Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
