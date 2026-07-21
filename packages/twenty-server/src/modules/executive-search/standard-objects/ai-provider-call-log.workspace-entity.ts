import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ProviderCallStatus } from 'src/modules/executive-search/common/enums/provider-call-status.enum';
import { type AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';
import { type AiPromptTemplateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-prompt-template.workspace-entity';

export class AiProviderCallLogWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  requestId: string;
  providerName: string;
  modelId: string;
  capability: AppAgentCapability;
  status: ProviderCallStatus;
  inputHash: string;
  responseHash: string | null;
  inputRedactionManifest: Record<string, unknown> | null;
  guardrailChecks: Record<string, unknown> | null;
  guardrailPolicyVersion: string | null;
  latencyMs: number | null;
  tokenInputCount: number | null;
  tokenOutputCount: number | null;
  errorCode: string | null;
  retentionPolicy: string;
  retentionExpiresAt: Date | null;
  legalHold: boolean;
  subjectType: string | null;
  subjectId: string | null;
  agentTurnRef: string | null; // NOTE: plain string, NOT EntityRelation
  directusRequestLogId: string | null;
  metadata: Record<string, unknown> | null;
  calledAt: Date;
  // MANY_TO_ONE
  promptTemplate: EntityRelation<AiPromptTemplateWorkspaceEntity> | null;
  promptTemplateId: string | null;
}
