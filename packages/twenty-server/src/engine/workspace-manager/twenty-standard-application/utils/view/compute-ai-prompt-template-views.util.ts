import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeAiPromptTemplateViews = (
  args: Omit<CreateStandardViewArgs<'aiPromptTemplate'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAiPromptTemplates: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    aiPromptTemplateRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'aiPromptTemplateRecordPageFields',
        name: 'AI Prompt Template Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
