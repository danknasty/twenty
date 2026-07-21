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
  AiGeneratedFilter,
  KillSwitchDisabledResponse,
  NlSearchFilterResult,
} from 'src/modules/executive-search/research-ai/types/research-ai.types';

/**
 * Natural-Language Search Filter Service.
 *
 * Takes a free-form natural-language query (e.g. "Find CTOs in Berlin
 * with deep-tech experience") and translates it into structured filter
 * expressions compatible with Twenty's filter system.
 *
 * Governance: PR32, low risk, transparent to the user.
 * Label: "AI DRAFT — HUMAN REVIEW REQUIRED".
 */
@Injectable()
export class NlSearchFilterService {
  private readonly logger = new Logger(NlSearchFilterService.name);

  /**
   * Fields the service may send to the AI as context. These must pass
   * the AI context firewall before being included in the prompt.
   */
  private readonly ALLOWLISTED_FIELDS = [
    'name',
    'industry',
    'location',
    'title',
    'company',
    'skills',
    'experience_years',
    'education',
    'function',
    'seniority_level',
    'department',
  ];

  constructor(
    private readonly agentRunService: AgentRunService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly provenanceService: ResearchAiProvenanceService,
    @InjectWorkspaceScopedRepository(AgentEntity)
    private readonly agentRepository: WorkspaceScopedRepository<AgentEntity>,
  ) {}

  /**
   * Translate a natural-language query into structured Twenty filters.
   *
   * @param query - Free-form natural-language search query.
   * @param workspace - The workspace context for the AI agent run.
   * @param searchAssignmentId - Optional assignment context for provenance.
   * @param requestUserWorkspaceId - Workspace/actor performing the request.
   *
   * @returns The translated filters with explanation, or a kill-switch response.
   */
  async translateQuery(
    query: string,
    workspace: FlatWorkspace,
    searchAssignmentId?: string,
    requestUserWorkspaceId?: string,
  ): Promise<NlSearchFilterResult | KillSwitchDisabledResponse> {
    // 1. Kill-switch check
    if (!RESEARCH_AI_KILL_SWITCHES.nlSearchFilterEnabled) {
      this.logger.warn(
        'NL search filter capability is disabled by kill switch',
      );

      return {
        disabled: true,
        capability: 'natural_language_search',
        message:
          'Natural-language search filter capability is currently disabled. ' +
          'Set RESEARCH_AI_ENABLE_NL_SEARCH_FILTER=true to enable.',
      };
    }

    // 2. Validate allowlisted fields through the AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(
      this.ALLOWLISTED_FIELDS,
    );

    // 3. Build the structured prompt for the AI agent
    const promptText = this.buildPrompt(query);

    // 4. Determine model / prompt version for provenance
    const agentUniversalIdentifier = 'nl-search-filter-v1';
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
        `NL search filter translation failed: ${runResult.error ?? 'no result returned'}`,
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

    // 6. Parse the result into structured filters
    const parsed = this.parseAgentResult(runResult.result, query);

    // 7. Record provenance
    this.provenanceService.recordProvenance(
      this.provenanceService.buildProvenance({
        capability: 'natural_language_search',
        subject: query,
        assignmentId: searchAssignmentId ?? null,
        modelUsed: modelId,
        promptVersion,
        inputReferences: [query],
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
   * Build the structured prompt for the NL → filter translation agent.
   */
  private buildPrompt(query: string): string {
    return [
      'You are an AI assistant that translates natural-language search queries',
      'into structured filter expressions for an executive-search platform.',
      '',
      'Allowed filter fields (snake_case):',
      ...this.ALLOWLISTED_FIELDS.map((f) => `  - ${f}`),
      '',
      'Operators: eq, neq, gt, gte, lt, lte, in, like, ilike, startsWith, is',
      '',
      'Respond with a JSON object exactly like this (no markdown, no wrapping):',
      JSON.stringify({
        filters: [
          {
            fieldName: 'example_field',
            operator: 'ilike',
            value: 'example value',
          },
        ],
        explanation: 'Briefly describe what you interpreted from the query.',
      }),
      '',
      'User query:',
      query,
    ].join('\n');
  }

  /**
   * Safely parse the agent result into NlSearchFilterResult.
   *
   * Filters returned by the AI are validated against the ALLOWLISTED_FIELDS
   * set; any filter whose fieldName is not in the allowlist is dropped and a
   * warning is logged.
   */
  private parseAgentResult(
    result: object,
    originalQuery: string,
  ): NlSearchFilterResult {
    const raw = result as Record<string, unknown>;
    const rawFilters = raw.filters;

    const allowlistSet = new Set(this.ALLOWLISTED_FIELDS);

    const filters = Array.isArray(rawFilters)
      ? rawFilters.reduce<AiGeneratedFilter[]>((acc, f: unknown) => {
          const filter = f as Record<string, unknown>;
          const fieldName = String(filter.fieldName ?? '');

          if (!fieldName || !allowlistSet.has(fieldName)) {
            this.logger.warn(
              `AI returned filter on non-allowlisted field "${fieldName}"; dropping`,
            );

            return acc;
          }

          acc.push({
            fieldName,
            operator: this.normalizeOperator(String(filter.operator ?? 'eq')),
            value: filter.value,
          });

          return acc;
        }, [])
      : [];

    return {
      filters,
      explanation: String(raw.explanation ?? 'No explanation provided.'),
      originalQuery,
      label: 'AI DRAFT — HUMAN REVIEW REQUIRED',
    };
  }

  /**
   * Normalise the operator string to a known union value.
   */
  private normalizeOperator(
    op: string,
  ): AiGeneratedFilter['operator'] {
    const valid: AiGeneratedFilter['operator'][] = [
      'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in',
      'like', 'ilike', 'startsWith', 'is',
    ];

    if (valid.includes(op as AiGeneratedFilter['operator'])) {
      return op as AiGeneratedFilter['operator'];
    }

    this.logger.warn(
      `Unknown filter operator "${op}" received from AI; defaulting to "eq"`,
    );

    return 'eq';
  }
}
