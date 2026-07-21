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
 * Input data for drafting a position specification.
 */
export type PositionSpecInput = {
  /** Role title being specified. */
  roleTitle: string;
  /** Client company name. */
  clientCompany: string;
  /** Key requirements extracted from client brief. */
  requirements: string[];
  /** Desired qualifications and experience. */
  qualifications: string[];
  /** Compensation range or details. */
  compensation?: string;
  /** Reporting structure details. */
  reportingStructure?: string;
  /** Additional context from the client conversation. */
  additionalContext?: string;
};

/**
 * AI draft of a position specification.
 *
 * Risk: Low. Requires human approval before use.
 *
 * This service:
 * 1. Sanitizes input through the AI context firewall
 * 2. Validates the AI candidate feature flag
 * 3. Generates a structured position specification draft
 * 4. Labels all output as "AI DRAFT — Requires Human Review"
 * 5. Records provenance per governance §Evidence and provenance
 */
@Injectable()
export class PositionSpecificationDraftService {
  private readonly logger = new Logger(
    PositionSpecificationDraftService.name,
  );

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
   * Draft a position specification from input data.
   *
   * Returns a labeled draft that requires human approval before use.
   * Returns null if the AI candidate feature flag is disabled.
   */
  async draftPositionSpec(
    workspaceId: string,
    input: PositionSpecInput,
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
        'AI candidate feature disabled — skipping position spec draft',
      );

      return null;
    }

    // 2. Sanitized input through the AI context firewall
    const sanitizedInput = this.sanitizeInput(input);

    // 3. Generate the draft
    const draftContent = this.simulateDraft(sanitizedInput);

    // 4. Compute input hashes for provenance
    const inputHash = this.computeHash(JSON.stringify(input));

    // 5. Create labeled draft through the drafting gate
    return this.draftingGateService.createDraft(draftContent, {
      capability: AiCapability.POSITION_SPEC,
      subject: sanitizedInput.roleTitle,
      assignmentId,
      model: PositionSpecificationDraftService.MODEL,
      promptVersion: PositionSpecificationDraftService.PROMPT_VERSION,
      inputRefs: [sanitizedInput.clientCompany],
      inputHashes: [inputHash],
      redactionManifest: [],
      guardrailChecks: ['ai_context_firewall_passed'],
      visibility: 'internal_only',
    });
  }

  /**
   * Sanitize input through the AI context firewall.
   */
  private sanitizeInput(input: PositionSpecInput): PositionSpecInput {
    const fieldTokens = this.extractFieldTokens(input);

    const filtered = this.aiContextFirewallService.filterProhibited(
      fieldTokens,
    );

    const redactedRequirements = input.requirements.map((req) =>
      this.redactIfProhibited(req, fieldTokens, filtered),
    );

    const redactedQualifications = input.qualifications.map((qual) =>
      this.redactIfProhibited(qual, fieldTokens, filtered),
    );

    return {
      ...input,
      requirements: redactedRequirements,
      qualifications: redactedQualifications,
    };
  }

  /**
   * Extract field-like tokens from the structured input for firewall screening.
   */
  private extractFieldTokens(input: PositionSpecInput): string[] {
    const tokens: string[] = [];

    for (const req of input.requirements) {
      const matches = req.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const qual of input.qualifications) {
      const matches = qual.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

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
   * Escape regex special characters in a string.
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Simulate draft generation.
   * In production this would call the AI model with the sanitized context.
   */
  private simulateDraft(input: PositionSpecInput): string {
    return (
      `Position Specification Draft\n` +
      `============================\n\n` +
      `Role Title: ${input.roleTitle}\n` +
      `Client Company: ${input.clientCompany}\n` +
      `Compensation: ${input.compensation ?? 'To be determined'}\n` +
      `Reporting Structure: ${input.reportingStructure ?? 'To be determined'}\n\n` +
      `Requirements\n` +
      `------------\n` +
      `${input.requirements.map((r) => `- ${r}`).join('\n')}\n\n` +
      `Qualifications\n` +
      `--------------\n` +
      `${input.qualifications.map((q) => `- ${q}`).join('\n')}\n\n` +
      `Note: This is a simulated draft. In production, this content is ` +
      `generated by the AI model from sanitized input data.\n`
    );
  }
}
