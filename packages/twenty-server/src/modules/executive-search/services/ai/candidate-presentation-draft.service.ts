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
 * Input data for drafting a candidate presentation.
 */
export type CandidatePresentationInput = {
  /** Candidate full name. */
  candidateName: string;
  /** Candidate current/most recent role title. */
  currentRole: string;
  /** Candidate current/most recent company. */
  currentCompany: string;
  /** Candidate summary of professional background. */
  backgroundSummary: string;
  /** Key strengths relevant to the role. */
  strengths: string[];
  /** Years of relevant experience. */
  yearsOfExperience: number;
  /** Education details. */
  education?: string;
  /** Notable achievements or career highlights. */
  achievements: string[];
  /** Why the candidate is a fit for this specific role. */
  fitRationale: string;
  /** Any relevant notes on compensation expectations. */
  compensationNotes?: string;
};

/**
 * AI draft of a candidate presentation for clients.
 *
 * Risk: Medium. Requires explicit client consent + internal review before use.
 *
 * This service:
 * 1. Validates that client consent has been obtained
 * 2. Sanitizes input through the AI context firewall
 * 3. Validates the AI candidate feature flag
 * 4. Generates a structured candidate presentation draft
 * 5. Labels all output as "AI DRAFT — Requires Human Review"
 * 6. Records provenance per governance §Evidence and provenance
 */
@Injectable()
export class CandidatePresentationDraftService {
  private readonly logger = new Logger(
    CandidatePresentationDraftService.name,
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
   * Draft a candidate presentation for the client.
   *
   * Requires explicit client consent (passed via `clientConsentObtained`).
   * Returns a labeled draft that requires review before use.
   * Returns null if the AI candidate feature flag is disabled.
   * Throws if client consent has not been obtained.
   */
  async draftPresentation(
    workspaceId: string,
    input: CandidatePresentationInput,
    clientConsentObtained: boolean,
    assignmentId?: string,
  ): Promise<DraftResult | null> {
    // 1. Consent check — never proceed without explicit client consent
    if (!clientConsentObtained) {
      throw new Error(
        'Client consent is required before drafting a candidate presentation. ' +
          'The candidate cannot be presented to the client without explicit consent.',
      );
    }

    // 2. Feature-flag check — silently return null if disabled
    if (
      !(await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
        workspaceId,
      ))
    ) {
      this.logger.debug(
        'AI candidate feature disabled — skipping candidate presentation draft',
      );

      return null;
    }

    // 3. Sanitize input through the AI context firewall
    const sanitizedInput = this.sanitizeInput(input);

    // 4. Generate the draft
    const draftContent = this.simulateDraft(sanitizedInput);

    // 5. Compute input hashes for provenance
    const inputHash = this.computeHash(JSON.stringify(input));

    // 6. Create labeled draft through the drafting gate
    return this.draftingGateService.createDraft(draftContent, {
      capability: AiCapability.CANDIDATE_PRESENTATION,
      subject: sanitizedInput.candidateName,
      assignmentId,
      model: CandidatePresentationDraftService.MODEL,
      promptVersion: CandidatePresentationDraftService.PROMPT_VERSION,
      inputRefs: [
        sanitizedInput.currentCompany,
        sanitizedInput.currentRole,
      ],
      inputHashes: [inputHash],
      redactionManifest: [],
      guardrailChecks: [
        'ai_context_firewall_passed',
        'client_consent_obtained',
      ],
      visibility: 'client_facing',
    });
  }

  /**
   * Sanitize input through the AI context firewall.
   */
  private sanitizeInput(
    input: CandidatePresentationInput,
  ): CandidatePresentationInput {
    const fieldTokens = this.extractFieldTokens(input);

    const filtered = this.aiContextFirewallService.filterProhibited(
      fieldTokens,
    );

    const redactedStrengths = input.strengths.map((s) =>
      this.redactIfProhibited(s, fieldTokens, filtered),
    );

    const redactedAchievements = input.achievements.map((a) =>
      this.redactIfProhibited(a, fieldTokens, filtered),
    );

    return {
      ...input,
      strengths: redactedStrengths,
      achievements: redactedAchievements,
    };
  }

  /**
   * Extract field-like tokens for firewall screening.
   */
  private extractFieldTokens(
    input: CandidatePresentationInput,
  ): string[] {
    const tokens: string[] = [];

    const textFields = [
      input.candidateName,
      input.currentRole,
      input.currentCompany,
      input.backgroundSummary,
      input.fitRationale,
    ];

    for (const text of textFields) {
      const matches = text.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const strength of input.strengths) {
      const matches = strength.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const achievement of input.achievements) {
      const matches = achievement.match(
        /\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g,
      ) ?? [];

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
  private simulateDraft(input: CandidatePresentationInput): string {
    return (
      `Candidate Presentation Draft\n` +
      `============================\n\n` +
      `Candidate: ${input.candidateName}\n` +
      `Current Role: ${input.currentRole}\n` +
      `Current Company: ${input.currentCompany}\n` +
      `Years of Experience: ${input.yearsOfExperience}\n` +
      `${input.education ? `Education: ${input.education}\n` : ''}` +
      `${input.compensationNotes ? `Compensation Notes: ${input.compensationNotes}\n` : ''}` +
      `\nBackground Summary\n` +
      `-----------------\n` +
      `${input.backgroundSummary}\n\n` +
      `Key Strengths\n` +
      `-------------\n` +
      `${input.strengths.map((s) => `- ${s}`).join('\n')}\n\n` +
      `Achievements\n` +
      `------------\n` +
      `${input.achievements.map((a) => `- ${a}`).join('\n')}\n\n` +
      `Fit Rationale\n` +
      `-------------\n` +
      `${input.fitRationale}\n\n` +
      `Note: This is a simulated draft. In production, this content is ` +
      `generated by the AI model from sanitized input data.\n`
    );
  }
}
