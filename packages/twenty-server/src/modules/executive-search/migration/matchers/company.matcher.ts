import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

import {
  readCandidateExternalIds,
  readCandidateId,
  readCompanyDomains,
  readDirectusDomains,
  readDirectusExternalId,
  readDirectusName,
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
} from 'src/modules/executive-search/migration/matchers/name-similarity.util';
import type {
  EntityMatcher,
  MatchResult,
} from 'src/modules/executive-search/migration/services/identity-matching.service';

/**
 * Directus collection this matcher targets.
 */
const DIRECTUS_COLLECTION = 'companies';

/**
 * Primary Twenty entity targeted by the company matcher.
 *
 * `companies` map to Twenty `company` + `clientAccountProfile` + an
 * `externalEntityLink`.  The matcher resolves `company` first; the
 * `clientAccountProfile` is then derivable from the company.
 */
const PRIMARY_TWENTY_ENTITY = 'company';

/**
 * Identity matcher for the Directus `companies` collection.
 *
 * Match-key precedence (first key that hits wins):
 *   1. `ats_uuid`                 → EXACT (attached externalEntityLink)
 *   2. domain + name              → HIGH (domain match; name corroborates)
 *   3. Freshsales / source ids    → MEDIUM (reference-only per collection map)
 *   4. name similarity            → MEDIUM/LOW (name only)
 *
 * Per the collection map, Freshsales/source ids are REFERENCE_ONLY and must
 * never drive record replication — they only contribute a MEDIUM hint here.
 *
 * Pure and side-effect-free.
 */
export const companyMatcher: EntityMatcher = {
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
    const domains = readDirectusDomains(directusItem);
    const sourceIds = readDirectusSourceIds(directusItem);
    const name = readStringField(directusItem, [
      'name',
      'company_name',
      'companyName',
      'legal_name',
      'legalName',
    ]);

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

    const domainAndNameKey = (): ScoredCandidate[] => {
      if (domains.length === 0) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const candidateDomains = readCompanyDomains(candidate);
        const domainHit = domains.find((domain) =>
          candidateDomains.includes(domain),
        );

        if (!domainHit) {
          continue;
        }

        const reasons = [`Domain "${domainHit}" matches company.domainName.`];

        const candidateName =
          typeof candidate['name'] === 'string'
            ? (candidate['name'] as string)
            : '';

        if (name && candidateName) {
          const similarity = compareNameStrings(name, candidateName);

          if (similarity.bucket !== 'NONE') {
            reasons.push(
              `Company name corroborates (similarity ${similarity.score.toFixed(3)}, bucket ${similarity.bucket}).`,
            );
          }
        }

        scored.push({
          twentyEntityName: PRIMARY_TWENTY_ENTITY,
          twentyRecordId: id,
          confidence: IdentityMatchConfidence.HIGH,
          reasons,
        });
      }

      return scored;
    };

    const freshsalesOrSourceIdKey = (): ScoredCandidate[] => {
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
              `Freshsales/source id "${hit}" matches an attached externalEntityLink (REFERENCE_ONLY — no replication).`,
            ],
          });
        }
      }

      return scored;
    };

    const nameSimilarityKey = (): ScoredCandidate[] => {
      if (!name) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const candidateName =
          typeof candidate['name'] === 'string'
            ? (candidate['name'] as string)
            : '';

        if (candidateName === '') {
          continue;
        }

        const similarity = compareNameStrings(name, candidateName);

        if (similarity.bucket === 'NONE') {
          continue;
        }

        scored.push({
          twentyEntityName: PRIMARY_TWENTY_ENTITY,
          twentyRecordId: id,
          confidence: bucketToConfidence(similarity.bucket),
          reasons: [
            `Company name similarity ${similarity.score.toFixed(3)} (bucket ${similarity.bucket}) against company.name.`,
          ],
        });
      }

      return scored;
    };

    const result = runPrecedence(externalId, DIRECTUS_COLLECTION, PRIMARY_TWENTY_ENTITY, [
      atsUuidKey,
      domainAndNameKey,
      freshsalesOrSourceIdKey,
      nameSimilarityKey,
    ]);

    if (result.matchedTwentyRecordId) {
      result.reasons.push(
        'clientAccountProfile derivable from the matched company.',
      );
    }

    return result;
  },
};
