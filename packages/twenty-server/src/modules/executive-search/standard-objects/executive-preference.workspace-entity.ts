import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutivePreferenceWorkspaceEntity extends BaseWorkspaceEntity {
  executiveProfileId: string;
  preferenceKey: string;
  preferenceValue: string;
}
