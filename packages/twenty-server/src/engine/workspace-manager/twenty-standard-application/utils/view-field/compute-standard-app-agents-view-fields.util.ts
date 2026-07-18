import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import { type CreateStandardViewFieldArgs, createStandardViewFieldFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardAppAgentsViewFields = ({ context, }: Omit<CreateStandardViewFieldArgs<'appAgents'>, 'context'>): Record<string, FlatViewField> => ({
  name: createStandardViewFieldFlatMetadata({ args: { objectName: 'appAgents' as AllStandardObjectName, context: { viewName: 'appAgentsRecordPageFields', viewFieldName: 'name', fieldName: 'name', position: 0, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  agentKey: createStandardViewFieldFlatMetadata({ args: { objectName: 'appAgents' as AllStandardObjectName, context: { viewName: 'appAgentsRecordPageFields', viewFieldName: 'agentKey', fieldName: 'agentKey', position: 1, isVisible: true, size: 200, viewFieldGroupName: 'general', }, }, context, }),
  capability: createStandardViewFieldFlatMetadata({ args: { objectName: 'appAgents' as AllStandardObjectName, context: { viewName: 'appAgentsRecordPageFields', viewFieldName: 'capability', fieldName: 'capability', position: 2, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
  status: createStandardViewFieldFlatMetadata({ args: { objectName: 'appAgents' as AllStandardObjectName, context: { viewName: 'appAgentsRecordPageFields', viewFieldName: 'status', fieldName: 'status', position: 3, isVisible: true, size: 150, viewFieldGroupName: 'general', }, }, context, }),
});
