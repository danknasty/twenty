import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardExecutiveProfileViewFields = (
  args: Omit<
    CreateStandardViewFieldArgs<'executiveProfile'>,
    'context'
  >,
): Record<string, FlatViewField> => {
  return {
    // person is the label identifier; it must hold the lowest position in non-widget views.
    allExecutiveProfilesPerson: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'executiveProfile',
      context: {
        viewName: 'allExecutiveProfiles',
        viewFieldName: 'person',
        fieldName: 'person',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allExecutiveProfilesHeadline: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'executiveProfile',
      context: {
        viewName: 'allExecutiveProfiles',
        viewFieldName: 'headline',
        fieldName: 'headline',
        position: 1,
        isVisible: true,
        size: 200,
      },
    }),
    allExecutiveProfilesLocation: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'executiveProfile',
      context: {
        viewName: 'allExecutiveProfiles',
        viewFieldName: 'location',
        fieldName: 'location',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allExecutiveProfilesYearsOfExperience:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'allExecutiveProfiles',
          viewFieldName: 'yearsOfExperience',
          fieldName: 'yearsOfExperience',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allExecutiveProfilesAvailabilityStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'allExecutiveProfiles',
          viewFieldName: 'availabilityStatus',
          fieldName: 'availabilityStatus',
          position: 4,
          isVisible: true,
          size: 150,
        },
      }),
    executiveProfileRecordPageFieldsPerson:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'person',
          fieldName: 'person',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsHeadline:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'headline',
          fieldName: 'headline',
          position: 1,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsSummary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'summary',
          fieldName: 'summary',
          position: 2,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsCurrentCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'currentCompany',
          fieldName: 'currentCompany',
          position: 3,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsLocation:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'location',
          fieldName: 'location',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsYearsOfExperience:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'yearsOfExperience',
          fieldName: 'yearsOfExperience',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsAvailabilityStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'availabilityStatus',
          fieldName: 'availabilityStatus',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsProfileVisibility:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'profileVisibility',
          fieldName: 'profileVisibility',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsIsBoardReady:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'isBoardReady',
          fieldName: 'isBoardReady',
          position: 8,
          isVisible: true,
          size: 100,
          viewFieldGroupName: 'general',
        },
      }),
    executiveProfileRecordPageFieldsSourceSystem:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'sourceSystem',
          fieldName: 'sourceSystem',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    executiveProfileRecordPageFieldsSourceRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'sourceRecordId',
          fieldName: 'sourceRecordId',
          position: 10,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'system',
        },
      }),
    executiveProfileRecordPageFieldsSourceUpdatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'sourceUpdatedAt',
          fieldName: 'sourceUpdatedAt',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    executiveProfileRecordPageFieldsSourceHash:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'executiveProfile',
        context: {
          viewName: 'executiveProfileRecordPageFields',
          viewFieldName: 'sourceHash',
          fieldName: 'sourceHash',
          position: 12,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'system',
        },
      }),
  };
};
