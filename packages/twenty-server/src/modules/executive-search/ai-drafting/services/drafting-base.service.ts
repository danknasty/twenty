import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { AiDraftResultDTO } from 'src/modules/executive-search/ai-drafting/dtos/ai-draft-result.dto';
import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

/**
 * Default draft label appended to every AI-generated draft output.
 * Per AI governance: "AI drafts are labeled and do not count as human submission."
 */
export const DRAFT_LABEL =
  'AI-generated draft — requires human review before use.';

/**
 * Abstract base service for all AI drafting capabilities.
 *
 * Every concrete drafting service:
 * 1. Checks the master drafting kill switch AND the per-capability kill switch
 * 2. Uses the AiContextFirewallService to ensure no prohibited fields leak into AI context
 * 3. Records provenance via DraftProvenanceService
 * 4. Returns draft content that is clearly labeled and never auto-applied
 */
@Injectable()
export abstract class DraftingBaseService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly featureFlagService: FeatureFlagService,
    protected readonly aiContextFirewallService: AiContextFirewallService,
    protected readonly draftProvenanceService: DraftProvenanceService,
  ) {}

  /**
   * Each concrete service defines its DraftType for kill switch resolution.
   */
  protected abstract getDraftType(): DraftType;

  /**
   * Each concrete service defines its per-capability kill switch key.
   */
  protected abstract getCapabilityKillSwitchKey(): FeatureFlagKey;

  /**
   * Concrete services implement their drafting logic here.
   * Called only after kill switch checks pass.
   */
  protected abstract doDraft(
    workspaceId: string,
    input: Record<string, unknown>,
  ): Promise<{
    draftContent: string;
    modelId: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    assignmentId: string | null;
    redactedFields?: string[];
  }>;

  /**
   * Build AI context from approved allowlist fields, using the firewall to
   * strip any prohibited fields.
   */
  protected buildSafeContext(
    fields: Record<string, unknown>,
  ): Record<string, unknown> {
    const safeKeys = this.aiContextFirewallService.filterProhibited(
      Object.keys(fields),
    );
    const safeContext: Record<string, unknown> = {};

    for (const key of safeKeys) {
      safeContext[key] = fields[key];
    }

    return safeContext;
  }

  /**
   * Check both the master drafting switch AND the per-capability kill switch.
   * Returns true when drafting is allowed (neither switch is thrown).
   */
  async isCapabilityEnabled(workspaceId: string): Promise<boolean> {
    const masterEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_DRAFTING_ENABLED,
      workspaceId,
    );

    if (!masterEnabled) {
      return false;
    }

    return this.featureFlagService.isFeatureEnabled(
      this.getCapabilityKillSwitchKey(),
      workspaceId,
    );
  }

  /**
   * Main entry point for drafting. Checks kill switches, executes the
   * draft, records provenance, and returns a labeled draft result.
   *
   * All outputs are draft-only — never auto-applied.
   */
  async draft(
    workspaceId: string,
    input: Record<string, unknown>,
  ): Promise<AiDraftResultDTO> {
    const capabilityEnabled = await this.isCapabilityEnabled(workspaceId);

    if (!capabilityEnabled) {
      this.logger.warn(
        `[${this.getDraftType()}] Drafting kill-switched for workspace ${workspaceId}`,
      );

      return {
        draftType: this.getDraftType(),
        status: DraftStatus.SKIPPED,
        draftContent: null,
        provenance: null,
        draftLabel: DRAFT_LABEL,
        error: `${
          this.getDraftType()
        } AI drafting is disabled. Enable the feature flag to use this capability.`,
        isKillSwitched: true,
      };
    }

    try {
      const result = await this.doDraft(workspaceId, input);
      const provenance = this.draftProvenanceService.buildProvenance({
        draftType: this.getDraftType(),
        assignmentId: result.assignmentId,
        modelId: result.modelId,
        promptTemplateId: result.promptTemplateId,
        promptTemplateVersion: result.promptTemplateVersion,
        input,
        redactedFields: result.redactedFields,
      });

      return {
        draftType: this.getDraftType(),
        status: DraftStatus.DRAFT,
        draftContent: result.draftContent,
        provenance,
        draftLabel: DRAFT_LABEL,
        error: null,
        isKillSwitched: false,
      };
    } catch (error) {
      this.logger.error(
        `[${this.getDraftType()}] Drafting failed for workspace ${workspaceId}: ${
          (error as Error).message
        }`,
        (error as Error).stack,
      );

      return {
        draftType: this.getDraftType(),
        status: DraftStatus.SKIPPED,
        draftContent: null,
        provenance: null,
        draftLabel: DRAFT_LABEL,
        error: `Drafting failed: ${(error as Error).message}`,
        isKillSwitched: false,
      };
    }
  }
}
