import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type BoardCompositionProfileStatus } from 'src/modules/executive-search/common/enums/board-composition-profile-status.enum';
import { type BoardCompositionTargetBoardType } from 'src/modules/executive-search/common/enums/board-composition-target-board-type.enum';

export class BoardCompositionProfileWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: BoardCompositionProfileStatus;
  targetBoardType: BoardCompositionTargetBoardType | null;
  industryPreference: string | null;
  currentSize: number | null;
  targetSize: number | null;
  notes: string | null;
  searchAssignmentId: string | null;
}
