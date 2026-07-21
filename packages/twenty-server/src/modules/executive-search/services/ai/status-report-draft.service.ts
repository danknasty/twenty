import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiCapability } from 'src/modules/executive-search/common/enums/ai-capability.enum';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import {
  DraftingGateService,
  DraftResult,
} from 'src/modules/executive-search/services/ai/drafting-gate.service';

/**
 * Input data for drafting a status report.
 */
export type StatusReportInput = {
  /** Assignment or search identifier. */
  assignmentTitle: string;
  /** Current assignment status. */
  currentStatus: string;
  /** Key milestones and their progress. */
  milestones: Array<{
    name: string;
    status: string;
    targetDate?: string;
  }>;
  /** Recent activities performed. */
  recentActivities: string[];
  /** Upcoming activities planned. */
  upcomingActivities: string[];
  /** Any blockers or issues. */
  blockers: string[];
  /** Candidate pipeline summary. */
  candidatePipeline?: string;
};

/**
 * AI draft of a status report.
 *
 * Risk: Low. Partner review required.
 *
 * This service:
 * 1. Sanitizes input through the AI context firewall
 * 2. Validates the AI candidate feature flag
 * 3. Generates a structured status report draft
 * 4. Labels all output as "AI DRAFT — Requires Human Review"
 * 5. Records provenance per governance §Evidence and provenance
 */
@Injectable()
export class StatusReportDraftService {
  private readonly logger = new Logger(StatusReportDraftService.name);

  /** Current prompt version for this capability. */
  static readonly PROMPT_VERSION = '1.0.0';

  /** AI model identifier used for generation. */
  static readonly MODEL = 'gpt-4';

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly draftingGateService: DraftingGateService,
  ) {}

  /**
   * Draft a status report from input data.
   *
   * Returns a labeled draft that requires partner review before use.
   * Returns null if the AI candidate feature flag is disabled.
   */
  async draftStatusReport(
    workspaceId: string,
    input: StatusReportInput,
    assignmentId?: string,
  ): Promise<DraftResult | null> {
    // 1. Feature-flag check — silently return null if disabled
    if (
      !(await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
        workspaceId,
      ))
    ) {
      this.logger.debug(
        'AI candidate feature disabled — skipping status report draft',
      );

      return null;
    }

    // 2. Sanitize input through the AI context firewall
    const sanitizedInput = this.sanitizeInput(input);

    // 3. Generate the draft
    const draftContent = this.simulateDraft(sanitizedInput);

    // 4. Compute input hashes for provenance
    const inputHash = this.computeHash(JSON.stringify(input));

    // 5. Create labeled draft through the drafting gate
    return this.draftingGateService.createDraft(draftContent, {
      capability: AiCapability.STATUS_REPORT,
      subject: sanitizedInput.assignmentTitle,
      assignmentId,
      model: StatusReportDraftService.MODEL,
      promptVersion: StatusReportDraftService.PROMPT_VERSION,
      inputRefs: sanitizedInput.recentActivities,
      inputHashes: [inputHash],
      redactionManifest: [],
      guardrailChecks: ['ai_context_firewall_passed'],
      visibility: 'internal_only',
    });
  }

  /**
   * Sanitize input through the AI context firewall.
   */
  private sanitizeInput(input: StatusReportInput): StatusReportInput {
    const fieldTokens = this.extractFieldTokens(input);

    const filtered = this.aiContextFirewallService.filterProhibited(
      fieldTokens,
    );

    const redactedActivities = input.recentActivities.map((act) =>
      this.redactIfProhibited(act, fieldTokens, filtered),
    );

    const redactedUpcoming = input.upcomingActivities.map((act) =>
      this.redactIfProhibited(act, fieldTokens, filtered),
    );

    return {
      ...input,
      recentActivities: redactedActivities,
      upcomingActivities: redactedUpcoming,
    };
  }

  /**
   * Extract field-like tokens for firewall screening.
   */
  private extractFieldTokens(input: StatusReportInput): string[] {
    const tokens: string[] = [];

    for (const act of input.recentActivities) {
      const matches = act.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const act of input.upcomingActivities) {
      const matches = act.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const blocker of input.blockers) {
      const matches = blocker.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    return [...new Set(tokens)];
  }

  /**
   * Redact prohibited fields from a text string.
   */
  private redactIfProhibited(
    text: string,
    allFields: string[],
    allowedFields: string[],
  ): string {
    const prohibited = allFields.filter((f) => !allowedFields.includes(f));

    if (prohibited.length === 0) return text;

    let redacted = text;

    for (const field of prohibited) {
      redacted = redacted.replace(
        new RegExp(`\\b${this.escapeRegExp(field)}\\b`, 'g'),
        '[REDACTED]',
      );
    }

    return redacted;
  }

  /**
   * Compute a SHA-256 hash of the input for provenance.
   */
  private computeHash(text: string): string {
    const crypto = require('crypto');

    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Escape regex special characters.
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Simulate draft generation.
   * In production this would call the AI model with the sanitized context.
   */
  private simulateDraft(input: StatusReportInput): string {
    const milestoneSection = input.milestones
      .map(
        (m) =>
          `- ${m.name} — Status: ${m.status}${m.targetDate ? ` (Target: ${m.targetDate})` : ''}`,
      )
      .join('\n');

    return (
      `Status Report Draft\n` +
      `===================\n\n` +
      `Assignment: ${input.assignmentTitle}\n` +
      `Current Status: ${input.currentStatus}\n` +
      `${input.candidatePipeline ? `Candidate Pipeline: ${input.candidatePipeline}\n` : ''}` +
      `\nMilestones\n` +
      `----------\n` +
      `${milestoneSection || 'No milestones recorded.'}\n\n` +
      `Recent Activities\n` +
      `-----------------\n` +
      `${input.recentActivities.map((a) => `- ${a}`).join('\n') || 'None recorded.'}\n\n` +
      `Upcoming Activities\n` +
      `------------------\n` +
      `${input.upcomingActivities.map((a) => `- ${a}`).join('\n') || 'None planned.'}\n\n` +
      `Blockers / Issues\n` +
      `-----------------\n` +
      `${input.blockers.map((b) => `- ${b}`).join('\n') || 'None identified.'}\n\n` +
      `Note: This is a simulated draft. In production, this content is ` +
      `generated by the AI model from sanitized input data.\n`
    );
  }
}
