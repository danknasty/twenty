import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardCommitmentReviewViews = (
  args: Omit<CreateStandardViewArgs<'boardCommitmentReview'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allBoardCommitmentReviews: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardCommitmentReview',
      context: {
        viewName: 'allBoardCommitmentReviews',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    boardCommitmentReviewRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'boardCommitmentReview',
      context: {
        viewName: 'boardCommitmentReviewRecordPageFields',
        name: 'Board Commitment Review Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
