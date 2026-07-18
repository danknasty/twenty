import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type DirectorIndependenceReviewStatus } from 'src/modules/executive-search/common/enums/director-independence-review-status.enum';

export class DirectorIndependenceReviewWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: DirectorIndependenceReviewStatus;
  reviewDate: Date | null;
  findings: string | null;
  reviewerId: string | null;
  searchCandidacyId: string | null;
}
