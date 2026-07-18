import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

import {
  readCandidateExternalIds,
  readCandidateId,
  readDirectusEmails,
  readDirectusExternalId,
  readDirectusName,
  readDirectusPhones,
  readDirectusSourceIds,
  readPersonEmails,
  readPersonName,
  readPersonPhones,
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
const DIRECTUS_COLLECTION = 'executives';

/**
 * Primary Twenty entity targeted by the executive matcher.
 *
 * `executives` map to Twenty `person` + native `executiveProfile` + an
 * `externalEntityLink`.  The matcher resolves the `person` first (via email or
 * name) and the owning `executiveProfile` is then derivable through
 * `executiveProfile.personId`.
 */
const PRIMARY_TWENTY_ENTITY = 'person';

/**
 * Identity matcher for the Directus `executives` collection.
 *
 * Match-key precedence (first key that hits wins):
 *   1. `ats_uuid`            → EXACT (matches an attached externalEntityLink)
 *   2. `email`               → HIGH  (matches `person.emails`)
 *   3. phone / external id   → MEDIUM (matches `person.phones` or link)
 *   4. name similarity       → MEDIUM/LOW (matches `person.name`)
 *
 * Pure and side-effect-free: all I/O is performed by the service, which
 * attaches each candidate's `externalLinks` before dispatch.
 */
export const executiveMatcher: EntityMatcher = {
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
    const emails = readDirectusEmails(directusItem);
    const phones = readDirectusPhones(directusItem);
    const sourceIds = readDirectusSourceIds(directusItem);
    const name = readDirectusName(directusItem);

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

    const emailKey = (): ScoredCandidate[] => {
      if (emails.length === 0) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const candidateEmails = readPersonEmails(candidate);
        const hit = emails.find((email) => candidateEmails.includes(email));

        if (hit) {
          scored.push({
            twentyEntityName: PRIMARY_TWENTY_ENTITY,
            twentyRecordId: id,
            confidence: IdentityMatchConfidence.HIGH,
            reasons: [`Email "${hit}" matches person.emails.`],
          });
        }
      }

      return scored;
    };

    const phoneOrExternalIdKey = (): ScoredCandidate[] => {
      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const reasons: string[] = [];

        if (phones.length > 0) {
          const candidatePhones = readPersonPhones(candidate);
          const phoneHit = phones.find((phone) =>
            candidatePhones.includes(phone),
          );

          if (phoneHit) {
            reasons.push(`Phone "${phoneHit}" matches person.phones.`);
          }
        }

        if (sourceIds.length > 0) {
          const candidateExternalIds = readCandidateExternalIds(candidate);
          const idHit = sourceIds.find((sourceId) =>
            candidateExternalIds.includes(sourceId),
          );

          if (idHit) {
            reasons.push(
              `External/source id "${idHit}" matches an attached externalEntityLink.`,
            );
          }
        }

        if (reasons.length > 0) {
          scored.push({
            twentyEntityName: PRIMARY_TWENTY_ENTITY,
            twentyRecordId: id,
            confidence: IdentityMatchConfidence.MEDIUM,
            reasons,
          });
        }
      }

      return scored;
    };

    const nameKey = (): ScoredCandidate[] => {
      if (name.full === '') {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const candidateName = readPersonName(candidate);

        if (candidateName.full === '') {
          continue;
        }

        const similarity = compareNameStrings(name.full, candidateName.full);

        if (similarity.bucket === 'NONE') {
          continue;
        }

        scored.push({
          twentyEntityName: PRIMARY_TWENTY_ENTITY,
          twentyRecordId: id,
          confidence: bucketToConfidence(similarity.bucket),
          reasons: [
            `Name similarity ${similarity.score.toFixed(3)} (bucket ${similarity.bucket}) against person.name.`,
          ],
        });
      }

      return scored;
    };

    const result = runPrecedence(externalId, DIRECTUS_COLLECTION, PRIMARY_TWENTY_ENTITY, [
      atsUuidKey,
      emailKey,
      phoneOrExternalIdKey,
      nameKey,
    ]);

    if (result.matchedTwentyRecordId) {
      result.reasons.push(
        'executiveProfile derivable via executiveProfile.personId.',
      );
    }

    return result;
  },
};
