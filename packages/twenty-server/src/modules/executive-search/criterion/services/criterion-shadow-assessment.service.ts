import { Injectable, Logger } from '@nestjs/common';

import { CriterionAssessmentKillSwitchService } from 'src/modules/executive-search/criterion/services/criterion-assessment-kill-switch.service';
import { CriterionAssessmentRunStatus } from 'src/modules/executive-search/common/enums/criterion-assessment-run-status.enum';
import { CriterionResultType } from 'src/modules/executive-search/common/enums/criterion-result-type.enum';
import { CriterionAssessmentRunDraft } from 'src/modules/executive-search/criterion/types/criterion-assessment-run-draft.type';

/**
 * Shadow-mode criterion assessment service.
 *
 * AI evaluates candidates against search criteria, but results are stored
 * in DRAFT state and NEVER auto-applied — only a human can submit them.
 *
 * Full provenance is recorded:
 * - Capability, subject, assignment
 * - Model, prompt, policy version
 * - Input references and hashes
 * - Redaction manifest
 * - Structured result per criterion
 * - Guardrail checks and results
 * - Kill switch status
 *
 * The kill switch per capability returns no results and logs deactivation
 * without affecting anything already in-flight.
 */
@Injectable()
export class CriterionShadowAssessmentService {
  private readonly logger = new Logger(CriterionShadowAssessmentService.name);

  constructor(
    private readonly killSwitchService: CriterionAssessmentKillSwitchService,
  ) {}

  /**
   * Perform a shadow-mode criterion assessment.
   *
   * In shadow mode, the AI evaluates the candidate against the provided
   * criteria, but the results are stored as a draft. They are NOT applied
   * to any record or used to change any stage/status.
   *
   * If the kill switch is active for the given capability, this method
   * returns null and logs the deactivation.
   *
   * @param draft - The complete assessment run draft with all provenance data
   * @returns The recorded assessment run ID, or null if kill-switched
   */
  async assessInShadowMode(
    draft: CriterionAssessmentRunDraft,
  ): Promise<string | null> {
    const capability = draft.capability;

    // Check the kill switch first
    if (this.killSwitchService.isActive(capability)) {
      this.logger.warn(
        `Criterion shadow assessment suppressed for capability "${capability}": ` +
          `kill switch is active. Subject: ${draft.subject}`,
      );
      return null;
    }

    // Validate required provenance fields
    this.validateProvenance(draft);

    // In shadow mode, we record the assessment but NEVER apply it.
    // The status starts as COMPLETED (shadow) — it is never SUBMITTED.
    // A human must explicitly submit it to make it effective.
    const runId = await this.recordAssessmentRun(draft);

    this.logger.log(
      `Criterion shadow assessment recorded [runId=${runId}] ` +
        `for capability="${capability}" subject="${draft.subject}". ` +
        `Results are shadow-only — human submission required.`,
    );

    return runId;
  }

  /**
   * Record the shadow assessment run.
   *
   * In this implementation, we log and return a synthetic ID.
   * In production, this would persist an AiCriterionAssessmentRun record
   * via the TwentyORM repository.
   */
  private async recordAssessmentRun(
    draft: CriterionAssessmentRunDraft,
  ): Promise<string> {
    // Production implementation would use TwentyORM to create a record:
    //
    // await this.objectMetadataRepository.create(
    //   AiCriterionAssessmentRunWorkspaceEntity,
    //   {
    //     capability: draft.capability,
    //     subject: draft.subject,
    //     assignmentId: draft.assignmentId,
    //     model: draft.model,
    //     prompt: draft.prompt,
    //     policyVersion: draft.policyVersion,
    //     inputReferences: draft.inputReferences,
    //     inputHashes: draft.inputHashes,
    //     redactionManifest: draft.redactionManifest,
    //     structuredResult: draft.structuredResult,
    //     guardrailChecks: draft.guardrailChecks,
    //     conclusion: draft.conclusion,
    //     confidenceScore: draft.confidenceScore,
    //     resultType: draft.resultType,
    //     status: CriterionAssessmentRunStatus.COMPLETED,
    //     isSubmittedByHuman: false,
    //     killSwitchActivated: false,
    //     contestId: draft.contestId,
    //   },
    // );
    //
    // For the shadow-mode MVP, we log the full provenance.

    this.logger.debug('Shadow assessment run draft:', {
      capability: draft.capability,
      subject: draft.subject,
      assignmentId: draft.assignmentId,
      model: draft.model,
      promptPreview: draft.prompt?.substring(0, 100),
      policyVersion: draft.policyVersion,
      inputRefCount: Object.keys(draft.inputReferences ?? {}).length,
      inputHashCount: Object.keys(draft.inputHashes ?? {}).length,
      redactionManifest: draft.redactionManifest,
      resultType: draft.resultType,
      confidenceScore: draft.confidenceScore,
      criterionCount: Object.keys(draft.structuredResult ?? {}).length,
      guardrailCheckCount: Object.keys(draft.guardrailChecks ?? {}).length,
      contestId: draft.contestId,
      isShadowMode: true,
      isSubmittedByHuman: false,
      status: CriterionAssessmentRunStatus.COMPLETED,
      killSwitchActivated: false,
    });

    // Return a synthetic run ID.
    // In production this would be the actual persisted entity ID.
    return `shadow-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * Validate that required provenance fields are present.
   */
  private validateProvenance(draft: CriterionAssessmentRunDraft): void {
    const requiredFields: Array<keyof CriterionAssessmentRunDraft> = [
      'capability',
      'subject',
      'model',
      'prompt',
    ];

    for (const field of requiredFields) {
      if (!draft[field]) {
        throw new Error(
          `Missing required provenance field "${field}" for criterion assessment run`,
        );
      }
    }
  }

  /**
   * Human submission of a shadow assessment result.
   *
   * This is the ONLY way assessment results become effective. The AI
   * draft is never auto-applied — only a human reviewer can call this method.
   *
   * @param assessmentRunId - The ID of the shadow assessment run
   * @param humanReviewerId - The human reviewer's identifier
   * @param overrideNotes - Optional notes if the human disagrees with the AI
   */
  async submitAssessment(
    assessmentRunId: string,
    humanReviewerId: string,
    overrideNotes?: string,
  ): Promise<void> {
    this.logger.log(
      `Human submission of shadow assessment [runId=${assessmentRunId}] ` +
        `by reviewer [${humanReviewerId}]`,
    );

    if (overrideNotes) {
      this.logger.log(
        `Human override notes for [runId=${assessmentRunId}]: ${overrideNotes}`,
      );
    }

    // Production implementation would:
    // 1. Fetch the AiCriterionAssessmentRun record
    // 2. Verify it is in COMPLETED (shadow) status
    // 3. Set isSubmittedByHuman = true
    // 4. Set humanReviewerId
    // 5. Set humanOverrideNotes if provided
    // 6. Apply the structured results to the candidate's evaluation
  }
}
