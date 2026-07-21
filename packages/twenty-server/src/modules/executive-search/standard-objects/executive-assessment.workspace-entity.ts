import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { type SearchAssignmentWorkspaceEntity } from './search-assignment.workspace-entity';

export class ExecutiveAssessmentWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  assessmentDate: Date | null;
  assessorName: string | null;

  // Relations
  assignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  assignmentId: string | null;
}
