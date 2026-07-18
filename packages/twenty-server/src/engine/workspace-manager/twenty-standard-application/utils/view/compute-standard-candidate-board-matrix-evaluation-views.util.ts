import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type CreateStandardViewArgs, createStandardViewFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardCandidateBoardMatrixEvaluationViews = ({ context, }: Omit<CreateStandardViewArgs<'candidateBoardMatrixEvaluation'>, 'context'>): Record<string, FlatView> => ({
  allCandidateBoardMatrixEvaluations: createStandardViewFlatMetadata({ args: { objectName: 'candidateBoardMatrixEvaluation' as AllStandardObjectName, context: { viewName: 'All Candidate Board Matrix Evaluations', viewType: 'TABLE', key: 'INDEX', }, }, context, }),
  candidateBoardMatrixEvaluationRecordPageFields: createStandardViewFlatMetadata({ args: { objectName: 'candidateBoardMatrixEvaluation' as AllStandardObjectName, context: { viewName: 'Candidate Board Matrix Evaluation Record Page Fields', viewType: 'FIELDS_WIDGET', key: 'INDEX', }, }, context, }),
});
