import { Injectable } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Assignment Intake Assistant (Low risk, required human review).
 *
 * Drafts a search assignment intake from client conversation notes.
 * Input: free-form conversation notes, opportunity reference, company reference.
 * Output: structured intake draft including role summary, key requirements,
 * team context, and any immediate flags.
 */
@Injectable()
export class AssignmentIntakeDraftService extends DraftingBaseService {
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
    return DraftType.ASSIGNMENT_INTAKE;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_ASSIGNMENT_INTAKE_ENABLED;
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

    // AI context is sanitized; build the draft prompt from conversation notes
    const notes = (safeContext.conversationNotes as string) ?? '';
    const clientCompanyId = (safeContext.clientCompanyId as string) ?? null;

    const prompt = [
      'You are an executive search assignment intake assistant.',
      'Based on the following client conversation notes, draft a structured search assignment intake.',
      '',
      'Include:',
      '- Role title and summary',
      '- Key responsibilities',
      '- Required qualifications and experience',
      '- Preferred qualifications',
      '- Reporting structure',
      '- Compensation range (if mentioned)',
      '- Timeline and urgency',
      '- Any immediate red flags or special considerations',
      '',
      'Conversation notes:',
      notes,
      clientCompanyId ? `Client company ID: ${clientCompanyId}` : '',
      '',
      'Format the output as structured markdown with clear section headings.',
      'Label this output clearly as "AI-GENERATED DRAFT — REQUIRES HUMAN REVIEW".',
    ]
      .filter(Boolean)
      .join('\n');

    // The actual agent execution will be handled by the caller (resolver/controller)
    // which has access to AgentRunService. This service prepares the validated,
    // sanitized prompt and context.
    //
    // For the initial implementation, we return a structured placeholder
    // demonstrating the complete governance workflow. The resolver layer will
    // integrate with AgentRunService using the prompt generated here.

    return {
      draftContent: prompt,
      modelId: 'pending-agent-execution',
      promptTemplateId: 'ai-prompt-template-assignment-intake',
      promptTemplateVersion: '1.0.0',
      assignmentId: null,
      redactedFields: Object.keys(input).filter(
        (k) => !Object.keys(safeContext).includes(k),
      ),
    };
  }
}
