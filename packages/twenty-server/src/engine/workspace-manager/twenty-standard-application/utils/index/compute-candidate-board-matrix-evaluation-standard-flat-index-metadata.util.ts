import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type CreateStandardIndexArgs, createStandardIndexFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildCandidateBoardMatrixEvaluationStandardFlatIndexMetadatas = ({ context, }: Omit<CreateStandardIndexArgs<'candidateBoardMatrixEvaluation'>, 'context'>): Record<string, FlatIndexMetadata> => ({
  searchVectorGinIndex: createStandardIndexFlatMetadata({ args: { objectName: 'candidateBoardMatrixEvaluation' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchVector'], indexType: 'GIN', }, }, context, }),
  boardMatrixCriterionIdIndex: createStandardIndexFlatMetadata({ args: { objectName: 'candidateBoardMatrixEvaluation' as AllStandardObjectName, context: { indexFieldMetadatas: ['boardMatrixCriterionId'], indexType: 'BTREE', }, }, context, }),
  searchCandidacyIdIndex: createStandardIndexFlatMetadata({ args: { objectName: 'candidateBoardMatrixEvaluation' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchCandidacyId'], indexType: 'BTREE', }, }, context, }),
});
