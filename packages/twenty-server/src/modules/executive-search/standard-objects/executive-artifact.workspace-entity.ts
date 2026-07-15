import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class ExecutiveArtifactWorkspaceEntity extends BaseWorkspaceEntity {
  executiveProfileId: string;
  artifactType: string;
  title: string;
  url: string | null;
  fileId: string | null;
  source: string;
  retrievedAt: string;
}
