import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type CreateStandardIndexArgs, createStandardIndexFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildBoardCompositionProfileStandardFlatIndexMetadatas = ({ context, }: Omit<CreateStandardIndexArgs<'boardCompositionProfile'>, 'context'>): Record<string, FlatIndexMetadata> => ({
  searchVectorGinIndex: createStandardIndexFlatMetadata({ args: { objectName: 'boardCompositionProfile' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchVector'], indexType: 'GIN', }, }, context, }),
  searchAssignmentIdIndex: createStandardIndexFlatMetadata({ args: { objectName: 'boardCompositionProfile' as AllStandardObjectName, context: { indexFieldMetadatas: ['searchAssignmentId'], indexType: 'BTREE', }, }, context, }),
});
