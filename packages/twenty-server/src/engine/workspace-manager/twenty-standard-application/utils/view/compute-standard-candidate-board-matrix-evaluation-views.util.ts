import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardCandidateBoardMatrixEvaluationViews = (
  args: Omit<CreateStandardViewArgs<'candidateBoardMatrixEvaluation'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allCandidateBoardMatrixEvaluations: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateBoardMatrixEvaluation',
      context: {
        viewName: 'allCandidateBoardMatrixEvaluations',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    candidateBoardMatrixEvaluationRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateBoardMatrixEvaluation',
      context: {
        viewName: 'candidateBoardMatrixEvaluationRecordPageFields',
        name: 'Candidate Board Matrix Evaluation Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
