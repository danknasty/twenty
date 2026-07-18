import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';
import { type IdentityMatchResolution } from 'src/modules/executive-search/common/enums/identity-match-resolution.enum';

export class ExternalIdentityMatchQueueWorkspaceEntity extends BaseWorkspaceEntity {
  workspaceId: string;
  externalSystemName: string;
  externalEntityName: string;
  externalRecordId: string;
  externalNaturalKey: string | null;
  matchedTwentyEntityName: string | null;
  matchConfidence: IdentityMatchConfidence;
  candidateMatches: Record<string, unknown>[] | null;
  resolutionState: IdentityMatchResolution;
  resolvedTwentyEntityName: string | null;
  resolvedTwentyRecordId: string | null;
  resolvedAt: Date | null;
  resolvedById: string | null;
  matchReasons: Record<string, unknown> | null;
  searchVector: string;
}
