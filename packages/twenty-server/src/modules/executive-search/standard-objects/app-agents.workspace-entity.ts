import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AppAgentStatus } from 'src/modules/executive-search/common/enums/app-agent-status.enum';
import { type AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';
import { type AiModelRegistryWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-model-registry.workspace-entity';
import { type AiPromptTemplateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-prompt-template.workspace-entity';

export class AppAgentsWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  agentKey: string;
  capability: AppAgentCapability;
  status: AppAgentStatus;
  description: string | null;
  prompt: string | null;
  killSwitchEnabled: boolean;
  approvalRequired: boolean;
  humanReviewRequired: boolean;
  consentRequired: boolean;
  isCustom: boolean;
  icon: string | null;
  sourceHash: string | null;
  version: string | null;
  capabilities: Record<string, unknown> | null;
  // MANY_TO_ONE
  targetModel: EntityRelation<AiModelRegistryWorkspaceEntity> | null;
  targetModelId: string | null;
  promptTemplate: EntityRelation<AiPromptTemplateWorkspaceEntity> | null;
  promptTemplateId: string | null;
}
