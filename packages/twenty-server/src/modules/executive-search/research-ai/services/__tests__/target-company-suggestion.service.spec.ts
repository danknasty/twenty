jest.mock(
  'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run.service',
  () => ({
    AgentRunService: jest.fn(),
  }),
);

import { TargetCompanySuggestionService } from '../target-company-suggestion.service';

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
    svc: new TargetCompanySuggestionService(
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

describe('TargetCompanySuggestionService', () => {
  describe('suggestCompanies', () => {
    it('calls the firewall with allowlisted fields', async () => {
      const { svc, firewallService } = makeService();

      await svc.suggestCompanies('assignment-1', mockWorkspace);

      expect(firewallService.assertAiContextAllowlistSafe).toHaveBeenCalled();
    });

    it('parses valid AI result with suggestions', async () => {
      const { svc } = makeService({
        agentRunResult: {
          suggestions: [
            {
              companyName: 'Acme Corp',
              rationale: 'Industry match',
              confidence: 0.9,
              sourceDataUsed: ['positionSpecification.industry'],
            },
          ],
        },
      });

      const result = await svc.suggestCompanies('assignment-1', mockWorkspace);

      expect(result).toHaveProperty('suggestions');
      if ('suggestions' in result) {
        expect(result.suggestions).toHaveLength(1);
        expect(result.suggestions[0].companyName).toBe('Acme Corp');
        expect(result.suggestions[0].confidence).toBe(0.9);
        expect(result.label).toBe('AI DRAFT — HUMAN REVIEW REQUIRED');
      }
    });

    it('clamps confidence to [0, 1]', async () => {
      const { svc } = makeService({
        agentRunResult: {
          suggestions: [
            { companyName: 'Bad', rationale: '', confidence: 5 },
            { companyName: 'Good', rationale: '', confidence: -1 },
            { companyName: 'Ok', rationale: '', confidence: 0.5 },
          ],
        },
      });

      const result = await svc.suggestCompanies('assignment-1', mockWorkspace);

      if ('suggestions' in result) {
        expect(result.suggestions[0].confidence).toBe(1);
        expect(result.suggestions[1].confidence).toBe(0);
        expect(result.suggestions[2].confidence).toBe(0.5);
      }
    });

    it('records provenance with model ID from agent entity', async () => {
      const { svc, provenanceService } = makeService();

      await svc.suggestCompanies('assignment-1', mockWorkspace);

      expect(provenanceService.recordProvenance).toHaveBeenCalled();
      const buildCall = provenanceService.buildProvenance.mock.calls[0][0];
      expect(buildCall.modelUsed).toBe('gpt-4');
      expect(buildCall.capability).toBe('target_company_suggestion');
    });

    it('throws on failed agent run', async () => {
      const { svc } = makeService({ agentRunSuccess: false });

      await expect(
        svc.suggestCompanies('assignment-1', mockWorkspace),
      ).rejects.toThrow('Target-company suggestion failed');
    });

    it('accepts optional criteria in the prompt', async () => {
      const { svc, agentRunService } = makeService();

      await svc.suggestCompanies('assignment-1', mockWorkspace, {
        industry: 'Healthcare',
        location: 'Boston',
      });

      expect(agentRunService.run).toHaveBeenCalled();
      const promptArg = agentRunService.run.mock.calls[0][0].input.prompt;
      expect(promptArg).toContain('Industry: Healthcare');
      expect(promptArg).toContain('Location: Boston');
    });
  });
});
