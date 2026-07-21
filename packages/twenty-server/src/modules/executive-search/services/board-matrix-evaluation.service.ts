import { createHash } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { BoardCompositionProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/board-composition-profile.workspace-entity';
import { BoardMatrixCriterionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/board-matrix-criterion.workspace-entity';
import { CandidateBoardMatrixEvaluationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/candidate-board-matrix-evaluation.workspace-entity';
import { DirectorIndependenceReviewWorkspaceEntity } from 'src/modules/executive-search/standard-objects/director-independence-review.workspace-entity';
import { BoardCommitmentReviewWorkspaceEntity } from 'src/modules/executive-search/standard-objects/board-commitment-review.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import {
  type BoardMatrixEvaluationResultDTO,
  type BoardMatrixCriterionResultDTO,
} from 'src/modules/executive-search/dtos/evaluate-board-matrix.dto';

const ADVISORY_PREAMBLE =
  'Board matrix evaluator — advisory only. Human reviewer must approve all outputs.';

// TODO(PR30): Integrate with aiModelRegistry, aiProviderCallLog, and appAgents
// once the AI Governance Registry (PR #40) lands on main.
// - Use aiProviderCallLog to record inputHash, guardrailChecks, inputRedactionManifest per run.
// - Use appAgents to enforce humanReviewRequired gate.
// - Use aiModelRegistry to resolve model configuration at runtime.

@Injectable()
export class BoardMatrixEvaluationService {
  private readonly logger = new Logger(BoardMatrixEvaluationService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Evaluate a candidate against all criteria in a board composition profile.
   * Produces CandidateBoardMatrixEvaluation records (one per criterion).
   * All outputs are advisory-only — status defaults to PENDING_HUMAN_REVIEW.
   */
  async evaluateBoardMatrix(
    boardCompositionProfileId: string,
    candidacyId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<BoardMatrixEvaluationResultDTO> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const profileRepo =
          await this.globalWorkspaceOrmManager.getRepository<BoardCompositionProfileWorkspaceEntity>(
            workspaceId,
            BoardCompositionProfileWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const profile = await profileRepo.findOne({
          where: { id: boardCompositionProfileId },
        });

        if (!profile) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            `Board composition profile not found: ${boardCompositionProfileId}`,
          );
        }

        const candidacyRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            workspaceId,
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const candidacy = await candidacyRepo.findOne({
          where: { id: candidacyId },
        });

        if (!candidacy) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NOT_FOUND,
            `Candidacy not found: ${candidacyId}`,
          );
        }

        const criteriaRepo =
          await this.globalWorkspaceOrmManager.getRepository<BoardMatrixCriterionWorkspaceEntity>(
            workspaceId,
            BoardMatrixCriterionWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );
        const criteria = await criteriaRepo.find({
          where: { boardCompositionProfileId },
          order: { weight: 'DESC' as any },
        });

        if (criteria.length === 0) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.VALIDATION_FAILED,
            'No board matrix criteria found for this profile',
          );
        }

        // Compute an input hash for provenance tracking.
        const inputHash = createHash('sha256')
          .update(JSON.stringify({ boardCompositionProfileId, candidacyId }))
          .digest('hex')
          .substring(0, 16);

        const evalRepo =
          await this.globalWorkspaceOrmManager.getRepository<CandidateBoardMatrixEvaluationWorkspaceEntity>(
            workspaceId,
            CandidateBoardMatrixEvaluationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const now = new Date();
        const criteriaResults: BoardMatrixCriterionResultDTO[] = [];

        // Upsert one evaluation record per criterion.
        for (const criterion of criteria) {
          const maxScore = criterion.weight as number;
          const score = null; // Advisory-only — human sets the score.

          const existing = await evalRepo.findOne({
            where: {
              boardMatrixCriterionId: criterion.id,
              searchCandidacyId: candidacyId,
            },
          });

          const record: Partial<CandidateBoardMatrixEvaluationWorkspaceEntity> =
            {
              ...(existing?.id ? { id: existing.id } : {}),
              score,
              maxScore,
              notes: existing?.notes ?? null,
              boardMatrixCriterionId: criterion.id,
              searchCandidacyId: candidacyId,
            };

          const saved = await evalRepo.save(record as any);

          criteriaResults.push({
            criterionId: criterion.id,
            criterionName: criterion.name,
            score: saved.score,
            rationale: null,
            evidenceSources: [`inputHash:${inputHash}`],
            guardrailFlags: ['ADVISORY_ONLY'],
          });
        }

        const result: BoardMatrixEvaluationResultDTO = {
          evaluationId: inputHash,
          boardCompositionProfileId,
          candidacyId,
          criteria: criteriaResults,
          overallScore: null,
          summary: null,
          modelId: 'board-matrix-advisory-v1',
          promptVersion: ADVISORY_PREAMBLE,
          status: 'PENDING_HUMAN_REVIEW',
          humanReviewerId: null,
          humanDecision: null,
          createdAt: now.toISOString(),
        };

        this.logger.log(
          `Board matrix evaluation created for candidacy ${candidacyId} ` +
            `(profile ${boardCompositionProfileId}, ${criteriaResults.length} criteria, hash ${inputHash})`,
        );

        return result;
      },
      authContext,
    );
  }
}
