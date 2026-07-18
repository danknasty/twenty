import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardSearchInterviewViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'searchInterview'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
searchInterviewRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'searchInterview',context:{viewName:'searchInterviewRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
searchInterviewRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'searchInterview',context:{viewName:'searchInterviewRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
