import { DraftProvenanceService } from '../draft-provenance.service';
import { DraftType } from '../../enums/draft-type.enum';

describe('DraftProvenanceService', () => {
  let service: DraftProvenanceService;

  beforeEach(() => {
    service = new DraftProvenanceService();
  });

  describe('computeInputHash', () => {
    it('returns a deterministic SHA-256 hex hash', () => {
      const input = { name: 'Test', value: 42 };

      const hash1 = service.computeInputHash(input);
      const hash2 = service.computeInputHash(input);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it('produces different hashes for different inputs', () => {
      const hash1 = service.computeInputHash({ a: 1 });
      const hash2 = service.computeInputHash({ a: 2 });

      expect(hash1).not.toBe(hash2);
    });

    it('sorts keys for deterministic hashing regardless of key order', () => {
      const hash1 = service.computeInputHash({ b: 2, a: 1 });
      const hash2 = service.computeInputHash({ a: 1, b: 2 });

      expect(hash1).toBe(hash2);
    });
  });

  describe('buildProvenance', () => {
    it('builds a complete provenance record', () => {
      const provenance = service.buildProvenance({
        draftType: DraftType.POSITION_SPEC,
        assignmentId: 'assign-123',
        modelId: 'gpt-4',
        promptTemplateId: 'template-456',
        promptTemplateVersion: '2.1.0',
        input: { role: 'CEO', company: 'Acme' },
      });

      expect(provenance.capability).toBe('POSITION_SPEC');
      expect(provenance.assignmentId).toBe('assign-123');
      expect(provenance.modelId).toBe('gpt-4');
      expect(provenance.promptTemplateId).toBe('template-456');
      expect(provenance.promptTemplateVersion).toBe('2.1.0');
      expect(provenance.inputHash).toHaveLength(64);
      expect(provenance.generatedAt).toBeTruthy();
      expect(provenance.redactionManifest).toBeNull();
    });

    it('includes redaction manifest when redacted fields are provided', () => {
      const provenance = service.buildProvenance({
        draftType: DraftType.STATUS_REPORT,
        assignmentId: null,
        modelId: 'claude-3',
        promptTemplateId: 'template-789',
        promptTemplateVersion: '1.0.0',
        input: { period: 'Q1' },
        redactedFields: ['salary', 'ssn'],
      });

      expect(provenance.redactionManifest).toContain('salary');
      expect(provenance.redactionManifest).toContain('ssn');
    });

    it('uses redactionManifest when provided as top priority', () => {
      const provenance = service.buildProvenance({
        draftType: DraftType.CANDIDATE_PRESENTATION,
        assignmentId: null,
        modelId: 'gpt-4',
        promptTemplateId: 'template-000',
        promptTemplateVersion: '1.0.0',
        input: {},
        redactionManifest: ['explicit-block'],
        redactedFields: ['fallback-block'],
      });

      expect(provenance.redactionManifest).toBe('explicit-block');
      expect(provenance.redactionManifest).not.toContain('fallback-block');
    });
  });
});
