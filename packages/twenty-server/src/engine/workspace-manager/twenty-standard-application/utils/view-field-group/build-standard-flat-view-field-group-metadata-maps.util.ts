import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { computeStandardBlocklistViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-blocklist-view-field-groups.util';
import { computeStandardCalendarChannelEventAssociationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-calendar-channel-event-association-view-field-groups.util';
import { computeStandardCalendarEventViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-calendar-event-view-field-groups.util';
import { computeStandardCalendarEventParticipantViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-calendar-event-participant-view-field-groups.util';
import { computeStandardCallRecordingViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-call-recording-view-field-groups.util';
import { computeStandardCandidacyStageEventViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-candidacy-stage-event-view-field-groups.util';
import { computeStandardClientAccountProfileViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-client-account-profile-view-field-groups.util';
import { computeStandardClientStakeholderRoleViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-client-stakeholder-role-view-field-groups.util';
import { computeStandardCompanyViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-company-view-field-groups.util';
import { computeStandardExecutiveProfileViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-executive-profile-view-field-groups.util';
import { computeStandardExternalEntityLinkViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-external-entity-link-view-field-groups.util';
import { computeStandardMessageChannelMessageAssociationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-message-channel-message-association-view-field-groups.util';
import { computeStandardMessageChannelMessageAssociationMessageFolderViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-message-channel-message-association-message-folder-view-field-groups.util';
import { computeStandardMessageParticipantViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-message-participant-view-field-groups.util';
import { computeStandardNoteViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-note-view-field-groups.util';
import { computeStandardOpportunityViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-opportunity-view-field-groups.util';
import { computeStandardPersonViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-person-view-field-groups.util';
import { computeStandardTaskViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-task-view-field-groups.util';
import { computeStandardWorkflowAutomatedTriggerViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-workflow-automated-trigger-view-field-groups.util';
import { computeStandardWorkflowRunViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-workflow-run-view-field-groups.util';
import { computeStandardWorkspaceEventOutboxViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-workspace-event-outbox-view-field-groups.util';
import { computeStandardWorkflowVersionViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-workflow-version-view-field-groups.util';
import { computeStandardSearchCandidacyViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-search-candidacy-view-field-groups.util';
import { type CreateStandardViewFieldGroupArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/create-standard-view-field-group-flat-metadata.util';
import { computeStandardSearchInterviewViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-search-interview-view-field-groups.util';
import { computeStandardReferenceCheckViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-reference-check-view-field-groups.util';
import { computeStandardDiligenceCheckViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-diligence-check-view-field-groups.util';
import { computeStandardCompensationExpectationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-compensation-expectation-view-field-groups.util';
import { computeStandardOfferNegotiationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-offer-negotiation-view-field-groups.util';
import { computeStandardPlacementViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-placement-view-field-groups.util';
import { computeStandardGuaranteeCaseViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-guarantee-case-view-field-groups.util';

import { computeStandardExecutiveAssessmentViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-executive-assessment-view-field-groups.util';
import { computeStandardCriterionEvaluationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-criterion-evaluation-view-field-groups.util';
import { computeStandardSearchSlateViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-search-slate-view-field-groups.util';
import { computeStandardSlateMembershipViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-slate-membership-view-field-groups.util';
import { computeStandardCandidatePresentationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-candidate-presentation-view-field-groups.util';
import { computeStandardClientFeedbackViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-client-feedback-view-field-groups.util';
import { computeStandardSearchStatusReportViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-search-status-report-view-field-groups.util';

import { computeStandardBoardCompositionProfileViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-board-composition-profile-view-field-groups.util';
import { computeStandardBoardMatrixCriterionViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-board-matrix-criterion-view-field-groups.util';
import { computeStandardCandidateBoardMatrixEvaluationViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-candidate-board-matrix-evaluation-view-field-groups.util';
import { computeStandardDirectorIndependenceReviewViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-director-independence-review-view-field-groups.util';
import { computeStandardBoardCommitmentReviewViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-board-commitment-review-view-field-groups.util';
import { computeStandardAiPromptTemplateViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-ai-prompt-template-view-field-groups.util';
import { computeStandardAnalyticsMetricViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-analytics-metric-view-field-groups.util';
import { computeStandardAnalyticsDashboardViewFieldGroups } from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field-group/compute-standard-analytics-dashboard-view-field-groups.util';


type StandardViewFieldGroupBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardViewFieldGroupArgs<P>, 'context'>,
) => Record<string, FlatViewFieldGroup>;

const STANDARD_FLAT_VIEW_FIELD_GROUP_METADATA_BUILDERS_BY_OBJECT_NAME = {
  blocklist: computeStandardBlocklistViewFieldGroups,
  calendarChannelEventAssociation:
    computeStandardCalendarChannelEventAssociationViewFieldGroups,
  calendarEvent: computeStandardCalendarEventViewFieldGroups,
  calendarEventParticipant:
    computeStandardCalendarEventParticipantViewFieldGroups,
  callRecording: computeStandardCallRecordingViewFieldGroups,
  candidacyStageEvent: computeStandardCandidacyStageEventViewFieldGroups,
  clientAccountProfile: computeStandardClientAccountProfileViewFieldGroups,
  clientStakeholderRole: computeStandardClientStakeholderRoleViewFieldGroups,
  company: computeStandardCompanyViewFieldGroups,
  executiveProfile: computeStandardExecutiveProfileViewFieldGroups,
  externalEntityLink: computeStandardExternalEntityLinkViewFieldGroups,
  messageChannelMessageAssociation:
    computeStandardMessageChannelMessageAssociationViewFieldGroups,
  messageChannelMessageAssociationMessageFolder:
    computeStandardMessageChannelMessageAssociationMessageFolderViewFieldGroups,
  messageParticipant: computeStandardMessageParticipantViewFieldGroups,
  note: computeStandardNoteViewFieldGroups,
  opportunity: computeStandardOpportunityViewFieldGroups,
  person: computeStandardPersonViewFieldGroups,
  task: computeStandardTaskViewFieldGroups,
  workflowAutomatedTrigger:
    computeStandardWorkflowAutomatedTriggerViewFieldGroups,
  workflowRun: computeStandardWorkflowRunViewFieldGroups,
  workspaceEventOutbox:
    computeStandardWorkspaceEventOutboxViewFieldGroups,
  workflowVersion: computeStandardWorkflowVersionViewFieldGroups,
  searchCandidacy: computeStandardSearchCandidacyViewFieldGroups,

  executiveAssessment: computeStandardExecutiveAssessmentViewFieldGroups,
  criterionEvaluation: computeStandardCriterionEvaluationViewFieldGroups,
  searchSlate: computeStandardSearchSlateViewFieldGroups,
  slateMembership: computeStandardSlateMembershipViewFieldGroups,
  candidatePresentation: computeStandardCandidatePresentationViewFieldGroups,
  clientFeedback: computeStandardClientFeedbackViewFieldGroups,
  searchStatusReport: computeStandardSearchStatusReportViewFieldGroups,
  compensationExpectation: computeStandardCompensationExpectationViewFieldGroups,
  offerNegotiation: computeStandardOfferNegotiationViewFieldGroups,
  placement: computeStandardPlacementViewFieldGroups,
  guaranteeCase: computeStandardGuaranteeCaseViewFieldGroups,
boardCompositionProfile:
    computeStandardBoardCompositionProfileViewFieldGroups,
  boardMatrixCriterion:
    computeStandardBoardMatrixCriterionViewFieldGroups,
  candidateBoardMatrixEvaluation:
    computeStandardCandidateBoardMatrixEvaluationViewFieldGroups,
  directorIndependenceReview:
    computeStandardDirectorIndependenceReviewViewFieldGroups,
  boardCommitmentReview:
    computeStandardBoardCommitmentReviewViewFieldGroups,
  aiPromptTemplate: computeStandardAiPromptTemplateViewFieldGroups,
  analyticsMetric: computeStandardAnalyticsMetricViewFieldGroups,
  analyticsDashboard: computeStandardAnalyticsDashboardViewFieldGroups,
} as const satisfies {
  [P in AllStandardObjectName]?: StandardViewFieldGroupBuilder<P>;
};

export type BuildStandardFlatViewFieldGroupMetadataMapsArgs = Omit<
  CreateStandardViewFieldGroupArgs,
  'context' | 'objectName'
>;

export const buildStandardFlatViewFieldGroupMetadataMaps = (
  args: BuildStandardFlatViewFieldGroupMetadataMapsArgs,
): FlatEntityMaps<FlatViewFieldGroup> => {
  const allViewFieldGroupMetadatas: FlatViewFieldGroup[] = (
    Object.keys(
      STANDARD_FLAT_VIEW_FIELD_GROUP_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_VIEW_FIELD_GROUP_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardViewFieldGroupBuilder<typeof objectName> =
      STANDARD_FLAT_VIEW_FIELD_GROUP_METADATA_BUILDERS_BY_OBJECT_NAME[
        objectName
      ];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result);
  });

  let flatViewFieldGroupMaps = createEmptyFlatEntityMaps();

  for (const viewFieldGroupMetadata of allViewFieldGroupMetadatas) {
    flatViewFieldGroupMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: viewFieldGroupMetadata,
      flatEntityMaps: flatViewFieldGroupMaps,
  searchInterview: computeStandardSearchInterviewViewFieldGroups,
  referenceCheck: computeStandardReferenceCheckViewFieldGroups,
  diligenceCheck: computeStandardDiligenceCheckViewFieldGroups,
    });
  }

  return flatViewFieldGroupMaps;
};
