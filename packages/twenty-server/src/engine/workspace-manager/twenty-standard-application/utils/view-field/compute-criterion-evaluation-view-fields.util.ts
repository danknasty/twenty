import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeCriterionEvaluationViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'criterionEvaluation'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    criterionEvaluationRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsRating:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'rating',
          fieldName: 'rating',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsEvidenceSummary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'evidenceSummary',
          fieldName: 'evidenceSummary',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsIsHumanReviewed:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'isHumanReviewed',
          fieldName: 'isHumanReviewed',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsAssessment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'assessment',
          fieldName: 'assessment',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsCriterion:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'criterion',
          fieldName: 'criterion',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    criterionEvaluationRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'criterionEvaluation',
        context: {
          viewName: 'criterionEvaluationRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
