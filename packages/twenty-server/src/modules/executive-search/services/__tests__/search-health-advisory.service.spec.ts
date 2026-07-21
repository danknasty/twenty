import { SearchHealthAdvisoryService } from 'src/modules/executive-search/services/search-health-advisory.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { FeatureFlagKey } from 'twenty-shared/types';

describe('SearchHealthAdvisoryService', () => {
  let service: SearchHealthAdvisoryService;
  let mockFeatureFlagService: { isFeatureEnabled: jest.Mock };

  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    mockFeatureFlagService = { isFeatureEnabled: jest.fn() };
    service = new SearchHealthAdvisoryService(
      mockFeatureFlagService as unknown as FeatureFlagService,
    );
  });

  describe('analyze', () => {
    it('returns empty advisory result when kill switch is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.analyze(workspaceId);

      expect(result.isAdvisory).toBe(true);
      expect(result.findings).toEqual([]);
      expect(result.totalFindings).toBe(0);
      expect(result.summary).toContain('disabled');
      expect(
        mockFeatureFlagService.isFeatureEnabled,
      ).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_BOARD_MATRIX_ENABLED,
        workspaceId,
      );
    });

    it('analyzes stale searches', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['search-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some((f) => f.category === 'STALE_SEARCH')).toBe(
        true,
      );
    });

    it('analyzes bottlenecked stages', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['search-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.some((f) => f.category === 'BOTTLENECKED_STAGE')).toBe(
        true,
      );
    });

    it('analyzes at-risk placements', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        candidacyIds: ['candidacy-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings.some((f) => f.category === 'AT_RISK_PLACEMENT')).toBe(
        true,
      );
    });

    it('analyzes approaching guarantee deadlines', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['search-1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(
        result.findings.some(
          (f) => f.category === 'APPROACHING_GUARANTEE_DEADLINE',
        ),
      ).toBe(true);
    });

    it('analyzes all health dimensions simultaneously', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['search-1', 'search-2'],
        candidacyIds: ['candidacy-1', 'candidacy-2'],
      });

      expect(result.isAdvisory).toBe(true);
      // 2 searches × (stale + bottlenecked + guarantee) + 2 candidacies × at-risk = 8
      expect(result.findings.length).toBe(8);
      expect(result.totalFindings).toBe(8);
      expect(result.summary).toContain('Advisory only');
    });

    it('returns empty findings when no options provided', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId);

      expect(result.isAdvisory).toBe(true);
      expect(result.findings).toEqual([]);
      expect(result.totalFindings).toBe(0);
      expect(result.summary).toContain('no findings');
    });

    it('always marks output as advisory', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['s1'],
        candidacyIds: ['c1'],
      });

      expect(result.isAdvisory).toBe(true);
    });

    it('includes generatedAt timestamp in result', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const before = new Date().toISOString().split('.')[0];
      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['s1'],
      });
      const after = new Date().toISOString().split('.')[0];

      expect(result.generatedAt).toBeDefined();
      expect(
        result.generatedAt >= before ||
          result.generatedAt.startsWith(before),
      ).toBe(true);
    });

    it('includes related entity info in findings', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['test-search-123'],
      });

      const staleFinding = result.findings.find(
        (f) => f.category === 'STALE_SEARCH',
      );
      expect(staleFinding).toBeDefined();
      expect(staleFinding!.relatedEntityId).toBe('test-search-123');
      expect(staleFinding!.relatedEntityType).toBe('searchAssignment');
    });

    it('includes suggested actions in findings', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['s1'],
        candidacyIds: ['c1'],
      });

      result.findings.forEach((finding) => {
        expect(finding.suggestedAction).toBeTruthy();
      });
    });

    it('does not include findings when feature flag is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.analyze(workspaceId, {
        searchAssignmentIds: ['s1'],
        candidacyIds: ['c1'],
      });

      expect(result.isAdvisory).toBe(true);
      expect(result.findings).toEqual([]);
      expect(result.totalFindings).toBe(0);
    });
  });
});
