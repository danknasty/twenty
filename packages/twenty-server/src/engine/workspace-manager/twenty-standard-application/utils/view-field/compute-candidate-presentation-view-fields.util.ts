import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeCandidatePresentationViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'candidatePresentation'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    candidatePresentationRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsVersion:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'version',
          fieldName: 'version',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsReviewDecision:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'reviewDecision',
          fieldName: 'reviewDecision',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsReviewedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'reviewedAt',
          fieldName: 'reviewedAt',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsReviewer:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'reviewer',
          fieldName: 'reviewer',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsSlateMembership:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'slateMembership',
          fieldName: 'slateMembership',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidatePresentationRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidatePresentation',
        context: {
          viewName: 'candidatePresentationRecordPageFields',
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
