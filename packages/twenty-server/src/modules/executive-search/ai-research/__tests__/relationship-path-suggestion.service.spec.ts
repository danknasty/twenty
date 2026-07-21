import { FeatureFlagKey } from 'twenty-shared/types';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { AiResearchKillSwitchService } from 'src/modules/executive-search/ai-research/services/ai-research-kill-switch.service';
import { RelationshipPathSuggestionService } from 'src/modules/executive-search/ai-research/services/relationship-path-suggestion.service';

describe('RelationshipPathSuggestionService', () => {
  let service: RelationshipPathSuggestionService;
  let mockKillSwitchService: jest.Mocked<AiResearchKillSwitchService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  const workspaceId = 'test-workspace-id';
  const assignmentId = 'assignment-1';
  const candidateIds = ['candidate-1', 'candidate-2'];

  beforeEach(() => {
    mockKillSwitchService = {
      isCapabilityEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
    } as any;

    service = new RelationshipPathSuggestionService(
      mockKillSwitchService,
      mockAiContextFirewallService,
    );
  });

  describe('suggestPaths', () => {
    it('returns null when kill switch disables the capability', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(false);

      const result = await service.suggestPaths(
        assignmentId,
        candidateIds,
        workspaceId,
      );

      expect(result).toBeNull();
      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).not.toHaveBeenCalled();
    });

    it('returns a result with paths for each candidate', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.suggestPaths(
        assignmentId,
        candidateIds,
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.assignmentId).toBe(assignmentId);
      expect(result!.candidateIds).toEqual(candidateIds);
      expect(result!.paths).toHaveLength(candidateIds.length);
    });

    it('NEVER sets autoSend to true', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.suggestPaths(
        assignmentId,
        candidateIds,
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.autoSend).toBe(false);
    });

    it('generates path suggestions with steps and narrative', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.suggestPaths(
        assignmentId,
        ['candidate-1'],
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.paths).toHaveLength(1);

      const path = result!.paths[0];
      expect(path.path.length).toBeGreaterThan(0);
      expect(path.narrative).toBeTruthy();
      expect(path.pathStrength).toBeDefined();
      expect(path.confidence).toBeGreaterThanOrEqual(0);
      expect(path.confidence).toBeLessThanOrEqual(1);
    });

    it('returns caveats about not auto-sending outreach', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.suggestPaths(
        assignmentId,
        candidateIds,
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.caveats.length).toBeGreaterThan(0);
    });

    it('validates allowlist against AI context firewall', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      await service.suggestPaths(assignmentId, candidateIds, workspaceId);

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalled();
    });

    it('returns empty paths array when no candidates provided', async () => {
      mockKillSwitchService.isCapabilityEnabled.mockResolvedValue(true);

      const result = await service.suggestPaths(
        assignmentId,
        [],
        workspaceId,
      );

      expect(result).not.toBeNull();
      expect(result!.paths).toHaveLength(0);
    });
  });
});
