// Break the CustomError circular-dependency chain by mocking AgentRunService
// before any module that imports it is loaded.
jest.mock(
  'src/engine/metadata-modules/ai/ai-agent-execution/services/agent-run.service',
  () => ({
    AgentRunService: jest.fn(),
  }),
);

import { NlSearchFilterService } from '../nl-search-filter.service';
import type { AiGeneratedFilter } from '../../types/research-ai.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function makeMockAgentRunService(result: object | null = null, success = true) {
  return { run: jest.fn().mockResolvedValue({ result, success, error: null }) };
}

function makeMockFirewallService() {
  return { assertAiContextAllowlistSafe: jest.fn() };
}

function makeMockProvenanceService() {
  return {
    recordProvenance: jest.fn(),
    buildProvenance: jest.fn((overrides: any) => ({
      ...overrides,
      performedAt: new Date(),
    })),
  };
}

function makeMockAgentRepo() {
  return { findOne: jest.fn().mockResolvedValue({ modelId: 'gpt-4' }) };
}

function makeService(overrides: {
  agentRunService?: ReturnType<typeof makeMockAgentRunService>;
  firewallService?: ReturnType<typeof makeMockFirewallService>;
  provenanceService?: ReturnType<typeof makeMockProvenanceService>;
  agentRepo?: ReturnType<typeof makeMockAgentRepo>;
} = {}) {
  return new NlSearchFilterService(
    overrides.agentRunService ?? (makeMockAgentRunService() as any),
    overrides.firewallService ?? (makeMockFirewallService() as any),
    overrides.provenanceService ?? (makeMockProvenanceService() as any),
    overrides.agentRepo ?? (makeMockAgentRepo() as any),
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NlSearchFilterService', () => {
  // ---- Firewall ----
  describe('allowlist firewall', () => {
    it('calls the firewall with the allowlisted fields', async () => {
      const firewall = makeMockFirewallService();
      const agentRun = makeMockAgentRunService({ filters: [] });
      const service = makeService({
        firewallService: firewall,
        agentRunService: agentRun,
      });

      await service.translateQuery('find CTOs', mockWorkspace);

      expect(firewall.assertAiContextAllowlistSafe).toHaveBeenCalled();
      const allowlistArg =
        firewall.assertAiContextAllowlistSafe.mock.calls[0][0];
      expect(allowlistArg).toContain('name');
      expect(allowlistArg).toContain('industry');
    });
  });

  // ---- Agent run errors ----
  describe('agent run failure', () => {
    it('throws when agent run returns success=false', async () => {
      const agentRun = makeMockAgentRunService(null, false);
      const service = makeService({ agentRunService: agentRun });

      await expect(
        service.translateQuery('find CTOs', mockWorkspace),
      ).rejects.toThrow('NL search filter translation failed');
    });
  });

  // ---- Result parsing ----
  describe('parseAgentResult (via translateQuery)', () => {
    it('parses a valid AI result into NlSearchFilterResult', async () => {
      const agentRun = makeMockAgentRunService({
        filters: [
          { fieldName: 'industry', operator: 'eq', value: 'tech' },
          { fieldName: 'title', operator: 'ilike', value: 'CTO' },
        ],
        explanation: 'Filtering by industry and title',
      });
      const service = makeService({ agentRunService: agentRun });

      const result = await service.translateQuery('find tech CTOs', mockWorkspace);

      expect(result).toHaveProperty('filters');
      expect(result).toHaveProperty('explanation');
      if ('filters' in result) {
        expect(result.filters).toHaveLength(2);
        expect(result.filters[0].fieldName).toBe('industry');
        expect(result.filters[1].operator).toBe('ilike');
        expect(result.label).toBe('AI DRAFT — HUMAN REVIEW REQUIRED');
      }
    });

    it('filters out non-allowlisted field names', async () => {
      const agentRun = makeMockAgentRunService({
        filters: [
          { fieldName: 'industry', operator: 'eq', value: 'tech' },
          { fieldName: 'secret_field', operator: 'eq', value: 'secret' },
          { fieldName: 'location', operator: 'eq', value: 'Berlin' },
        ],
        explanation: 'test',
      });
      const logWarn = jest.fn();
      const service = makeService({ agentRunService: agentRun });
      jest.spyOn((service as any).logger, 'warn').mockImplementation(logWarn);

      const result = await service.translateQuery('test', mockWorkspace);

      if ('filters' in result) {
        expect(result.filters).toHaveLength(2);
        expect(
          result.filters.map((f: AiGeneratedFilter) => f.fieldName),
        ).toEqual(['industry', 'location']);
      }
      expect(logWarn).toHaveBeenCalledWith(
        expect.stringContaining('secret_field'),
      );
    });

    it('rejects empty field names', async () => {
      const agentRun = makeMockAgentRunService({
        filters: [
          { fieldName: '', operator: 'eq', value: 'test' },
          { fieldName: 'industry', operator: 'eq', value: 'tech' },
        ],
        explanation: 'test',
      });
      const service = makeService({ agentRunService: agentRun });

      const result = await service.translateQuery('test', mockWorkspace);

      if ('filters' in result) {
        expect(result.filters).toHaveLength(1);
        expect(result.filters[0].fieldName).toBe('industry');
      }
    });

    it('returns empty filters when AI returns non-array', async () => {
      const agentRun = makeMockAgentRunService({
        filters: 'not-an-array',
        explanation: 'test',
      });
      const service = makeService({ agentRunService: agentRun });

      const result = await service.translateQuery('test', mockWorkspace);

      if ('filters' in result) {
        expect(result.filters).toEqual([]);
      }
    });
  });

  // ---- Operator normalization ----
  describe('normalizeOperator', () => {
    it('passes through valid operators', () => {
      const service = makeService();
      const normalize = (service as any).normalizeOperator.bind(service);

      expect(normalize('eq')).toBe('eq');
      expect(normalize('neq')).toBe('neq');
      expect(normalize('gt')).toBe('gt');
      expect(normalize('gte')).toBe('gte');
      expect(normalize('lt')).toBe('lt');
      expect(normalize('lte')).toBe('lte');
      expect(normalize('in')).toBe('in');
      expect(normalize('like')).toBe('like');
      expect(normalize('ilike')).toBe('ilike');
      expect(normalize('startsWith')).toBe('startsWith');
      expect(normalize('is')).toBe('is');
    });

    it('defaults unknown operators (including nin) to eq', () => {
      const service = makeService();
      const normalize = (service as any).normalizeOperator.bind(service);

      expect(normalize('nin')).toBe('eq');
      expect(normalize('endsWith')).toBe('eq');
      expect(normalize('random')).toBe('eq');
    });

    it('logs a warning for unknown operators', () => {
      const logWarn = jest.fn();
      const service = makeService();
      jest.spyOn((service as any).logger, 'warn').mockImplementation(logWarn);
      const normalize = (service as any).normalizeOperator.bind(service);

      normalize('nin');

      expect(logWarn).toHaveBeenCalledWith(expect.stringContaining('"nin"'));
    });
  });

  // ---- buildPrompt ----
  describe('buildPrompt', () => {
    it('includes all allowlisted fields in the prompt', () => {
      const service = makeService();
      const buildPrompt = (service as any).buildPrompt.bind(service);

      const prompt = buildPrompt('find CTOs');

      expect(prompt).toContain('name');
      expect(prompt).toContain('industry');
      expect(prompt).toContain('seniority_level');
    });

    it('includes valid operators only (no nin)', () => {
      const service = makeService();
      const buildPrompt = (service as any).buildPrompt.bind(service);

      const prompt = buildPrompt('find CTOs');

      expect(prompt).toContain('startsWith');
      expect(prompt).toContain(', is');
      expect(prompt).not.toContain('nin');
    });

    it('includes the user query', () => {
      const service = makeService();
      const buildPrompt = (service as any).buildPrompt.bind(service);

      const prompt = buildPrompt('find senior engineers');

      expect(prompt).toContain('find senior engineers');
    });
  });

  // ---- Provenance ----
  describe('provenance recording', () => {
    it('records provenance after a successful run', async () => {
      const provenance = makeMockProvenanceService();
      const agentRun = makeMockAgentRunService({
        filters: [{ fieldName: 'industry', operator: 'eq', value: 'tech' }],
        explanation: 'test',
      });
      const service = makeService({
        agentRunService: agentRun,
        provenanceService: provenance,
      });

      await service.translateQuery('test', mockWorkspace);

      expect(provenance.recordProvenance).toHaveBeenCalledTimes(1);
      expect(provenance.buildProvenance).toHaveBeenCalledTimes(1);
      const buildCall = provenance.buildProvenance.mock.calls[0][0];
      expect(buildCall.capability).toBe('natural_language_search');
      expect(buildCall.modelUsed).toBe('gpt-4');
    });
  });

  // ---- modelUsed comes from agent entity ----
  describe('modelUsed resolution', () => {
    it('uses agent entity modelId for provenance', async () => {
      const agentRepo = makeMockAgentRepo();
      const provenance = makeMockProvenanceService();
      const agentRun = makeMockAgentRunService({
        filters: [],
        explanation: 'test',
      });
      const service = makeService({
        agentRunService: agentRun,
        provenanceService: provenance,
        agentRepo,
      });

      await service.translateQuery('test', mockWorkspace);

      const buildCall = provenance.buildProvenance.mock.calls[0][0];
      expect(buildCall.modelUsed).toBe('gpt-4');
    });

    it('falls back to "unknown" when agent repo lookup fails', async () => {
      const agentRepo = {
        findOne: jest.fn().mockRejectedValue(new Error('DB error')),
      };
      const provenance = makeMockProvenanceService();
      const agentRun = makeMockAgentRunService({
        filters: [],
        explanation: 'test',
      });
      const service = makeService({
        agentRunService: agentRun,
        provenanceService: provenance,
        agentRepo,
      });

      await service.translateQuery('test', mockWorkspace);

      const buildCall = provenance.buildProvenance.mock.calls[0][0];
      expect(buildCall.modelUsed).toBe('unknown');
    });
  });
});
