import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { SearchCriterionCategory } from '../common/enums/search-criterion-category.enum';

import { type PositionSpecificationWorkspaceEntity } from './position-specification.workspace-entity';

export class SearchCriterionWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  weight: number | null;
  category: SearchCriterionCategory;
  isRequired: boolean;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  specification: EntityRelation<PositionSpecificationWorkspaceEntity> | null;
  specificationId: string | null;
}
