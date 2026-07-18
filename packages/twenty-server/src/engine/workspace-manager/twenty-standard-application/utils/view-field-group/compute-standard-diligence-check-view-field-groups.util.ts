import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardDiligenceCheckViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'diligenceCheck'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
diligenceCheckRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'diligenceCheck',context:{viewName:'diligenceCheckRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
diligenceCheckRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'diligenceCheck',context:{viewName:'diligenceCheckRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
