import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ClientAccountProfileWorkspaceEntity } from 'src/modules/client-account-profile/standard-objects/client-account-profile.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export class ClientStakeholderRoleWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  role: string;
  isPrimary: boolean;
  notes: string | null;
  person: EntityRelation<PersonWorkspaceEntity>;
  personId: string;
  company: EntityRelation<CompanyWorkspaceEntity>;
  companyId: string;
  clientAccountProfile: EntityRelation<ClientAccountProfileWorkspaceEntity> | null;
  clientAccountProfileId: string | null;
  searchVector: string;
}
