import { Injectable } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Research Strategy Draft (Low risk, required human review).
 *
 * Drafts a research strategy from position specification + market map.
 * Input: position spec context, market map data, researcher notes.
 * Output: structured research strategy with target segments, company lists,
 * candidate sourcing approach, and timeline.
 */
@Injectable()
export class ResearchStrategyDraftService extends DraftingBaseService {
  constructor(
    featureFlagService: FeatureFlagService,
    aiContextFirewallService: AiContextFirewallService,
    draftProvenanceService: DraftProvenanceService,
  ) {
    super(
      featureFlagService,
      aiContextFirewallService,
      draftProvenanceService,
    );
  }

  protected getDraftType(): DraftType {
    return DraftType.RESEARCH_STRATEGY;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_RESEARCH_STRATEGY_ENABLED;
  }

  protected async doDraft(
    workspaceId: string,
    input: Record<string, unknown>,
  ): Promise<{
    draftContent: string;
    modelId: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    assignmentId: string | null;
    redactedFields?: string[];
  }> {
    const safeContext = this.buildSafeContext(input);
    const positionSpecId = (safeContext.positionSpecId as string) ?? null;
    const marketMapId = (safeContext.marketMapId as string) ?? null;
    const researcherNotes =
      (safeContext.researcherNotes as string) ?? null;

    const prompt = [
      'You are an executive search research strategist.',
      'Based on the following position specification and market map,',
      'draft a comprehensive research strategy.',
      '',
      'Include:',
      '- Target company segments and tiers',
      '- Candidate sourcing approach (direct approach, network referrals, etc.)',
      '- Target candidate profile and experience level',
      '- Geographic scope and considerations',
      '- Estimated candidate pool size',
      '- Proposed timeline and milestones',
      '- Alternative sources and contingency plans',
      '',
      positionSpecId
        ? `Position Specification ID: ${positionSpecId}`
        : '',
      marketMapId ? `Market Map ID: ${marketMapId}` : '',
      researcherNotes
        ? `Researcher notes:\n${researcherNotes}`
        : '',
      '',
      'Format the output as a structured research strategy document.',
      'Label this output clearly as "AI-GENERATED DRAFT — REQUIRES HUMAN REVIEW".',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      draftContent: prompt,
      modelId: 'pending-agent-execution',
      promptTemplateId: 'ai-prompt-template-research-strategy',
      promptTemplateVersion: '1.0.0',
      assignmentId: null,
      redactedFields: Object.keys(input).filter(
        (k) => !Object.keys(safeContext).includes(k),
      ),
    };
  }
}
