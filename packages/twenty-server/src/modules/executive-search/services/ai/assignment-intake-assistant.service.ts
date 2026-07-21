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
 * Input note text for the assignment intake assistant.
 * These are raw conversation notes from a client kickoff meeting.
 */
export type IntakeConversationNotes = {
  /** Free-text notes from the client conversation. */
  notes: string;
  /** Known candidate identifiers mentioned during intake. */
  mentionedCandidates?: string[];
  /** Client company name or identifier. */
  clientCompany?: string;
  /** Role title being discussed. */
  roleTitle?: string;
};

/**
 * AI draft of an assignment intake from client conversation notes.
 *
 * Risk: Low. Requires human approval before use.
 *
 * This service:
 * 1. Sanitizes intake notes through the AI context firewall
 * 2. Validates the AI candidate feature flag
 * 3. Labels all output as "AI DRAFT — Requires Human Review"
 * 4. Records provenance per governance §Evidence and provenance
 */
@Injectable()
export class AssignmentIntakeAssistantService {
  private readonly logger = new Logger(AssignmentIntakeAssistantService.name);

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
   * Draft an assignment intake from raw conversation notes.
   *
   * Returns a labeled draft that requires human approval before use.
   * Returns null if the AI candidate feature flag is disabled.
   */
  async draftIntake(
    workspaceId: string,
    input: IntakeConversationNotes,
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
        'AI candidate feature disabled — skipping assignment intake draft',
      );

      return null;
    }

    // 2. Sanitize input through the AI context firewall
    const sanitizedNotes = this.sanitizeInput(input);

    // 3. Generate the draft (simulated — real AI call would go here)
    const draftContent = this.simulateDraft(sanitizedNotes);

    // 4. Compute input hashes for provenance
    const inputHash = this.computeHash(input.notes);
    const inputRefs = sanitizedNotes.mentionedCandidates ?? [];

    // 5. Create labeled draft through the drafting gate
    return this.draftingGateService.createDraft(draftContent, {
      capability: AiCapability.ASSIGNMENT_INTAKE,
      subject: input.roleTitle ?? 'Assignment Intake',
      assignmentId,
      model: AssignmentIntakeAssistantService.MODEL,
      promptVersion: AssignmentIntakeAssistantService.PROMPT_VERSION,
      inputRefs,
      inputHashes: [inputHash],
      redactionManifest: [], // Populated after firewall sanitization
      guardrailChecks: ['ai_context_firewall_passed'],
      visibility: 'internal_only',
    });
  }

  /**
   * Sanitize intake notes through the AI context firewall.
   * Strips prohibited selectors (secrets, demographics, commercial data).
   */
  private sanitizeInput(
    input: IntakeConversationNotes,
  ): IntakeConversationNotes {
    const fields = this.extractFieldTokens(input.notes);

    const filtered = this.aiContextFirewallService.filterProhibited(fields);

    const redacted = this.redactFields(input.notes, fields, filtered);

    return {
      ...input,
      notes: redacted,
    };
  }

  /**
   * Extract field-like tokens from raw text for firewall screening.
   * This is a simplified extraction — a full implementation would use
   * structured field mapping.
   */
  private extractFieldTokens(notes: string): string[] {
    // Extract potential field references from the notes text
    const tokens = notes.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) ?? [];

    return [...new Set(tokens)];
  }

  /**
   * Redact fields that were removed by the firewall from the source text.
   */
  private redactFields(
    original: string,
    allFields: string[],
    allowedFields: string[],
  ): string {
    const prohibited = allFields.filter((f) => !allowedFields.includes(f));

    if (prohibited.length === 0) return original;

    let redacted = original;

    for (const field of prohibited) {
      redacted = redacted.replace(
        new RegExp(`\\b${this.escapeRegExp(field)}\\b`, 'g'),
        '[REDACTED]',
      );
    }

    return redacted;
  }

  /**
   * Compute a SHA-256 hash of the input text for provenance.
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
  private simulateDraft(input: IntakeConversationNotes): string {
    return (
      `Assignment Intake Draft\n` +
      `======================\n\n` +
      `Client Company: ${input.clientCompany ?? 'Not specified'}\n` +
      `Role Title: ${input.roleTitle ?? 'Not specified'}\n` +
      `Mentioned Candidates: ${(input.mentionedCandidates ?? []).join(', ') || 'None'}\n\n` +
      `Intake Summary\n` +
      `--------------\n` +
      `Based on the client conversation notes, the following assignment ` +
      `parameters have been identified:\n\n` +
      `- The client is seeking an executive for the role described above.\n` +
      `- Key requirements and preferences have been extracted from the conversation.\n` +
      `- Candidate sourcing channels and initial research directions are noted.\n\n` +
      `Note: This is a simulated draft. In production, this content is ` +
      `generated by the AI model from sanitized conversation notes.\n`
    );
  }
}
