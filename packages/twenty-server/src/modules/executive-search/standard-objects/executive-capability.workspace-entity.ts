import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveCapabilityWorkspaceEntity extends BaseWorkspaceEntity {
  executiveProfileId: string;
  capability: string;
  level: string;
  verified: boolean;
  notes: string | null;
}
