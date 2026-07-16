import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardWorkspaceEventOutboxViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'workspaceEventOutbox'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allWorkspaceEventOutboxesEventName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'workspaceEventOutbox',
      context: {
        viewName: 'allWorkspaceEventOutboxes',
        viewFieldName: 'eventName',
        fieldName: 'eventName',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allWorkspaceEventOutboxesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'workspaceEventOutbox',
      context: {
        viewName: 'allWorkspaceEventOutboxes',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allWorkspaceEventOutboxesAttemptCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'workspaceEventOutbox',
      context: {
        viewName: 'allWorkspaceEventOutboxes',
        viewFieldName: 'attemptCount',
        fieldName: 'attemptCount',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allWorkspaceEventOutboxesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'workspaceEventOutbox',
      context: {
        viewName: 'allWorkspaceEventOutboxes',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
