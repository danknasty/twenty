import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardAssignmentTeamMemberViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'assignmentTeamMember'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    assignmentTeamMemberRecordPageFieldsRole:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'role',
          fieldName: 'role',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    assignmentTeamMemberRecordPageFieldsIsLead:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'isLead',
          fieldName: 'isLead',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    assignmentTeamMemberRecordPageFieldsAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'assignment',
          fieldName: 'assignment',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    assignmentTeamMemberRecordPageFieldsWorkspaceMember:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'workspaceMember',
          fieldName: 'workspaceMember',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    assignmentTeamMemberRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    assignmentTeamMemberRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'assignmentTeamMember',
        context: {
          viewName: 'assignmentTeamMemberRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
