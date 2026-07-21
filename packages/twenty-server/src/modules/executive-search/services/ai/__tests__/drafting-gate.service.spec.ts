import { DraftingGateService } from '../drafting-gate.service';
import { AiCapability } from '../../../common/enums/ai-capability.enum';
import { AiDraftStatus } from '../../../common/enums/ai-draft-status.enum';

describe('DraftingGateService', () => {
  let service: DraftingGateService;

  const mockProvenance = {
    capability: AiCapability.ASSIGNMENT_INTAKE,
    subject: 'Test Subject',
    model: 'test-model',
    promptVersion: '1.0.0',
    inputRefs: ['ref-1'],
    inputHashes: ['hash-1'],
    redactionManifest: [],
    guardrailChecks: ['test_check_passed'],
    visibility: 'internal_only',
  };

  beforeEach(() => {
    service = new DraftingGateService();
  });

  describe('labelDraft', () => {
    it('prepends the AI DRAFT label to content', () => {
      const content = 'This is draft content.';
      const labeled = service.labelDraft(content);

      expect(labeled).toContain('AI DRAFT — Requires Human Review');
      expect(labeled).toContain(content);
    });

    it('handles empty content', () => {
      const labeled = service.labelDraft('');

      expect(labeled).toContain('AI DRAFT — Requires Human Review');
    });
  });

  describe('createDraft', () => {
    it('creates a draft with pending_review status', () => {
      const content = 'Test draft content';
      const result = service.createDraft(content, mockProvenance);

      expect(result.content).toContain('AI DRAFT — Requires Human Review');
      expect(result.content).toContain(content);
      expect(result.status).toBe(AiDraftStatus.PENDING_REVIEW);
      expect(result.provenance.capability).toBe(
        AiCapability.ASSIGNMENT_INTAKE,
      );
      expect(result.provenance.subject).toBe('Test Subject');
      expect(result.provenance.reviewDecision).toBeUndefined();
    });

    it('includes all provenance metadata', () => {
      const result = service.createDraft('content', mockProvenance);

      expect(result.provenance.model).toBe('test-model');
      expect(result.provenance.promptVersion).toBe('1.0.0');
      expect(result.provenance.inputRefs).toEqual(['ref-1']);
      expect(result.provenance.inputHashes).toEqual(['hash-1']);
      expect(result.provenance.guardrailChecks).toEqual(['test_check_passed']);
      expect(result.provenance.visibility).toBe('internal_only');
    });

    it('accepts optional assignmentId', () => {
      const result = service.createDraft('content', {
        ...mockProvenance,
        assignmentId: 'assign-123',
      });

      expect(result.provenance.assignmentId).toBe('assign-123');
    });
  });

  describe('recordReview', () => {
    it('approves a pending review draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const reviewed = service.recordReview(
        draft,
        'reviewer-1',
        AiDraftStatus.APPROVED,
      );

      expect(reviewed.status).toBe(AiDraftStatus.APPROVED);
      expect(reviewed.provenance.humanReviewer).toBe('reviewer-1');
      expect(reviewed.provenance.reviewDecision).toBe(AiDraftStatus.APPROVED);
    });

    it('rejects a pending review draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const reviewed = service.recordReview(
        draft,
        'reviewer-1',
        AiDraftStatus.REJECTED,
      );

      expect(reviewed.status).toBe(AiDraftStatus.REJECTED);
      expect(reviewed.provenance.humanReviewer).toBe('reviewer-1');
      expect(reviewed.provenance.reviewDecision).toBe(AiDraftStatus.REJECTED);
    });

    it('accepts optional override rationale on rejection', () => {
      const draft = service.createDraft('content', mockProvenance);
      const reviewed = service.recordReview(
        draft,
        'reviewer-1',
        AiDraftStatus.REJECTED,
        'Missing key requirement details',
      );

      expect(reviewed.provenance.overrideRationale).toBe(
        'Missing key requirement details',
      );
    });

    it('does not review an already-approved draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const approved = service.recordReview(
        draft,
        'r1',
        AiDraftStatus.APPROVED,
      );
      const reReviewed = service.recordReview(
        approved,
        'r2',
        AiDraftStatus.REJECTED,
      );

      // Status should remain APPROVED
      expect(reReviewed.status).toBe(AiDraftStatus.APPROVED);
      expect(reReviewed.provenance.humanReviewer).toBe('r1');
    });
  });

  describe('supersede', () => {
    it('marks a draft as superseded', () => {
      const draft = service.createDraft('content', mockProvenance);
      const superseded = service.supersede(draft);

      expect(superseded.status).toBe(AiDraftStatus.SUPERSEDED);
    });

    it('preserves content and provenance', () => {
      const draft = service.createDraft('Original content', mockProvenance);
      const superseded = service.supersede(draft);

      expect(superseded.content).toBe(draft.content);
      expect(superseded.provenance.capability).toBe(
        mockProvenance.capability,
      );
    });
  });

  describe('assertApproved', () => {
    it('does not throw for an approved draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const approved = service.recordReview(
        draft,
        'r1',
        AiDraftStatus.APPROVED,
      );

      expect(() => service.assertApproved(approved)).not.toThrow();
    });

    it('throws for a pending review draft', () => {
      const draft = service.createDraft('content', mockProvenance);

      expect(() => service.assertApproved(draft)).toThrow(
        'Draft is not approved',
      );
    });

    it('throws for a rejected draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const rejected = service.recordReview(
        draft,
        'r1',
        AiDraftStatus.REJECTED,
      );

      expect(() => service.assertApproved(rejected)).toThrow(
        'Draft is not approved',
      );
    });

    it('throws for a superseded draft', () => {
      const draft = service.createDraft('content', mockProvenance);
      const superseded = service.supersede(draft);

      expect(() => service.assertApproved(superseded)).toThrow(
        'Draft is not approved',
      );
    });
  });
});
