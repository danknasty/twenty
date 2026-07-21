export enum ShadowAssessmentStatus {
  /** AI-generated shadow assessment awaiting human review */
  PENDING_REVIEW = 'pending_review',
  /** Human reviewed and accepted the shadow assessment as-is */
  ACCEPTED = 'accepted',
  /** Human reviewed and modified the assessment */
  MODIFIED = 'modified',
  /** Human rejected the shadow assessment entirely */
  REJECTED = 'rejected',
}
