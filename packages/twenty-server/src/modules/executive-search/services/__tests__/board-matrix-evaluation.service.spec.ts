import { BoardMatrixEvaluationService } from 'src/modules/executive-search/services/board-matrix-evaluation.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { FeatureFlagKey } from 'twenty-shared/types';
import { BoardMatrixHumanReviewStatus } from 'src/modules/executive-search/dtos/board-matrix-evaluation.dto';

describe('BoardMatrixEvaluationService', () => {
  let service: BoardMatrixEvaluationService;
  let mockFeatureFlagService: { isFeatureEnabled: jest.Mock };

  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    mockFeatureFlagService = { isFeatureEnabled: jest.fn() };
    service = new BoardMatrixEvaluationService(
      mockFeatureFlagService as unknown as FeatureFlagService,
    );
  });

  describe('evaluate', () => {
    it('returns empty advisory result when kill switch is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.evaluate(workspaceId);

      expect(result.isAdvisory).toBe(true);
      expect(result.findings).toEqual([]);
      expect(result.reviewStatus).toBe(BoardMatrixHumanReviewStatus.PENDING);
      expect(result.summary).toContain('disabled');
      expect(
        mockFeatureFlagService.isFeatureEnabled,
      ).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED,
        workspaceId,
      );
    });

    it('evaluates director independence reviews', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        directorIndependenceReviewIds: ['review-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings[0].category).toBe('DIRECTOR_INDEPENDENCE');
      expect(result.riskLevel).toBe('MEDIUM');
      expect(result.humanReviewRequired).toContain('Yes');
      expect(result.reviewStatus).toBe(BoardMatrixHumanReviewStatus.PENDING);
    });

    it('evaluates board commitment reviews', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        boardCommitmentReviewIds: ['commitment-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings[0].category).toBe('BOARD_COMMITMENT');
    });

    it('evaluates board composition profiles', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        boardCompositionProfileIds: ['profile-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings[0].category).toBe('BOARD_COMPOSITION');
    });

    it('evaluates candidate board matrix evaluations', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        candidateBoardMatrixEvaluationIds: ['eval-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings[0].category).toBe('CANDIDATE_MATRIX');
    });

    it('evaluates all categories simultaneously', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        directorIndependenceReviewIds: ['r1', 'r2'],
        boardCommitmentReviewIds: ['b1'],
        boardCompositionProfileIds: ['p1', 'p2'],
        candidateBoardMatrixEvaluationIds: ['e1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBe(6); // 2 + 1 + 2 + 1
      expect(result.riskLevel).toBe('MEDIUM');
      expect(result.summary).toContain('Advisory only');
    });

    it('returns empty findings when no options provided', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId);

      expect(result.isAdvisory).toBe(true);
      expect(result.findings).toEqual([]);
      expect(result.summary).toContain('no findings');
    });

    it('always marks output as advisory', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.evaluate(workspaceId, {
        directorIndependenceReviewIds: ['r1'],
        boardCommitmentReviewIds: ['b1'],
        boardCompositionProfileIds: ['p1'],
        candidateBoardMatrixEvaluationIds: ['e1'],
      });

      expect(result.isAdvisory).toBe(true);
    });

    it('includes evaluatedAt timestamp in result', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const before = new Date().toISOString().split('.')[0];
      const result = await service.evaluate(workspaceId, {
        directorIndependenceReviewIds: ['r1'],
      });
      const after = new Date().toISOString().split('.')[0];

      expect(result.evaluatedAt).toBeDefined();
      // Should be a valid ISO string between before and after
      expect(result.evaluatedAt >= before || result.evaluatedAt.startsWith(before)).toBe(true);
    });
  });
});
