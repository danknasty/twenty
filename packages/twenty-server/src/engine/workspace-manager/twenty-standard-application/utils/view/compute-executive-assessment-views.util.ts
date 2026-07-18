import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeExecutiveAssessmentViews = (
  args: Omit<CreateStandardViewArgs<'executiveAssessment'>, 'context'>,
): Record<string, FlatView> => {
  return {
    executiveAssessmentRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'executiveAssessment',
      context: {
        viewName: 'executiveAssessmentRecordPageFields',
        name: 'Executive Assessment Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
