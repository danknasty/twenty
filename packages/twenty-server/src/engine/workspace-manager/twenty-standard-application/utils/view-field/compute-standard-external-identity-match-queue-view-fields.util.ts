import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardExternalIdentityMatchQueueViewFields = (
  args: Omit<
    CreateStandardViewFieldArgs<'externalIdentityMatchQueue'>,
    'context'
  >,
): Record<string, FlatViewField> => {
  return {
    // allExternalIdentityMatchQueues (table view)
    allExternalIdentityMatchQueuesExternalSystemName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'externalSystemName',
          fieldName: 'externalSystemName',
          position: 0,
          isVisible: true,
          size: 150,
        },
      }),
    allExternalIdentityMatchQueuesExternalEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'externalEntityName',
          fieldName: 'externalEntityName',
          position: 1,
          isVisible: true,
          size: 150,
        },
      }),
    allExternalIdentityMatchQueuesExternalRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'externalRecordId',
          fieldName: 'externalRecordId',
          position: 2,
          isVisible: true,
          size: 200,
        },
      }),
    allExternalIdentityMatchQueuesMatchConfidence:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'matchConfidence',
          fieldName: 'matchConfidence',
          position: 3,
          isVisible: true,
          size: 150,
        },
      }),
    allExternalIdentityMatchQueuesResolutionState:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'resolutionState',
          fieldName: 'resolutionState',
          position: 4,
          isVisible: true,
          size: 150,
        },
      }),
    allExternalIdentityMatchQueuesCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'allExternalIdentityMatchQueues',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 5,
          isVisible: true,
          size: 150,
        },
      }),
    // externalIdentityMatchQueueRecordPageFields (fields widget)
    externalIdentityMatchQueueRecordPageFieldsExternalSystemName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'externalSystemName',
          fieldName: 'externalSystemName',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsExternalEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'externalEntityName',
          fieldName: 'externalEntityName',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsExternalRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'externalRecordId',
          fieldName: 'externalRecordId',
          position: 2,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsExternalNaturalKey:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'externalNaturalKey',
          fieldName: 'externalNaturalKey',
          position: 3,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsMatchedTwentyEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'matchedTwentyEntityName',
          fieldName: 'matchedTwentyEntityName',
          position: 4,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsMatchConfidence:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'matchConfidence',
          fieldName: 'matchConfidence',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsCandidateMatches:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'candidateMatches',
          fieldName: 'candidateMatches',
          position: 6,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsResolutionState:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'resolutionState',
          fieldName: 'resolutionState',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsResolvedTwentyEntityName:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'resolvedTwentyEntityName',
          fieldName: 'resolvedTwentyEntityName',
          position: 8,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsResolvedTwentyRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'resolvedTwentyRecordId',
          fieldName: 'resolvedTwentyRecordId',
          position: 9,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsResolvedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'resolvedAt',
          fieldName: 'resolvedAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsResolvedById:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'resolvedById',
          fieldName: 'resolvedById',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsMatchReasons:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'matchReasons',
          fieldName: 'matchReasons',
          position: 12,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 13,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    externalIdentityMatchQueueRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalIdentityMatchQueue',
        context: {
          viewName: 'externalIdentityMatchQueueRecordPageFields',
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
