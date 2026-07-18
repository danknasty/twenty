import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PromptTemplateStatus } from 'src/modules/executive-search/common/enums/prompt-template-status.enum';
import { type AiModelRegistryWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-model-registry.workspace-entity';
import { type AiProviderCallLogWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-provider-call-log.workspace-entity';
import { type AppAgentsWorkspaceEntity } from 'src/modules/executive-search/standard-objects/app-agents.workspace-entity';

export class AiPromptTemplateWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  promptKey: string;
  version: string;
  status: PromptTemplateStatus;
  promptBody: string;
  systemPrompt: string | null;
  inputContract: Record<string, unknown> | null;
  outputSchema: Record<string, unknown> | null;
  bannedInputs: Record<string, unknown> | null;
  guardrailPolicyVersion: string | null;
  responseFormat: Record<string, unknown> | null;
  modelConfiguration: Record<string, unknown> | null;
  description: string | null;
  directusPromptId: string | null;
  sourceHash: string | null;
  publishedAt: Date | null;
  deprecatedAt: Date | null;
  // MANY_TO_ONE
  targetModel: EntityRelation<AiModelRegistryWorkspaceEntity> | null;
  targetModelId: string | null;
  // Reverse ONE_TO_MANY
  providerCallLogs: EntityRelation<AiProviderCallLogWorkspaceEntity[]>;
  appAgents: EntityRelation<AppAgentsWorkspaceEntity[]>;
}
