import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAiModelRegistryViews = (
  args: Omit<CreateStandardViewArgs<'aiModelRegistry'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAiModelRegistries: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiModelRegistry',
      context: {
        viewName: 'allAiModelRegistries',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    aiModelRegistryRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiModelRegistry',
      context: {
        viewName: 'aiModelRegistryRecordPageFields',
        name: 'AI Model Registry Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
