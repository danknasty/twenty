import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-index-name.type';
import { type CreateStandardIndexArgs, createStandardIndexFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildOfferNegotiationStandardFlatIndexMetadatas = ({now,objectName,workspaceId,standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId}:Omit<CreateStandardIndexArgs<'offerNegotiation'>,'context'>):Record<AllStandardObjectIndexName<'offerNegotiation'>,FlatIndexMetadata> => ({
candidacyIdIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'candidacyIdIndex',relatedFieldNames:['candidacy']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
searchAssignmentIdIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'searchAssignmentIdIndex',relatedFieldNames:['searchAssignment']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
compensationExpectationIdIndex: createStandardIndexFlatMetadata({objectName,workspaceId,context:{indexName:'compensationExpectationIdIndex',relatedFieldNames:['compensationExpectation']},standardObjectMetadataRelatedEntityIds,dependencyFlatEntityMaps,twentyStandardApplicationId,now}),
});
