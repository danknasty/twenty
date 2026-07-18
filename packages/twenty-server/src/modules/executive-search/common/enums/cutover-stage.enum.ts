/**
 * Field-ownership cutover stage.
 *
 * The Directus→Twenty migration cuts over field ownership in five monotonic
 * stages (see `docs/executive-search/09-migration-and-backfill.md`,
 * "Cut over field ownership in controlled stages"). Each stage transfers a
 * documented subset of the field-ownership rows; stages must be applied in
 * order and may only be walked back via {@link revertToStage}.
 *
 * The enum values are ordered so that numeric comparison of the member names
 * (via {@link CUTOVER_STAGE_ORDER}) reflects progression.
 */
export enum CutoverStage {
  /** Read-only bridge: events observed, no field ownership transferred. */
  STAGE_0_READONLY = 'STAGE_0_READONLY',
  /** Identity links (ats_uuid, external IDs) established and verified. */
  STAGE_1_LINKS = 'STAGE_1_LINKS',
  /** Inbound sync active for DIRECTUS_AUTHORITATIVE field groups. */
  STAGE_2_INBOUND = 'STAGE_2_INBOUND',
  /** Narrow outbound projections published (candidate-visible, public). */
  STAGE_3_OUTBOUND_NARROW = 'STAGE_3_OUTBOUND_NARROW',
  /** Full bidirectional / append-only / controlled-migration sync. */
  STAGE_4_FULL = 'STAGE_4_FULL',
}
