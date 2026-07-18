import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardRetentionActionLogViewFields = (
  args: Omit<
    CreateStandardViewFieldArgs<'retentionActionLog'>,
    'context'
  >,
): Record<string, FlatViewField> => {
  return {
    // allRetentionActionLogs (table view)
    allRetentionActionLogsActionType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'actionType',
          fieldName: 'actionType',
          position: 0,
          isVisible: true,
          size: 150,
        },
      }),
    allRetentionActionLogsInitiatorSystem:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'initiatorSystem',
          fieldName: 'initiatorSystem',
          position: 1,
          isVisible: true,
          size: 150,
        },
      }),
    allRetentionActionLogsTargetTwentyEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'targetTwentyEntityName',
          fieldName: 'targetTwentyEntityName',
          position: 2,
          isVisible: true,
          size: 200,
        },
      }),
    allRetentionActionLogsTargetTwentyRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'targetTwentyRecordId',
          fieldName: 'targetTwentyRecordId',
          position: 3,
          isVisible: true,
          size: 200,
        },
      }),
    allRetentionActionLogsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 4,
          isVisible: true,
          size: 150,
        },
      }),
    allRetentionActionLogsRequestedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'requestedAt',
          fieldName: 'requestedAt',
          position: 5,
          isVisible: true,
          size: 150,
        },
      }),
    allRetentionActionLogsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'allRetentionActionLogs',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 6,
          isVisible: true,
          size: 150,
        },
      }),
    // retentionActionLogRecordPageFields (fields widget)
    retentionActionLogRecordPageFieldsActionType:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'actionType',
          fieldName: 'actionType',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsInitiatorSystem:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'initiatorSystem',
          fieldName: 'initiatorSystem',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsTargetTwentyEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'targetTwentyEntityName',
          fieldName: 'targetTwentyEntityName',
          position: 2,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsTargetTwentyRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'targetTwentyRecordId',
          fieldName: 'targetTwentyRecordId',
          position: 3,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsExternalSystemName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'externalSystemName',
          fieldName: 'externalSystemName',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsExternalRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'externalRecordId',
          fieldName: 'externalRecordId',
          position: 5,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsScope:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'scope',
          fieldName: 'scope',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsLegalHoldReference:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'legalHoldReference',
          fieldName: 'legalHoldReference',
          position: 7,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'status',
          fieldName: 'status',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsRequestedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'requestedAt',
          fieldName: 'requestedAt',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsPropagatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'propagatedAt',
          fieldName: 'propagatedAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsActorId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'actorId',
          fieldName: 'actorId',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsSourceHash:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'sourceHash',
          fieldName: 'sourceHash',
          position: 12,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    retentionActionLogRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 13,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    retentionActionLogRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'retentionActionLog',
        context: {
          viewName: 'retentionActionLogRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 14,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
  };
};
