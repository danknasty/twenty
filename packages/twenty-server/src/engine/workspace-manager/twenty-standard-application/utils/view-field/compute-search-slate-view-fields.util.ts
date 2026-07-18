import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeSearchSlateViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'searchSlate'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    searchSlateRecordPageFieldsName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'name',
          fieldName: 'name',
          position: 0,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsSlateType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'slateType',
          fieldName: 'slateType',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsVersion:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'version',
          fieldName: 'version',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsSubmittedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'submittedAt',
          fieldName: 'submittedAt',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsSubmittedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'submittedBy',
          fieldName: 'submittedBy',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsClientNotes:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'clientNotes',
          fieldName: 'clientNotes',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsSearchAssignment:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'searchAssignment',
          fieldName: 'searchAssignment',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    searchSlateRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'searchSlate',
        context: {
          viewName: 'searchSlateRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
