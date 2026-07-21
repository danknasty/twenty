/**
 * Shared types for Research AI services (Phase 16 / PR32).
 *
 * These types define the contracts for AI-powered research capabilities
 * in the executive-search module: natural-language search filters,
 * target-company suggestions, and relationship path suggestions.
 */

// ---------------------------------------------------------------------------
// NL Search Filter
// ---------------------------------------------------------------------------

/**
 * A single filter expression produced by the AI, compatible with
 * Twenty's filter system (field name, operator, value).
 */
export type AiGeneratedFilter = {
  fieldName: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike';
  value: unknown;
};

/**
 * Result of translating a natural-language query into structured filters.
 */
export type NlSearchFilterResult = {
  /** The translated structured filters. */
  filters: AiGeneratedFilter[];
  /** Human-readable explanation of what the AI interpreted from the query. */
  explanation: string;
  /** The original natural-language query. */
  originalQuery: string;
  /** Label per governance requirements. */
  label: 'AI DRAFT — HUMAN REVIEW REQUIRED';
};

// ---------------------------------------------------------------------------
// Target-Company Suggestion
// ---------------------------------------------------------------------------

/**
 * A single suggested target company.
 */
export type TargetCompanySuggestionItem = {
  /** Suggested company name. */
  companyName: string;
  /** Rationale for the suggestion. */
  rationale: string;
  /** Confidence level (0–1). */
  confidence: number;
  /** Source data / evidence the AI used to produce this suggestion. */
  sourceDataUsed: string[];
};

/**
 * Result of AI-powered target-company suggestion.
 */
export type TargetCompanySuggestionResult = {
  /** Ordered list of suggestions (highest confidence first). */
  suggestions: TargetCompanySuggestionItem[];
  /** Label per governance requirements. */
  label: 'AI DRAFT — HUMAN REVIEW REQUIRED';
};

// ---------------------------------------------------------------------------
// Relationship Path Suggestion
// ---------------------------------------------------------------------------

/**
 * An intermediate connection in a relationship path.
 */
export type RelationshipPathConnection = {
  /** Name or identifier of the intermediate person. */
  personName: string;
  /** How this person connects to the next hop. */
  connectionType: string;
};

/**
 * A single suggested relationship path.
 */
export type RelationshipPathSuggestionItem = {
  /** Human-readable path description. */
  pathDescription: string;
  /** Confidence level (0–1). */
  confidence: number;
  /** Intermediate connections along the path. */
  intermediateConnections: RelationshipPathConnection[];
};

/**
 * Result of AI-powered relationship-path suggestion.
 */
export type RelationshipPathSuggestionResult = {
  /** Ordered list of suggestions (highest confidence first). */
  suggestions: RelationshipPathSuggestionItem[];
  /** Label per governance requirements. */
  label: 'AI DRAFT — HUMAN REVIEW REQUIRED';
};

// ---------------------------------------------------------------------------
// Evidence / Provenance
// ---------------------------------------------------------------------------

/**
 * Record of a guardrail check performed during an AI operation.
 */
export type GuardrailCheckRecord = {
  guardrailName: string;
  passed: boolean;
  detail: string;
};

/**
 * Provenance payload recorded for every AI output in the research-ai
 * module, as required by the AI governance document (08-ai-governance.md).
 */
export type ResearchAiProvenance = {
  capability: string;
  subject: string;
  assignmentId: string | null;
  modelUsed: string;
  promptVersion: string;
  inputReferences: string[];
  output: object;
  guardrailChecks: GuardrailCheckRecord[];
  performedAt: Date;
  performedByUserId: string | null;
};

// ---------------------------------------------------------------------------
// Kill-switch response
// ---------------------------------------------------------------------------

/**
 * Returned when a capability's independent kill switch is active.
 */
export type KillSwitchDisabledResponse = {
  disabled: true;
  capability: string;
  message: string;
};
