import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { computeStandardAttachmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attachment-views.util';
import { computeStandardBlocklistViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-blocklist-views.util';
import { computeStandardCalendarChannelEventAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-channel-event-association-views.util';
import { computeStandardCalendarEventParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-participant-views.util';
import { computeStandardCalendarEventViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-views.util';
import { computeStandardCallRecordingViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-call-recording-views.util';
import { computeStandardCandidacyStageEventViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-candidacy-stage-event-views.util';
import { computeStandardClientAccountProfileViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-client-account-profile-views.util';
import { computeStandardClientStakeholderRoleViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-client-stakeholder-role-views.util';
import { computeStandardCompanyViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-company-views.util';
import { computeStandardDashboardViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-dashboard-views.util';
import {
  computeStandardExecutiveArtifactViews,
  computeStandardExecutiveAwardViews,
  computeStandardExecutiveBoardServiceViews,
  computeStandardExecutiveCapabilityViews,
  computeStandardExecutiveCareerExperienceViews,
  computeStandardExecutiveEducationViews,
  computeStandardExecutiveExternalProfileViews,
  computeStandardExecutiveLanguageViews,
  computeStandardExecutiveProfileViews,
  computeStandardExecutiveSearchPreferenceViews,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-executive-views.util';
import { computeStandardExecutiveProfileViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-executive-profile-views.util';
import { computeStandardExternalEntityLinkViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-external-entity-link-views.util';
import { computeStandardMessageCampaignViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-campaign-views.util';
import { computeStandardMessageChannelMessageAssociationMessageFolderViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-message-folder-views.util';
import { computeStandardMessageChannelMessageAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-views.util';
import { computeStandardMessageListViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-list-views.util';
import { computeStandardMessageParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-participant-views.util';
import { computeStandardMessageThreadViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-thread-views.util';
import { computeStandardMessageViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-views.util';
import { computeStandardNoteTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-target-views.util';
import { computeStandardNoteViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-views.util';
import { computeStandardOpportunityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-opportunity-views.util';
import { computeStandardPersonViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-person-views.util';
import { computeStandardTaskTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-target-views.util';
import { computeStandardTaskViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-views.util';
import { computeStandardTimelineActivityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-timeline-activity-views.util';
import { computeStandardWorkflowAutomatedTriggerViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-automated-trigger-views.util';
import { computeStandardWorkflowRunViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-run-views.util';
import { computeStandardWorkflowVersionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-version-views.util';
import { computeStandardWorkflowViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-views.util';
import { computeStandardWorkspaceEventOutboxViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workspace-event-outbox-views.util';
import { computeStandardWorkspaceMemberViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workspace-member-views.util';
import { computeStandardSearchEngagementTermsViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-engagement-terms-views.util';
import { computeStandardSearchAssignmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-assignment-views.util';
import { computeStandardAssignmentTeamMemberViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-assignment-team-member-views.util';
import { computeStandardSearchMilestoneViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-milestone-views.util';
import { computeStandardPositionSpecificationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-position-specification-views.util';
import { computeStandardSearchCriterionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-criterion-views.util';
import { computeStandardSearchCandidacyViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-candidacy-views.util';
import { computeStandardSearchCriterionViews }
import { computeStandardSearchInterviewViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-interview-views.util';
import { computeStandardReferenceCheckViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-reference-check-views.util';
import { computeStandardDiligenceCheckViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-diligence-check-views.util';
import { computeStandardCompensationExpectationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-compensation-expectation-views.util';
import { computeStandardOfferNegotiationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-offer-negotiation-views.util';
import { computeStandardPlacementViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-placement-views.util';
import { computeStandardGuaranteeCaseViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-guarantee-case-views.util';
 from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-search-criterion-views.util';
import {
  computeStandardConfidentialityRecordViews,
  computeStandardConflictCheckViews,
  computeStandardMarketMapViews,
  computeStandardOffLimitsRestrictionViews,
  computeStandardRelationshipEdgeViews,
  computeStandardResearchCandidateViews,
  computeStandardResearchStrategyViews,
  computeStandardTargetCompanyViews,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-research-offlimits-views.util';
import { type CreateStandardViewArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

import { computeExecutiveAssessmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-executive-assessment-views.util';
import { computeCriterionEvaluationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-criterion-evaluation-views.util';
import { computeSearchSlateViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-search-slate-views.util';
import { computeSlateMembershipViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-slate-membership-views.util';
import { computeCandidatePresentationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-candidate-presentation-views.util';
import { computeClientFeedbackViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-client-feedback-views.util';
import { computeSearchStatusReportViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-search-status-report-views.util';

import { computeStandardCompensationExpectationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-compensation-expectation-views.util';
import { computeStandardOfferNegotiationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-offer-negotiation-views.util';
import { computeStandardPlacementViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-placement-views.util';
import { computeStandardGuaranteeCaseViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-guarantee-case-views.util';

import { computeStandardBoardCompositionProfileViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-board-composition-profile-views.util';
import { computeStandardBoardMatrixCriterionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-board-matrix-criterion-views.util';
import { computeStandardCandidateBoardMatrixEvaluationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-candidate-board-matrix-evaluation-views.util';
import { computeStandardDirectorIndependenceReviewViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-director-independence-review-views.util';
import { computeStandardBoardCommitmentReviewViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-board-commitment-review-views.util';
import { computeAnalyticsMetricViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-analytics-metric-views.util';
import { computeAnalyticsDashboardViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-analytics-dashboard-views.util';

type StandardViewBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardViewArgs<P>, 'context'>,
) => Record<string, FlatView>;

const STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: computeStandardAttachmentViews,
  blocklist: computeStandardBlocklistViews,
  calendarChannelEventAssociation:
    computeStandardCalendarChannelEventAssociationViews,
  calendarEvent: computeStandardCalendarEventViews,
  calendarEventParticipant: computeStandardCalendarEventParticipantViews,
  callRecording: computeStandardCallRecordingViews,
  clientAccountProfile: computeStandardClientAccountProfileViews,
  clientStakeholderRole: computeStandardClientStakeholderRoleViews,
  company: computeStandardCompanyViews,
  confidentialityRecord:
    computeStandardConfidentialityRecordViews,
  conflictCheck: computeStandardConflictCheckViews,
  dashboard: computeStandardDashboardViews,
executiveArtifact: computeStandardExecutiveArtifactViews,
  executiveAward: computeStandardExecutiveAwardViews,
  executiveBoardService: computeStandardExecutiveBoardServiceViews,
  executiveCapability: computeStandardExecutiveCapabilityViews,
  executiveCareerExperience: computeStandardExecutiveCareerExperienceViews,
  executiveEducation: computeStandardExecutiveEducationViews,
  executiveExternalProfile: computeStandardExecutiveExternalProfileViews,
  executiveLanguage: computeStandardExecutiveLanguageViews,
  executiveProfile: computeStandardExecutiveProfileViews,
  executiveSearchPreference: computeStandardExecutiveSearchPreferenceViews,
  marketMap: computeStandardMarketMapViews,
executiveProfile: computeStandardExecutiveProfileViews,
  externalEntityLink: computeStandardExternalEntityLinkViews,
  message: computeStandardMessageViews,
  messageCampaign: computeStandardMessageCampaignViews,
  messageChannelMessageAssociation:
    computeStandardMessageChannelMessageAssociationViews,
  messageChannelMessageAssociationMessageFolder:
    computeStandardMessageChannelMessageAssociationMessageFolderViews,
  messageList: computeStandardMessageListViews,
  messageParticipant: computeStandardMessageParticipantViews,
  messageThread: computeStandardMessageThreadViews,
  note: computeStandardNoteViews,
  noteTarget: computeStandardNoteTargetViews,
  offLimitsRestriction:
    computeStandardOffLimitsRestrictionViews,
  opportunity: computeStandardOpportunityViews,
  person: computeStandardPersonViews,
  relationshipEdge: computeStandardRelationshipEdgeViews,
  researchCandidate: computeStandardResearchCandidateViews,
  researchStrategy: computeStandardResearchStrategyViews,
  targetCompany: computeStandardTargetCompanyViews,
  task: computeStandardTaskViews,
  taskTarget: computeStandardTaskTargetViews,
  timelineActivity: computeStandardTimelineActivityViews,
  workflow: computeStandardWorkflowViews,
  workflowAutomatedTrigger: computeStandardWorkflowAutomatedTriggerViews,
  workflowRun: computeStandardWorkflowRunViews,
  workflowVersion: computeStandardWorkflowVersionViews,
  workspaceEventOutbox: computeStandardWorkspaceEventOutboxViews,
  workspaceMember: computeStandardWorkspaceMemberViews,
  searchEngagementTerms: computeStandardSearchEngagementTermsViews,
  searchAssignment: computeStandardSearchAssignmentViews,
  assignmentTeamMember: computeStandardAssignmentTeamMemberViews,
  searchMilestone: computeStandardSearchMilestoneViews,
  candidacyStageEvent: computeStandardCandidacyStageEventViews,
  positionSpecification: computeStandardPositionSpecificationViews,
  searchCriterion: computeStandardSearchCriterionViews,
  searchCandidacy: computeStandardSearchCandidacyViews,
  searchInterview: computeStandardSearchInterviewViews,
  referenceCheck: computeStandardReferenceCheckViews,
  diligenceCheck: computeStandardDiligenceCheckViews,

  executiveAssessment: computeExecutiveAssessmentViews,
  criterionEvaluation: computeCriterionEvaluationViews,
  searchSlate: computeSearchSlateViews,
  slateMembership: computeSlateMembershipViews,
  candidatePresentation: computeCandidatePresentationViews,
  clientFeedback: computeClientFeedbackViews,
  searchStatusReport: computeSearchStatusReportViews,
  compensationExpectation: computeStandardCompensationExpectationViews,
  offerNegotiation: computeStandardOfferNegotiationViews,
  placement: computeStandardPlacementViews,
  guaranteeCase: computeStandardGuaranteeCaseViews,

boardCompositionProfile:
    computeStandardBoardCompositionProfileViews,
  boardMatrixCriterion:
    computeStandardBoardMatrixCriterionViews,
  candidateBoardMatrixEvaluation:
    computeStandardCandidateBoardMatrixEvaluationViews,
  directorIndependenceReview:
    computeStandardDirectorIndependenceReviewViews,
  boardCommitmentReview:
    computeStandardBoardCommitmentReviewViews,
  analyticsMetric: computeAnalyticsMetricViews,
  analyticsDashboard: computeAnalyticsDashboardViews,
} as const satisfies {
  [P in AllStandardObjectName]?: StandardViewBuilder<P>;
};

export type BuildStandardFlatViewMetadataMapsArgs = Omit<
  CreateStandardViewArgs,
  'context' | 'objectName'
>;

export const buildStandardFlatViewMetadataMaps = (
  args: BuildStandardFlatViewMetadataMapsArgs,
): FlatEntityMaps<FlatView> => {
  const allViewMetadatas: FlatView[] = (
    Object.keys(
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardViewBuilder<typeof objectName> =
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result);
  });

  let flatViewMaps = createEmptyFlatEntityMaps();

  for (const viewMetadata of allViewMetadatas) {
    flatViewMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: viewMetadata,
      flatEntityMaps: flatViewMaps,
    });
  }

  return flatViewMaps;
};
