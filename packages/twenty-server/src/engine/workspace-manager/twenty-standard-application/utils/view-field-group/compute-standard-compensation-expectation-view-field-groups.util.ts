import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardCompensationExpectationViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'compensationExpectation'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
compensationExpectationRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'compensationExpectation',context:{viewName:'compensationExpectationRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
compensationExpectationRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'compensationExpectation',context:{viewName:'compensationExpectationRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
