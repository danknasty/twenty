import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type DiligenceCheckType } from 'src/modules/executive-search/common/enums/diligence-check-type.enum';
import { type DiligenceCheckStatus } from 'src/modules/executive-search/common/enums/diligence-check-status.enum';

export class DiligenceCheckWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  diligenceType: DiligenceCheckType;
  status: DiligenceCheckStatus;
  findings: string | null;
  recommendation: string | null;
  conductedAt: string | null;
  conductedById: string | null;
  searchCandidacyId: string;
}
