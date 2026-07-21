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
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
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
