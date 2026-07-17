import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type MarketMapWorkspaceEntity } from 'src/modules/executive-search/standard-objects/market-map.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type ResearchCandidateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/research-candidate.workspace-entity';
import { type CompanySizeBand } from 'src/modules/executive-search/common/enums/company-size-band.enum';
import { type TargetCompanyTier } from 'src/modules/executive-search/common/enums/target-company-tier.enum';
import { type PriorityLevel } from 'src/modules/executive-search/common/enums/priority-level.enum';

export class TargetCompanyWorkspaceEntity extends BaseWorkspaceEntity {
  marketMap: EntityRelation<MarketMapWorkspaceEntity>;
  marketMapId: string;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  companyName: string;
  domain: string | null;
  industry: string | null;
  sizeBand: CompanySizeBand | null;
  tier: TargetCompanyTier;
  attractiveness: PriorityLevel;
  headquartersLocation: string | null;
  rationale: string | null;
  researchCandidates: EntityRelation<ResearchCandidateWorkspaceEntity[]>;
}
