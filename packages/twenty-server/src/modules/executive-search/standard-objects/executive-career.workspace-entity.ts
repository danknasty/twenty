import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveCareerWorkspaceEntity extends BaseWorkspaceEntity {
  position: string;
  executiveProfileId: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}
