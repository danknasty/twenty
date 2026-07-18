import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';
import { type CandidacyStageEventWorkspaceEntity } from 'src/modules/executive-search/standard-objects/candidacy-stage-event.workspace-entity';
import { type ExecutiveProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-profile.workspace-entity';
import { type ResearchCandidateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-candidate.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export class SearchCandidacyWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: CandidacyStatus;
  currentStage: string | null;
  assignedAt: Date | null;
  lastStageChangedAt: Date | null;
  closedAt: Date | null;
  notes: string | null;
  candidateConsentDate: Date | null;

  // Relations
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  searchAssignmentId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  researchCandidate: EntityRelation<ResearchCandidateWorkspaceEntity> | null;
  researchCandidateId: string | null;
  executiveProfile: EntityRelation<ExecutiveProfileWorkspaceEntity> | null;
  executiveProfileId: string | null;
  stageEvents: EntityRelation<CandidacyStageEventWorkspaceEntity[]>;
}
