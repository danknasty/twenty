import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeClientFeedbackViews = (
  args: Omit<CreateStandardViewArgs<'clientFeedback'>, 'context'>,
): Record<string, FlatView> => {
  return {
    clientFeedbackRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'clientFeedback',
      context: {
        viewName: 'clientFeedbackRecordPageFields',
        name: 'Client Feedback Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
