import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

import { SearchAssignmentStatus } from '../common/enums/search-assignment-status.enum';

import { type AssignmentTeamMemberWorkspaceEntity } from './assignment-team-member.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type PositionSpecificationWorkspaceEntity } from './position-specification.workspace-entity';
import { type SearchEngagementTermsWorkspaceEntity } from './search-engagement-terms.workspace-entity';
import { type SearchMilestoneWorkspaceEntity } from './search-milestone.workspace-entity';
import { type SearchCandidacyWorkspaceEntity } from './search-candidacy.workspace-entity';

export class SearchAssignmentWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: SearchAssignmentStatus;
  startDate: Date | null;
  targetCloseDate: Date | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  clientCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  clientCompanyId: string | null;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
  engagementTerms: EntityRelation<SearchEngagementTermsWorkspaceEntity> | null;
  engagementTermsId: string | null;
  positionSpecification: EntityRelation<PositionSpecificationWorkspaceEntity> | null;
  positionSpecificationId: string | null;
  candidacies: EntityRelation<SearchCandidacyWorkspaceEntity[]>;
  teamMembers: EntityRelation<AssignmentTeamMemberWorkspaceEntity[]>;
  milestones: EntityRelation<SearchMilestoneWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  searchVector: string;
}
