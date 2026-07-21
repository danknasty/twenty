import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ModelRegistryStatus } from 'src/modules/executive-search/common/enums/model-registry-status.enum';
import { type AiPromptTemplateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-prompt-template.workspace-entity';
import { type AppAgentsWorkspaceEntity } from 'src/modules/executive-search/standard-objects/app-agents.workspace-entity';

export class AiModelRegistryWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  modelId: string;
  providerName: string;
  modelVersion: string;
  status: ModelRegistryStatus;
  sdkPackage: string;
  isCurrent: boolean;
  contextWindowTokens: number;
  maxOutputTokens: number;
  supportsReasoning: boolean;
  modelConfiguration: Record<string, unknown> | null;
  capabilities: string[] | null;
  guardrailPolicyVersion: string | null;
  description: string | null;
  directusModelId: string | null;
  sourceHash: string | null;
  activatedAt: Date | null;
  deprecatedAt: Date | null;
  // Reverse ONE_TO_MANY
  promptTemplates: EntityRelation<AiPromptTemplateWorkspaceEntity[]>;
  appAgents: EntityRelation<AppAgentsWorkspaceEntity[]>;
}
