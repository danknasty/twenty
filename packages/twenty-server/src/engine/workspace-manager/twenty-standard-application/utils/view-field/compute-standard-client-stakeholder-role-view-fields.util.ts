import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardClientStakeholderRoleViewFields = (
  args: Omit<
    CreateStandardViewFieldArgs<'clientStakeholderRole'>,
    'context'
  >,
): Record<string, FlatViewField> => {
  return {
    // allClientStakeholderRoles view fields
    allClientStakeholderRolesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    allClientStakeholderRolesPerson: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'person',
        fieldName: 'person',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allClientStakeholderRolesCompany: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'company',
        fieldName: 'company',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allClientStakeholderRolesRole: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'role',
        fieldName: 'role',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allClientStakeholderRolesIsPrimary: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'isPrimary',
        fieldName: 'isPrimary',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allClientStakeholderRolesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'clientStakeholderRole',
      context: {
        viewName: 'allClientStakeholderRoles',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),

    // clientStakeholderRoleRecordPageFields view fields
    // General group
    clientStakeholderRoleRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientStakeholderRoleRecordPageFieldsRole:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'role',
          fieldName: 'role',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientStakeholderRoleRecordPageFieldsIsPrimary:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'isPrimary',
          fieldName: 'isPrimary',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientStakeholderRoleRecordPageFieldsNotes:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'notes',
          fieldName: 'notes',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    // Relations group
    clientStakeholderRoleRecordPageFieldsPerson:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'person',
          fieldName: 'person',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'relations',
        },
      }),
    clientStakeholderRoleRecordPageFieldsCompany:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'company',
          fieldName: 'company',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'relations',
        },
      }),
    clientStakeholderRoleRecordPageFieldsClientAccountProfile:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'clientAccountProfile',
          fieldName: 'clientAccountProfile',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'relations',
        },
      }),
    // System group
    clientStakeholderRoleRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    clientStakeholderRoleRecordPageFieldsUpdatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientStakeholderRole',
        context: {
          viewName: 'clientStakeholderRoleRecordPageFields',
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
