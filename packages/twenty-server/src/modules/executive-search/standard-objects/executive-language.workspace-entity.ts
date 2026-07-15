import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveLanguageWorkspaceEntity extends BaseWorkspaceEntity {
  executiveProfileId: string;
  language: string;
  proficiency: string;
}
