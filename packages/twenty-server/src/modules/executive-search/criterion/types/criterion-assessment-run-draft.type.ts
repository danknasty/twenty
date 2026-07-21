import { type CriterionResultType } from 'src/modules/executive-search/common/enums/criterion-result-type.enum';

/**
 * Full provenance draft for a criterion assessment run.
 *
 * This is the complete input payload for a shadow-mode assessment.
 * Every field captures part of the provenance required by the AI
 * governance framework (see docs/executive-search/08-ai-governance.md).
 */
export interface CriterionAssessmentRunDraft {
  /** The AI capability performing this assessment */
  capability: string;

  /** The subject being assessed (candidate name or identifier) */
  subject: string;

  /** Foreign key to the search assignment context (optional) */
  assignmentId?: string | null;

  /** The AI model identifier used */
  model: string;

  /** The prompt template text or reference */
  prompt: string;

  /** Policy version governing this assessment */
  policyVersion?: string | null;

  /** Input references — URLs, document IDs, candidate identifiers */
  inputReferences?: Record<string, unknown> | null;

  /** Hashes of input documents for integrity verification */
  inputHashes?: Record<string, string> | null;

  /** Redaction manifest — what was removed before sending to AI */
  redactionManifest?: Record<string, unknown> | null;

  /** Structured result per criterion — maps criterion ID to evaluation */
  structuredResult?: Record<string, unknown> | null;

  /** Guardrail check results */
  guardrailChecks?: Record<string, unknown> | null;

  /** Overall assessment conclusion */
  conclusion?: string | null;

  /** Assessment confidence score (0-1) */
  confidenceScore?: number | null;

  /** Overall result type */
  resultType?: CriterionResultType | null;

  /** Contest or appeal linkage */
  contestId?: string | null;
}
