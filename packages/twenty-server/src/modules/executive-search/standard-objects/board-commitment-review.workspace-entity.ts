import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type BoardCommitmentReviewStatus } from 'src/modules/executive-search/common/enums/board-commitment-review-status.enum';

export class BoardCommitmentReviewWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: BoardCommitmentReviewStatus;
  reviewDate: Date | null;
  currentBoardCount: number | null;
  currentChairCount: number | null;
  totalCommitmentHoursEstimate: number | null;
  findings: string | null;
  searchCandidacyId: string | null;
}
