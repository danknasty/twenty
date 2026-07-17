import { type ActorMetadata, type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';

import { SearchEngagementTermsStatus } from '../common/enums/search-engagement-terms-status.enum';

import { type SearchAssignmentWorkspaceEntity } from './search-assignment.workspace-entity';

export class SearchEngagementTermsWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  retainerFee: CurrencyMetadata | null;
  successFee: CurrencyMetadata | null;
  totalFee: CurrencyMetadata | null;
  exclusivityPeriod: number | null;
  paymentMilestones: Record<string, unknown> | null;
  status: SearchEngagementTermsStatus;
  approvedAt: Date | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  clientCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  clientCompanyId: string | null;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
  approvedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  approvedById: string | null;
  searchAssignments: EntityRelation<SearchAssignmentWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  searchVector: string;
}
