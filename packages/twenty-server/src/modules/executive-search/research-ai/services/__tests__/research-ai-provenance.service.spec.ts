import { ResearchAiProvenanceService } from '../research-ai-provenance.service';
import type { ResearchAiProvenance } from '../../types/research-ai.types';

describe('ResearchAiProvenanceService', () => {
  let service: ResearchAiProvenanceService;
  let logSpy: jest.SpyInstance;

  const makeProvenance = (
    overrides: Partial<ResearchAiProvenance> = {},
  ): ResearchAiProvenance => ({
    capability: 'natural_language_search',
    subject: 'test query',
    assignmentId: 'assignment-1',
    modelUsed: 'gpt-4',
    promptVersion: '1.0.0',
    inputReferences: ['query: test query'],
    output: { filters: [], explanation: 'none' },
    guardrailChecks: [
      { guardrailName: 'firewall', passed: true, detail: 'ok' },
    ],
    performedAt: new Date('2026-01-01T00:00:00Z'),
    performedByUserId: 'user-1',
    ...overrides,
  });

  beforeEach(() => {
    service = new ResearchAiProvenanceService();
    logSpy = jest.spyOn((service as any).logger, 'log').mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('recordProvenance', () => {
    it('logs the full provenance payload as structured data', () => {
      const provenance = makeProvenance();

      service.recordProvenance(provenance);

      // First log call should be the structured JSON payload
      const firstCall = logSpy.mock.calls[0][0];
      expect(firstCall).toHaveProperty('message');
      expect(firstCall).toHaveProperty('provenance');
      expect(firstCall.provenance).toEqual(provenance);
    });

    it('logs a human-readable summary line', () => {
      const provenance = makeProvenance();

      service.recordProvenance(provenance);

      // Second log call should be the summary string
      const summaryCall = logSpy.mock.calls[1][0];
      expect(typeof summaryCall).toBe('string');
      expect(summaryCall).toContain('[AI PROVENANCE SUMMARY]');
      expect(summaryCall).toContain('natural_language_search');
      expect(summaryCall).toContain('gpt-4');
    });

    it('includes guardrail pass/fail status in summary', () => {
      const provenance = makeProvenance({
        guardrailChecks: [
          { guardrailName: 'check-1', passed: true, detail: 'ok' },
          { guardrailName: 'check-2', passed: false, detail: 'fail' },
        ],
      });

      service.recordProvenance(provenance);

      const summaryCall = logSpy.mock.calls[1][0];
      expect(summaryCall).toContain('guardrailChecks=2');
      expect(summaryCall).toContain('passed=false');
    });

    it('handles null assignmentId gracefully', () => {
      const provenance = makeProvenance({ assignmentId: null });

      service.recordProvenance(provenance);

      const summaryCall = logSpy.mock.calls[1][0];
      expect(summaryCall).toContain('assignmentId="N/A"');
    });
  });

  describe('buildProvenance', () => {
    it('returns a provenance object with performedAt set', () => {
      const before = new Date();

      const result = service.buildProvenance({
        capability: 'test_capability',
        subject: 'test',
        assignmentId: null,
        modelUsed: 'gpt-4',
        promptVersion: '1.0.0',
        inputReferences: [],
        output: {},
        guardrailChecks: [],
        performedByUserId: null,
      });

      expect(result.capability).toBe('test_capability');
      expect(result.subject).toBe('test');
      expect(result.performedAt).toBeInstanceOf(Date);
      expect(result.performedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
    });

    it('preserves all caller-provided fields', () => {
      const inputReferences = ['ref1', 'ref2'];
      const guardrailChecks = [
        { guardrailName: 'g1', passed: true, detail: 'ok' },
      ];

      const result = service.buildProvenance({
        capability: 'cap',
        subject: 'subj',
        assignmentId: 'assign-1',
        modelUsed: 'claude-3',
        promptVersion: '2.0.0',
        inputReferences,
        output: { key: 'value' },
        guardrailChecks,
        performedByUserId: 'user-2',
      });

      expect(result.inputReferences).toEqual(inputReferences);
      expect(result.guardrailChecks).toEqual(guardrailChecks);
      expect(result.assignmentId).toBe('assign-1');
      expect(result.performedByUserId).toBe('user-2');
    });
  });
});
