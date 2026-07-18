import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import {
  createStandardViewFieldGroupFlatMetadata,
  type CreateStandardViewFieldGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardCriterionEvaluationViewFieldGroups = (
  args: Omit<
    CreateStandardViewFieldGroupArgs<'criterionEvaluation'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {
    criterionEvaluationRecordPageFieldsGeneral:
      createStandardViewFieldGroupFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
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
