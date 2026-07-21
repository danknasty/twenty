import { Injectable, Logger } from '@nestjs/common';

import { type FlatWorkspace } from 'src/engine/core-modules/workspace/types/flat-workspace.type';
import { AgentEntity } from 'src/engine/metadata-modules/ai/ai-agent/entities/agent.entity';
import { AgentRunService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run.service';
import { InjectWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator';
import { WorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { RESEARCH_AI_KILL_SWITCHES } from 'src/modules/executive-search/research-ai/constants/research-ai-kill-switches.const';
import { ResearchAiProvenanceService } from 'src/modules/executive-search/research-ai/services/research-ai-provenance.service';
import type {
  KillSwitchDisabledResponse,
  RelationshipPathSuggestionResult,
} from 'src/modules/executive-search/research-ai/types/research-ai.types';

/**
 * Relationship Path Suggestion Service.
 *
 * Analyses relationshipEdge data, boardService history, and career
 * experience overlap to suggest relationship paths (who knows whom)
 * between executives and target companies.
 *
 * Governance: PR32, medium risk, no auto-send of messages or outreach.
 * Label: "AI DRAFT — HUMAN REVIEW REQUIRED".
 * Human must approve before any outreach is initiated.
 */
@Injectable()
export class RelationshipPathSuggestionService {
  private readonly logger = new Logger(RelationshipPathSuggestionService.name);

  /**
   * Fields the service may send to the AI as context about relationship data.
   * These must pass the AI context firewall before being included in the prompt.
   */
  private readonly ALLOWLISTED_FIELDS = [
    'executive_name',
    'executive_current_company',
    'executive_previous_companies',
    'target_company_name',
    'target_company_industry',
    'relationship_edge_type',
    'relationship_edge_strength',
    'board_service_company',
    'board_service_role',
    'board_service_start_date',
    'board_service_end_date',
    'career_experience_company',
    'career_experience_role',
    'career_experience_start_date',
    'career_experience_end_date',
  ];

  constructor(
    private readonly agentRunService: AgentRunService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly provenanceService: ResearchAiProvenanceService,
    @InjectWorkspaceScopedRepository(AgentEntity)
    private readonly agentRepository: WorkspaceScopedRepository<AgentEntity>,
  ) {}

  /**
   * Suggest relationship paths between an executive profile and a target company.
   *
   * @param executiveProfileId - The executive profile to analyse.
   * @param targetCompanyId - The target company to find connections to.
   * @param workspace - The workspace context for the AI agent run.
   * @param searchAssignmentId - Optional assignment context for provenance.
   * @param requestUserWorkspaceId - Workspace/actor performing the request.
   *
   * @returns Ordered list of relationship path suggestions for human review, or kill-switch response.
   */
  async suggestPaths(
    executiveProfileId: string,
    targetCompanyId: string,
    workspace: FlatWorkspace,
    searchAssignmentId?: string,
    requestUserWorkspaceId?: string,
  ): Promise<RelationshipPathSuggestionResult | KillSwitchDisabledResponse> {
    // 1. Kill-switch check
    if (!RESEARCH_AI_KILL_SWITCHES.relationshipPathSuggestionEnabled) {
      this.logger.warn(
        'Relationship path suggestion capability is disabled by kill switch',
      );

      return {
        disabled: true,
        capability: 'relationship_path_suggestion',
        message:
          'Relationship path suggestion capability is currently disabled. ' +
          'Set RESEARCH_AI_ENABLE_RELATIONSHIP_PATH_SUGGESTION=true to enable.',
      };
    }

    // 2. Validate allowlisted fields through the AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(
      this.ALLOWLISTED_FIELDS,
    );

    // 3. Build the structured prompt
    const promptText = this.buildPrompt(
      executiveProfileId,
      targetCompanyId,
      searchAssignmentId,
    );

    // 4. Determine model / prompt version for provenance
    const agentUniversalIdentifier = 'relationship-path-suggestion-v1';
    const promptVersion = '1.0.0';

    // 5. Run the AI agent
    const runResult = await this.agentRunService.run({
      workspace,
      requestUserWorkspaceId: requestUserWorkspaceId ?? null,
      input: {
        agentUniversalIdentifier,
        prompt: promptText,
      },
    });

    if (!runResult.success || !runResult.result) {
      this.logger.error(
        `AI agent run failed: ${runResult.error ?? 'unknown error'}`,
      );

      throw new Error(
        `Relationship path suggestion failed: ${runResult.error ?? 'no result returned'}`,
      );
    }

    // 5b. Resolve the actual model ID from the agent entity
    let modelId = 'unknown';
    try {
      const agent = await this.agentRepository.findOne(workspace.id, {
        where: { universalIdentifier: agentUniversalIdentifier },
      });

      if (agent) {
        modelId = agent.modelId;
      }
    } catch (err) {
      this.logger.warn(
        `Could not resolve model ID for agent "${agentUniversalIdentifier}": ${String(err)}`,
      );
    }

    // 6. Parse the result into structured suggestions
    const parsed = this.parseAgentResult(runResult.result);

    // 7. Record provenance
    this.provenanceService.recordProvenance(
      this.provenanceService.buildProvenance({
        capability: 'relationship_path_suggestion',
        subject: `executiveProfileId=${executiveProfileId}, targetCompanyId=${targetCompanyId}`,
        assignmentId: searchAssignmentId ?? null,
        modelUsed: modelId,
        promptVersion,
        inputReferences: [
          `executiveProfileId=${executiveProfileId}`,
          `targetCompanyId=${targetCompanyId}`,
        ],
        output: parsed,
        guardrailChecks: [
          {
            guardrailName: 'ai_context_allowlist_firewall',
            passed: true,
            detail: `Allowlist fields (${this.ALLOWLISTED_FIELDS.length}) passed firewall check`,
          },
        ],
        performedByUserId: requestUserWorkspaceId ?? null,
      }),
    );

    return parsed;
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Build the structured prompt for the relationship-path suggestion agent.
   */
  private buildPrompt(
    executiveProfileId: string,
    targetCompanyId: string,
    searchAssignmentId?: string,
  ): string {
    const parts: string[] = [
      'You are an AI assistant that analyses relationship data to suggest',
      'connection paths between executives and target companies.',
      '',
      `Executive Profile ID: ${executiveProfileId}`,
      `Target Company ID: ${targetCompanyId}`,
      ...(searchAssignmentId
        ? [`Search Assignment ID: ${searchAssignmentId}`]
        : []),
      '',
      'Available data includes:',
      '  - Relationship edges (type, strength) between executives',
      '  - Board service history (company, role, dates)',
      '  - Career experience overlap (company, role, dates)',
      '',
      'Respond with a JSON object exactly like this (no markdown, no wrapping):',
      JSON.stringify({
        suggestions: [
          {
            pathDescription:
              'Jane served on the same board as the target company\'s CFO.',
            confidence: 0.82,
            intermediateConnections: [
              {
                personName: 'Jane Smith',
                connectionType: 'BoardService',
              },
            ],
          },
        ],
      }),
      '',
      'Rules:',
      '  - Return up to 5 suggestions, ordered by confidence (highest first).',
      '  - Confidence must be a float between 0 and 1.',
      '  - Each pathDescription must be a clear, human-readable sentence.',
      '  - List all intermediate connections; each hop must be traceable.',
      '  - Never suggest auto-sending messages or outreach.',
      '  - If no relationship data is available, return an empty suggestions array.',
    ].join('\n');

    return parts;
  }

  /**
   * Safely parse the agent result into RelationshipPathSuggestionResult.
   */
  private parseAgentResult(result: object): RelationshipPathSuggestionResult {
    const raw = result as Record<string, unknown>;
    const rawSuggestions = raw.suggestions;

    const suggestions = Array.isArray(rawSuggestions)
      ? rawSuggestions.map((s: unknown) => {
          const item = s as Record<string, unknown>;

          return {
            pathDescription: String(item.pathDescription ?? ''),
            confidence: Math.min(1, Math.max(0, Number(item.confidence ?? 0))),
            intermediateConnections: Array.isArray(item.intermediateConnections)
              ? item.intermediateConnections.map((c: unknown) => {
                  const conn = c as Record<string, unknown>;

                  return {
                    personName: String(conn.personName ?? ''),
                    connectionType: String(conn.connectionType ?? ''),
                  };
                })
              : [],
          };
        })
      : [];

    return {
      suggestions,
      label: 'AI DRAFT — HUMAN REVIEW REQUIRED',
    };
  }
}
