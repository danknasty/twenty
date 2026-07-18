import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';

import { type SearchCandidacyWorkspaceEntity } from './search-candidacy.workspace-entity';

export class CandidacyStageEventWorkspaceEntity extends BaseWorkspaceEntity {
  stage: string;
  stageFrom: string | null;
  stageTo: string;
  transitionedAt: Date;
  transitionedById: string | null;
  actorKind: string | null;
  reason: string | null;
  notes: string | null;
  isCandidateVisible: boolean;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  // Relations
  candidacy: EntityRelation<SearchCandidacyWorkspaceEntity>;
  candidacyId: string;
}
