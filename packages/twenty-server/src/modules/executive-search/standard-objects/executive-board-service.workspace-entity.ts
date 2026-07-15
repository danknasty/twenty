import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveBoardServiceWorkspaceEntity extends BaseWorkspaceEntity {
  executiveProfileId: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
}
