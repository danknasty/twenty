import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardClientAccountProfileViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'clientAccountProfile'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    clientAccountProfileRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldGroupName: 'general',
          name: 'General',
          position: 0,
          isVisible: true,
        },
      }),
    clientAccountProfileRecordPageFieldsSystem:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldGroupName: 'system',
          name: 'System',
          position: 1,
          isVisible: true,
        },
      }),
  };
};
