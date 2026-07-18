import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

import {
  readCandidateExternalIds,
  readCandidateId,
  readDirectusDomains,
  readDirectusExternalId,
  readDirectusSourceIds,
  readStringField,
} from 'src/modules/executive-search/migration/matchers/candidate-fields.util';
import {
  runPrecedence,
  type ScoredCandidate,
} from 'src/modules/executive-search/migration/matchers/build-match-result.util';
import {
  bucketToConfidence,
  compareNameStrings,
  type NameSimilarityBucket,
} from 'src/modules/executive-search/migration/matchers/name-similarity.util';
import type {
  EntityMatcher,
  MatchResult,
} from 'src/modules/executive-search/migration/services/identity-matching.service';

/**
 * Directus collection this matcher targets.
 */
const DIRECTUS_COLLECTION = 'opportunities';

/**
 * Primary Twenty entity targeted by the opportunity matcher.
 *
 * `opportunities` (published executive opportunities — NOT the Twenty CRM
 * `opportunity`) map to `searchAssignment`, with spec data routed to a linked
 * `positionSpecification`.
 */
const PRIMARY_TWENTY_ENTITY = 'searchAssignment';

/** Read a string-valued field that may be enriched onto a candidate. */
function readEnrichedString(
  candidate: Record<string, unknown>,
  key: string,
): string {
  const value = candidate[key];

  return typeof value === 'string' ? value : '';
}

/** Read enriched domain list (`_companyDomains`) from a searchAssignment. */
function readEnrichedDomains(
  candidate: Record<string, unknown>,
): string[] {
  const value = candidate['_companyDomains'];

  return Array.isArray(value)
    ? value.filter((d): d is string => typeof d === 'string')
    : [];
}

/**
 * Identity matcher for the Directus `opportunities` collection.
 *
 * Match-key precedence (first key that hits wins):
 *   1. `ats_uuid`               → EXACT (attached externalEntityLink)
 *   2. external id              → MEDIUM (source ids)
 *   3. title + company          → MEDIUM/LOW (title similarity, company
 *                                   domain/name corroborates and can promote)
 *
 * The matcher targets `searchAssignment`; spec data is routed to
 * `positionSpecification` by the downstream writer.
 *
 * Pure and side-effect-free.  The service enriches each `searchAssignment`
 * candidate with `_companyName` / `_companyDomains` (resolved from
 * `clientCompanyId`) before dispatch.
 */
export const opportunityMatcher: EntityMatcher = {
  match(
    directusItem: Record<string, unknown>,
    candidates: Record<string, unknown>[],
  ): MatchResult {
    const externalId = readDirectusExternalId(directusItem) ?? '';
    const atsUuid = readStringField(directusItem, [
      'ats_uuid',
      'atsUuid',
      'ats_id',
    ]);
    const sourceIds = readDirectusSourceIds(directusItem);
    const title = readStringField(directusItem, [
      'title',
      'name',
      'position_title',
      'positionTitle',
      'role_title',
      'roleTitle',
    ]);
    const itemCompanyName = readStringField(directusItem, [
      'company_name',
      'companyName',
      'client_name',
      'clientName',
      'company',
    ]);
    const itemCompanyDomains = readDirectusDomains(directusItem);

    const atsUuidKey = (): ScoredCandidate[] => {
      if (!atsUuid) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        if (readCandidateExternalIds(candidate).includes(atsUuid)) {
          scored.push({
            twentyEntityName: PRIMARY_TWENTY_ENTITY,
            twentyRecordId: id,
            confidence: IdentityMatchConfidence.EXACT,
            reasons: [
              `ats_uuid "${atsUuid}" matches an attached externalEntityLink.`,
            ],
          });
        }
      }

      return scored;
    };

    const externalIdKey = (): ScoredCandidate[] => {
      if (sourceIds.length === 0) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const candidateExternalIds = readCandidateExternalIds(candidate);
        const hit = sourceIds.find((sourceId) =>
          candidateExternalIds.includes(sourceId),
        );

        if (hit) {
          scored.push({
            twentyEntityName: PRIMARY_TWENTY_ENTITY,
            twentyRecordId: id,
            confidence: IdentityMatchConfidence.MEDIUM,
            reasons: [
              `External id "${hit}" matches an attached externalEntityLink.`,
            ],
          });
        }
      }

      return scored;
    };

    const titleAndCompanyKey = (): ScoredCandidate[] => {
      if (!title) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const assignmentName =
          typeof candidate['name'] === 'string'
            ? (candidate['name'] as string)
            : '';

        if (assignmentName === '') {
          continue;
        }

        const titleSimilarity = compareNameStrings(title, assignmentName);

        if (titleSimilarity.bucket === 'NONE') {
          continue;
        }

        // Company corroboration (best-effort): domain match beats name match.
        const candidateCompanyDomains = readEnrichedDomains(candidate);
        const domainMatch =
          itemCompanyDomains.length > 0 &&
          itemCompanyDomains.some((d) => candidateCompanyDomains.includes(d));

        const candidateCompanyName = readEnrichedString(
          candidate,
          '_companyName',
        );
        let companyNameBucket: NameSimilarityBucket = 'NONE';

        if (itemCompanyName && candidateCompanyName) {
          companyNameBucket = compareNameStrings(
            itemCompanyName,
            candidateCompanyName,
          ).bucket;
        }

        const reasons: string[] = [
          `Title similarity ${titleSimilarity.score.toFixed(3)} (bucket ${titleSimilarity.bucket}) against searchAssignment.name.`,
        ];

        let confidence = bucketToConfidence(titleSimilarity.bucket);

        if (domainMatch) {
          reasons.push('Company domain corroborates the match.');
          confidence = IdentityMatchConfidence.MEDIUM;
        } else if (companyNameBucket === 'STRONG') {
          reasons.push('Company name strongly corroborates the match.');
          confidence = IdentityMatchConfidence.MEDIUM;
        }

        scored.push({
          twentyEntityName: PRIMARY_TWENTY_ENTITY,
          twentyRecordId: id,
          confidence,
          reasons,
        });
      }

      return scored;
    };

    const result = runPrecedence(externalId, DIRECTUS_COLLECTION, PRIMARY_TWENTY_ENTITY, [
      atsUuidKey,
      externalIdKey,
      titleAndCompanyKey,
    ]);

    if (result.matchedTwentyRecordId) {
      result.reasons.push(
        'Position spec data routes to positionSpecification linked from this searchAssignment.',
      );
    }

    return result;
  },
};
