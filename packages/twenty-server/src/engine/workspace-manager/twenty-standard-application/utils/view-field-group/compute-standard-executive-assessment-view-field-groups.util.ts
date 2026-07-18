import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardExecutiveAssessmentViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'executiveAssessment'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    executiveAssessmentRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
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
