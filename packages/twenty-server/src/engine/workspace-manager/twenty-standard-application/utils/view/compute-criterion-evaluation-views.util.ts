import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeCriterionEvaluationViews = (
  args: Omit<CreateStandardViewArgs<'criterionEvaluation'>, 'context'>,
): Record<string, FlatView> => {
  return {
    criterionEvaluationRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'criterionEvaluation',
      context: {
        viewName: 'criterionEvaluationRecordPageFields',
        name: 'Criterion Evaluation Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
