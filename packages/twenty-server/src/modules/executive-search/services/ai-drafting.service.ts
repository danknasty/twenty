import { Injectable, NotFoundException } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';
import { AppAgentStatus } from 'src/modules/executive-search/common/enums/app-agent-status.enum';
import { ProviderCallStatus } from 'src/modules/executive-search/common/enums/provider-call-status.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AppAgentsWorkspaceEntity } from 'src/modules/executive-search/standard-objects/app-agents.workspace-entity';
import { AiProviderCallLogWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-provider-call-log.workspace-entity';
import { AiPromptTemplateWorkspaceEntity } from 'src/modules/executive-search/standard-objects/ai-prompt-template.workspace-entity';
import { type AiDraftRequestDTO } from 'src/modules/executive-search/dtos/ai-drafting/ai-draft-request.dto';
import { type AiDraftResultDTO } from 'src/modules/executive-search/dtos/ai-drafting/ai-draft-result.dto';
import {
  hashString,
  assemblePrompt,
  buildRedactionManifest,
  buildGuardrailResults,
  buildGuardrailChecks,
} from 'src/modules/executive-search/services/ai-drafting.utils';

/**
 * Entity-specific field allowlists for AI context construction.
 *
 * Only explicitly listed fields may be included in AI prompts. The
 * AiContextFirewallService provides defense-in-depth validation.
 */
const FIELD_ALLOWLISTS: Record<string, string[]> = {
  searchAssignment: [
    'name',
    'description',
    'searchScope',
    'industryFocus',
    'functionalArea',
    'seniorityLevel',
    'targetCompensationMin',
    'targetCompensationMax',
    'positionSpecification',
  ],
  positionSpecification: [
    'name',
    'description',
    'requirements',
    'responsibilities',
    'qualifications',
    'compensationRange',
  ],
  searchCandidacy: [
    'status',
    'stage',
    'notes',
    'sourceNote',
    'executiveProfile',
  ],
  executiveProfile: [
    'summary',
    'currentTitle',
    'currentCompany',
    'industry',
    'functionalArea',
    'yearsOfExperience',
    'educationSummary',
  ],
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class AiDraftingService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Generate an AI draft for a given drafting capability.
   *
   * Flow:
   *   1. Look up the `appAgents` record → check kill switch, get gates
   *   2. Load the linked prompt template and model
   *   3. Build sanitized context from the subject entity (positive allowlist)
   *   4. Assemble the prompt and execute the draft
   *   5. Log the call to `aiProviderCallLog` for audit trail
   *   6. Return the draft with gate metadata
   *
   * All drafts require human review before use. No stage changes, client
   * presentations, or rejections are automatic — per ADR-0001.
   */
  async generateDraft(
    request: AiDraftRequestDTO,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<AiDraftResultDTO> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const capability = request.category;

        // 1. Look up the app agent + check kill switch
        const agent = await this.findEnabledAgent(workspaceId, capability);

        if (!agent) {
          throw new NotFoundException(
            `No enabled app agent found for capability "${capability}"`,
          );
        }

        if (agent.killSwitchEnabled) {
          throw new ExecutiveSearchException(
            `Drafting capability "${capability}" is currently disabled via kill switch`,
            ExecutiveSearchExceptionCode.AI_KILL_SWITCH_ACTIVE,
          );
        }

        // 2. Load linked prompt template
        const promptText = await this.loadPromptText(
          workspaceId,
          agent.promptTemplateId,
        );

        if (!promptText) {
          throw new NotFoundException(
            `No prompt template linked to agent "${agent.agentKey}"`,
          );
        }

        // 3. Build sanitized context
        const sanitizedContext = await this.buildSanitizedContext(
          workspaceId,
          request.subjectEntityName,
          request.subjectEntityId,
        );

        const redactionManifest = buildRedactionManifest(sanitizedContext);

        // 4. Assemble the full prompt
        const assembledPrompt = assemblePrompt(
          promptText,
          sanitizedContext,
          request.additionalInstructions,
        );

        // 5. Execute the draft
        const draftResult = await this.executeDraft(
          agent.agentKey,
          assembledPrompt,
          workspaceId,
          authContext,
        );

        // 6. Log the provider call for audit trail
        await this.logProviderCall(
          workspaceId,
          capability,
          assembledPrompt,
          draftResult.text,
          redactionManifest,
          agent,
        );

        // 7. Return with gate metadata from appAgents
        const modelVersion =
          typeof agent.version === 'string' ? agent.version : '1.0.0';

        return {
          draftId: draftResult.draftId,
          category: request.category,
          draftText: draftResult.text,
          modelUsed: agent.targetModelId ?? 'default-model',
          promptVersion: modelVersion,
          generatedAt: new Date().toISOString(),
          requiresHumanReview:
            agent.humanReviewRequired || agent.approvalRequired,
          redactionManifest: JSON.stringify(redactionManifest),
          guardrailResults: JSON.stringify(buildGuardrailResults(agent)),
        };
      },
    );
  }

  /**
   * Find an enabled app agent for a given capability.
   */
  private async findEnabledAgent(
    workspaceId: string,
    capability: AppAgentCapability,
  ): Promise<AppAgentsWorkspaceEntity | null> {
    const repo =
      await this.globalWorkspaceOrmManager.getRepository<AppAgentsWorkspaceEntity>(
        workspaceId,
        AppAgentsWorkspaceEntity,
      );

    const agents = await repo.find({
      where: {
        capability,
        status: AppAgentStatus.ENABLED,
      },
      take: 1,
    });

    return agents.length > 0 ? agents[0] : null;
  }

  /**
   * Load the prompt text from a linked prompt template.
   */
  private async loadPromptText(
    workspaceId: string,
    promptTemplateId: string | null,
  ): Promise<string | null> {
    if (!promptTemplateId) return null;

    const repo =
      await this.globalWorkspaceOrmManager.getRepository<AiPromptTemplateWorkspaceEntity>(
        workspaceId,
        AiPromptTemplateWorkspaceEntity,
      );

    const template = await repo.findOne({
      where: { id: promptTemplateId, isActive: true, isApproved: true },
    });

    return template?.promptText ?? null;
  }

  /**
   * Build a sanitized context using a positive allowlist.
   */
  private async buildSanitizedContext(
    workspaceId: string,
    entityName: string,
    entityId: string,
  ): Promise<Record<string, unknown>> {
    const allowlist = FIELD_ALLOWLISTS[entityName] ?? [];
    this.aiContextFirewallService.assertAiContextAllowlistSafe(allowlist);

    const repo =
      await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        entityName,
      );

    const entity = await repo.findOne({ where: { id: entityId } });

    if (!entity) {
      throw new ExecutiveSearchException(
        `Subject entity "${entityName}" with id "${entityId}" not found`,
        ExecutiveSearchExceptionCode.ENTITY_NOT_FOUND,
      );
    }

    const safeContext: Record<string, unknown> = {};

    for (const field of allowlist) {
      if (field in (entity as Record<string, unknown>)) {
        safeContext[field] = (entity as Record<string, unknown>)[field];
      }
    }

    return safeContext;
  }

  /**
   * Execute the AI draft generation.
   *
   * TODO: Integrate with AgentRunService when the agent pipeline supports
   * app-agent-key-based routing. For PR31, returns a structured placeholder
   * that satisfies the contract and is clearly marked as requiring human review.
   */
  private async executeDraft(
    _agentKey: string,
    _prompt: string,
    _workspaceId: string,
    _authContext: WorkspaceAuthContext,
  ): Promise<{ draftId: string; text: string }> {
    const draftId = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    return {
      draftId,
      text: `[AI Draft — Requires Human Review]\n\nNot yet implemented — requires agent pipeline integration (AgentRunService app-agent-key routing). All drafts require human approval before use, per Twenty AI governance policy (ADR-0001).`,
    };
  }

  /**
   * Log the AI provider call to `aiProviderCallLog` for the audit trail.
   */
  private async logProviderCall(
    workspaceId: string,
    capability: AppAgentCapability,
    prompt: string,
    responseText: string,
    redactionManifest: Record<string, unknown>,
    agent: AppAgentsWorkspaceEntity,
  ): Promise<void> {
    const repo =
      await this.globalWorkspaceOrmManager.getRepository<AiProviderCallLogWorkspaceEntity>(
        workspaceId,
        AiProviderCallLogWorkspaceEntity,
      );

    const callLog = repo.create({
      name: `draft-${capability}-${Date.now()}`,
      requestId: `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      providerName: agent.targetModelId ?? 'default',
      modelId: agent.targetModelId ?? 'default',
      capability,
      status: ProviderCallStatus.SUCCESS,
      inputHash: hashString(prompt),
      responseHash: hashString(responseText),
      inputRedactionManifest: redactionManifest,
      guardrailChecks: buildGuardrailChecks(agent),
      guardrailPolicyVersion: '1.0.0',
      retentionPolicy: 'standard',
      legalHold: false,
      calledAt: new Date(),
    });

    await repo.save(callLog);
  }
}
