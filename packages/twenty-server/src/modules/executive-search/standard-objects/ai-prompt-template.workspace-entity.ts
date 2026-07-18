import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type AiPromptCategory } from 'src/modules/executive-search/common/enums/ai-prompt-category.enum';
import { type AiResponseFormat } from 'src/modules/executive-search/common/enums/ai-response-format.enum';

export class AiPromptTemplateWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  promptText: string;
  modelId: string | null;
  responseFormat: AiResponseFormat | null;
  category: AiPromptCategory | null;
  version: string | null;
  isActive: boolean;
  isApproved: boolean;
}
