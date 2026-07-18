export enum ExecutiveSearchExceptionCode {
  OPPORTUNITY_NOT_WON = 'OPPORTUNITY_NOT_WON',
  NO_APPROVED_ENGAGEMENT_TERMS = 'NO_APPROVED_ENGAGEMENT_TERMS',
  OFF_LIMITS_BLOCKED = 'OFF_LIMITS_BLOCKED',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  OPPORTUNITY_NOT_FOUND = 'OPPORTUNITY_NOT_FOUND',
  CLIENT_COMPANY_REQUIRED = 'CLIENT_COMPANY_REQUIRED',
  METRIC_NOT_FOUND = 'METRIC_NOT_FOUND',
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
