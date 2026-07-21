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

import { CandidatePresentationDraftService } from 'src/modules/executive-search/ai-drafting/services/candidate-presentation-draft.service';
import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

describe('CandidatePresentationDraftService', () => {
  let service: CandidatePresentationDraftService;
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
        capability: 'CANDIDATE_PRESENTATION',
        draftType: DraftType.CANDIDATE_PRESENTATION,
        assignmentId: 'assignment-1',
        modelId: 'test-model',
        promptTemplateId: 'ai-prompt-template-candidate-presentation',
        promptTemplateVersion: '1.0.0',
        inputHash: 'test-hash',
        redactionManifest: null,
        generatedAt: new Date().toISOString(),
      }),
    };

    service = new CandidatePresentationDraftService(
      mockFeatureFlagService as any,
      mockAiContextFirewall as any,
      mockDraftProvenance as any,
    );
  });

  describe('consent gate', () => {
    it('returns SKIPPED when candidateConsented is false', async () => {
      const result = await service.draft(workspaceId, {
        candidacyId: 'cand-123',
        assignmentId: 'assign-456',
        candidateConsented: false,
      });

      expect(result.status).toBe(DraftStatus.SKIPPED);
      expect(result.draftContent).toBeNull();
      expect(result.error).toContain('consent');
    });

    it('returns SKIPPED when candidateConsented is missing', async () => {
      const result = await service.draft(workspaceId, {
        candidacyId: 'cand-123',
        assignmentId: 'assign-456',
      });

      expect(result.status).toBe(DraftStatus.SKIPPED);
      expect(result.error).toContain('consent');
    });

    it('proceeds when candidateConsented is true and flags are enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys,
      );

      const result = await service.draft(workspaceId, {
        candidacyId: 'cand-123',
        assignmentId: 'assign-456',
        candidateConsented: true,
        presentationContext: 'Focus on leadership experience',
      });

      expect(result.status).toBe(DraftStatus.DRAFT);
      expect(result.draftContent).toBeTruthy();
      expect(result.draftContent).toContain('AI-GENERATED DRAFT');
    });

    it('still checks kill switch after consent passes', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draft(workspaceId, {
        candidacyId: 'cand-123',
        assignmentId: 'assign-456',
        candidateConsented: true,
      });

      expect(result.status).toBe(DraftStatus.SKIPPED);
      expect(result.isKillSwitched).toBe(true);
    });
  });

  describe('getCapabilityKillSwitchKey', () => {
    it('returns the correct kill switch key', () => {
      expect(service.getCapabilityKillSwitchKey()).toBe(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_PRESENTATION_ENABLED,
      );
    });
  });
});
