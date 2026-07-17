import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type OffLimitsRestrictionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/off-limits-restriction.workspace-entity';
import { type ConflictSubjectType } from 'src/modules/executive-search/common/enums/conflict-subject-type.enum';
import { type ConflictCheckType } from 'src/modules/executive-search/common/enums/conflict-check-type.enum';
import { type ConflictCheckOutcome } from 'src/modules/executive-search/common/enums/conflict-check-outcome.enum';

export class ConflictCheckWorkspaceEntity extends BaseWorkspaceEntity {
  searchAssignmentId: string | null;
  subjectPerson: EntityRelation<PersonWorkspaceEntity> | null;
  subjectPersonId: string | null;
  subjectCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  subjectCompanyId: string | null;
  matchedRestriction: EntityRelation<OffLimitsRestrictionWorkspaceEntity> | null;
  matchedRestrictionId: string | null;
  summary: string | null;
  subjectType: ConflictSubjectType;
  checkType: ConflictCheckType;
  outcome: ConflictCheckOutcome;
  outcomeReason: string | null;
  checkedAt: string | null;
  expiresAt: string | null;
  waiverReference: string | null;
  reviewNotes: string | null;
}
