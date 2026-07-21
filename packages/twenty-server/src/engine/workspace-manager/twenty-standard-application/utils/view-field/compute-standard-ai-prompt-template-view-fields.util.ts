import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import { type CreateStandardViewFieldArgs, createStandardViewFieldFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardAiPromptTemplateViewFields = ({ context, }: Omit<CreateStandardViewFieldArgs<'aiPromptTemplate'>, 'context'>): Record<string, FlatViewField> => ({
  name: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiPromptTemplate' as AllStandardObjectName, context: { viewName: 'aiPromptTemplateRecordPageFields', viewFieldName: 'name', fieldName: 'name', position: 0, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  promptKey: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiPromptTemplate' as AllStandardObjectName, context: { viewName: 'aiPromptTemplateRecordPageFields', viewFieldName: 'promptKey', fieldName: 'promptKey', position: 1, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  version: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiPromptTemplate' as AllStandardObjectName, context: { viewName: 'aiPromptTemplateRecordPageFields', viewFieldName: 'version', fieldName: 'version', position: 2, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
  status: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiPromptTemplate' as AllStandardObjectName, context: { viewName: 'aiPromptTemplateRecordPageFields', viewFieldName: 'status', fieldName: 'status', position: 3, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
});
