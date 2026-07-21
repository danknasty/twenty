import { Injectable, Logger } from '@nestjs/common';

import type {
  GuardrailCheckRecord,
  ResearchAiProvenance,
} from 'src/modules/executive-search/research-ai/types/research-ai.types';

/**
 * Shared evidence-recording service for all Research AI capabilities.
 *
 * Per the AI governance document (08-ai-governance.md), every
 * candidate-affecting AI output must record:
 *   - Capability, subject, assignment
 *   - Model, prompt, policy version
 *   - Input references and hashes
 *   - Redaction manifest (what was removed)
 *   - Structured result and evidence per criterion
 *   - Guardrail checks and results
 *   - Human reviewer, review decision, override
 *   - Client/candidate visibility
 *   - Contest/appeal linkage
 *
 * This service records the full provenance payload as structured JSON
 * to the application log. Future iterations will persist records to a
 * dedicated provenance standard object (e.g. `researchAiProvenance`)
 * with database-level retention.
 *
 * TODO(PR32): Create a `researchAiProvenance` standard object and
 *             persist each {@link ResearchAiProvenance} record to the
 *             database via a workspace-scoped repository so the full
 *             payload is durable and queryable, not just logged.
 */
@Injectable()
export class ResearchAiProvenanceService {
  private readonly logger = new Logger(ResearchAiProvenanceService.name);

  /**
   * Record an evidence/provenance entry for an AI capability execution.
   *
   * The full provenance payload is logged as structured JSON. A summary
   * log line (one-liner) is also emitted for quick scanning.
   *
   * Future: persist to a {@code researchAiProvenance} standard object.
   */
  recordProvenance(provenance: ResearchAiProvenance): void {
    // Structured JSON log for full payload retention (machine-parseable)
    this.logger.log({
      message: '[AI PROVENANCE] Full payload recorded',
      provenance,
    });

    // Human-readable summary line for quick log scanning
    this.logger.log(
      `[AI PROVENANCE SUMMARY] capability="${provenance.capability}" ` +
        `subject="${provenance.subject}" ` +
        `assignmentId="${provenance.assignmentId ?? 'N/A'}" ` +
        `model="${provenance.modelUsed}" ` +
        `promptVersion="${provenance.promptVersion}" ` +
        `guardrailChecks=${provenance.guardrailChecks.length} ` +
        `passed=${provenance.guardrailChecks.every((c) => c.passed)} ` +
        `performedAt="${provenance.performedAt.toISOString()}"`,
    );
  }

  /**
   * Build a standard provenance payload for a Research AI capability.
   * Callers provide capability-specific fields; shared fields are filled in.
   */
  buildProvenance(overrides: {
    capability: string;
    subject: string;
    assignmentId: string | null;
    modelUsed: string;
    promptVersion: string;
    inputReferences: string[];
    output: object;
    guardrailChecks: GuardrailCheckRecord[];
    performedByUserId: string | null;
  }): ResearchAiProvenance {
    return {
      ...overrides,
      performedAt: new Date(),
    };
  }
}
