import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildCandidateBoardMatrixEvaluationStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardIndexArgs<'candidateBoardMatrixEvaluation'>,
  'context'
>): Record<
  AllStandardObjectIndexName<'candidateBoardMatrixEvaluation'>,
  FlatIndexMetadata
> => ({
  searchVectorGinIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'searchVectorGinIndex',
      relatedFieldNames: ['searchVector'],
      indexType: 'GIN',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  boardMatrixCriterionIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'boardMatrixCriterionIdIndex',
      relatedFieldNames: ['boardMatrixCriterionId'],
      indexType: 'BTREE',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  searchCandidacyIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'searchCandidacyIdIndex',
      relatedFieldNames: ['searchCandidacyId'],
      indexType: 'BTREE',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
