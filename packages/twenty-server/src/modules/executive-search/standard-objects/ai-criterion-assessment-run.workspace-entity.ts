import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CriterionAssessmentRunStatus } from 'src/modules/executive-search/common/enums/criterion-assessment-run-status.enum';
import { type CriterionResultType } from 'src/modules/executive-search/common/enums/criterion-result-type.enum';
import { type ExecutiveCapabilityWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-capability.workspace-entity';
import { type ResearchCandidateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-candidate.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { type SearchCriterionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-criterion.workspace-entity';

/**
 * Standard object representing a shadow-mode AI criterion assessment run.
 *
 * Stores the full provenance and structured results of an AI evaluation of a
 * candidate against search criteria. Results are NEVER auto-applied — only a
 * human reviewer can submit them. This object serves as the audit trail and
 * evidence record for Phase 16 PR33 (Criterion Assessment Shadow Mode).
 */
export class AiCriterionAssessmentRunWorkspaceEntity extends BaseWorkspaceEntity {
  /** The AI capability that performed this assessment (e.g. 'criterion-assessment') */
  capability: string;

  /** The subject being assessed — typically a candidate or candidate profile */
  subject: string;

  /** Foreign key to the search assignment context */
  assignmentId: string | null;

  /** The AI model identifier used for the assessment (e.g. 'gpt-4', 'claude-3-opus') */
  model: string;

  /** The prompt template text or identifier used */
  prompt: string;

  /** Policy version governing this assessment */
  policyVersion: string | null;

  /** Input references — URLs, document IDs, or candidate identifiers provided as context */
  inputReferences: Record<string, unknown> | null;

  /** Hashes of input documents for integrity verification */
  inputHashes: Record<string, string> | null;

  /** Redaction manifest — records what was removed from input before sending to the AI model */
  redactionManifest: Record<string, unknown> | null;

  /** Structured result per criterion — maps criterion ID to evaluation result */
  structuredResult: Record<string, unknown> | null;

  /** Guardrail check results — records each guardrail check and its outcome */
  guardrailChecks: Record<string, unknown> | null;

  /** Overall assessment conclusion */
  conclusion: string | null;

  /** Assessment confidence score (0-1) if applicable */
  confidenceScore: number | null;

  /** Overall result type across all evaluated criteria */
  resultType: CriterionResultType | null;

  /** Run status: PENDING → IN_PROGRESS → COMPLETED/FAILED/DEACTIVATED */
  status: CriterionAssessmentRunStatus;

  /** Whether a human has reviewed and submitted this assessment */
  isSubmittedByHuman: boolean;

  /** Human reviewer identifier, populated when a human submits */
  humanReviewerId: string | null;

  /** Human reviewer override notes if the human disagrees with the AI assessment */
  humanOverrideNotes: string | null;

  /** Contest or appeal linkage — references any contest associated with this assessment */
  contestId: string | null;

  /** Kill switch indicator — true if this run was halted by a kill switch */
  killSwitchActivated: boolean;

  /** Timestamp of kill switch activation, if applicable */
  killSwitchActivatedAt: string | null;

  /** Error message if the assessment failed */
  errorMessage: string | null;

  /** Actor metadata for creation */
  createdBy: ActorMetadata;

  /** Actor metadata for last update */
  updatedBy: ActorMetadata;

  // Relations
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  searchCriterion: EntityRelation<SearchCriterionWorkspaceEntity> | null;
  searchCriterionId: string | null;
  researchCandidate: EntityRelation<ResearchCandidateWorkspaceEntity> | null;
  researchCandidateId: string | null;
  executiveCapability: EntityRelation<ExecutiveCapabilityWorkspaceEntity> | null;
  executiveCapabilityId: string | null;
}
