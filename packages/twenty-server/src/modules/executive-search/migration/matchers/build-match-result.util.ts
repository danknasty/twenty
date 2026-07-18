import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

import type { MatchResult } from 'src/modules/executive-search/migration/services/identity-matching.service';

/**
 * Pure helpers for assembling {@link MatchResult} objects from a list of
 * scored candidate matches.  No I/O, no side effects — used by every matcher.
 */

/** A single candidate scored by a matcher key. */
export interface ScoredCandidate {
  twentyEntityName: string;
  twentyRecordId: string;
  confidence: IdentityMatchConfidence;
  reasons: string[];
}

/** Numeric rank used to sort/compare confidence tiers (higher = stronger). */
const CONFIDENCE_RANK: Record<IdentityMatchConfidence, number> = {
  [IdentityMatchConfidence.EXACT]: 4,
  [IdentityMatchConfidence.HIGH]: 3,
  [IdentityMatchConfidence.MEDIUM]: 2,
  [IdentityMatchConfidence.LOW]: 1,
  [IdentityMatchConfidence.NONE]: 0,
};

/** Highest-scoring candidate (ties broken by record id for determinism). */
export function pickBestCandidate(
  scored: ScoredCandidate[],
): ScoredCandidate | undefined {
  if (scored.length === 0) {
    return undefined;
  }

  return [...scored].sort((a, b) => {
    const rankDiff = CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence];

    if (rankDiff !== 0) {
      return rankDiff;
    }

    return a.twentyRecordId.localeCompare(b.twentyRecordId);
  })[0];
}

/**
 * Assemble a {@link MatchResult} from the candidates scored by the winning
 * matcher key.
 *
 * - Candidates with `NONE` confidence are discarded.
 * - The primary match is the highest-confidence candidate.
 * - When two or more candidates share the top confidence, all of them are
 *   surfaced in `candidates` and an ambiguity reason is added (the caller must
 *   not auto-link without human review).
 */
export function buildMatchResultFromCandidates(
  externalRecordId: string,
  externalEntityName: string,
  primaryTwentyEntityName: string,
  scoredCandidates: ScoredCandidate[],
): MatchResult {
  const matched = scoredCandidates.filter(
    (c) => c.confidence !== IdentityMatchConfidence.NONE,
  );

  if (matched.length === 0) {
    return {
      externalRecordId,
      externalEntityName,
      confidence: IdentityMatchConfidence.NONE,
      reasons: ['No candidate cleared any match threshold.'],
    };
  }

  const best = pickBestCandidate(matched) as ScoredCandidate;

  const topRank = CONFIDENCE_RANK[best.confidence];
  const tiedAtTop = matched.filter(
    (c) => CONFIDENCE_RANK[c.confidence] === topRank,
  );

  const reasons = [...best.reasons];

  const isAmbiguous = tiedAtTop.length > 1;

  if (isAmbiguous) {
    reasons.push(
      `Ambiguous: ${tiedAtTop.length} candidates matched at ${best.confidence} confidence — requires human review before linking.`,
    );
  }

  const result: MatchResult = {
    externalRecordId,
    externalEntityName,
    matchedTwentyEntityName: best.twentyEntityName,
    matchedTwentyRecordId: best.twentyRecordId,
    confidence: best.confidence,
    reasons,
  };

  if (matched.length > 1) {
    result.candidates = matched.map((c) => ({
      twentyEntityName: c.twentyEntityName,
      twentyRecordId: c.twentyRecordId,
      confidence: c.confidence,
      reasons: c.reasons,
    }));
  }

  // Hint the canonical Twenty target even when matched via a derived entity.
  if (best.twentyEntityName !== primaryTwentyEntityName) {
    result.reasons.push(
      `Matched via ${best.twentyEntityName}; canonical target is ${primaryTwentyEntityName}.`,
    );
  }

  return result;
}

/**
 * Run matcher keys in precedence order and return the result from the FIRST key
 * that produces at least one non-`NONE` candidate.  This encodes the
 * "first key that hits wins" precedence contract.
 */
export function runPrecedence(
  externalRecordId: string,
  externalEntityName: string,
  primaryTwentyEntityName: string,
  keys: Array<() => ScoredCandidate[]>,
): MatchResult {
  for (const key of keys) {
    const scored = key().filter(
      (c) => c.confidence !== IdentityMatchConfidence.NONE,
    );

    if (scored.length > 0) {
      return buildMatchResultFromCandidates(
        externalRecordId,
        externalEntityName,
        primaryTwentyEntityName,
        scored,
      );
    }
  }

  return buildMatchResultFromCandidates(
    externalRecordId,
    externalEntityName,
    primaryTwentyEntityName,
    [],
  );
}
