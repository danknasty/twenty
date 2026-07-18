import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { CutoverStage } from 'src/modules/executive-search/common/enums/cutover-stage.enum';
import { FieldOwnershipAuthority } from 'src/modules/executive-search/common/enums/field-ownership-authority.enum';

/**
 * Field-ownership cutover configuration.
 *
 * Parses `docs/executive-search/directus-field-ownership.csv` into an
 * immutable, ordered-stage definition. The CSV is the single source of truth
 * for which system owns each field group and at which cutover stage that
 * ownership transfers (see `docs/executive-search/09-migration-and-backfill.md`,
 * "Cut over field ownership in controlled stages").
 *
 * The docs `.mjs` validator is ESM living under `docs/` and is not importable
 * from the server bundle, so the CSV parsing is re-implemented here in TS.
 *
 * This module is a pure constant — no service, no DI. The constant is computed
 * once at import time and frozen; downstream code (the cutover service) reads
 * it without mutation.
 */

const FIELD_OWNERSHIP_CSV_RELATIVE_PATH = path.join(
  'docs',
  'executive-search',
  'directus-field-ownership.csv',
);

/** Columns of the field-ownership CSV, in header order. */
const CSV_COLUMNS = [
  'collection',
  'field_group',
  'canonical_authority',
  'sync_direction',
  'twenty_behavior',
  'data_classification',
  'source_citation',
] as const;

/** A single parsed field-ownership row. */
export interface FieldOwnershipRow {
  collection: string;
  fieldGroup: string;
  authority: FieldOwnershipAuthority;
  syncDirection: string;
  twentyBehavior: string;
  dataClassification: string;
  sourceCitation: string;
}

/**
 * Parse a single CSV line, honoring quoted cells that may contain commas and
 * escaped double-quotes (`""`). Mirrors the algorithm in
 * `docs/executive-search/scripts/lib/csv.mjs` (re-implemented in TS because the
 * `.mjs` validator is not importable from the server bundle).
 */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuote) {
      if (char === '"') {
        // Escaped quote ("") collapses to a literal quote.
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuote = true;
    } else if (char === ',') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);

  return cells;
}

/**
 * Parse the full field-ownership CSV text into typed rows. Blank trailing
 * lines are skipped. Unknown authority values are rejected to keep the
 * config consistent with the {@link FieldOwnershipAuthority} vocabulary.
 */
export function parseFieldOwnershipCsv(csvText: string): FieldOwnershipRow[] {
  const lines = csvText.split('\n');
  const rows: FieldOwnershipRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (!line || !line.trim()) {
      continue;
    }

    const cells = parseCsvLine(line);
    const raw: Record<string, string> = {};

    CSV_COLUMNS.forEach((column, index) => {
      raw[column] = (cells[index] ?? '').trim();
    });

    const authority = raw.canonical_authority as FieldOwnershipAuthority;

    if (!isValidAuthority(authority)) {
      throw new Error(
        `field-ownership-config: unknown canonical_authority "${raw.canonical_authority}" for ` +
          `${raw.collection} / ${raw.field_group} at line ${i + 1}`,
      );
    }

    rows.push({
      collection: raw.collection,
      fieldGroup: raw.field_group,
      authority,
      syncDirection: raw.sync_direction,
      twentyBehavior: raw.twenty_behavior,
      dataClassification: raw.data_classification,
      sourceCitation: raw.source_citation,
    });
  }

  return rows;
}

function isValidAuthority(value: string): value is FieldOwnershipAuthority {
  return Object.values(FieldOwnershipAuthority).includes(
    value as FieldOwnershipAuthority,
  );
}

/**
 * Monotonic cutover stage ordering. Earlier entries transfer before later
 * ones; numeric index reflects progression.
 */
export const CUTOVER_STAGE_ORDER: readonly CutoverStage[] = [
  CutoverStage.STAGE_0_READONLY,
  CutoverStage.STAGE_1_LINKS,
  CutoverStage.STAGE_2_INBOUND,
  CutoverStage.STAGE_3_OUTBOUND_NARROW,
  CutoverStage.STAGE_4_FULL,
];

/** Zero-based rank of a stage within {@link CUTOVER_STAGE_ORDER}. */
export function stageRank(stage: CutoverStage): number {
  const rank = CUTOVER_STAGE_ORDER.indexOf(stage);

  if (rank === -1) {
    throw new Error(`cutover-config: unknown stage "${stage}"`);
  }

  return rank;
}

/**
 * Map a CSV `sync_direction` to the cutover stage at which that field group's
 * ownership transfers. Never-sync directions (guardrails whose authority is
 * asserted from the read-only baseline and never transferred outbound) are
 * grouped under {@link CutoverStage.STAGE_0_READONLY}.
 */
const STAGE_BY_SYNC_DIRECTION: Record<string, CutoverStage> = {
  // STAGE_0 — read-only baseline / guardrails; no ownership transferred.
  None_outbound: CutoverStage.STAGE_0_READONLY,
  NO_SYNC_SELECTION: CutoverStage.STAGE_0_READONLY,
  NOT_ALLOWED_TO_SYNC: CutoverStage.STAGE_0_READONLY,
  // STAGE_1 — identity links & integration identifiers established/verified.
  Outbound_verified: CutoverStage.STAGE_1_LINKS,
  REFERENCE_ONLY_NO_REPLICATION: CutoverStage.STAGE_1_LINKS,
  // STAGE_2 — inbound sync active for DIRECTUS_AUTHORITATIVE field groups.
  Inbound: CutoverStage.STAGE_2_INBOUND,
  Optional_inbound: CutoverStage.STAGE_2_INBOUND,
  // STAGE_3 — narrow outbound projections published.
  Outbound_publish: CutoverStage.STAGE_3_OUTBOUND_NARROW,
  Outbound_narrow_projection: CutoverStage.STAGE_3_OUTBOUND_NARROW,
  // STAGE_4 — full bidirectional / append-only / controlled migration.
  Bidirectional: CutoverStage.STAGE_4_FULL,
  Controlled_migration: CutoverStage.STAGE_4_FULL,
  Initial_inbound_future_outbound: CutoverStage.STAGE_4_FULL,
};

