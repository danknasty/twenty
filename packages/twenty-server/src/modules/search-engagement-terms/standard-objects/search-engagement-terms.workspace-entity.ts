import { type ActorMetadata, type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class SearchEngagementTermsWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
  termsType: string;
  feeStructure: string;
  feePercentage: number | null;
  fixedFeeAmount: CurrencyMetadata | null;
  exclusivity: boolean;
  exclusivityDurationMonths: number | null;
  engagementStartDate: Date | null;
  engagementEndDate: Date | null;
  durationMonths: number | null;
  guaranteePeriodMonths: number | null;
  paymentSchedule: string;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
  searchVector: string;
}
