import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeClientFeedbackViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'clientFeedback'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    clientFeedbackRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsFeedbackType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'feedbackType',
          fieldName: 'feedbackType',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsRating:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'rating',
          fieldName: 'rating',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsComments:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'comments',
          fieldName: 'comments',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsReceivedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'receivedAt',
          fieldName: 'receivedAt',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsReceivedFrom:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'receivedFrom',
          fieldName: 'receivedFrom',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsSlate:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'slate',
          fieldName: 'slate',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsPresentation:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'presentation',
          fieldName: 'presentation',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    clientFeedbackRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'clientFeedback',
        context: {
          viewName: 'clientFeedbackRecordPageFields',
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
