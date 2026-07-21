/* @license Enterprise */

/**
 * Type definitions for AI Research module (Phase 16 PR32).
 *
 * Each capability outputs structured, human-reviewable results.
 * No AI output is used without human review.
 */

// ─── Natural-language search filters ────────────────────────────────────────

export interface SearchFilterCriterion {
  /** The target entity (researchCandidate, executiveProfile, targetCompany). */
  entity: string;
  /** The field name to filter on. */
  field: string;
  /** The operator for the filter (e.g. eq, neq, contains, gt, lt, in). */
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  /** The filter value. */
  value: unknown;
}

export interface ParsedSearchFilters {
  naturalLanguageQuery: string;
  filters: SearchFilterCriterion[];
  /** Human-readable explanation of how the NL query was interpreted. */
  explanation: string;
}

// ─── Target-company suggestions ─────────────────────────────────────────────

export interface TargetCompanySuggestion {
  companyName: string;
  domain: string | null;
  industry: string | null;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  rationale: string;
  /** Confidence level: HIGH, MEDIUM, LOW. */
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TargetCompanySuggestionResult {
  positionSpecId: string;
  marketMapId: string | null;
  suggestions: TargetCompanySuggestion[];
  /** Summary of the reasoning approach used. */
  methodology: string;
  /** Warnings or caveats for the researcher. */
  caveats: string[];
}

// ─── Relationship-path suggestions ──────────────────────────────────────────

export interface RelationshipPathStep {
  /** Person or entity name at this step. */
  entityName: string;
  /** How the entity connects to the next step. */
  connection: string;
}

export interface RelationshipPathSuggestion {
  candidateName: string;
  candidateId: string;
  /** Ordered steps from firm contact to candidate. */
  path: RelationshipPathStep[];
  /** Full contextual narrative of the relationship chain. */
  narrative: string;
  /** Strength of the path (STRONG, MODERATE, WEAK). */
  pathStrength: 'STRONG' | 'MODERATE' | 'WEAK';
  /** Confidence score 0-1. */
  confidence: number;
}

export interface RelationshipPathSuggestionResult {
  assignmentId: string;
  candidateIds: string[];
  paths: RelationshipPathSuggestion[];
  methodology: string;
  caveats: string[];
  /** Always false — never auto-send outreach. */
  autoSend: false;
}

// ─── Kill-switch check result ───────────────────────────────────────────────

export interface KillSwitchCheck {
  enabled: boolean;
  reason: string | null;
}
