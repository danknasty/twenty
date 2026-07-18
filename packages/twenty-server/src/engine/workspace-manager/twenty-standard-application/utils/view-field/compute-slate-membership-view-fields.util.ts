import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeSlateMembershipViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'slateMembership'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    slateMembershipRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsPosition:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'position',
          fieldName: 'position',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsPresentationConsentObtained:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'presentationConsentObtained',
          fieldName: 'presentationConsentObtained',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsSlate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'slate',
          fieldName: 'slate',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    slateMembershipRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'slateMembership',
        context: {
          viewName: 'slateMembershipRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
