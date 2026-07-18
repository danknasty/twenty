import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type CreateStandardViewArgs, createStandardViewFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardMatrixCriterionViews = ({ context, }: Omit<CreateStandardViewArgs<'boardMatrixCriterion'>, 'context'>): Record<string, FlatView> => ({
  allBoardMatrixCriteria: createStandardViewFlatMetadata({ args: { objectName: 'boardMatrixCriterion' as AllStandardObjectName, context: { viewName: 'All Board Matrix Criteria', viewType: 'TABLE', key: 'INDEX', }, }, context, }),
  boardMatrixCriterionRecordPageFields: createStandardViewFlatMetadata({ args: { objectName: 'boardMatrixCriterion' as AllStandardObjectName, context: { viewName: 'Board Matrix Criterion Record Page Fields', viewType: 'FIELDS_WIDGET', key: 'INDEX', }, }, context, }),
});
