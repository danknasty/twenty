import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-index-name.type';
import { type CreateStandardIndexArgs, createStandardIndexFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildSearchInterviewStandardFlatIndexMetadatas = ({now,objectName,workspaceId,standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId}:Omit<CreateStandardIndexArgs<'searchInterview'>,'context'>):Record<AllStandardObjectIndexName<'searchInterview'>,FlatIndexMetadata> => ({
searchAssignmentIdIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'searchAssignmentIdIndex',relatedFieldNames:['searchAssignment']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
searchCandidacyIdIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'searchCandidacyIdIndex',relatedFieldNames:['searchCandidacy']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
statusIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'statusIndex',relatedFieldNames:['status']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
scheduledDateIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'scheduledDateIndex',relatedFieldNames:['scheduledDate']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
});
