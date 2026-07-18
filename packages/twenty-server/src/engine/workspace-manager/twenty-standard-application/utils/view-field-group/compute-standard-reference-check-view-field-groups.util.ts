import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardReferenceCheckViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'referenceCheck'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
referenceCheckRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'referenceCheck',context:{viewName:'referenceCheckRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
referenceCheckRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'referenceCheck',context:{viewName:'referenceCheckRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
