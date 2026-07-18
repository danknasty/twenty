/**
 * Canonical field-ownership authority.
 *
 * Mirrors the `canonical_authority` column of
 * `docs/executive-search/directus-field-ownership.csv`. Each value records
 * which system is the source of truth for a field group after the cutover
 * stage at which the group transfers.
 *
 * The four values here are the subset of the governance authority vocabulary
 * that actually appears in the field-ownership CSV (see
 * `docs/executive-search/scripts/lib/constants.mjs` for the full validator
 * vocabulary, which includes non-ownership sentinels such as
 * `NOT_ALLOWED_TO_SYNC` that are not ownership authorities).
 */
export enum FieldOwnershipAuthority {
  /** Directus is the source of truth; Twenty projects/normalizes inbound. */
  DIRECTUS_AUTHORITATIVE = 'DIRECTUS_AUTHORITATIVE',
  /** Twenty is the source of truth; never overwrite from Directus. */
  TWENTY_AUTHORITATIVE = 'TWENTY_AUTHORITATIVE',
  /** Ownership is decided per-field within the group (bidirectional). */
  SPLIT_BY_FIELD = 'SPLIT_BY_FIELD',
  /** Both systems append with a shared idempotency key; never overwrite. */
  APPEND_ONLY_BOTH_WITH_SHARED_IDEMPOTENCY = 'APPEND_ONLY_BOTH_WITH_SHARED_IDEMPOTENCY',
}
