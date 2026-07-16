import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { SearchMilestoneStatus } from '../common/enums/search-milestone-status.enum';

import { type SearchAssignmentWorkspaceEntity } from './search-assignment.workspace-entity';

export class SearchMilestoneWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
  status: SearchMilestoneStatus;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  assignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  assignmentId: string | null;
}
