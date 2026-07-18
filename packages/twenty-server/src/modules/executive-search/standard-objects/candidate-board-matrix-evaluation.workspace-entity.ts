import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class CandidateBoardMatrixEvaluationWorkspaceEntity extends BaseWorkspaceEntity {
  score: number | null;
  maxScore: number | null;
  notes: string | null;
  boardMatrixCriterionId: string | null;
  searchCandidacyId: string | null;
}
