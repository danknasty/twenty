import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type OfferNegotiationStatus } from 'src/modules/executive-search/common/enums/offer-negotiation-status.enum';
import { type CompensationExpectationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/compensation-expectation.workspace-entity';
import { type SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';

export class OfferNegotiationWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: OfferNegotiationStatus;
  offerAmount: number | null;
  currencyCode: string | null;
  equityTerms: string | null;
  bonusTerms: string | null;
  otherBenefits: string | null;
  proposedStartDate: string | null;
  offerLetterSentAt: string | null;
  offerLetterUrl: string | null;
  acceptedAt: string | null;
  acceptedSalary: number | null;
  acceptedTotalCompensation: number | null;
  declinedReason: string | null;
  notes: string | null;
  candidacyId: string | null;
  searchAssignmentId: string | null;
  compensationExpectationId: string | null;
  // Relations
  candidacy: EntityRelation<SearchCandidacyWorkspaceEntity> | null;
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  compensationExpectation: EntityRelation<CompensationExpectationWorkspaceEntity> | null;
}
