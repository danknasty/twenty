import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardGuaranteeCaseViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'guaranteeCase'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
guaranteeCaseRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'guaranteeCase',context:{viewName:'guaranteeCaseRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
guaranteeCaseRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'guaranteeCase',context:{viewName:'guaranteeCaseRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
