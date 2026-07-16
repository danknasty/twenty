import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSearchMilestoneViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchMilestone'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    searchMilestoneRecordPageFieldsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchMilestone',
      context: {
        viewName: 'searchMilestoneRecordPageFields',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
        viewFieldGroupName: 'general',
      },
    }),
    searchMilestoneRecordPageFieldsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchMilestone',
      context: {
        viewName: 'searchMilestoneRecordPageFields',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    searchMilestoneRecordPageFieldsDueDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'dueDate',
          fieldName: 'dueDate',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchMilestoneRecordPageFieldsCompletedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'completedAt',
          fieldName: 'completedAt',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchMilestoneRecordPageFieldsDescription:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'description',
          fieldName: 'description',
          position: 4,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchMilestoneRecordPageFieldsAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'assignment',
          fieldName: 'assignment',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchMilestoneRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchMilestoneRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchMilestone',
        context: {
          viewName: 'searchMilestoneRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
