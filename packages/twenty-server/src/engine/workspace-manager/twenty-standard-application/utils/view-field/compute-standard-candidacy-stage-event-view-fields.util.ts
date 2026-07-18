import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardCandidacyStageEventViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'candidacyStageEvent'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    candidacyStageEventRecordPageFieldsStage:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'stage',
          fieldName: 'stage',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsStageFrom:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'stageFrom',
          fieldName: 'stageFrom',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsStageTo:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'stageTo',
          fieldName: 'stageTo',
          position: 2,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsTransitionedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'transitionedAt',
          fieldName: 'transitionedAt',
          position: 3,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsTransitionedById:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'transitionedById',
          fieldName: 'transitionedById',
          position: 4,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsActorKind:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'actorKind',
          fieldName: 'actorKind',
          position: 5,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsReason:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'reason',
          fieldName: 'reason',
          position: 6,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsIsCandidateVisible:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'isCandidateVisible',
          fieldName: 'isCandidateVisible',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsCandidacy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'candidacy',
          fieldName: 'candidacy',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    candidacyStageEventRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'candidacyStageEvent',
        context: {
          viewName: 'candidacyStageEventRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
  };
};
