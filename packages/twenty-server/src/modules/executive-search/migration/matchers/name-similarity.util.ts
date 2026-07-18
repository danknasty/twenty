import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

/**
 * Pure, dependency-free name/string comparators used by the identity matchers.
 *
 * Everything here is a pure function with no side effects so it is trivially
 * unit-testable at threshold boundaries.
 *
 * THRESHOLDS (documented contract):
 *   score >= {@link STRONG_NAME_MATCH_THRESHOLD}  (0.92)  → STRONG
 *   score >= {@link WEAK_NAME_MATCH_THRESHOLD}    (0.80)  → WEAK
 *   score <  WEAK_NAME_MATCH_THRESHOLD                    → NONE
 *
 * These map to {@link IdentityMatchConfidence} MEDIUM (STRONG) and LOW (WEAK)
 * by the matchers — name similarity is never EXACT or HIGH on its own because
 * names are not globally unique identifiers.
 */

/** Score at or above which a name match is considered STRONG (→ MEDIUM). */
export const STRONG_NAME_MATCH_THRESHOLD = 0.92;

/** Score at or above which (but below STRONG) a name match is considered WEAK (→ LOW). */
export const WEAK_NAME_MATCH_THRESHOLD = 0.8;

/** Internal bucketing result used by the matchers. */
export type NameSimilarityBucket = 'STRONG' | 'WEAK' | 'NONE';

export interface NameSimilarityResult {
  /** Jaro–Winkler score in the range [0, 1]. */
  score: number;
  bucket: NameSimilarityBucket;
}

/**
 * Normalize a raw string for comparison:
 *  - lowercase
 *  - trim
 *  - strip all non-alphanumeric characters (keeps unicode letters/digits)
 *  - collapse internal whitespace
 *
 * Returns the empty string for null/undefined/whitespace-only input.
 */
export function normalizeString(
  input: string | null | undefined,
): string {
  if (input == null) {
    return '';
  }

  return input
    .toString()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Split a normalized string into a sorted, de-duplicated token array.
 * Tokenization makes the comparator order-independent ("Jane Doe" matches
 * "Doe, Jane").
 */
export function tokenize(input: string | null | undefined): string[] {
  const normalized = normalizeString(input);

  if (normalized === '') {
    return [];
  }

  return Array.from(new Set(normalized.split(/\s+/))).sort();
}

/**
 * Classic Jaro similarity between two strings, range [0, 1].
 *
 * Reference implementation; no external dependencies.
 */
export function jaroSimilarity(a: string, b: string): number {
  if (a === b) {
    return 1;
  }

  if (a.length === 0 || b.length === 0) {
    return 0;
  }

  const matchDistance = Math.max(
    0,
    Math.floor(Math.max(a.length, b.length) / 2) - 1,
  );

  const aMatches = new Array<boolean>(a.length).fill(false);
  const bMatches = new Array<boolean>(b.length).fill(false);

  let matches = 0;

  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, b.length);

    for (let j = start; j < end; j++) {
      if (bMatches[j]) {
        continue;
      }

      if (a[i] !== b[j]) {
        continue;
      }

      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) {
    return 0;
  }

  let transpositions = 0;
  let k = 0;

  for (let i = 0; i < a.length; i++) {
    if (!aMatches[i]) {
      continue;
    }

    while (!bMatches[k]) {
      k++;
    }

    if (a[i] !== b[k]) {
      transpositions++;
    }

    k++;
  }

  const m = matches;

  return (
    m / a.length / 3 +
    m / b.length / 3 +
    (m - transpositions / 2) / m / 3
  );
}

/**
 * Jaro–Winkler similarity: Jaro with a bonus for a common prefix.
 *
 * @param prefixScale Winkler prefix scaling factor, default 0.1 (Winkler's
 *  original constant).  Clamped to [0, 0.25].
 * @param maxPrefixLength Maximum prefix length that contributes the bonus
 *  (Winkler uses 4).
 */
export function jaroWinklerSimilarity(
  a: string,
  b: string,
  prefixScale = 0.1,
  maxPrefixLength = 4,
): number {
  const jaro = jaroSimilarity(a, b);

  if (jaro === 0 || jaro === 1) {
    return jaro;
  }

  const scale = Math.min(0.25, Math.max(0, prefixScale));

  let prefixLength = 0;

  for (
    let i = 0;
    i < Math.min(maxPrefixLength, a.length, b.length);
    i++
  ) {
    if (a[i] === b[i]) {
      prefixLength++;
    } else {
      break;
    }
  }

  return jaro + prefixLength * scale * (1 - jaro);
}

/**
 * Bucket a numeric similarity score into the documented threshold buckets.
 */
export function bucketNameScore(score: number): NameSimilarityBucket {
  if (score >= STRONG_NAME_MATCH_THRESHOLD) {
    return 'STRONG';
  }

  if (score >= WEAK_NAME_MATCH_THRESHOLD) {
    return 'WEAK';
  }

  return 'NONE';
}

/**
 * Map a name-similarity bucket to the matcher confidence tier.
 *
 * STRONG → MEDIUM, WEAK → LOW, NONE → NONE.  Name similarity alone is never
 * EXACT or HIGH.
 */
export function bucketToConfidence(
  bucket: NameSimilarityBucket,
): IdentityMatchConfidence {
  switch (bucket) {
    case 'STRONG':
      return IdentityMatchConfidence.MEDIUM;
    case 'WEAK':
      return IdentityMatchConfidence.LOW;
    default:
      return IdentityMatchConfidence.NONE;
  }
}

/**
 * Compare two human names (or arbitrary strings) using tokenized Jaro–Winkler.
 *
 * The comparison is order-independent: tokens are sorted and de-duplicated so
 * that "Jane Marie Doe" matches "Doe, Jane Marie".  The final score is the
 * maximum of:
 *   1. Jaro–Winkler on the sorted-token canonical form, and
 *   2. Jaro–Winkler on the raw normalized form.
 *
 * Taking the max lets us match both reordered tokens and near-identical
 * raw strings (e.g. a single-token company name).
 */
export function compareNameStrings(
  a: string | null | undefined,
  b: string | null | undefined,
): NameSimilarityResult {
  const normalizedA = normalizeString(a);
  const normalizedB = normalizeString(b);

  if (normalizedA === '' || normalizedB === '') {
    return { score: 0, bucket: 'NONE' };
  }

  if (normalizedA === normalizedB) {
    return { score: 1, bucket: 'STRONG' };
  }

  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  const canonicalA = tokensA.join(' ');
  const canonicalB = tokensB.join(' ');

  const canonicalScore = jaroWinklerSimilarity(canonicalA, canonicalB);
  const rawScore = jaroWinklerSimilarity(normalizedA, normalizedB);

  const score = Math.max(canonicalScore, rawScore);

  return { score, bucket: bucketNameScore(score) };
}
