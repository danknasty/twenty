import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type ReferenceCheckStatus } from 'src/modules/executive-search/common/enums/reference-check-status.enum';

export class ReferenceCheckWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: ReferenceCheckStatus;
  referenceName: string;
  referenceTitle: string | null;
  referenceOrganization: string | null;
  referenceContact: string | null;
  relationshipType: string | null;
  findings: string | null;
  verifiedAt: string | null;
  verifiedById: string | null;
  searchCandidacyId: string;
}
