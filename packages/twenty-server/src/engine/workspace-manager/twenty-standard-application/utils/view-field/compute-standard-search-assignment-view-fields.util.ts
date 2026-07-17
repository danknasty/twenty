import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSearchAssignmentViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchAssignment'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allSearchAssignmentsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allSearchAssignmentsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchAssignmentsStartDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'startDate',
        fieldName: 'startDate',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchAssignmentsTargetCloseDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'targetCloseDate',
        fieldName: 'targetCloseDate',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchAssignmentsClientCompany: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'clientCompany',
        fieldName: 'clientCompany',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchAssignmentsOpportunity: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'opportunity',
        fieldName: 'opportunity',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchAssignmentsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'allSearchAssignments',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    byStatusStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusStartDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'startDate',
        fieldName: 'startDate',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusTargetCloseDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'targetCloseDate',
        fieldName: 'targetCloseDate',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusClientCompany: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'clientCompany',
        fieldName: 'clientCompany',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusOpportunity: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'opportunity',
        fieldName: 'opportunity',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    byStatusCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'byStatus',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    searchAssignmentRecordPageFieldsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'searchAssignmentRecordPageFields',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
        viewFieldGroupName: 'general',
      },
    }),
    searchAssignmentRecordPageFieldsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchAssignment',
      context: {
        viewName: 'searchAssignmentRecordPageFields',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
        viewFieldGroupName: 'general',
      },
    }),
    searchAssignmentRecordPageFieldsStartDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'startDate',
          fieldName: 'startDate',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsTargetCloseDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'targetCloseDate',
          fieldName: 'targetCloseDate',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsClientCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'clientCompany',
          fieldName: 'clientCompany',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsOpportunity:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'opportunity',
          fieldName: 'opportunity',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsEngagementTerms:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'engagementTerms',
          fieldName: 'engagementTerms',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsPositionSpecification:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'positionSpecification',
          fieldName: 'positionSpecification',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchAssignmentRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchAssignment',
        context: {
          viewName: 'searchAssignmentRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
