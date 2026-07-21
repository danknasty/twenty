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

import { AssignmentIntakeDraftService } from 'src/modules/executive-search/ai-drafting/services/assignment-intake-draft.service';
import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

describe('AssignmentIntakeDraftService', () => {
  let service: AssignmentIntakeDraftService;
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
        capability: 'ASSIGNMENT_INTAKE',
        draftType: DraftType.ASSIGNMENT_INTAKE,
        assignmentId: null,
        modelId: 'test-model',
        promptTemplateId: 'ai-prompt-template-assignment-intake',
        promptTemplateVersion: '1.0.0',
        inputHash: 'test-hash',
        redactionManifest: null,
        generatedAt: new Date().toISOString(),
      }),
    };

    service = new AssignmentIntakeDraftService(
      mockFeatureFlagService as any,
      mockAiContextFirewall as any,
      mockDraftProvenance as any,
    );
  });

  describe('isCapabilityEnabled', () => {
    it('returns false when master drafting switch is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.isCapabilityEnabled(workspaceId);

      expect(result).toBe(false);
      expect(mockFeatureFlagService.isFeatureEnabled).toHaveBeenCalledWith(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_DRAFTING_ENABLED,
        workspaceId,
      );
    });

    it('returns false when master switch on but per-capability switch off', async () => {
      mockFeatureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const result = await service.isCapabilityEnabled(workspaceId);

      expect(result).toBe(false);
    });

    it('returns true when both switches are enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const result = await service.isCapabilityEnabled(workspaceId);

      expect(result).toBe(true);
    });
  });

  describe('draft', () => {
    it('returns SKIPPED when kill switch is active', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draft(workspaceId, {
        conversationNotes: 'Client wants a CEO for a Series B startup',
        opportunityId: 'opp-123',
        clientCompanyId: 'company-456',
      });

      expect(result.status).toBe(DraftStatus.SKIPPED);
      expect(result.isKillSwitched).toBe(true);
      expect(result.draftContent).toBeNull();
    });

    it('returns DRAFT with content when all checks pass', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys,
      );

      const result = await service.draft(workspaceId, {
        conversationNotes: 'Client wants a CEO for a Series B startup',
        opportunityId: 'opp-123',
        clientCompanyId: 'company-456',
      });

      expect(result.status).toBe(DraftStatus.DRAFT);
      expect(result.isKillSwitched).toBe(false);
      expect(result.draftContent).toBeTruthy();
      expect(result.draftContent).toContain('AI-GENERATED DRAFT');
      expect(result.draftLabel).toBeTruthy();
      expect(result.draftType).toBe(DraftType.ASSIGNMENT_INTAKE);
    });

    it('filters prohibited fields through the firewall', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys.filter((k) => k !== 'protectedField'),
      );

      await service.draft(workspaceId, {
        conversationNotes: 'notes',
        clientCompanyId: 'company-456',
        protectedField: 'should-be-removed',
      });

      expect(mockAiContextFirewall.filterProhibited).toHaveBeenCalled();
    });

    it('records provenance on successful draft', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);
      mockAiContextFirewall.filterProhibited.mockImplementation(
        (keys: string[]) => keys,
      );

      const result = await service.draft(workspaceId, {
        conversationNotes: 'notes',
        clientCompanyId: 'company-456',
      });

      expect(result.provenance).not.toBeNull();
      expect(result.provenance!.draftType).toBe(DraftType.ASSIGNMENT_INTAKE);
    });
  });

  describe('getDraftType', () => {
    it('returns ASSIGNMENT_INTAKE', () => {
      expect(service.getDraftType()).toBe(DraftType.ASSIGNMENT_INTAKE);
    });
  });
});
