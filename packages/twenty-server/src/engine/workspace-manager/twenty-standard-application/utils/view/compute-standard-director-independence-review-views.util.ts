import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type CreateStandardViewArgs, createStandardViewFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardDirectorIndependenceReviewViews = ({ context, }: Omit<CreateStandardViewArgs<'directorIndependenceReview'>, 'context'>): Record<string, FlatView> => ({
  allDirectorIndependenceReviews: createStandardViewFlatMetadata({ args: { objectName: 'directorIndependenceReview' as AllStandardObjectName, context: { viewName: 'All Director Independence Reviews', viewType: 'TABLE', key: 'INDEX', }, }, context, }),
  directorIndependenceReviewRecordPageFields: createStandardViewFlatMetadata({ args: { objectName: 'directorIndependenceReview' as AllStandardObjectName, context: { viewName: 'Director Independence Review Record Page Fields', viewType: 'FIELDS_WIDGET', key: 'INDEX', }, }, context, }),
});
