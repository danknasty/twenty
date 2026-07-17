import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { AssignmentTeamMemberRole } from '../common/enums/assignment-team-member-role.enum';

import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

import { type SearchAssignmentWorkspaceEntity } from './search-assignment.workspace-entity';

export class AssignmentTeamMemberWorkspaceEntity extends BaseWorkspaceEntity {
  role: AssignmentTeamMemberRole;
  isLead: boolean;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  assignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  assignmentId: string | null;
  workspaceMember: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  workspaceMemberId: string | null;
}
