import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveProfileWorkspaceEntity extends BaseWorkspaceEntity {
  position: string;
  personId: string;
  status: string;
  source: string;
  sourceUpdatedAt: string;
  atsUuid: string;
  primaryEmail: string;
  linkedInUrl: string;
  claimedPrimaryEmail: string;
  verifiedFlags: string;
  displayNameOverride: string;
  mergeStatus: string;
  mergeCandidatePersonId: string;
}
