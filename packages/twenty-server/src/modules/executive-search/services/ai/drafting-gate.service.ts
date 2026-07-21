import { Injectable, Logger } from '@nestjs/common';

import { AiCapability } from 'src/modules/executive-search/common/enums/ai-capability.enum';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

/**
 * Provenance record for an AI-generated draft. Captures all metadata required
 * by the AI governance §Evidence and provenance policy:
 * - capability, subject, assignment, model, prompt version
 * - input refs/hashes, redaction manifest, guardrail checks
 * - human reviewer, review decision, override, visibility
 */
export type DraftProvenance = {
  /** The AI capability that produced this draft. */
  capability: AiCapability;
  /** Human-readable subject of the draft (e.g. client name, role title). */
  subject: string;
  /** Optional assignment ID this draft belongs to. */
  assignmentId?: string;
  /** AI model identifier used for generation. */
  model: string;
  /** Prompt version string (semver or git-based). */
  promptVersion: string;
  /** References to input records used to generate the draft. */
  inputRefs: string[];
  /** SHA-256 hashes of input data for immutability tracking. */
  inputHashes: string[];
  /** Fields redacted by the AI context firewall. */
  redactionManifest: string[];
  /** Guardrail checks that passed (e.g. "off_limits_clear", "no_pii"). */
  guardrailChecks: string[];
  /** Human reviewer identifier, populated after review. */
  humanReviewer?: string;
  /** Review decision timestamp, populated after review. */
  reviewDecision?: AiDraftStatus;
  /** Optional override rationale if review decision overrides AI output. */
  overrideRationale?: string;
  /** Visibility scope (e.g. "internal_only", "client_facing"). */
  visibility: string;
};

/**
 * Result of a draft submission, including the labeled output and provenance.
 */
export type DraftResult = {
  /** The AI-generated content prefixed with the "AI DRAFT" label. */
  content: string;
  /** Immutable provenance record for audit/governance. */
  provenance: DraftProvenance;
  /** Current status of this draft. */
  status: AiDraftStatus;
};

/**
 * Shared human-review gate for all AI drafting capabilities.
 *
 * Every AI-generated draft must pass through this gate before it can be used.
 * The gate:
 * 1. Labels all AI output as "AI DRAFT — Requires Human Review"
 * 2. Records provenance per §Evidence and provenance policy
 * 3. Tracks draft lifecycle status (pending_review → approved/rejected/superseded)
 * 4. Enforces that stage changes, client presentations, and rejections are
 *    never automatic
 */
@Injectable()
export class DraftingGateService {
  private readonly logger = new Logger(DraftingGateService.name);

  /**
   * Prefix applied to every AI-generated draft.
   */
  static readonly DRAFT_LABEL = 'AI DRAFT — Requires Human Review';

  /**
   * Label the AI output with the draft warning prefix.
   * This is applied before any draft is returned to callers.
   */
  labelDraft(content: string): string {
    const prefix = `[${DraftingGateService.DRAFT_LABEL}]\n\n`;

    return prefix + content;
  }

  /**
   * Create a draft result with provenance metadata.
   * All outputs are automatically labeled and start as PENDING_REVIEW.
   */
  createDraft(
    content: string,
    provenance: Omit<DraftProvenance, 'reviewDecision'>,
  ): DraftResult {
    const labeledContent = this.labelDraft(content);

    const fullProvenance: DraftProvenance = {
      ...provenance,
      reviewDecision: undefined,
    };

    this.logger.debug(
      `Draft created: capability=${provenance.capability}, ` +
        `subject="${provenance.subject}", ` +
        `assignmentId=${provenance.assignmentId ?? 'none'}, ` +
        `model=${provenance.model}`,
    );

    return {
      content: labeledContent,
      provenance: fullProvenance,
      status: AiDraftStatus.PENDING_REVIEW,
    };
  }

  /**
   * Record a human review decision.
   * Only a reviewer can transition from PENDING_REVIEW to APPROVED or REJECTED.
   * A SUPERSEDED status indicates a newer draft replaced this one.
   */
  recordReview(
    draft: DraftResult,
    reviewerId: string,
    decision: AiDraftStatus.APPROVED | AiDraftStatus.REJECTED,
    overrideRationale?: string,
  ): DraftResult {
    if (draft.status !== AiDraftStatus.PENDING_REVIEW) {
      this.logger.warn(
        `Review attempted on draft with status ${draft.status} — only PENDING_REVIEW can be reviewed`,
      );

      return draft;
    }

    const updatedProvenance: DraftProvenance = {
      ...draft.provenance,
      humanReviewer: reviewerId,
      reviewDecision: decision,
      overrideRationale: overrideRationale ?? draft.provenance.overrideRationale,
    };

    this.logger.log(
      `Draft reviewed: capability=${draft.provenance.capability}, ` +
        `subject="${draft.provenance.subject}", ` +
        `decision=${decision}, ` +
        `reviewer=${reviewerId}`,
    );

    return {
      ...draft,
      provenance: updatedProvenance,
      status: decision,
    };
  }

  /**
   * Mark a draft as superseded by a newer version.
   */
  supersede(draft: DraftResult): DraftResult {
    const updatedProvenance: DraftProvenance = {
      ...draft.provenance,
      reviewDecision: AiDraftStatus.SUPERSEDED,
    };

    return {
      ...draft,
      provenance: updatedProvenance,
      status: AiDraftStatus.SUPERSEDED,
    };
  }

  /**
   * Assert that a draft is approved and can be used.
   * Throws if the draft is not in APPROVED status.
   */
  assertApproved(draft: DraftResult): void {
    if (draft.status !== AiDraftStatus.APPROVED) {
      throw new Error(
        `Draft is not approved (status=${draft.status}). ` +
          `Capability: ${draft.provenance.capability}, ` +
          `Subject: "${draft.provenance.subject}". ` +
          'Human review is required before use.',
      );
    }
  }
}
