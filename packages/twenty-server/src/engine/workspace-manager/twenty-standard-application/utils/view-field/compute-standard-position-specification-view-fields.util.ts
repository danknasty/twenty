import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardPositionSpecificationViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'positionSpecification'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allPositionSpecificationsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'positionSpecification',
      context: {
        viewName: 'allPositionSpecifications',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allPositionSpecificationsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'positionSpecification',
      context: {
        viewName: 'allPositionSpecifications',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allPositionSpecificationsCompensationMin:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'allPositionSpecifications',
          viewFieldName: 'compensationMin',
          fieldName: 'compensationMin',
          position: 2,
          isVisible: true,
          size: 150,
        },
      }),
    allPositionSpecificationsCompensationMax:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'allPositionSpecifications',
          viewFieldName: 'compensationMax',
          fieldName: 'compensationMax',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allPositionSpecificationsApprovedBy: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'positionSpecification',
      context: {
        viewName: 'allPositionSpecifications',
        viewFieldName: 'approvedBy',
        fieldName: 'approvedBy',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allPositionSpecificationsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'positionSpecification',
      context: {
        viewName: 'allPositionSpecifications',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    positionSpecificationRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsReportingLine:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'reportingLine',
          fieldName: 'reportingLine',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsCompensationMin:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'compensationMin',
          fieldName: 'compensationMin',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsCompensationMax:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'compensationMax',
          fieldName: 'compensationMax',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsKeyResponsibilities:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'keyResponsibilities',
          fieldName: 'keyResponsibilities',
          position: 4,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsRequiredQualifications:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'requiredQualifications',
          fieldName: 'requiredQualifications',
          position: 5,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsPreferredQualifications:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'preferredQualifications',
          fieldName: 'preferredQualifications',
          position: 6,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsApprovedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'approvedAt',
          fieldName: 'approvedAt',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsApprovedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'approvedBy',
          fieldName: 'approvedBy',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsCriteria:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'criteria',
          fieldName: 'criteria',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    positionSpecificationRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'positionSpecification',
        context: {
          viewName: 'positionSpecificationRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 12,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
