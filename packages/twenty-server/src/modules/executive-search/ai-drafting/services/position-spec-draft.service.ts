import { Injectable } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Position Specification Draft (Low risk, required human review).
 *
 * Drafts a position specification from engagement terms + assignment context.
 * Input: assignment context, engagement terms, any additional client notes.
 * Output: structured position spec with responsibilities, qualifications,
 * reporting line, and compensation.
 */
@Injectable()
export class PositionSpecDraftService extends DraftingBaseService {
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
    return DraftType.POSITION_SPEC;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_POSITION_SPEC_ENABLED;
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
    const assignmentId = (safeContext.assignmentId as string) ?? null;
    const additionalContext =
      (safeContext.additionalContext as string) ?? null;

    const prompt = [
      'You are an executive search position specification writer.',
      'Based on the following assignment context and engagement terms,',
      'draft a comprehensive position specification.',
      '',
      'Include:',
      '- Position title and summary',
      '- Key responsibilities and scope',
      '- Required qualifications (education, experience, skills)',
      '- Preferred qualifications',
      '- Reporting structure and team context',
      '- Compensation range and structure',
      '- Location and travel requirements',
      '- Any special considerations',
      '',
      assignmentId ? `Assignment ID: ${assignmentId}` : '',
      additionalContext
        ? `Additional context from client:\n${additionalContext}`
        : '',
      '',
      'Format the output as a professional position specification document',
      'with clear section headings and bullet points.',
      'Label this output clearly as "AI-GENERATED DRAFT — REQUIRES HUMAN REVIEW".',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      draftContent: prompt,
      modelId: 'pending-agent-execution',
      promptTemplateId: 'ai-prompt-template-position-spec',
      promptTemplateVersion: '1.0.0',
      assignmentId,
      redactedFields: Object.keys(input).filter(
        (k) => !Object.keys(safeContext).includes(k),
      ),
    };
  }
}
