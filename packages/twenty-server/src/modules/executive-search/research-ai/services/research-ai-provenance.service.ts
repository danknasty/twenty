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
 * This service is a synchronous provenance recorder; future iterations
 * may persist records to a dedicated provenance store.
 */
@Injectable()
export class ResearchAiProvenanceService {
  private readonly logger = new Logger(ResearchAiProvenanceService.name);

  /**
   * Record an evidence/provenance entry for an AI capability execution.
   *
   * Currently logs to the application log. Future iterations will persist
   * to a dedicated provenance table or external store.
   */
  recordProvenance(provenance: ResearchAiProvenance): void {
    this.logger.log(
      `[AI PROVENANCE] capability="${provenance.capability}" ` +
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
