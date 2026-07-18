import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSearchCandidacyViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchCandidacy'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allSearchCandidaciesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allSearchCandidaciesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchCandidaciesCurrentStage: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'currentStage',
        fieldName: 'currentStage',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchCandidaciesSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'allSearchCandidacies',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allSearchCandidaciesPerson: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'person',
        fieldName: 'person',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchCandidaciesAssignedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'assignedAt',
        fieldName: 'assignedAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    allSearchCandidaciesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'searchCandidacy',
      context: {
        viewName: 'allSearchCandidacies',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    searchCandidacyRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsCurrentStage:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'currentStage',
          fieldName: 'currentStage',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsPerson:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'person',
          fieldName: 'person',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsResearchCandidate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'researchCandidate',
          fieldName: 'researchCandidate',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsExecutiveProfile:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'executiveProfile',
          fieldName: 'executiveProfile',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsAssignedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'assignedAt',
          fieldName: 'assignedAt',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsLastStageChangedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'lastStageChangedAt',
          fieldName: 'lastStageChangedAt',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsCandidateConsentDate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'candidateConsentDate',
          fieldName: 'candidateConsentDate',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsClosedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'closedAt',
          fieldName: 'closedAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsNotes:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'notes',
          fieldName: 'notes',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 12,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchCandidacyRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchCandidacy',
        context: {
          viewName: 'searchCandidacyRecordPageFields',
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
