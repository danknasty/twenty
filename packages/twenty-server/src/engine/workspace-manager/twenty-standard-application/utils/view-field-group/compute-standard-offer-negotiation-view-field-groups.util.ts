import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { createStandardViewFieldGroupFlatMetadata, type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

export const computeStandardOfferNegotiationViewFieldGroups = (args: Omit<CreateStandardViewFieldGroupArgs<'offerNegotiation'>, 'context'>): Record<string, FlatViewFieldGroup> => ({
offerNegotiationRecordPageFieldsGeneral: createStandardViewFieldGroupFlatMetadata({...args,objectName:'offerNegotiation',context:{viewName:'offerNegotiationRecordPageFields',viewFieldGroupName:'general',fieldPosition:0,isAccordion:false,isVisible:true,label:'General'}}),
offerNegotiationRecordPageFieldsSystem: createStandardViewFieldGroupFlatMetadata({...args,objectName:'offerNegotiation',context:{viewName:'offerNegotiationRecordPageFields',viewFieldGroupName:'system',fieldPosition:1,isAccordion:true,isVisible:true,label:'System'}}),
});
