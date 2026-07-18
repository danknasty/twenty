import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { DirectusClientService } from 'src/modules/executive-search/directus/services/directus-client.service';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';
import { executiveMatcher } from 'src/modules/executive-search/migration/matchers/executive.matcher';
import { companyMatcher } from 'src/modules/executive-search/migration/matchers/company.matcher';
import { opportunityMatcher } from 'src/modules/executive-search/migration/matchers/opportunity.matcher';
import { applicationMatcher } from 'src/modules/executive-search/migration/matchers/application.matcher';
import {
  readCandidateExternalIds,
  readCandidateId,
  readCompanyDomains,
  readDirectusExternalId,
  type AttachedExternalLink,
} from 'src/modules/executive-search/migration/matchers/candidate-fields.util';

/**
 * Result of matching a single Directus record against Twenty candidates.
 *
 * The matcher is strictly read-only: it never creates or updates a link.  A
 * downstream reconciliation step consumes `MatchResult[]` and performs any
 * writes.
 */
export type MatchResult = {
  /** The external record id we tried to match (`ats_uuid` if present, else `id`). */
  externalRecordId: string;
  /** The Directus collection the record came from (e.g. `executives`). */
  externalEntityName: string;
  /** The Twenty entity the record was matched to, if any (e.g. `person`). */
  matchedTwentyEntityName?: string;
  /** The Twenty record id the record was matched to, if any. */
  matchedTwentyRecordId?: string;
  confidence: IdentityMatchConfidence;
  reasons: string[];
  /**
   * Additional candidates that also matched (used to flag ambiguity / require
   * human review).  Present only when more than one candidate cleared a
   * threshold.
   */
  candidates?: Array<{
    twentyEntityName: string;
    twentyRecordId: string;
    confidence: IdentityMatchConfidence;
    reasons: string[];
  }>;
};

/**
 * Pure, side-effect-free contract implemented by each matcher type.  The
 * service owns all I/O; matchers only inspect the items and candidates handed
 * to them.
 */
export interface EntityMatcher {
  match(
    directusItem: Record<string, unknown>,
    candidates: Record<string, unknown>[],
  ): MatchResult;
}

/** Which matcher to dispatch to for a collection pair. */
export type MatcherType = 'executive' | 'company' | 'opportunity' | 'application';

/**
 * A Directus→Twenty collection pair to match.
 */
export interface DirectusToTwentyPair {
  /** Directus collection name, e.g. `executives`. */
  directusCollection: string;
  /** Primary Twenty entity targeted by this pair, e.g. `person`. */
  twentyEntityName: string;
  /** Which matcher to use. */
  matcherType: MatcherType;
}

/**
 * Read-only identity matching engine.
 *
 * Scores each Directus record in a collection against Twenty candidates and
 * returns a {@link MatchResult}[] without writing anything.  Dispatches to the
 * appropriate pure matcher (executive / company / opportunity / application).
 *
 * HARD RULE: if a non-null `externalEntityLink` carrying `ats_uuid` /
 * `isAuthoritativeLink` already exists for the external record, the record is
 * reported as an EXACT link-only result and is NEVER considered for overwrite.
 */
@Injectable()
export class IdentityMatchingService {
  private readonly logger = new Logger(IdentityMatchingService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly directusClient: DirectusClientService,
  ) {}

