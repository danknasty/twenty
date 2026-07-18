import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type BoardMatrixCriterionCategory } from 'src/modules/executive-search/common/enums/board-matrix-criterion-category.enum';

export class BoardMatrixCriterionWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  category: BoardMatrixCriterionCategory;
  weight: number;
  description: string | null;
  isRequired: boolean;
  boardCompositionProfileId: string | null;
}
