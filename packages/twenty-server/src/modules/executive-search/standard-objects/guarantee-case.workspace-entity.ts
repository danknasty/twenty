import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type GuaranteeCaseStatus } from 'src/modules/executive-search/common/enums/guarantee-case-status.enum';
import { type PlacementWorkspaceEntity } from 'src/modules/executive-search/standard-objects/placement.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';

export class GuaranteeCaseWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: GuaranteeCaseStatus;
  activeFrom: string | null;
  activeUntil: string | null;
  guaranteeType: string | null;
  claimFiledAt: string | null;
  claimReason: string | null;
  claimAmount: number | null;
  claimCurrencyCode: string | null;
  claimOutcome: string | null;
  claimResolvedAt: string | null;
  placementId: string | null;
  replacementPlacementId: string | null;
  searchAssignmentId: string | null;
  // Relations
  placement: EntityRelation<PlacementWorkspaceEntity> | null;
  replacementPlacement: EntityRelation<PlacementWorkspaceEntity> | null;
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
}
