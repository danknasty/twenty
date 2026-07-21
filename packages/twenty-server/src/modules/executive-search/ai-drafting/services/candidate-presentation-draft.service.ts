import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { AiDraftResultDTO } from 'src/modules/executive-search/ai-drafting/dtos/ai-draft-result.dto';
import { DRAFT_LABEL } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';

/**
 * Candidate Presentation Draft (Medium risk, consent + review).
 *
 * Drafts client-facing candidate presentations from pipeline data.
 * This is MEDIUM RISK per the AI governance spec — requires explicit
 * candidate consent AND partner review before use.
 *
 * The `candidateConsented` field MUST be `true` for the draft to proceed;
 * if consent is not confirmed, the service returns a SKIPPED status.
 */
@Injectable()
export class CandidatePresentationDraftService extends DraftingBaseService {
  private readonly presentationLogger = new Logger(
    CandidatePresentationDraftService.name,
  );

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
    return DraftType.CANDIDATE_PRESENTATION;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_PRESENTATION_ENABLED;
  }

  /**
   * Override the base `draft` entry point to enforce the consent gate
   * before any kill switch or drafting logic.
   */
  override async draft(
    workspaceId: string,
    input: Record<string, unknown>,
  ): Promise<AiDraftResultDTO> {
    const candidateConsented = input.candidateConsented === true;

    if (!candidateConsented) {
      this.presentationLogger.warn(
        `[CANDIDATE_PRESENTATION] Consent not confirmed for workspace ${workspaceId} — draft skipped`,
      );

      return {
        draftType: this.getDraftType(),
        status: DraftStatus.SKIPPED,
        draftContent: null,
        provenance: null,
        draftLabel: DRAFT_LABEL,
        error:
          'Candidate consent is required before generating a presentation draft.',
        isKillSwitched: false,
      };
    }

    return super.draft(workspaceId, input);
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
    const candidacyId = (safeContext.candidacyId as string) ?? null;
    const assignmentId = (safeContext.assignmentId as string) ?? null;
    const presentationContext =
      (safeContext.presentationContext as string) ?? null;

    const prompt = [
      'You are an executive search candidate presentation writer.',
      'Based on the following candidate and assignment data,',
      'draft a professional client-facing candidate presentation.',
      '',
      'Include:',
      '- Candidate overview and career summary',
      '- Relevant experience and qualifications',
      '- Key achievements and impact',
      '- Why this role is a good fit',
      '- Interview feedback summary (if available)',
      '- Compensation expectations (if known)',
      '',
      candidacyId ? `Candidacy ID: ${candidacyId}` : '',
      assignmentId ? `Assignment ID: ${assignmentId}` : '',
      presentationContext
        ? `Additional context:\n${presentationContext}`
        : '',
      '',
      'IMPORTANT NOTES:',
      '- This is a client-facing document — maintain professional tone',
      '- Do not include any protected-class information',
      '- Do not include subjective personality assessments',
      '- Focus on verifiable facts, experience, and qualifications',
      '',
      'Format the output as a professional candidate presentation document.',
      'Label this output clearly as "AI-GENERATED DRAFT — REQUIRES PARTNER REVIEW".',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      draftContent: prompt,
      modelId: 'pending-agent-execution',
      promptTemplateId: 'ai-prompt-template-candidate-presentation',
      promptTemplateVersion: '1.0.0',
      assignmentId,
      redactedFields: Object.keys(input).filter(
        (k) => !Object.keys(safeContext).includes(k),
      ),
    };
  }
}
