import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ResearchStrategyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-strategy.workspace-entity';
import { type TargetCompanyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/target-company.workspace-entity';
import { type ExecutiveProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-profile.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type ResearchCandidateTier } from 'src/modules/executive-search/common/enums/research-candidate-tier.enum';
import { type ResearchCandidateStatus } from 'src/modules/executive-search/common/enums/research-candidate-status.enum';
import { type SourcingChannel } from 'src/modules/executive-search/common/enums/sourcing-channel.enum';
import { type SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';

export class ResearchCandidateWorkspaceEntity extends BaseWorkspaceEntity {
  researchStrategy: EntityRelation<ResearchStrategyWorkspaceEntity> | null;
  researchStrategyId: string | null;
  targetCompany: EntityRelation<TargetCompanyWorkspaceEntity> | null;
  targetCompanyId: string | null;
  executiveProfile: EntityRelation<ExecutiveProfileWorkspaceEntity> | null;
  executiveProfileId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  searchAssignmentId: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  fitScore: number | null;
  tier: ResearchCandidateTier;
  status: ResearchCandidateStatus;
  source: SourcingChannel | null;
  rationale: string | null;
  notes: string | null;
  lastContactedAt: string | null;
  candidacies: EntityRelation<SearchCandidacyWorkspaceEntity[]>;
}
