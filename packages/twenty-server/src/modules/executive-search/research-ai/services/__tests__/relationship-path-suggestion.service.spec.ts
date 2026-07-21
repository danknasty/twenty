jest.mock(
  'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run.service',
  () => ({
    AgentRunService: jest.fn(),
  }),
);

import { RelationshipPathSuggestionService } from '../relationship-path-suggestion.service';

const mockWorkspace = {
  id: 'workspace-1',
  displayName: 'test',
  logo: null,
  inviteHash: null,
  allowImpersonation: false,
  activationStatus: 'ACTIVE',
  workspaceUrls: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  subdomain: 'test',
  isPublicInviteLinkEnabled: false,
  isGoogleAuthEnabled: false,
  isMicrosoftAuthEnabled: false,
  isPasswordAuthEnabled: false,
  totalInvited: 0,
  isDomainAuthEnabled: false,
  permissions: [],
} as any;

function makeService(overrides: {
  agentRunResult?: object | null;
  agentRunSuccess?: boolean;
} = {}) {
  const agentRunService = {
    run: jest.fn().mockResolvedValue({
      result: overrides.agentRunResult ?? { suggestions: [] },
      success: overrides.agentRunSuccess ?? true,
      error: null,
    }),
  };
  const firewallService = { assertAiContextAllowlistSafe: jest.fn() };
  const provenanceService = {
    recordProvenance: jest.fn(),
    buildProvenance: jest.fn((o: any) => ({ ...o, performedAt: new Date() })),
  };
  const agentRepo = {
    findOne: jest.fn().mockResolvedValue({ modelId: 'gpt-4' }),
  };

  return {
    svc: new RelationshipPathSuggestionService(
      agentRunService as any,
      firewallService as any,
      provenanceService as any,
      agentRepo as any,
    ),
    agentRunService,
    provenanceService,
    firewallService,
    agentRepo,
  };
}

describe('RelationshipPathSuggestionService', () => {
  describe('suggestPaths', () => {
    it('calls the firewall with allowlisted fields', async () => {
      const { svc, firewallService } = makeService();

      await svc.suggestPaths('exec-1', 'company-1', mockWorkspace);

      expect(firewallService.assertAiContextAllowlistSafe).toHaveBeenCalled();
    });

    it('parses valid AI result with suggestions', async () => {
      const { svc } = makeService({
        agentRunResult: {
          suggestions: [
            {
              pathDescription: 'Jane served on the same board.',
              confidence: 0.82,
              intermediateConnections: [
                { personName: 'Jane Smith', connectionType: 'BoardService' },
              ],
            },
          ],
        },
      });

      const result = await svc.suggestPaths('exec-1', 'company-1', mockWorkspace);

      expect(result).toHaveProperty('suggestions');
      if ('suggestions' in result) {
        expect(result.suggestions).toHaveLength(1);
        expect(result.suggestions[0].pathDescription).toBe(
          'Jane served on the same board.',
        );
        expect(
          result.suggestions[0].intermediateConnections[0].personName,
        ).toBe('Jane Smith');
        expect(result.label).toBe('AI DRAFT — HUMAN REVIEW REQUIRED');
      }
    });

    it('clamps confidence to [0, 1]', async () => {
      const { svc } = makeService({
        agentRunResult: {
          suggestions: [
            { pathDescription: '', confidence: 2, intermediateConnections: [] },
            { pathDescription: '', confidence: -0.5, intermediateConnections: [] },
          ],
        },
      });

      const result = await svc.suggestPaths('exec-1', 'company-1', mockWorkspace);

      if ('suggestions' in result) {
        expect(result.suggestions[0].confidence).toBe(1);
        expect(result.suggestions[1].confidence).toBe(0);
      }
    });

    it('records provenance with model ID from agent entity', async () => {
      const { svc, provenanceService } = makeService();

      await svc.suggestPaths('exec-1', 'company-1', mockWorkspace);

      expect(provenanceService.recordProvenance).toHaveBeenCalled();
      const buildCall = provenanceService.buildProvenance.mock.calls[0][0];
      expect(buildCall.modelUsed).toBe('gpt-4');
      expect(buildCall.capability).toBe('relationship_path_suggestion');
    });

    it('throws on failed agent run', async () => {
      const { svc } = makeService({ agentRunSuccess: false });

      await expect(
        svc.suggestPaths('exec-1', 'company-1', mockWorkspace),
      ).rejects.toThrow('Relationship path suggestion failed');
    });

    it('includes assignment ID in prompt when provided', async () => {
      const { svc, agentRunService } = makeService();

      await svc.suggestPaths('exec-1', 'company-1', mockWorkspace, 'assignment-42');

      const promptArg = agentRunService.run.mock.calls[0][0].input.prompt;
      expect(promptArg).toContain('Search Assignment ID: assignment-42');
    });
  });
});
