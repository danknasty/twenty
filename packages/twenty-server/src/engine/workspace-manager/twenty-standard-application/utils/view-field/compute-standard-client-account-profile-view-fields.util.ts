import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardClientAccountProfileViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'clientAccountProfile'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allClientAccountProfiles view fields
    allClientAccountProfilesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientAccountProfile',
      context: {
        viewName: 'allClientAccountProfiles',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    allClientAccountProfilesCompany: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientAccountProfile',
      context: {
        viewName: 'allClientAccountProfiles',
        viewFieldName: 'company',
        fieldName: 'company',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allClientAccountProfilesClientAccountType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'allClientAccountProfiles',
          viewFieldName: 'clientAccountType',
          fieldName: 'clientAccountType',
          position: 2,
          isVisible: true,
          size: 150,
        },
      }),
    allClientAccountProfilesClientOnboardingStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'allClientAccountProfiles',
          viewFieldName: 'clientOnboardingStatus',
          fieldName: 'clientOnboardingStatus',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allClientAccountProfilesClientSince:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'allClientAccountProfiles',
          viewFieldName: 'clientSince',
          fieldName: 'clientSince',
          position: 4,
          isVisible: true,
          size: 150,
        },
      }),
    allClientAccountProfilesCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'allClientAccountProfiles',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 5,
          isVisible: true,
          size: 150,
        },
      }),

    // clientAccountProfileRecordPageFields view fields
    // General group
    clientAccountProfileRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientAccountProfileRecordPageFieldsClientAccountType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientAccountType',
          fieldName: 'clientAccountType',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientAccountProfileRecordPageFieldsClientOnboardingStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientOnboardingStatus',
          fieldName: 'clientOnboardingStatus',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientAccountProfileRecordPageFieldsClientSince:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientSince',
          fieldName: 'clientSince',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientAccountProfileRecordPageFieldsClientPaymentTerms:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientPaymentTerms',
          fieldName: 'clientPaymentTerms',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientAccountProfileRecordPageFieldsClientNotes:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientNotes',
          fieldName: 'clientNotes',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),

    // Relations group
    clientAccountProfileRecordPageFieldsClientBillingContact:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'clientBillingContact',
          fieldName: 'clientBillingContact',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'relations',
        },
      }),
    clientAccountProfileRecordPageFieldsCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'company',
          fieldName: 'company',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'relations',
        },
      }),

    // System group
    clientAccountProfileRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    clientAccountProfileRecordPageFieldsUpdatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientAccountProfile',
        context: {
          viewName: 'clientAccountProfileRecordPageFields',
          viewFieldName: 'updatedAt',
          fieldName: 'updatedAt',
          position: 1,
          isVisible: false,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
  };
};
