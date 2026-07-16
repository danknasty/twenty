import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export type AvailabilityStatus =
  | 'NOT_LOOKING'
  | 'OPEN_TO_OPPORTUNITIES'
  | 'ACTIVELY_LOOKING';

export type ProfileVisibility = 'PRIVATE' | 'FIRM_ONLY';

export type SourceSystem = 'TWENTY' | 'DIRECTUS';

export class ExecutiveProfileWorkspaceEntity extends BaseWorkspaceEntity {
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string;
  headline: string | null;
  summary: string | null;
  currentCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  currentCompanyId: string | null;
  location: string | null;
  yearsOfExperience: number | null;
  availabilityStatus: AvailabilityStatus;
  profileVisibility: ProfileVisibility;
  isBoardReady: boolean;
  sourceSystem: SourceSystem;
  sourceRecordId: string | null;
  sourceUpdatedAt: string | null;
  sourceHash: string | null;
}
