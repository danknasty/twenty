import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { type ExecutiveAssessmentWorkspaceEntity } from './executive-assessment.workspace-entity';
import { type SearchCandidacyWorkspaceEntity } from './search-candidacy.workspace-entity';
import { type SearchCriterionWorkspaceEntity } from './search-criterion.workspace-entity';

export class CriterionEvaluationWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  rating: number | null;
  evidenceSummary: string | null;
  evidenceReferences: string | null;
  aiDraft: string | null;
  aiDraftGeneratedAt: Date | null;
  aiModelVersion: string | null;
  isHumanReviewed: boolean;
  assessorNotes: string | null;

  // Relations
  assessment: EntityRelation<ExecutiveAssessmentWorkspaceEntity> | null;
  assessmentId: string | null;
  criterion: EntityRelation<SearchCriterionWorkspaceEntity> | null;
  criterionId: string | null;
  candidacy: EntityRelation<SearchCandidacyWorkspaceEntity> | null;
  candidacyId: string | null;
}
