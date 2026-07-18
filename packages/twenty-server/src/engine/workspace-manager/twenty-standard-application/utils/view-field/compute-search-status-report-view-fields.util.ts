import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeSearchStatusReportViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchStatusReport'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    searchStatusReportRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsReportType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'reportType',
          fieldName: 'reportType',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsReportDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'reportDate',
          fieldName: 'reportDate',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsPeriodStart:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'periodStart',
          fieldName: 'periodStart',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsPeriodEnd:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'periodEnd',
          fieldName: 'periodEnd',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsActivitiesSummary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'activitiesSummary',
          fieldName: 'activitiesSummary',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsSubmittedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'submittedBy',
          fieldName: 'submittedBy',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchStatusReportRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchStatusReport',
        context: {
          viewName: 'searchStatusReportRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
