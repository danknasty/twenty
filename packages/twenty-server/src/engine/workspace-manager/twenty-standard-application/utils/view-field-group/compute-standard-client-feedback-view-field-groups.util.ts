import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardClientFeedbackViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'clientFeedback'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    clientFeedbackRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldGroupName: 'general',
          fieldName: null,
          isExpanded: true,
          isVisible: true,
          label: 'General',
          position: 0,
        },
      }),
  };
};
