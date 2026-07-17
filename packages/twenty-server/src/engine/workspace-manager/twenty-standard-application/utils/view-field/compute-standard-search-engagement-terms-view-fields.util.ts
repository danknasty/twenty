import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSearchEngagementTermsViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchEngagementTerms'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allSearchEngagementTermsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allSearchEngagementTermsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchEngagementTermsRetainerFee: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'retainerFee',
        fieldName: 'retainerFee',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchEngagementTermsClientCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'allSearchEngagementTerms',
          viewFieldName: 'clientCompany',
          fieldName: 'clientCompany',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allSearchEngagementTermsOpportunity: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'opportunity',
        fieldName: 'opportunity',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchEngagementTermsTotalFee: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'totalFee',
        fieldName: 'totalFee',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchEngagementTermsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchEngagementTerms',
      context: {
        viewName: 'allSearchEngagementTerms',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    searchEngagementTermsRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsRetainerFee:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'retainerFee',
          fieldName: 'retainerFee',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsSuccessFee:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'successFee',
          fieldName: 'successFee',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsTotalFee:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'totalFee',
          fieldName: 'totalFee',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsExclusivityPeriod:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'exclusivityPeriod',
          fieldName: 'exclusivityPeriod',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsPaymentMilestones:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'paymentMilestones',
          fieldName: 'paymentMilestones',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsDescription:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'description',
          fieldName: 'description',
          position: 7,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsApprovedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'approvedAt',
          fieldName: 'approvedAt',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsApprovedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'approvedBy',
          fieldName: 'approvedBy',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsClientCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'clientCompany',
          fieldName: 'clientCompany',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsOpportunity:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'opportunity',
          fieldName: 'opportunity',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 12,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchEngagementTermsRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchEngagementTerms',
        context: {
          viewName: 'searchEngagementTermsRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 13,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
