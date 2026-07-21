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
 * Input data for drafting a research strategy.
 */
export type ResearchStrategyInput = {
  /** Role title being researched. */
  roleTitle: string;
  /** Target industry or sector. */
  targetIndustry: string;
  /** Target geography for candidate search. */
  targetGeography: string;
  /** Key skills and competencies required. */
  keySkills: string[];
  /** Target companies or organizations to source from. */
  targetCompanies: string[];
  /** Company size or revenue bands to target. */
  companySizeBand?: string;
  /** Additional research parameters or constraints. */
  additionalParameters?: string;
};

/**
 * AI draft of a research strategy.
 *
 * Risk: Low. Requires human approval before use.
 *
 * This service:
 * 1. Sanitizes input through the AI context firewall
 * 2. Validates the AI candidate feature flag
 * 3. Generates a structured research strategy draft
 * 4. Labels all output as "AI DRAFT — Requires Human Review"
 * 5. Records provenance per governance §Evidence and provenance
 */
@Injectable()
export class ResearchStrategyDraftService {
  private readonly logger = new Logger(ResearchStrategyDraftService.name);

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
   * Draft a research strategy from input parameters.
   *
   * Returns a labeled draft that requires human approval before use.
   * Returns null if the AI candidate feature flag is disabled.
   */
  async draftResearchStrategy(
    workspaceId: string,
    input: ResearchStrategyInput,
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
        'AI candidate feature disabled — skipping research strategy draft',
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
      capability: AiCapability.RESEARCH_STRATEGY,
      subject: sanitizedInput.roleTitle,
      assignmentId,
      model: ResearchStrategyDraftService.MODEL,
      promptVersion: ResearchStrategyDraftService.PROMPT_VERSION,
      inputRefs: [
        ...sanitizedInput.targetCompanies,
        sanitizedInput.targetIndustry,
      ],
      inputHashes: [inputHash],
      redactionManifest: [],
      guardrailChecks: ['ai_context_firewall_passed'],
      visibility: 'internal_only',
    });
  }

  /**
   * Sanitize input through the AI context firewall.
   */
  private sanitizeInput(
    input: ResearchStrategyInput,
  ): ResearchStrategyInput {
    const fieldTokens = this.extractFieldTokens(input);

    const filtered = this.aiContextFirewallService.filterProhibited(
      fieldTokens,
    );

    const redactedSkills = input.keySkills.map((skill) =>
      this.redactIfProhibited(skill, fieldTokens, filtered),
    );

    const redactedCompanies = input.targetCompanies.map((company) =>
      this.redactIfProhibited(company, fieldTokens, filtered),
    );

    return {
      ...input,
      keySkills: redactedSkills,
      targetCompanies: redactedCompanies,
    };
  }

  /**
   * Extract field-like tokens for firewall screening.
   */
  private extractFieldTokens(input: ResearchStrategyInput): string[] {
    const tokens: string[] = [];

    for (const skill of input.keySkills) {
      const matches = skill.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

      tokens.push(...matches);
    }

    for (const company of input.targetCompanies) {
      const matches = company.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

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
  private simulateDraft(input: ResearchStrategyInput): string {
    return (
      `Research Strategy Draft\n` +
      `=======================\n\n` +
      `Role Title: ${input.roleTitle}\n` +
      `Target Industry: ${input.targetIndustry}\n` +
      `Target Geography: ${input.targetGeography}\n` +
      `Company Size Band: ${input.companySizeBand ?? 'Not specified'}\n\n` +
      `Key Skills\n` +
      `----------\n` +
      `${input.keySkills.map((s) => `- ${s}`).join('\n')}\n\n` +
      `Target Companies\n` +
      `----------------\n` +
      `${input.targetCompanies.map((c) => `- ${c}`).join('\n')}\n\n` +
      `Sourcing Approach\n` +
      `-----------------\n` +
      `- Direct sourcing from target companies\n` +
      `- Industry network referrals\n` +
      `- Executive search database mining\n` +
      `- Passive candidate outreach via professional networks\n\n` +
      `Note: This is a simulated draft. In production, this content is ` +
      `generated by the AI model from sanitized input data.\n`
    );
  }
}
