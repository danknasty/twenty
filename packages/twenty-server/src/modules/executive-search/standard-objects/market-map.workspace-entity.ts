import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ResearchStrategyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-strategy.workspace-entity';
import { type TargetCompanyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/target-company.workspace-entity';
import { type MarketMapType } from 'src/modules/executive-search/common/enums/market-map-type.enum';

export class MarketMapWorkspaceEntity extends BaseWorkspaceEntity {
  researchStrategy: EntityRelation<ResearchStrategyWorkspaceEntity>;
  researchStrategyId: string;
  name: string;
  mapType: MarketMapType;
  segment: string | null;
  geography: string | null;
  description: string | null;
  targetCompanies: EntityRelation<TargetCompanyWorkspaceEntity[]>;
}
