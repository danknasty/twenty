import { Injectable, Logger } from '@nestjs/common';
import crypto from 'crypto';

import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';
import { AiDraftProvenanceDTO } from 'src/modules/executive-search/ai-drafting/dtos/ai-draft-result.dto';

/**
 * Provenance recording for AI-generated drafts per the AI governance spec.
 *
 * Every candidate-affecting AI output must record:
 * - Capability, subject, assignment
 * - Model, prompt, policy version
 * - Input references and hashes
 * - Redaction manifest (what was removed)
 */
@Injectable()
export class DraftProvenanceService {
  private readonly logger = new Logger(DraftProvenanceService.name);

  /**
   * Compute a deterministic hash of the input data for provenance tracking.
   */
  computeInputHash(input: Record<string, unknown>): string {
    const serialized = JSON.stringify(input, Object.keys(input).sort());

    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Build a provenance record for a draft generation.
   */
  buildProvenance(metadata: {
    draftType: DraftType;
    assignmentId: string | null;
    modelId: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    input: Record<string, unknown>;
    redactionManifest?: string[];
    redactedFields?: string[];
  }): AiDraftProvenanceDTO {
    const inputHash = this.computeInputHash(metadata.input);

    const redactionManifest =
      metadata.redactionManifest?.join(',') ??
      metadata.redactedFields?.join(',') ??
      null;

    return {
      capability: metadata.draftType,
      draftType: metadata.draftType,
      assignmentId: metadata.assignmentId,
      modelId: metadata.modelId,
      promptTemplateId: metadata.promptTemplateId,
      promptTemplateVersion: metadata.promptTemplateVersion,
      inputHash,
      redactionManifest,
      generatedAt: new Date().toISOString(),
    };
  }
}
