import { Injectable, Logger } from '@nestjs/common';

import { type FlatWorkspace } from 'src/engine/core-modules/workspace/types/flat-workspace.type';
import { AgentRunService } from 'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { RESEARCH_AI_KILL_SWITCHES } from 'src/modules/executive-search/research-ai/constants/research-ai-kill-switches.const';
import { ResearchAiProvenanceService } from 'src/modules/executive-search/research-ai/services/research-ai-provenance.service';
import type {
  KillSwitchDisabledResponse,
  TargetCompanySuggestionResult,
} from 'src/modules/executive-search/research-ai/types/research-ai.types';

/**
 * Criteria that can be provided to bias the target-company suggestion.
 */
export type TargetCompanyCriteria = {
  industry?: string;
  size?: string;
  location?: string;
};

/**
 * Target-Company Suggestion Service.
 *
 * Analyses the assignment's position specification, search criterion entries,
 * and past successful placements to generate a ranked list of suggested
 * target companies for a human researcher to consider.
 *
 * Governance: PR32, low risk, researcher review required.
 * Label: "AI DRAFT — HUMAN REVIEW REQUIRED".
 * No auto-add — human must explicitly add any suggested company.
 */
@Injectable()
export class TargetCompanySuggestionService {
  private readonly logger = new Logger(TargetCompanySuggestionService.name);

  /**
   * Fields the service may send to the AI as context about the assignment.
   * These must pass the AI context firewall before being included in the prompt.
   */
  private readonly ALLOWLISTED_FIELDS = [
    'position_title',
    'position_function',
    'position_seniority',
    'industry_focus',
    'target_region',
    'company_size_range',
    'required_skills',
    'past_placement_company',
    'past_placement_industry',
    'past_placement_location',
    'search_criterion_industry',
    'search_criterion_location',
    'search_criterion_company_size',
    'search_criterion_revenue_range',
  ];

  constructor(
    private readonly agentRunService: AgentRunService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly provenanceService: ResearchAiProvenanceService,
  ) {}

  /**
   * Generate a ranked list of suggested target companies.
   *
   * @param searchAssignmentId - The search assignment to analyse.
   * @param workspace - The workspace context for the AI agent run.
   * @param criteria - Optional user-provided criteria to narrow suggestions.
   * @param requestUserWorkspaceId - Workspace/actor performing the request.
   *
   * @returns Ordered suggestions for human researcher review, or kill-switch response.
   */
  async suggestCompanies(
    searchAssignmentId: string,
    workspace: FlatWorkspace,
    criteria?: TargetCompanyCriteria,
    requestUserWorkspaceId?: string,
  ): Promise<TargetCompanySuggestionResult | KillSwitchDisabledResponse> {
    // 1. Kill-switch check
    if (!RESEARCH_AI_KILL_SWITCHES.targetCompanySuggestionEnabled) {
      this.logger.warn(
        'Target-company suggestion capability is disabled by kill switch',
      );

      return {
        disabled: true,
        capability: 'target_company_suggestion',
        message:
          'Target-company suggestion capability is currently disabled. ' +
          'Set RESEARCH_AI_ENABLE_TARGET_COMPANY_SUGGESTION=true to enable.',
      };
    }

    // 2. Validate allowlisted fields through the AI context firewall
    this.aiContextFirewallService.assertAiContextAllowlistSafe(
      this.ALLOWLISTED_FIELDS,
    );

    // 3. Build the structured prompt
    const promptText = this.buildPrompt(searchAssignmentId, criteria);

    // 4. Determine model / prompt version for provenance
    const agentUniversalIdentifier = 'target-company-suggestion-v1';
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
        `Target-company suggestion failed: ${runResult.error ?? 'no result returned'}`,
      );
    }

    // 6. Parse the result into structured suggestions
    const parsed = this.parseAgentResult(runResult.result);

    // 7. Record provenance
    this.provenanceService.recordProvenance(
      this.provenanceService.buildProvenance({
        capability: 'target_company_suggestion',
        subject: `searchAssignmentId=${searchAssignmentId}`,
        assignmentId: searchAssignmentId,
        modelUsed: agentUniversalIdentifier,
        promptVersion,
        inputReferences: [
          `searchAssignmentId=${searchAssignmentId}`,
          ...(criteria ? [`criteria=${JSON.stringify(criteria)}`] : []),
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
   * Build the structured prompt for the target-company suggestion agent.
   */
  private buildPrompt(
    searchAssignmentId: string,
    criteria?: TargetCompanyCriteria,
  ): string {
    const parts: string[] = [
      'You are an AI assistant that analyses executive-search assignments',
      'and suggests target companies for a human researcher to investigate.',
      '',
      `Search Assignment ID: ${searchAssignmentId}`,
      '',
      'The assignment includes:',
      '  - Position specification (title, function, seniority)',
      '  - Search criteria (industry, location, company size)',
      '  - Past successful placements (companies, industries, locations)',
      '',
      ...(criteria
        ? [
            'Additional user-provided criteria:',
            ...(criteria.industry ? [`  - Industry: ${criteria.industry}`] : []),
            ...(criteria.size ? [`  - Company size: ${criteria.size}`] : []),
            ...(criteria.location ? [`  - Location: ${criteria.location}`] : []),
            '',
          ]
        : []),
      '',
      'Respond with a JSON object exactly like this (no markdown, no wrapping):',
      JSON.stringify({
        suggestions: [
          {
            companyName: 'Example Corp',
            rationale:
              'Matches the target industry and has a track record of hiring from the same talent pool.',
            confidence: 0.85,
            sourceDataUsed: [
              'positionSpecification.industry',
              'pastPlacements[0].company',
            ],
          },
        ],
      }),
      '',
      'Rules:',
      '  - Return up to 10 suggestions, ordered by confidence (highest first).',
      '  - Confidence must be a float between 0 and 1.',
      '  - Provide a clear rationale for each suggestion.',
      '  - List the specific source data fields used for each suggestion.',
      '  - Never auto-add companies — return suggestions for human review only.',
      '  - If insufficient data is available, return an empty suggestions array.',
    ].join('\n');

    return parts;
  }

  /**
   * Safely parse the agent result into TargetCompanySuggestionResult.
   */
  private parseAgentResult(result: object): TargetCompanySuggestionResult {
    const raw = result as Record<string, unknown>;
    const rawSuggestions = raw.suggestions;

    const suggestions = Array.isArray(rawSuggestions)
      ? rawSuggestions.map((s: unknown) => {
          const item = s as Record<string, unknown>;

          return {
            companyName: String(item.companyName ?? ''),
            rationale: String(item.rationale ?? ''),
            confidence: Math.min(1, Math.max(0, Number(item.confidence ?? 0))),
            sourceDataUsed: Array.isArray(item.sourceDataUsed)
              ? item.sourceDataUsed.map(String)
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
