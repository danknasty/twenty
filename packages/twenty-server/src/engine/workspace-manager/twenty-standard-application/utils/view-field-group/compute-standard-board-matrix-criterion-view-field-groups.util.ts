import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { type CreateStandardViewFieldGroupArgs, createStandardViewFieldGroupFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardBoardMatrixCriterionViewFieldGroups = ({ context, }: Omit<CreateStandardViewFieldGroupArgs<'boardMatrixCriterion'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
  general: createStandardViewFieldGroupFlatMetadata({ args: { objectName: 'boardMatrixCriterion' as AllStandardObjectName, context: { viewGroupName: 'general', fieldGroupName: 'general', }, }, context, }),
});
