import { Injectable } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Status Report Draft (Low risk, partner review).
 *
 * Drafts client status reports from pipeline data.
 * Input: assignment context, pipeline/candidacy data, reporting period.
 * Output: professional client-facing status report summarizing progress,
 * key activities, next steps, and any risks or blockers.
 */
@Injectable()
export class StatusReportDraftService extends DraftingBaseService {
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
    return DraftType.STATUS_REPORT;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_STATUS_REPORT_ENABLED;
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
    const periodStart = (safeContext.periodStart as string) ?? null;
    const periodEnd = (safeContext.periodEnd as string) ?? null;

    const prompt = [
      'You are an executive search engagement manager.',
      'Based on the following pipeline data and candidacy information,',
      'draft a professional client status report.',
      '',
      'Include:',
      '- Executive summary of search progress',
      '- Key activities during the reporting period',
      '- Candidate pipeline summary (sourced, screened, interviewed, presented)',
      '- Next steps and upcoming milestones',
      '- Any risks, blockers, or client action items',
      '- Period-over-period comparison if applicable',
      '',
      assignmentId ? `Assignment ID: ${assignmentId}` : '',
      periodStart ? `Reporting period start: ${periodStart}` : '',
      periodEnd ? `Reporting period end: ${periodEnd}` : '',
      '',
      'Format the output as a professional client-facing status report.',
      'Use clear section headings and a professional tone.',
      'Label this output clearly as "AI-GENERATED DRAFT — REQUIRES PARTNER REVIEW".',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      draftContent: prompt,
      modelId: 'pending-agent-execution',
      promptTemplateId: 'ai-prompt-template-status-report',
      promptTemplateVersion: '1.0.0',
      assignmentId,
      redactedFields: Object.keys(input).filter(
        (k) => !Object.keys(safeContext).includes(k),
      ),
    };
  }
}
