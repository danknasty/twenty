import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PriorityLevel } from 'src/modules/executive-search/common/enums/priority-level.enum';
import { type ResearchStrategyStatus } from 'src/modules/executive-search/common/enums/research-strategy-status.enum';
import { type MarketMapWorkspaceEntity } from 'src/modules/executive-search/standard-objects/market-map.workspace-entity';
import { type ResearchCandidateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-candidate.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class ResearchStrategyWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: ResearchStrategyStatus;
  priority: PriorityLevel;
  objectives: string | null;
  targetSegments: string | null;
  targetCandidateCount: number | null;
  startDate: string | null;
  targetCompletionDate: string | null;
  completedAt: string | null;
  searchAssignmentId: string;
  // Relations
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
  marketMaps: EntityRelation<MarketMapWorkspaceEntity[]>;
  researchCandidates: EntityRelation<ResearchCandidateWorkspaceEntity[]>;
}
