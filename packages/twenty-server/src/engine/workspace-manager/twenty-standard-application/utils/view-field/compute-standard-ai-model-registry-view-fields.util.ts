import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import { type CreateStandardViewFieldArgs, createStandardViewFieldFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardAiModelRegistryViewFields = ({ context, }: Omit<CreateStandardViewFieldArgs<'aiModelRegistry'>, 'context'>): Record<string, FlatViewField> => ({
  name: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiModelRegistry' as AllStandardObjectName, context: { viewName: 'aiModelRegistryRecordPageFields', viewFieldName: 'name', fieldName: 'name', position: 0, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  modelId: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiModelRegistry' as AllStandardObjectName, context: { viewName: 'aiModelRegistryRecordPageFields', viewFieldName: 'modelId', fieldName: 'modelId', position: 1, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  providerName: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiModelRegistry' as AllStandardObjectName, context: { viewName: 'aiModelRegistryRecordPageFields', viewFieldName: 'providerName', fieldName: 'providerName', position: 2, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
  status: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiModelRegistry' as AllStandardObjectName, context: { viewName: 'aiModelRegistryRecordPageFields', viewFieldName: 'status', fieldName: 'status', position: 3, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
  isCurrent: createStandardViewFieldFlatMetadata({ args: { objectName: 'aiModelRegistry' as AllStandardObjectName, context: { viewName: 'aiModelRegistryRecordPageFields', viewFieldName: 'isCurrent', fieldName: 'isCurrent', position: 4, isVisible: true, size: 100, viewFieldGroupName: 'general', }, }, context, }),
});
