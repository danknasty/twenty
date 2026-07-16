import { type RichTextMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type ConfidentialityRecordType } from 'src/modules/executive-search/common/enums/confidentiality-record-type.enum';
import { type ConfidentialityStatus } from 'src/modules/executive-search/common/enums/confidentiality-status.enum';

export class ConfidentialityRecordWorkspaceEntity extends BaseWorkspaceEntity {
  searchAssignmentId: string | null;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  summary: string | null;
  recordType: ConfidentialityRecordType;
  status: ConfidentialityStatus;
  counterpartyName: string | null;
  signedDate: string | null;
  expiryDate: string | null;
  scope: RichTextMetadata | null;
  notes: RichTextMetadata | null;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
}
