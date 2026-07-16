import { ViewKey, ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAssignmentTeamMemberViews = (
  args: Omit<CreateStandardViewArgs<'assignmentTeamMember'>, 'context'>,
): Record<string, FlatView> => {
  return {
    assignmentTeamMemberRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'assignmentTeamMember',
      context: {
        viewName: 'assignmentTeamMemberRecordPageFields',
        name: 'Assignment Team Member Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
