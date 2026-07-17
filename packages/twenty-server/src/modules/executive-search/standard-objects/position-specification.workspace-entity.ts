import { type ActorMetadata, type CurrencyMetadata, type RichTextMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

import { PositionSpecificationStatus } from '../common/enums/position-specification-status.enum';

import { type SearchAssignmentWorkspaceEntity } from './search-assignment.workspace-entity';
import { type SearchCriterionWorkspaceEntity } from './search-criterion.workspace-entity';

export class PositionSpecificationWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  reportingLine: string | null;
  compensationMin: CurrencyMetadata | null;
  compensationMax: CurrencyMetadata | null;
  keyResponsibilities: RichTextMetadata | null;
  requiredQualifications: RichTextMetadata | null;
  preferredQualifications: RichTextMetadata | null;
  status: PositionSpecificationStatus;
  approvedAt: Date | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  approvedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  approvedById: string | null;
  assignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  assignmentId: string | null;
  criteria: EntityRelation<SearchCriterionWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  searchVector: string;
}
