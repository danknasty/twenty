import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

import {
  readCandidateExternalIds,
  readCandidateId,
  readDirectusExternalId,
  readStringField,
} from 'src/modules/executive-search/migration/matchers/candidate-fields.util';
import {
  runPrecedence,
  type ScoredCandidate,
} from 'src/modules/executive-search/migration/matchers/build-match-result.util';
import type {
  EntityMatcher,
  MatchResult,
} from 'src/modules/executive-search/migration/services/identity-matching.service';

/**
 * Directus collection this matcher targets.
 */
const DIRECTUS_COLLECTION = 'applications';

/**
 * Primary Twenty entity targeted by the application matcher.
 *
 * `applications` are one candidacy origin and map to `searchCandidacy`, which
 * is linked to a `person` and a `searchAssignment`.
 */
const PRIMARY_TWENTY_ENTITY = 'searchCandidacy';

/** Read an enriched string-array field from a candidate. */
function readEnrichedIdArray(
  candidate: Record<string, unknown>,
  key: string,
): string[] {
  const value = candidate[key];

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

/**
 * Identity matcher for the Directus `applications` collection.
 *
 * Match-key precedence (first key that hits wins):
 *   1. `ats_uuid`                                          → EXACT
 *   2. composite (executive external id + opportunity
 *      external id)                                        → HIGH / MEDIUM
 *
 * The composite key resolves the candidacy by linking BOTH the person (via the
 * executive external id) and the searchAssignment (via the opportunity external
 * id).  Both legs matching yields HIGH; a single leg yields MEDIUM.
 *
 * Pure and side-effect-free.  The service enriches each `searchCandidacy`
 * candidate with `_personExternalIds` (from `personId`'s links) and
 * `_assignmentExternalIds` (from `searchAssignmentId`'s links) before dispatch.
 */
export const applicationMatcher: EntityMatcher = {
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
    const executiveExternalId = readStringField(directusItem, [
      'executive_id',
      'executiveId',
      'executive_external_id',
      'executiveExternalId',
      'source_executive_id',
      'sourceExecutiveId',
      'executive_uuid',
      'candidate_id',
      'candidateId',
    ]);
    const opportunityExternalId = readStringField(directusItem, [
      'opportunity_id',
      'opportunityId',
      'opportunity_external_id',
      'opportunityExternalId',
      'source_opportunity_id',
      'sourceOpportunityId',
      'opportunity_uuid',
      'position_id',
      'positionId',
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
              `ats_uuid "${atsUuid}" matches an attached externalEntityLink on searchCandidacy.`,
            ],
          });
        }
      }

      return scored;
    };

    const compositeKey = (): ScoredCandidate[] => {
      const hasExecutive = !!executiveExternalId;
      const hasOpportunity = !!opportunityExternalId;

      if (!hasExecutive && !hasOpportunity) {
        return [];
      }

      const scored: ScoredCandidate[] = [];

      for (const candidate of candidates) {
        const id = readCandidateId(candidate);

        if (!id) {
          continue;
        }

        const personIds = readEnrichedIdArray(candidate, '_personExternalIds');
        const assignmentIds = readEnrichedIdArray(
          candidate,
          '_assignmentExternalIds',
        );

        const personMatch =
          hasExecutive &&
          executiveExternalId
            ? personIds.includes(executiveExternalId)
            : false;
        const assignmentMatch =
          hasOpportunity && opportunityExternalId
            ? assignmentIds.includes(opportunityExternalId)
            : false;

        if (!personMatch && !assignmentMatch) {
          continue;
        }

        const reasons: string[] = [];

        if (personMatch) {
          reasons.push(
            `Executive external id "${executiveExternalId}" matches the candidacy's person.`,
          );
        }

        if (assignmentMatch) {
          reasons.push(
            `Opportunity external id "${opportunityExternalId}" matches the candidacy's searchAssignment.`,
          );
        }

        scored.push({
          twentyEntityName: PRIMARY_TWENTY_ENTITY,
          twentyRecordId: id,
          confidence:
            personMatch && assignmentMatch
              ? IdentityMatchConfidence.HIGH
              : IdentityMatchConfidence.MEDIUM,
          reasons,
        });
      }

      return scored;
    };

    return runPrecedence(externalId, DIRECTUS_COLLECTION, PRIMARY_TWENTY_ENTITY, [
      atsUuidKey,
      compositeKey,
    ]);
  },
};