/** Default to the read-only baseline for any unmapped direction (fail-safe). */
const DEFAULT_STAGE = CutoverStage.STAGE_0_READONLY;

/** Resolve the cutover stage at which a row's ownership transfers. */
export function cutoverStageForRow(row: FieldOwnershipRow): CutoverStage {
  return STAGE_BY_SYNC_DIRECTION[row.syncDirection] ?? DEFAULT_STAGE;
}

/** A field-group ownership definition bound to its transferring stage. */
export interface FieldOwnershipStageDefinition {
  readonly stage: CutoverStage;
  readonly rows: readonly FieldOwnershipRow[];
}

/**
 * Group an ordered list of rows by their transferring cutover stage, returning
 * one entry per stage (in {@link CUTOVER_STAGE_ORDER}) with the rows that
 * transfer there in their original CSV order.
 */
export function groupRowsByCutoverStage(
  rows: readonly FieldOwnershipRow[],
): readonly FieldOwnershipStageDefinition[] {
  return CUTOVER_STAGE_ORDER.map((stage) => ({
    stage,
    rows: Object.freeze(
      rows.filter((row) => cutoverStageForRow(row) === stage),
    ),
  }));
}

/** The per-collection authority in effect once a stage has been applied. */
export interface CollectionAuthorityState {
  readonly collection: string;
  readonly authority: FieldOwnershipAuthority;
  readonly cutoverStage: CutoverStage;
}

/**
 * Compute the authoritative state of every collection once a given stage has
 * been applied. For each collection, the authority is that of the *latest*
 * transferring row (highest stage rank at or before `stage`); ties within a
 * single stage are broken by CSV order so later rows refine earlier ones. The
 * cutover stage is that row's transferring stage. Collections with no row at
 * or before `stage` are omitted (they have no cutover authority yet).
 *
 * This rollup is what the cutover service writes onto `externalEntityLink`
 * records; it is deterministic because field-group order in the CSV is fixed.
 */
export function authoritiesAtStage(
  rows: readonly FieldOwnershipRow[],
  stage: CutoverStage,
): readonly CollectionAuthorityState[] {
  const targetRank = stageRank(stage);
  const byCollection = new Map<
    string,
    { authority: FieldOwnershipAuthority; cutoverStage: CutoverStage; rank: number }
  >();

  for (const row of rows) {
    const rowStage = cutoverStageForRow(row);
    const rowRank = stageRank(rowStage);

    if (rowRank > targetRank) {
      continue;
    }

    const existing = byCollection.get(row.collection);

    // Latest transfer wins; equal-stage rows refine in CSV order (>=).
    if (!existing || rowRank >= existing.rank) {
      byCollection.set(row.collection, {
        authority: row.authority,
        cutoverStage: rowStage,
        rank: rowRank,
      });
    }
  }

  return [...byCollection.entries()].map(([collection, state]) => ({
    collection,
    authority: state.authority,
    cutoverStage: state.cutoverStage,
  }));
}

/** Resolve the CSV path by walking up from this module to the repo root. */
function resolveCsvPath(): string | null {
  let directory = __dirname;

  for (let depth = 0; depth < 10; depth++) {
    const candidate = path.join(directory, FIELD_OWNERSHIP_CSV_RELATIVE_PATH);

    try {
      readFileSync(candidate, 'utf8');

      return candidate;
    } catch {
      directory = path.dirname(directory);
    }
  }

  return null;
}

function loadRows(): readonly FieldOwnershipRow[] {
  const csvPath = resolveCsvPath();

  // The CSV ships in the repo; if it cannot be located (e.g. a packaged
  // build without docs/), degrade to an empty config rather than crashing
  // the import. The pure parsing functions above remain usable in tests.
  if (!csvPath) {
    // oxlint-disable-next-line no-console
    console.warn(
      'field-ownership-config: directus-field-ownership.csv not found; ' +
        'cutover config is empty until the docs are available',
    );

    return [];
  }

  return Object.freeze(parseFieldOwnershipCsv(readFileSync(csvPath, 'utf8')));
}

/**
 * All 21 field-ownership rows in CSV order. Immutable.
 */
export const FIELD_OWNERSHIP_ROWS: readonly FieldOwnershipRow[] = loadRows();

/**
 * Distinct collections that appear in the field-ownership CSV, in first-seen
 * (CSV) order.
 */
export const FIELD_OWNERSHIP_COLLECTIONS: readonly string[] = Object.freeze([
  ...new Set(FIELD_OWNERSHIP_ROWS.map((row) => row.collection)),
]);

/**
 * The immutable, ordered-stage field-ownership definition — one entry per
 * cutover stage in {@link CUTOVER_STAGE_ORDER}.
 */
export const FIELD_OWNERSHIP_CONFIG: readonly FieldOwnershipStageDefinition[] =
  Object.freeze(groupRowsByCutoverStage(FIELD_OWNERSHIP_ROWS));

/** Rows whose ownership transfers at exactly `stage`. */
export function rowsTransferringAt(
  stage: CutoverStage,
): readonly FieldOwnershipRow[] {
  return FIELD_OWNERSHIP_CONFIG[stageRank(stage)]?.rows ?? [];
}
