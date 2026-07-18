import { Injectable, Logger, type Type } from '@nestjs/common';
import { In, type ObjectLiteral } from 'typeorm';

import { buildSystemAuthContext } from
  'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CompanyWorkspaceEntity } from
  'src/modules/company/standard-objects/company.workspace-entity';
import { PersonWorkspaceEntity } from
  'src/modules/person/standard-objects/person.workspace-entity';
import { SearchAssignmentWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { ExternalEntityLinkWorkspaceEntity } from
  'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import type { ReconcileArgs, ReconciliationEngine } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.interface';
import { ReconciliationEngineRegistry } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import type { ReconciliationFinding } from
  'src/modules/executive-search/reconciliation/reconciliation-finding.type';

type EntityCheck = {
  twentyEntityName: string;
  entity: Type<ObjectLiteral>;
};

/**
 * The Twenty entity types that external entity links can point at.
 */
const LINKED_ENTITIES: EntityCheck[] = [
  { twentyEntityName: 'person', entity: PersonWorkspaceEntity },
  { twentyEntityName: 'company', entity: CompanyWorkspaceEntity },
  {
    twentyEntityName: 'searchAssignment',
    entity: SearchAssignmentWorkspaceEntity,
  },
  {
    twentyEntityName: 'searchCandidacy',
    entity: SearchCandidacyWorkspaceEntity,
  },
];

/**
 * Referential-integrity reconciliation engine.
 *
 * Read-only: walks every `externalEntityLink` and verifies that the referenced
 * Twenty record still exists (`ORPHAN_LINK` when it does not). For applications
 * (modelled as `searchCandidacy`), it additionally verifies that the candidacy's
 * `personId` and `searchAssignmentId` resolve to existing records (`STALE`).
 *
 * All findings are `dryRunSafe: true` — this engine never mutates data.
 */
@Injectable()
export class ReferentialIntegrityEngine implements ReconciliationEngine {
  readonly name = 'referential-integrity';

  private readonly logger = new Logger(ReferentialIntegrityEngine.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    registry: ReconciliationEngineRegistry,
  ) {
    registry.register(this);
  }

  // The engine enumerates all external entity links internally and ignores
  // objectName.
  async reconcile(args: ReconcileArgs): Promise<ReconciliationFinding[]> {
    const authContext = buildSystemAuthContext(args.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const linkRepository =
          await this.globalWorkspaceOrmManager.getRepository<ExternalEntityLinkWorkspaceEntity>(
            args.workspaceId,
            ExternalEntityLinkWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const links = await linkRepository.find();

        if (links.length === 0) {
          return [];
        }

        // Group the Twenty record ids referenced by links, per entity name.
        const idsByEntity = new Map<string, Set<string>>();

        for (const link of links) {
          if (!link.twentyEntityName || !link.twentyRecordId) {
            continue;
          }

          let set = idsByEntity.get(link.twentyEntityName);

          if (!set) {
            set = new Set<string>();
            idsByEntity.set(link.twentyEntityName, set);
          }

          set.add(link.twentyRecordId);
        }

        const existingByEntity = await this.fetchExistingIdsByEntity(
          args.workspaceId,
          idsByEntity,
        );

        // For application (searchCandidacy) sub-referential checks, load the
        // candidacies and resolve the person / assignment ids they point at.
        const candidacyById = await this.fetchCandidacies(
          args.workspaceId,
          idsByEntity.get('searchCandidacy'),
        );

        const referencedPersonIds = new Set<string>();
        const referencedAssignmentIds = new Set<string>();

        for (const candidacy of candidacyById.values()) {
          if (candidacy.personId) {
            referencedPersonIds.add(candidacy.personId);
          }

          if (candidacy.searchAssignmentId) {
            referencedAssignmentIds.add(candidacy.searchAssignmentId);
          }
        }

        const existingPersonIds = await this.fetchExistingIds(
          args.workspaceId,
          PersonWorkspaceEntity,
          referencedPersonIds,
        );
        const existingAssignmentIds = await this.fetchExistingIds(
          args.workspaceId,
          SearchAssignmentWorkspaceEntity,
          referencedAssignmentIds,
        );

        const findings: ReconciliationFinding[] = [];

        for (const link of links) {
          if (!link.twentyEntityName || !link.twentyRecordId) {
            continue;
          }

          const existing = existingByEntity.get(link.twentyEntityName);

          if (existing && !existing.has(link.twentyRecordId)) {
            findings.push({
              objectName: link.twentyEntityName,
              recordId: link.twentyRecordId,
              kind: 'ORPHAN_LINK',
              severity: 'HIGH',
              detail:
                `externalEntityLink references ${link.twentyEntityName} ` +
                `"${link.twentyRecordId}" which does not exist in Twenty`,
              dryRunSafe: true,
            });

            continue;
          }

          if (link.twentyEntityName !== 'searchCandidacy') {
            continue;
          }

          const candidacy = candidacyById.get(link.twentyRecordId);

          if (!candidacy) {
            continue;
          }

          if (
            candidacy.personId &&
            !existingPersonIds.has(candidacy.personId)
          ) {
            findings.push({
              objectName: 'searchCandidacy',
              recordId: link.twentyRecordId,
              kind: 'STALE',
              severity: 'MEDIUM',
              detail:
                `searchCandidacy "${link.twentyRecordId}" references person ` +
                `"${candidacy.personId}" which does not resolve`,
              dryRunSafe: true,
            });
          }

          if (
            candidacy.searchAssignmentId &&
            !existingAssignmentIds.has(candidacy.searchAssignmentId)
          ) {
            findings.push({
              objectName: 'searchCandidacy',
              recordId: link.twentyRecordId,
              kind: 'STALE',
              severity: 'MEDIUM',
              detail:
                `searchCandidacy "${link.twentyRecordId}" references ` +
                `searchAssignment "${candidacy.searchAssignmentId}" which does not resolve`,
              dryRunSafe: true,
            });
          }
        }

        return findings;
      },
      authContext,
    );
  }

  private async fetchExistingIdsByEntity(
    workspaceId: string,
    idsByEntity: Map<string, Set<string>>,
  ): Promise<Map<string, Set<string>>> {
    const result = new Map<string, Set<string>>();

    for (const check of LINKED_ENTITIES) {
      const ids = idsByEntity.get(check.twentyEntityName);

      if (!ids || ids.size === 0) {
        continue;
      }

      result.set(
        check.twentyEntityName,
        await this.fetchExistingIds(workspaceId, check.entity, ids),
      );
    }

    return result;
  }

  private async fetchExistingIds(
    workspaceId: string,
    entity: Type<ObjectLiteral>,
    ids: Set<string>,
  ): Promise<Set<string>> {
    if (ids.size === 0) {
      return new Set<string>();
    }

    const repository = await this.globalWorkspaceOrmManager.getRepository(
      workspaceId,
      entity,
      { shouldBypassPermissionChecks: true },
    );

    const records = await repository.find({
      where: { id: In(Array.from(ids)) } as any,
    });

    return new Set(
      records
        .map((record) => record.id)
        .filter((id): id is string => typeof id === 'string'),
    );
  }

  private async fetchCandidacies(
    workspaceId: string,
    ids: Set<string> | undefined,
  ): Promise<Map<string, SearchCandidacyWorkspaceEntity>> {
    const result = new Map<string, SearchCandidacyWorkspaceEntity>();

    if (!ids || ids.size === 0) {
      return result;
    }

    const repository =
      await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
        workspaceId,
        SearchCandidacyWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

    const candidacies = await repository.find({
      where: { id: In(Array.from(ids)) } as any,
    });

    for (const candidacy of candidacies) {
      result.set(candidacy.id, candidacy);
    }

    return result;
  }
}
