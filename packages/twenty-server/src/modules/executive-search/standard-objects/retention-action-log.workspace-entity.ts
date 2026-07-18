import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

/**
 * Append-only shared reference for retention / legal-hold actions.
 *
 * NOTE: This is the minimal workspace-entity definition (plain typed
 * properties, no decorators — see the workspace-entity pattern). The full
 * standard-object metadata (field metadata, indexes, views, upgrade command)
 * is built by the parallel Task 1. Both follow the same documented field list:
 * actionType, initiatorSystem, targetTwentyEntityName, targetTwentyRecordId,
 * externalSystemName, externalRecordId, scope, legalHoldReference, status,
 * requestedAt, propagatedAt, actorId, sourceHash.
 *
 * Invariant: rows are append-only. A second append with the same natural key
 * (derived into `sourceHash`) is a no-op — existing rows are never updated by
 * idempotent re-entry. Status lifecycle transitions (REQUESTED → PROPAGATED /
 * RECONCILED) only ever target a row created within the same
 * `recordAndPropagate` call.
 */
export class RetentionActionLogWorkspaceEntity extends BaseWorkspaceEntity {
  workspaceId: string;
  actionType: string;
  initiatorSystem: string;
  targetTwentyEntityName: string;
  targetTwentyRecordId: string | null;
  externalSystemName: string | null;
  externalRecordId: string | null;
  scope: string;
  legalHoldReference: string | null;
  status: string;
  requestedAt: string;
  propagatedAt: string | null;
  actorId: string | null;
  sourceHash: string;
  searchVector: string;
}
