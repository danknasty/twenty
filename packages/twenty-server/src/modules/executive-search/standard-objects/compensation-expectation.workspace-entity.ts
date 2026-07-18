import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompensationExpectationSource } from 'src/modules/executive-search/common/enums/compensation-expectation-source.enum';
import { type SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';

export class CompensationExpectationWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  expectedBaseSalary: number | null;
  expectedTotalCompensation: number | null;
  expectedEquity: string | null;
  expectedBonus: number | null;
  currencyCode: string | null;
  expectationSource: CompensationExpectationSource | null;
  notes: string | null;
  isVerifiedWithCandidate: boolean | null;
  verifiedAt: string | null;
  candidacyId: string | null;
  searchAssignmentId: string | null;
  // Relations
  candidacy: EntityRelation<SearchCandidacyWorkspaceEntity> | null;
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
}
