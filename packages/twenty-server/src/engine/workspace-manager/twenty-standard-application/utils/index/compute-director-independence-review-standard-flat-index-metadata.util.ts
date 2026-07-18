import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type CreateStandardIndexArgs, createStandardIndexFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildDirectorIndependenceReviewStandardFlatIndexMetadatas = ({ context, }: Omit<CreateStandardIndexArgs<'directorIndependenceReview'>, 'context'>): Record<string, FlatIndexMetadata> => ({
  searchVectorGinIndex: createStandardIndexFlatMetadata({ args: { objectName: 'directorIndependenceReview' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchVector'], indexType: 'GIN', }, }, context, }),
  searchCandidacyIdIndex: createStandardIndexFlatMetadata({ args: { objectName: 'directorIndependenceReview' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchCandidacyId'], indexType: 'BTREE', }, }, context, }),
});
