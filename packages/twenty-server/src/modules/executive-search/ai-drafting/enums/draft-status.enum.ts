export enum DraftStatus {
  /** Initial state — draft has been generated but not yet reviewed. */
  DRAFT = 'DRAFT',
  /** Draft has been reviewed and accepted by a human. */
  ACCEPTED = 'ACCEPTED',
  /** Draft has been reviewed and rejected by a human. */
  REJECTED = 'REJECTED',
  /** Capability kill switch was active or an error occurred — no draft produced. */
  SKIPPED = 'SKIPPED',
}
