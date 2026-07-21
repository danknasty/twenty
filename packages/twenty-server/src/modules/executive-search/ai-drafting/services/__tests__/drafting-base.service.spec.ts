/**
 * Mock twenty-shared/utils before any imports to fix ESM/CJS resolution
 * in the custom-exception chain.
 */
jest.mock('twenty-shared/utils', () => {
  class MockCustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  }

  return { CustomError: MockCustomError };
});

import { FeatureFlagKey } from 'twenty-shared/types';

import { DraftingBaseService } from 'src/modules/executive-search/ai-drafting/services/drafting-base.service';
import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

/**
 * Concrete test implementation of DraftingBaseService for testing
 * the abstract base class behavior.
 */
class TestDraftingService extends DraftingBaseService {
  protected getDraftType(): DraftType {
    return DraftType.POSITION_SPEC;
  }

  protected getCapabilityKillSwitchKey(): FeatureFlagKey {
    return FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_POSITION_SPEC_ENABLED;
  }

  protected async doDraft(
    _workspaceId: string,
    input: Record<string, unknown>,
  ): Promise<{
    draftContent: string;
    modelId: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    assignmentId: string | null;
    redactedFields?: string[];
  }> {
    return {
      draftContent: `Draft for ${input.testKey ?? 'unknown'}`,
      modelId: 'test-model',
      promptTemplateId: 'test-template',
      promptTemplateVersion: '1.0.0',
      assignmentId: (input.assignmentId as string) ?? null,
    };
  }
}

describe('DraftingBaseService', () => {
  let service: TestDraftingService;
  let mockFeatureFlagService: { isFeatureEnabled: jest.Mock };
  let mockAiContextFirewall: { filterProhibited: jest.Mock };
  let mockDraftProvenance: { computeInputHash: jest.Mock; buildProvenance: jest.Mock };

  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    mockFeatureFlagService = { isFeatureEnabled: jest.fn() };
    mockAiContextFirewall = { filterProhibited: jest.fn() };
    mockDraftProvenance = {
      computeInputHash: jest.fn().mockReturnValue('test-hash'),
      buildProvenance: jest.fn().mockReturnValue({
        capability: 'POSITION_SPEC',
        draftType: DraftType.POSITION_SPEC,
        assignmentId: null,
        modelId: 'test-model',
        promptTemplateId: 'test-template',
        promptTemplateVersion: '1.0.0',
        inputHash: 'test-hash',
        redactionManifest: null,
        generatedAt: new Date().toISOString(),
      }),
    };

    service = new TestDraftingService(
      mockFeatureFlagService as any,
      mockAiContextFirewall as any,
      mockDraftProvenance as any,
    );
  });

  describe('buildSafeContext', () => {
    it('removes prohibited fields while keeping safe ones', () => {
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys.filter((k) => k !== 'salary'),
      );

      const result = service.buildSafeContext({
        name: 'Test Position',
        salary: '300k',
        location: 'NYC',
      });

      expect(result).toEqual({ name: 'Test Position', location: 'NYC' });
      expect(result).not.toHaveProperty('salary');
    });

    it('returns empty object when all fields are prohibited', () => {
      mockAiContextFirewall.filterProhibited.mockReturnValue([]);

      const result = service.buildSafeContext({
        salary: '300k',
        ssn: '123-45-6789',
      });

      expect(result).toEqual({});
    });
  });

  describe('draft error handling', () => {
    it('returns SKIPPED with error when doDraft throws', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys,
      );

      jest.spyOn(service as any, 'doDraft').mockRejectedValue(
        new Error('Model API error'),
      );

      const result = await service.draft(workspaceId, {
        testKey: 'value',
      });

      expect(result.status).toBe(DraftStatus.SKIPPED);
      expect(result.error).toContain('Model API error');
      expect(result.isKillSwitched).toBe(false);
    });
  });

  describe('DRAFT_LABEL constant', () => {
    it('returns the correct draft label on success', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys,
      );

      const result = await service.draft(workspaceId, { testKey: 'CEO' });

      expect(result.draftLabel).toBe(
        'AI-generated draft — requires human review before use.',
      );
    });
  });
});
