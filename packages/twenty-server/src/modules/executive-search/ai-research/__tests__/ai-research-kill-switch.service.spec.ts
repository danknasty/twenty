import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiResearchKillSwitchService } from 'src/modules/executive-search/ai-research/services/ai-research-kill-switch.service';

describe('AiResearchKillSwitchService', () => {
  let service: AiResearchKillSwitchService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;

  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    mockFeatureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    service = new AiResearchKillSwitchService(mockFeatureFlagService);
  });

  describe('isCapabilityEnabled', () => {
    it('returns true when master toggle AND capability toggle are enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true) // Master toggle
        .mockResolvedValueOnce(true); // Capability toggle

      const result = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_NL_SEARCH_FILTERS_ENABLED,
        workspaceId,
      );

      expect(result).toBe(true);
      expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(2);
      expect(
        mockFeatureFlagService.isFeatureEnabled,
      ).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_RESEARCH_ENABLED,
        workspaceId,
      );
      expect(
        mockFeatureFlagService.isFeatureEnabled,
      ).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_NL_SEARCH_FILTERS_ENABLED,
        workspaceId,
      );
    });

    it('returns false when master toggle is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValueOnce(false);

      const result = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_NL_SEARCH_FILTERS_ENABLED,
        workspaceId,
      );

      expect(result).toBe(false);
      expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(1);
    });

    it('returns false when capability toggle is disabled even if master is enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true) // Master toggle
        .mockResolvedValueOnce(false); // Capability toggle

      const result = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_TARGET_COMPANY_SUGGESTIONS_ENABLED,
        workspaceId,
      );

      expect(result).toBe(false);
      expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(2);
    });

    it('works for all three capability flags', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const nlFilters = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_NL_SEARCH_FILTERS_ENABLED,
        workspaceId,
      );
      const targetCompanies = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_TARGET_COMPANY_SUGGESTIONS_ENABLED,
        workspaceId,
      );
      const relationshipPaths = await service.isCapabilityEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_RELATIONSHIP_PATH_SUGGESTIONS_ENABLED,
        workspaceId,
      );

      expect(nlFilters).toBe(true);
      expect(targetCompanies).toBe(true);
      expect(relationshipPaths).toBe(true);
    });
  });
});
