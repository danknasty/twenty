import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardClientStakeholderRoleViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'clientStakeholderRole'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    clientStakeholderRoleRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldGroupName: 'general',
          name: 'General',
          position: 0,
          isVisible: true,
        },
      }),
    clientStakeholderRoleRecordPageFieldsSystem:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldGroupName: 'system',
          name: 'System',
          position: 1,
          isVisible: true,
        },
      }),
  };
};
