export enum ExecutiveSearchExceptionCode {
  OPPORTUNITY_NOT_WON = 'OPPORTUNITY_NOT_WON',
  NO_APPROVED_ENGAGEMENT_TERMS = 'NO_APPROVED_ENGAGEMENT_TERMS',
  OFF_LIMITS_BLOCKED = 'OFF_LIMITS_BLOCKED',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  OPPORTUNITY_NOT_FOUND = 'OPPORTUNITY_NOT_FOUND',
  CLIENT_COMPANY_REQUIRED = 'CLIENT_COMPANY_REQUIRED',
  /** Applying a cutover stage that does not advance past the current stage. */
  CUTOVER_STAGE_REGRESSION = 'CUTOVER_STAGE_REGRESSION',
  /** Reverting to a stage that is not behind the current stage. */
  CUTOVER_INVALID_REVERT = 'CUTOVER_INVALID_REVERT',
  METRIC_NOT_FOUND = 'METRIC_NOT_FOUND',
  /** Board matrix AI feature is disabled. */
  BOARD_MATRIX_AI_DISABLED = 'BOARD_MATRIX_AI_DISABLED',
  /** Search health AI feature is disabled. */
  SEARCH_HEALTH_AI_DISABLED = 'SEARCH_HEALTH_AI_DISABLED',
  /** AI candidate feature (umbrella) is disabled. */
  EXECUTIVE_SEARCH_AI_DISABLED = 'EXECUTIVE_SEARCH_AI_DISABLED',
  /** Board matrix profile not found. */
  BOARD_COMPOSITION_PROFILE_NOT_FOUND = 'BOARD_COMPOSITION_PROFILE_NOT_FOUND',
  /** Board matrix criteria not found. */
  BOARD_MATRIX_CRITERIA_NOT_FOUND = 'BOARD_MATRIX_CRITERIA_NOT_FOUND',
  /** Candidate not found for evaluation. */
  CANDIDATE_NOT_FOUND = 'CANDIDATE_NOT_FOUND',
  /** Search assignment not found for health advisory. */
  SEARCH_ASSIGNMENT_NOT_FOUND = 'SEARCH_ASSIGNMENT_NOT_FOUND',
  /** AI context firewall blocked prohibited fields from being sent to the LLM */
  AI_CONTEXT_VIOLATION = 'AI_CONTEXT_VIOLATION',
  /** Feature flag check failed for a required feature flag */
  FEATURE_FLAG_DISABLED = 'FEATURE_FLAG_DISABLED',
}

export class ExecutiveSearchException extends Error {
  constructor(
    public readonly code: ExecutiveSearchExceptionCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'ExecutiveSearchException';
  }
}
