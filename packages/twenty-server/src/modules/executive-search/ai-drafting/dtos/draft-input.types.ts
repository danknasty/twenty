import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

export type AssignmentIntakeInput = {
  /** Free-form client conversation notes from intake call / meeting. */
  conversationNotes: string;
  /** Id of the opportunity record this intake is for (nullable for prospects). */
  opportunityId: string | null;
  /** Id of the client company. */
  clientCompanyId: string;
};

export type PositionSpecInput = {
  /** Id of the search assignment this position spec belongs to. */
  assignmentId: string;
  /** Any additional context from client conversations not yet in standard fields. */
  additionalContext: string | null;
};

export type ResearchStrategyInput = {
  /** Id of the position specification to base strategy on. */
  positionSpecId: string;
  /** Id of the market map (if any). */
  marketMapId: string | null;
  /** Any additional researcher notes. */
  researcherNotes: string | null;
};

export type StatusReportInput = {
  /** Id of the search assignment to report on. */
  assignmentId: string;
  /** Report period start date (ISO string). */
  periodStart: string;
  /** Report period end date (ISO string). */
  periodEnd: string;
};

export type CandidatePresentationInput = {
  /** Id of the search candidacy record. */
  candidacyId: string;
  /** Id of the search assignment. */
  assignmentId: string;
  /** Any additional context or instructions for the presentation. */
  presentationContext: string | null;
  /** Whether candidate has consented to AI-generated presentation. */
  candidateConsented: boolean;
};

export type DraftInput =
  | { draftType: DraftType.ASSIGNMENT_INTAKE; input: AssignmentIntakeInput }
  | { draftType: DraftType.POSITION_SPEC; input: PositionSpecInput }
  | { draftType: DraftType.RESEARCH_STRATEGY; input: ResearchStrategyInput }
  | { draftType: DraftType.STATUS_REPORT; input: StatusReportInput }
  | {
      draftType: DraftType.CANDIDATE_PRESENTATION;
      input: CandidatePresentationInput;
    };
