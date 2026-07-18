import {
  STANDARD_BLOCKLIST_PAGE_LAYOUT_CONFIG,
  STANDARD_CALENDAR_CHANNEL_EVENT_ASSOCIATION_PAGE_LAYOUT_CONFIG,
  STANDARD_CALENDAR_EVENT_PAGE_LAYOUT_CONFIG,
  STANDARD_CALENDAR_EVENT_PARTICIPANT_PAGE_LAYOUT_CONFIG,
  STANDARD_CALL_RECORDING_PAGE_LAYOUT_CONFIG,
  STANDARD_CANDIDACY_STAGE_EVENT_PAGE_LAYOUT_CONFIG,
  STANDARD_CLIENT_ACCOUNT_PROFILE_PAGE_LAYOUT_CONFIG,
  STANDARD_CLIENT_STAKEHOLDER_ROLE_PAGE_LAYOUT_CONFIG,
  STANDARD_COMPANY_PAGE_LAYOUT_CONFIG,
  STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG,
  STANDARD_EXECUTIVE_PROFILE_PAGE_LAYOUT_CONFIG,
  STANDARD_EXTERNAL_ENTITY_LINK_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_CAMPAIGN_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_PARTICIPANT_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_LIST_PAGE_LAYOUT_CONFIG,
  STANDARD_MESSAGE_THREAD_PAGE_LAYOUT_CONFIG,
  STANDARD_NOTE_PAGE_LAYOUT_CONFIG,
  STANDARD_OPPORTUNITY_PAGE_LAYOUT_CONFIG,
  STANDARD_PERSON_PAGE_LAYOUT_CONFIG,
  STANDARD_TASK_PAGE_LAYOUT_CONFIG,
  STANDARD_WORKFLOW_AUTOMATED_TRIGGER_PAGE_LAYOUT_CONFIG,
  STANDARD_WORKFLOW_PAGE_LAYOUT_CONFIG,
  STANDARD_WORKFLOW_RUN_PAGE_LAYOUT_CONFIG,
  STANDARD_WORKFLOW_VERSION_PAGE_LAYOUT_CONFIG,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config';
import { STANDARD_SEARCH_INTERVIEW_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-search-interview-page-layout.config';
import { STANDARD_REFERENCE_CHECK_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-reference-check-page-layout.config';
import { STANDARD_DILIGENCE_CHECK_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-diligence-check-page-layout.config';
import { STANDARD_EXECUTIVE_ASSESSMENT_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-executive-assessment-page-layout.config';
import { STANDARD_CRITERION_EVALUATION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-criterion-evaluation-page-layout.config';
import { STANDARD_SEARCH_SLATE_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-search-slate-page-layout.config';
import { STANDARD_SLATE_MEMBERSHIP_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-slate-membership-page-layout.config';
import { STANDARD_CANDIDATE_PRESENTATION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-candidate-presentation-page-layout.config';
import { STANDARD_CLIENT_FEEDBACK_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-client-feedback-page-layout.config';
import { STANDARD_SEARCH_STATUS_REPORT_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-search-status-report-page-layout.config';
import { STANDARD_COMPENSATION_EXPECTATION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-compensation-expectation-page-layout.config';
import { STANDARD_OFFER_NEGOTIATION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-offer-negotiation-page-layout.config';
import { STANDARD_PLACEMENT_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-placement-page-layout.config';
import { STANDARD_GUARANTEE_CASE_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-guarantee-case-page-layout.config';
import { type StandardRecordPageLayouts } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-page-layout-config.type';

import { STANDARD_BOARD_COMPOSITION_PROFILE_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-board-composition-profile-page-layout.config';
import { STANDARD_BOARD_MATRIX_CRITERION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-board-matrix-criterion-page-layout.config';
import { STANDARD_CANDIDATE_BOARD_MATRIX_EVALUATION_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-candidate-board-matrix-evaluation-page-layout.config';
import { STANDARD_DIRECTOR_INDEPENDENCE_REVIEW_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-director-independence-review-page-layout.config';
import { STANDARD_BOARD_COMMITMENT_REVIEW_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-board-commitment-review-page-layout.config';
import { STANDARD_AI_PROMPT_TEMPLATE_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-ai-prompt-template-page-layout.config';
import { STANDARD_ANALYTICS_DOMAIN_METRIC_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-analytics-domain-metric-page-layout.config';
import { STANDARD_ANALYTICS_METRIC_SNAPSHOT_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-analytics-metric-snapshot-page-layout.config';
import { STANDARD_ANALYTICS_DASHBOARD_CONFIG_PAGE_LAYOUT_CONFIG } from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-analytics-dashboard-config-page-layout.config';
export const STANDARD_PAGE_LAYOUTS = {
  myFirstDashboard: STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG,
  blocklistRecordPage: STANDARD_BLOCKLIST_PAGE_LAYOUT_CONFIG,
  calendarChannelEventAssociationRecordPage:
    STANDARD_CALENDAR_CHANNEL_EVENT_ASSOCIATION_PAGE_LAYOUT_CONFIG,
  calendarEventRecordPage: STANDARD_CALENDAR_EVENT_PAGE_LAYOUT_CONFIG,
  calendarEventParticipantRecordPage:
    STANDARD_CALENDAR_EVENT_PARTICIPANT_PAGE_LAYOUT_CONFIG,
  callRecordingRecordPage: STANDARD_CALL_RECORDING_PAGE_LAYOUT_CONFIG,
  candidacyStageEventRecordPage:
    STANDARD_CANDIDACY_STAGE_EVENT_PAGE_LAYOUT_CONFIG,
  searchCandidacyRecordPage:
    STANDARD_SEARCH_CANDIDACY_PAGE_LAYOUT_CONFIG,
  clientAccountProfileRecordPage:
    STANDARD_CLIENT_ACCOUNT_PROFILE_PAGE_LAYOUT_CONFIG,
  clientStakeholderRoleRecordPage:
    STANDARD_CLIENT_STAKEHOLDER_ROLE_PAGE_LAYOUT_CONFIG,
  companyRecordPage: STANDARD_COMPANY_PAGE_LAYOUT_CONFIG,
  executiveProfileRecordPage: STANDARD_EXECUTIVE_PROFILE_PAGE_LAYOUT_CONFIG,
  externalEntityLinkRecordPage:
    STANDARD_EXTERNAL_ENTITY_LINK_PAGE_LAYOUT_CONFIG,
  messageCampaignRecordPage: STANDARD_MESSAGE_CAMPAIGN_PAGE_LAYOUT_CONFIG,
  messageChannelMessageAssociationRecordPage:
    STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_PAGE_LAYOUT_CONFIG,
  messageChannelMessageAssociationMessageFolderRecordPage:
    STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG,
  messageParticipantRecordPage: STANDARD_MESSAGE_PARTICIPANT_PAGE_LAYOUT_CONFIG,
  messageListRecordPage: STANDARD_MESSAGE_LIST_PAGE_LAYOUT_CONFIG,
  messageThreadRecordPage: STANDARD_MESSAGE_THREAD_PAGE_LAYOUT_CONFIG,
  noteRecordPage: STANDARD_NOTE_PAGE_LAYOUT_CONFIG,
  opportunityRecordPage: STANDARD_OPPORTUNITY_PAGE_LAYOUT_CONFIG,
  personRecordPage: STANDARD_PERSON_PAGE_LAYOUT_CONFIG,
  taskRecordPage: STANDARD_TASK_PAGE_LAYOUT_CONFIG,
  workflowRecordPage: STANDARD_WORKFLOW_PAGE_LAYOUT_CONFIG,
  workflowAutomatedTriggerRecordPage:
    STANDARD_WORKFLOW_AUTOMATED_TRIGGER_PAGE_LAYOUT_CONFIG,
  workflowVersionRecordPage: STANDARD_WORKFLOW_VERSION_PAGE_LAYOUT_CONFIG,
  workflowRunRecordPage: STANDARD_WORKFLOW_RUN_PAGE_LAYOUT_CONFIG,
  searchCandidacyRecordPage: STANDARD_SEARCH_CANDIDACY_PAGE_LAYOUT_CONFIG,
  searchInterviewRecordPage:
    STANDARD_SEARCH_INTERVIEW_PAGE_LAYOUT_CONFIG,
  referenceCheckRecordPage:
    STANDARD_REFERENCE_CHECK_PAGE_LAYOUT_CONFIG,
  diligenceCheckRecordPage:
    STANDARD_DILIGENCE_CHECK_PAGE_LAYOUT_CONFIG,
  executiveAssessmentRecordPage:
    STANDARD_EXECUTIVE_ASSESSMENT_PAGE_LAYOUT_CONFIG,
  criterionEvaluationRecordPage:
    STANDARD_CRITERION_EVALUATION_PAGE_LAYOUT_CONFIG,
  searchSlateRecordPage:
    STANDARD_SEARCH_SLATE_PAGE_LAYOUT_CONFIG,
  slateMembershipRecordPage:
    STANDARD_SLATE_MEMBERSHIP_PAGE_LAYOUT_CONFIG,
  candidatePresentationRecordPage:
    STANDARD_CANDIDATE_PRESENTATION_PAGE_LAYOUT_CONFIG,
  clientFeedbackRecordPage:
    STANDARD_CLIENT_FEEDBACK_PAGE_LAYOUT_CONFIG,
  searchStatusReportRecordPage:
    STANDARD_SEARCH_STATUS_REPORT_PAGE_LAYOUT_CONFIG,
  compensationExpectationRecordPage:
    STANDARD_COMPENSATION_EXPECTATION_PAGE_LAYOUT_CONFIG,
  offerNegotiationRecordPage:
    STANDARD_OFFER_NEGOTIATION_PAGE_LAYOUT_CONFIG,
  placementRecordPage:
    STANDARD_PLACEMENT_PAGE_LAYOUT_CONFIG,
  guaranteeCaseRecordPage:
    STANDARD_GUARANTEE_CASE_PAGE_LAYOUT_CONFIG,
  boardCompositionProfileRecordPage:
    STANDARD_BOARD_COMPOSITION_PROFILE_PAGE_LAYOUT_CONFIG,
  boardMatrixCriterionRecordPage:
    STANDARD_BOARD_MATRIX_CRITERION_PAGE_LAYOUT_CONFIG,
  candidateBoardMatrixEvaluationRecordPage:
    STANDARD_CANDIDATE_BOARD_MATRIX_EVALUATION_PAGE_LAYOUT_CONFIG,
  directorIndependenceReviewRecordPage:
    STANDARD_DIRECTOR_INDEPENDENCE_REVIEW_PAGE_LAYOUT_CONFIG,
  boardCommitmentReviewRecordPage:
    STANDARD_BOARD_COMMITMENT_REVIEW_PAGE_LAYOUT_CONFIG,
  aiPromptTemplateRecordPage:
    STANDARD_AI_PROMPT_TEMPLATE_PAGE_LAYOUT_CONFIG,
  analyticsDomainMetricRecordPage: STANDARD_ANALYTICS_DOMAIN_METRIC_PAGE_LAYOUT_CONFIG,
  analyticsMetricSnapshotRecordPage: STANDARD_ANALYTICS_METRIC_SNAPSHOT_PAGE_LAYOUT_CONFIG,
  analyticsDashboardConfigRecordPage: STANDARD_ANALYTICS_DASHBOARD_CONFIG_PAGE_LAYOUT_CONFIG,
} as const;

const { myFirstDashboard: _myFirstDashboard, ...recordPageLayouts } =
  STANDARD_PAGE_LAYOUTS;

export const STANDARD_RECORD_PAGE_LAYOUTS =
  recordPageLayouts satisfies StandardRecordPageLayouts;
