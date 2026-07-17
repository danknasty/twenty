import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type RelationshipType } from 'src/modules/executive-search/common/enums/relationship-type.enum';
import { type RelationshipStrength } from 'src/modules/executive-search/common/enums/relationship-strength.enum';
import { type RelationshipSource } from 'src/modules/executive-search/common/enums/relationship-source.enum';
import { type PriorityLevel } from 'src/modules/executive-search/common/enums/priority-level.enum';

export class RelationshipEdgeWorkspaceEntity extends BaseWorkspaceEntity {
  sourcePerson: EntityRelation<PersonWorkspaceEntity> | null;
  sourcePersonId: string | null;
  targetPerson: EntityRelation<PersonWorkspaceEntity> | null;
  targetPersonId: string | null;
  sourceCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  sourceCompanyId: string | null;
  targetCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  targetCompanyId: string | null;
  summary: string | null;
  relationshipType: RelationshipType | null;
  strength: RelationshipStrength;
  source: RelationshipSource;
  confidenceLevel: PriorityLevel;
  context: string | null;
  notes: string | null;
  observedAt: string | null;
}
