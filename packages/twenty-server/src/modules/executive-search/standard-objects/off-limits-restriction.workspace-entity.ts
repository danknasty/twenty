import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type OffLimitsScope } from 'src/modules/executive-search/common/enums/off-limits-scope.enum';
import { type OffLimitsType } from 'src/modules/executive-search/common/enums/off-limits-type.enum';
import { type OffLimitsBasis } from 'src/modules/executive-search/common/enums/off-limits-basis.enum';
import { type OffLimitsStatus } from 'src/modules/executive-search/common/enums/off-limits-status.enum';

export class OffLimitsRestrictionWorkspaceEntity extends BaseWorkspaceEntity {
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  clientCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  clientCompanyId: string | null;
  summary: string | null;
  restrictionScope: OffLimitsScope;
  restrictionType: OffLimitsType;
  basis: OffLimitsBasis | null;
  status: OffLimitsStatus;
  clientName: string | null;
  startDate: string | null;
  endDate: string | null;
  waiverReason: string | null;
  waivedAt: string | null;
  notes: string | null;
  reviewReason: string | null;
}
