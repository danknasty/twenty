import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ClientStakeholderRoleWorkspaceEntity } from 'src/modules/client-stakeholder-role/standard-objects/client-stakeholder-role.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export class ClientAccountProfileWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  clientAccountType: string;
  clientOnboardingStatus: string;
  clientSince: string | null;
  clientPaymentTerms: string | null;
  clientNotes: string | null;
  clientBillingContact: EntityRelation<PersonWorkspaceEntity> | null;
  clientBillingContactId: string | null;
  company: EntityRelation<CompanyWorkspaceEntity>;
  companyId: string;
  clientStakeholderRoles: EntityRelation<ClientStakeholderRoleWorkspaceEntity[]>;
  searchVector: string;
}
