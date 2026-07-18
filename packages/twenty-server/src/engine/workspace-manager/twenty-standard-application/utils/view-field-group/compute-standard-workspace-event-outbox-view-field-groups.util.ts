import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';

// WorkspaceEventOutbox has no record-page layout, so no view field groups are needed.
export const computeStandardWorkspaceEventOutboxViewFieldGroups = (
  _args: Omit<
    CreateStandardViewFieldGroupArgs<'workspaceEventOutbox'>,
    'context'
  >,
): Record<string, FlatViewFieldGroup> => {
  return {};
};