  /**
   * Match all Directus items in a collection against Twenty candidates for the
   * given workspace.  Read-only.
   */
  async matchWorkspace(
    workspaceId: string,
    pair: DirectusToTwentyPair,
  ): Promise<MatchResult[]> {
    // Dominant DI pattern: executeInWorkspaceContext with NO authContext.
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const items = await this.directusClient.getItems(pair.directusCollection);

      this.logger.log(
        `Matching ${items.length} Directus "${pair.directusCollection}" items against Twenty "${pair.twentyEntityName}" candidates in workspace ${workspaceId}`,
      );

      if (items.length === 0) {
        return [];
      }

      const candidates = await this.loadCandidates(workspaceId, pair);

      const authoritativeLinksByExternalId =
        await this.loadAuthoritativeLinksByExternalId(workspaceId);

      const matcher = this.resolveMatcher(pair.matcherType);

      const results: MatchResult[] = [];

      for (const item of items) {
        const externalId = readDirectusExternalId(item) ?? '';

        // HARD RULE: an authoritative link already exists → EXACT, never overwrite.
        if (externalId !== '') {
          const existingLink =
            authoritativeLinksByExternalId.get(externalId);

          if (existingLink) {
            results.push(
              this.buildExactLinkOnlyResult(
                externalId,
                pair.directusCollection,
                existingLink,
              ),
            );
            continue;
          }
        }

        results.push(matcher.match(item, candidates));
      }

      return results;
    });
  }

  private resolveMatcher(matcherType: MatcherType): EntityMatcher {
    switch (matcherType) {
      case 'executive':
        return executiveMatcher;
      case 'company':
        return companyMatcher;
      case 'opportunity':
        return opportunityMatcher;
      case 'application':
        return applicationMatcher;
      default: {
        // Exhaustiveness guard.
        const exhaustive: never = matcherType;

        throw new Error(
          `IdentityMatchingService: unknown matcher type ${String(exhaustive)}`,
        );
      }
    }
  }

  /**
   * Load Twenty candidates for the pair's entity, enriched with their attached
   * `externalEntityLink` rows (under `externalLinks`) so the pure matchers can
   * do `ats_uuid`/source-id matching without any I/O.
   *
   * For opportunity / application pairs, candidates are further enriched with
   * resolved cross-entity external ids (see {@link enrichCandidates}) so the
   * pure matchers can perform their composite corroboration.
   */
  private async loadCandidates(
    workspaceId: string,
    pair: DirectusToTwentyPair,
  ): Promise<Record<string, unknown>[]> {
    const linkEntityNames = this.candidateLinkEntityNames(pair.matcherType);

    const candidates = await this.loadRecordsWithLinks(
      workspaceId,
      pair.twentyEntityName,
      linkEntityNames,
    );

    return this.enrichCandidates(workspaceId, pair.matcherType, candidates);
  }

  /**
   * Load all records of an entity and attach the relevant `externalEntityLink`
   * rows to each (under `externalLinks`).
   */
  private async loadRecordsWithLinks(
    workspaceId: string,
    entityName: string,
    linkEntityNames: string[],
  ): Promise<Record<string, unknown>[]> {
    const repository = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      entityName,
      { shouldBypassPermissionChecks: true },
    );

    const records = ((await repository.find({})) ??
      []) as unknown as Record<string, unknown>[];

    const linksByRecordId = await this.loadLinksByTwentyRecordId(
      workspaceId,
      linkEntityNames,
    );

    return records.map((record) => {
      const id = readCandidateId(record);
      const links = id ? (linksByRecordId.get(id) ?? []) : [];

      return { ...record, externalLinks: links };
    });
  }

  /**
   * Matcher-specific enrichment of already-link-attached candidates.
   *
   * - opportunity: attach `_companyName` / `_companyDomains` /
   *   `_companyExternalIds` resolved from each assignment's `clientCompanyId`.
   * - application: attach `_personExternalIds` (from `personId`) and
   *   `_assignmentExternalIds` (from `searchAssignmentId`).
   *
   * All other matchers need no further enrichment.
   */
  private async enrichCandidates(
    workspaceId: string,
    matcherType: MatcherType,
    candidates: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    if (matcherType === 'opportunity') {
      return this.enrichOpportunityCandidates(workspaceId, candidates);
    }

    if (matcherType === 'application') {
      return this.enrichApplicationCandidates(workspaceId, candidates);
    }

    return candidates;
  }

  /**
   * Enrich `searchAssignment` candidates with their client company's name,
   * domains and external ids (resolved from `clientCompanyId`).
   */
  private async enrichOpportunityCandidates(
    workspaceId: string,
    candidates: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const companies = await this.loadRecordsWithLinks(workspaceId, 'company', [
      'company',
      'clientAccountProfile',
    ]);

    const companyByName = new Map<string, Record<string, unknown>>();

    for (const company of companies) {
      const id = readCandidateId(company);

      if (id) {
        companyByName.set(id, company);
      }
    }

    return candidates.map((candidate) => {
      const companyId =
        typeof candidate['clientCompanyId'] === 'string'
          ? (candidate['clientCompanyId'] as string)
          : '';

      const company = companyId ? companyByName.get(companyId) : undefined;

      if (!company) {
        return candidate;
      }

      const companyName =
        typeof company['name'] === 'string' ? (company['name'] as string) : '';
      const companyDomains = readCompanyDomains(company);
      const companyExternalIds = readCandidateExternalIds(company);

      return {
        ...candidate,
        _companyName: companyName,
        _companyDomains: companyDomains,
        _companyExternalIds: companyExternalIds,
      };
    });
  }

  /**
   * Enrich `searchCandidacy` candidates with the external ids of the linked
   * person (`_personExternalIds`) and searchAssignment
   * (`_assignmentExternalIds`), resolved from their attached links.
   */
  private async enrichApplicationCandidates(
    workspaceId: string,
    candidates: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const [people, assignments] = await Promise.all([
      this.loadRecordsWithLinks(workspaceId, 'person', [
        'person',
        'executiveProfile',
      ]),
      this.loadRecordsWithLinks(workspaceId, 'searchAssignment', [
        'searchAssignment',
        'positionSpecification',
      ]),
    ]);

    const personExternalIdsByPersonId = new Map<string, string[]>();

    for (const person of people) {
      const id = readCandidateId(person);

      if (id) {
        personExternalIdsByPersonId.set(
          id,
          readCandidateExternalIds(person),
        );
      }
    }

    const assignmentExternalIdsByAssignmentId = new Map<string, string[]>();

    for (const assignment of assignments) {
      const id = readCandidateId(assignment);

      if (id) {
        assignmentExternalIdsByAssignmentId.set(
          id,
          readCandidateExternalIds(assignment),
        );
      }
    }

    return candidates.map((candidate) => {
      const personId =
        typeof candidate['personId'] === 'string'
          ? (candidate['personId'] as string)
          : '';
      const assignmentId =
        typeof candidate['searchAssignmentId'] === 'string'
          ? (candidate['searchAssignmentId'] as string)
          : '';

      return {
        ...candidate,
        _personExternalIds: personId
          ? (personExternalIdsByPersonId.get(personId) ?? [])
          : [],
        _assignmentExternalIds: assignmentId
          ? (assignmentExternalIdsByAssignmentId.get(assignmentId) ?? [])
          : [],
      };
    });
  }

  /**
   * Build a `twentyRecordId → attached links[]` map for the supplied link
   * entity names.  `executiveProfile` links are folded onto their owning
   * person via `personId` by the executive enrichment path, so callers pass
   * the entity names whose links they care about.
   */
  private async loadLinksByTwentyRecordId(
    workspaceId: string,
    linkEntityNames: string[],
  ): Promise<Map<string, AttachedExternalLink[]>> {
    const linkRepository = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalEntityLinkWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    const links = ((await linkRepository.find({
      where: { externalSystemName: 'directus' },
    })) ?? []) as unknown as AttachedExternalLink[];

    const map = new Map<string, AttachedExternalLink[]>();

    for (const link of links) {
      if (
        !link.twentyEntityName ||
        !linkEntityNames.includes(link.twentyEntityName) ||
        !link.twentyRecordId
      ) {
        continue;
      }

      const bucket = map.get(link.twentyRecordId) ?? [];
      bucket.push(link);
      map.set(link.twentyRecordId, bucket);
    }

    return map;
  }

  /** Entity names whose links are relevant for a given matcher type. */
  private candidateLinkEntityNames(matcherType: MatcherType): string[] {
    switch (matcherType) {
      case 'executive':
        // `executives` map to `person` + native `executiveProfile`.
        return ['person', 'executiveProfile'];
      case 'company':
        // `companies` map to `company` + `clientAccountProfile`.
        return ['company', 'clientAccountProfile'];
      case 'opportunity':
        return ['searchAssignment', 'positionSpecification'];
      case 'application':
        return ['searchCandidacy'];
      default:
        return [];
    }
  }

  /**
   * Load all authoritative Directus links for the workspace keyed by
   * `externalRecordId`.  Used to enforce the HARD RULE.
   */
  private async loadAuthoritativeLinksByExternalId(
    workspaceId: string,
  ): Promise<Map<string, AttachedExternalLink>> {
    const linkRepository = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      ExternalEntityLinkWorkspaceEntity,
      { shouldBypassPermissionChecks: true },
    );

    const links = ((await linkRepository.find({
      where: {
        externalSystemName: 'directus',
        isAuthoritativeLink: true,
      },
    })) ?? []) as unknown as AttachedExternalLink[];

    const map = new Map<string, AttachedExternalLink>();

    for (const link of links) {
      for (const value of [link.externalRecordId, link.externalNaturalKey]) {
        if (typeof value === 'string' && value.trim() !== '') {
          map.set(value.trim(), link);
        }
      }
    }

    return map;
  }

  private buildExactLinkOnlyResult(
    externalRecordId: string,
    externalEntityName: string,
    link: AttachedExternalLink,
  ): MatchResult {
    return {
      externalRecordId,
      externalEntityName,
      matchedTwentyEntityName: link.twentyEntityName ?? undefined,
      matchedTwentyRecordId: link.twentyRecordId ?? undefined,
      confidence: IdentityMatchConfidence.EXACT,
      reasons: [
        `Existing authoritative externalEntityLink (isAuthoritativeLink=true) already references this external record — link-only result, never overwritten (HARD RULE).`,
      ],
    };
  }
}
