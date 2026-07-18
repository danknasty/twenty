import { ViewKey, ViewType } from 'twenty-shared/types';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { createStandardViewFlatMetadata, type CreateStandardViewArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardGuaranteeCaseViews = (args: Omit<CreateStandardViewArgs<'guaranteeCase'>, 'context'>): Record<string, FlatView> => ({
guaranteeCaseRecordPageFields: createStandardViewFlatMetadata({...args,objectName:'guaranteeCase',context:{viewName:'guaranteeCaseRecordPageFields',name:'Guarantee Case Record Page Fields',type:ViewType.FIELDS_WIDGET,key:null,position:0,icon:'IconList'}}),
});
