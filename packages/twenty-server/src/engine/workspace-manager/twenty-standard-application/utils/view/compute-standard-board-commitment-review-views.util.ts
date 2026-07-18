import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type CreateStandardViewArgs, createStandardViewFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardCommitmentReviewViews = ({ context, }: Omit<CreateStandardViewArgs<'boardCommitmentReview'>, 'context'>): Record<string, FlatView> => ({
  allBoardCommitmentReviews: createStandardViewFlatMetadata({ args: { objectName: 'boardCommitmentReview' as AllStandardObjectName, context: { viewName: 'All Board Commitment Reviews', viewType: 'TABLE', key: 'INDEX', }, }, context, }),
  boardCommitmentReviewRecordPageFields: createStandardViewFlatMetadata({ args: { objectName: 'boardCommitmentReview' as AllStandardObjectName, context: { viewName: 'Board Commitment Review Record Page Fields', viewType: 'FIELDS_WIDGET', key: 'INDEX', }, }, context, }),
});
