import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type CreateStandardViewArgs, createStandardViewFlatMetadata, } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardBoardCompositionProfileViews = ({ context, }: Omit<CreateStandardViewArgs<'boardCompositionProfile'>, 'context'>): Record<string, FlatView> => ({
  allBoardCompositionProfiles: createStandardViewFlatMetadata({ args: { objectName: 'boardCompositionProfile' as AllStandardObjectName, context: { viewName: 'All Board Composition Profiles', viewType: 'TABLE', key: 'INDEX', }, }, context, }),
  boardCompositionProfileRecordPageFields: createStandardViewFlatMetadata({ args: { objectName: 'boardCompositionProfile' as AllStandardObjectName, context: { viewName: 'Board Composition Profile Record Page Fields', viewType: 'FIELDS_WIDGET', key: 'INDEX', }, }, context, }),
});
