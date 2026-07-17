import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSearchCriterionViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchCriterion'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    searchCriterionRecordPageFieldsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCriterion',
      context: {
        viewName: 'searchCriterionRecordPageFields',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
        viewFieldGroupName: 'general',
      },
    }),
    searchCriterionRecordPageFieldsWeight: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCriterion',
      context: {
        viewName: 'searchCriterionRecordPageFields',
        viewFieldName: 'weight',
        fieldName: 'weight',
        position: 1,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    searchCriterionRecordPageFieldsCategory:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
          viewFieldName: 'category',
          fieldName: 'category',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCriterionRecordPageFieldsIsRequired:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
          viewFieldName: 'isRequired',
          fieldName: 'isRequired',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCriterionRecordPageFieldsDescription:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
          viewFieldName: 'description',
          fieldName: 'description',
          position: 4,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchCriterionRecordPageFieldsSpecification:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
          viewFieldName: 'specification',
          fieldName: 'specification',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCriterionRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCriterionRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCriterion',
        context: {
          viewName: 'searchCriterionRecordPageFields',
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
