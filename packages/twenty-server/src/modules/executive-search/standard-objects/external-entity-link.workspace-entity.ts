import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExternalEntityLinkWorkspaceEntity extends BaseWorkspaceEntity {
  workspaceId: string;
  twentyEntityName: string;
  twentyRecordId: string;
externalSystemName: string;
  externalEntityName: string;
  externalRecordId: string;
  authority: string;
  lastSyncedAt: string | null;
  searchVector: string;,
externalNaturalKey: string | null;
  sourceVersion: string | null;
  sourceUpdatedAt: Date | null;
  sourceHash: string | null;
  lastInboundSyncAt: Date | null;
  lastOutboundSyncAt: Date | null;
  syncStatus: string;
  conflictStatus: string;
  lastErrorCode: string | null;
  lastErrorAt: Date | null;
  isAuthoritativeLink: boolean;
  metadata: Record<string, unknown> | null;
}
