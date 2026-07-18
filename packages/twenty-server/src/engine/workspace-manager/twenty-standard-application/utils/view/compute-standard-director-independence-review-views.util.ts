import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardDirectorIndependenceReviewViews = (
  args: Omit<CreateStandardViewArgs<'directorIndependenceReview'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allDirectorIndependenceReviews: createStandardViewFlatMetadata({
      ...args,
      objectName: 'directorIndependenceReview',
      context: {
        viewName: 'allDirectorIndependenceReviews',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
    directorIndependenceReviewRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'directorIndependenceReview',
      context: {
        viewName: 'directorIndependenceReviewRecordPageFields',
        name: 'Director Independence Review Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
