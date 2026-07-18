import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardExternalIdentityMatchQueueViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'externalIdentityMatchQueue'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    externalIdentityMatchQueueRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldGroupName: 'general',
          name: 'General',
          position: 0,
          isVisible: true,
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsSystem:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldGroupName: 'system',
          name: 'System',
          position: 1,
          isVisible: true,
        },
      }),
  };
};
