import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeExecutiveAssessmentViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'executiveAssessment'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    executiveAssessmentRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsOverallAssessment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'overallAssessment',
          fieldName: 'overallAssessment',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsStrengthsSummary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'strengthsSummary',
          fieldName: 'strengthsSummary',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsRiskFactorsSummary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'riskFactorsSummary',
          fieldName: 'riskFactorsSummary',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsRecommendation:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'recommendation',
          fieldName: 'recommendation',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsAssessmentDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'assessmentDate',
          fieldName: 'assessmentDate',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsAssessor:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'assessor',
          fieldName: 'assessor',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveAssessmentRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveAssessment',
        context: {
          viewName: 'executiveAssessmentRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
