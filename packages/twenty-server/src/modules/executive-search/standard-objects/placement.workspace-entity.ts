import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PlacementStatus } from 'src/modules/executive-search/common/enums/placement-status.enum';
import { type SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { type OfferNegotiationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/offer-negotiation.workspace-entity';
import { type SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type GuaranteeCaseWorkspaceEntity } from 'src/modules/executive-search/standard-objects/guarantee-case.workspace-entity';

export class PlacementWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: PlacementStatus;
  placementDate: string | null;
  startDate: string | null;
  endDate: string | null;
  feeAmount: number | null;
  feeCurrencyCode: string | null;
  feeType: string | null;
  feeCalculation: Record<string, unknown> | null;
  commissionableAmount: number | null;
  invoiceReference: string | null;
  guaranteePeriodMonths: number | null;
  guaranteeEndDate: string | null;
  billingContactId: string | null;
  placementConfirmedById: string | null;
  candidacyId: string | null;
  offerNegotiationId: string | null;
  searchAssignmentId: string | null;
  // Relations
  billingContact: EntityRelation<PersonWorkspaceEntity> | null;
  placementConfirmedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  candidacy: EntityRelation<SearchCandidacyWorkspaceEntity> | null;
  offerNegotiation: EntityRelation<OfferNegotiationWorkspaceEntity> | null;
  searchAssignment: EntityRelation<SearchAssignmentWorkspaceEntity> | null;
  guarantee: EntityRelation<GuaranteeCaseWorkspaceEntity[]>;
}
