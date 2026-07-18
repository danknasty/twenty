/**
 * Identity-link dry projector.
 *
 * Pure utility (no NestJS DI, no I/O, no mutations) that computes the
 * *would-change* field set for a single `.shadow_sync` inbox event.  Given the
 * shadow event payload (the external entity data) and the matching Twenty
 * record, it returns the subset of governed fields that would differ if the
 * shadow projection were applied — without writing anything.
 *
 * Comparability is governed by `directus-field-ownership.csv`: only fields that
 * Twenty is authoritative for, or that are inbound, are eligible for
 * comparison.  Auth/payment/secret fields (`NOT_ALLOWED_TO_SYNC`) are never
 * compared.
 */

/** Per-field ownership rule derived from `directus-field-ownership.csv`. */
export type FieldOwnershipRule = {
  /** `canonical_authority` column, e.g. `DIRECTUS_AUTHORITATIVE`. */
  authority: string;
  /** `sync_direction` column, e.g. `Inbound`, `None_outbound`. */
  syncDirection: string;
};

/** A single projected field difference.  Returned in authority order. */
export type ProjectionDiff = {
  fieldName: string;
  currentValue: unknown;
  projectedValue: unknown;
  authority: string;
};

/** Minimal structural view of an `externalEntityLink` row. */
export type ProjectionLinkContext = {
  twentyEntityName: string;
  twentyRecordId: string;
  externalSystemName: string;
  externalEntityName: string;
  externalRecordId: string;
};

export type ProjectIdentityLinkArgs = {
  /** The shadow-sync inbox event payload (external entity data). */
  payload: Record<string, unknown>;
  /** The matching `externalEntityLink` row (read-only context). */
  link: ProjectionLinkContext;
  /** The current Twenty record, or null when it does not yet exist. */
  currentRecord: Record<string, unknown> | null;
  /** Parsed field-ownership map keyed by lowercase field name. */
  fieldOwnership: Record<string, FieldOwnershipRule>;
};

/** Authority markers used by `directus-field-ownership.csv`. */
const TWENTY_AUTHORITATIVE = 'TWENTY_AUTHORITATIVE';

/**
 * A field is eligible for shadow comparison when Twenty owns it (so an external
 * value differing is a conflict we must flag) OR the field is inbound (so an
 * external value differing is a change we would apply).  Everything else
 * (e.g. `NOT_ALLOWED_TO_SYNC`, `None_outbound` external-only fields) is ignored.
 */
export function isComparableField(rule: FieldOwnershipRule): boolean {
  if (rule.authority === TWENTY_AUTHORITATIVE) {
    return true;
  }

  return rule.syncDirection.toLowerCase().includes('inbound');
}

/**
 * Treat `null`/`undefined` as equivalent "no value" and compare everything else
 * structurally via JSON.  This keeps the comparison type-agnostic and stable
 * for the scalar values that dominate the ownership CSV.
 */
function valuesDiffer(a: unknown, b: unknown): boolean {
  const aEmpty = a === null || a === undefined;
  const bEmpty = b === null || b === undefined;

  if (aEmpty && bEmpty) {
    return false;
  }

  if (aEmpty !== bEmpty) {
    return true;
  }

  return JSON.stringify(a) !== JSON.stringify(b);
}

/**
 * Parse a single RFC-4180-ish CSV line, honouring double-quoted cells that
 * contain embedded commas and escaped quotes (`""`).
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
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
 * Parse the `directus-field-ownership.csv` contents into a field-name → rule
 * map.  The `field_group` cell is a comma-separated list of field labels; each
 * label is lowercased and trimmed to form the lookup key.  Later rows override
 * earlier ones for the same label (the CSV repeats identifiers such as
 * `ats_uuid` across collections with identical authority).
 */
export function parseFieldOwnershipCsv(
  csv: string,
): Record<string, FieldOwnershipRule> {
  const lines = csv.split(/\r?\n/);
  const map: Record<string, FieldOwnershipRule> = {};

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();

    if (line.length === 0) {
      continue;
    }

    // Skip the header row.
    if (
      index === 0 &&
      /collection\s*,\s*field_group/i.test(line)
    ) {
      continue;
    }

    const columns = parseCsvLine(line);

    // collection, field_group, canonical_authority, sync_direction, ...
    if (columns.length < 4) {
      continue;
    }

    const fieldGroup = columns[1];
    const authority = columns[2].trim();
    const syncDirection = columns[3].trim();

    if (authority.length === 0) {
      continue;
    }

    for (const rawField of fieldGroup.split(',')) {
      const field = rawField.trim().toLowerCase();

      if (field.length === 0) {
        continue;
      }

      map[field] = { authority, syncDirection };
    }
  }

  return map;
}

/**
 * Compute the projected diff for a shadow-sync event.  Iterates the governed,
 * comparable fields and reports each one whose external (projected) value
 * differs from the current Twenty value.  Writes nothing.
 */
export function projectIdentityLink(
  args: ProjectIdentityLinkArgs,
): ProjectionDiff[] {
  const { payload, currentRecord, fieldOwnership } = args;

  const diffs: ProjectionDiff[] = [];

  for (const [fieldName, rule] of Object.entries(fieldOwnership)) {
    if (!isComparableField(rule)) {
      continue;
    }

    const currentValue = currentRecord ? currentRecord[fieldName] : undefined;
    const projectedValue = payload[fieldName];

    if (!valuesDiffer(currentValue, projectedValue)) {
      continue;
    }

    diffs.push({
      fieldName,
      currentValue,
      projectedValue,
      authority: rule.authority,
    });
  }

  // Stable order: alphabetical by field name.
  diffs.sort((a, b) => a.fieldName.localeCompare(b.fieldName));

  return diffs;
}
