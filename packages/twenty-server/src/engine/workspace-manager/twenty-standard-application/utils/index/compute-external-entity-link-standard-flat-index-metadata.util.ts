import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildExternalEntityLinkStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'externalEntityLink'>, 'context'>): Record<
  AllStandardObjectIndexName<'externalEntityLink'>,
  FlatIndexMetadata
> => ({
  systemExternalCollectionExternalIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'systemExternalCollectionExternalIdIndex',
      relatedFieldNames: ['system', 'externalCollection', 'externalId'],
      isUnique: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  systemTwentyObjectUniversalIdentifierTwentyRecordIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'systemTwentyObjectUniversalIdentifierTwentyRecordIdIndex',
      relatedFieldNames: ['system', 'twentyObjectUniversalIdentifier', 'twentyRecordId'],
      isUnique: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
