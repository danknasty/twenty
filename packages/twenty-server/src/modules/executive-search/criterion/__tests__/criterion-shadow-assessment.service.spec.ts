import { CriterionAssessmentKillSwitchService } from 'src/modules/executive-search/criterion/services/criterion-assessment-kill-switch.service';
import { CriterionShadowAssessmentService } from 'src/modules/executive-search/criterion/services/criterion-shadow-assessment.service';
import { CriterionResultType } from 'src/modules/executive-search/common/enums/criterion-result-type.enum';
import { type CriterionAssessmentRunDraft } from 'src/modules/executive-search/criterion/types/criterion-assessment-run-draft.type';

describe('CriterionShadowAssessmentService', () => {
  let killSwitchService: CriterionAssessmentKillSwitchService;
  let service: CriterionShadowAssessmentService;

  const validDraft: CriterionAssessmentRunDraft = {
    capability: 'criterion-assessment',
    subject: 'Jane Smith',
    assignmentId: 'assign-123',
    model: 'gpt-4',
    prompt: 'Evaluate the candidate against the search criteria.',
    policyVersion: '1.0',
    inputReferences: {
      resumeUrl: 'https://example.com/resume.pdf',
      linkedInProfile: 'https://linkedin.com/in/janesmith',
    },
    inputHashes: {
      resumeUrl: 'sha256-abc123',
    },
    redactionManifest: {
      removedFields: ['phoneNumber', 'email'],
    },
    structuredResult: {
      'criterion-1': {
        result: CriterionResultType.SATISFACTORY,
        evidence: 'Candidate has 10+ years of relevant experience.',
        confidence: 0.85,
      },
      'criterion-2': {
        result: CriterionResultType.PARTIAL,
        evidence: 'Candidate has some relevant board experience.',
        confidence: 0.6,
      },
    },
    guardrailChecks: {
      demographicBiasCheck: 'PASSED',
      protectedClassInferenceCheck: 'PASSED',
      overconfidenceCheck: 'PASSED',
    },
    conclusion: 'Strong candidate overall with minor gaps in board experience.',
    confidenceScore: 0.78,
    resultType: CriterionResultType.PARTIAL,
  };

  beforeEach(() => {
    killSwitchService = new CriterionAssessmentKillSwitchService();
    service = new CriterionShadowAssessmentService(killSwitchService);
  });

  afterEach(() => {
    killSwitchService.resetAll();
  });

  describe('assessInShadowMode', () => {
    it('returns a run ID for a valid draft when kill switch is inactive', async () => {
      const runId = await service.assessInShadowMode(validDraft);

      expect(runId).toBeTruthy();
      expect(runId).toMatch(/^shadow-\d+-[a-z0-9]+$/);
    });

    it('returns null when the kill switch is active for the capability', async () => {
      killSwitchService.activate('criterion-assessment');

      const runId = await service.assessInShadowMode(validDraft);

      expect(runId).toBeNull();
    });

    it('still returns a result for other capabilities when one has an active kill switch', async () => {
      killSwitchService.activate('board-matrix-evaluation');

      const runId = await service.assessInShadowMode(validDraft);

      expect(runId).toBeTruthy();
    });

    it('throws when required provenance fields are missing', async () => {
      const invalidDraft = {
        ...validDraft,
        capability: '',
      };

      await expect(
        service.assessInShadowMode(invalidDraft),
      ).rejects.toThrow(
        'Missing required provenance field "capability"',
      );
    });

    it('throws when subject is missing', async () => {
      const invalidDraft = {
        ...validDraft,
        subject: '',
      };

      await expect(
        service.assessInShadowMode(invalidDraft),
      ).rejects.toThrow('Missing required provenance field "subject"');
    });

    it('throws when model is missing', async () => {
      const invalidDraft = {
        ...validDraft,
        model: '',
      };

      await expect(
        service.assessInShadowMode(invalidDraft),
      ).rejects.toThrow('Missing required provenance field "model"');
    });

    it('throws when prompt is missing', async () => {
      const invalidDraft = {
        ...validDraft,
        prompt: '',
      };

      await expect(
        service.assessInShadowMode(invalidDraft),
      ).rejects.toThrow('Missing required provenance field "prompt"');
    });

    it('accepts a draft with minimal required fields', async () => {
      const minimalDraft: CriterionAssessmentRunDraft = {
        capability: 'criterion-assessment',
        subject: 'John Doe',
        model: 'claude-3-opus',
        prompt: 'Evaluate the candidate.',
      };

      const runId = await service.assessInShadowMode(minimalDraft);

      expect(runId).toBeTruthy();
    });

    it('accepts a draft with candidate-contest linkage', async () => {
      const draftWithContest: CriterionAssessmentRunDraft = {
        ...validDraft,
        contestId: 'contest-456',
      };

      const runId = await service.assessInShadowMode(draftWithContest);

      expect(runId).toBeTruthy();
    });
  });

  describe('submitAssessment', () => {
    it('logs submission without throwing', async () => {
      const runId = await service.assessInShadowMode(validDraft);

      await expect(
        service.submitAssessment(runId!, 'human-reviewer-001'),
      ).resolves.toBeUndefined();
    });

    it('accepts override notes', async () => {
      const runId = await service.assessInShadowMode(validDraft);

      await expect(
        service.submitAssessment(
          runId!,
          'human-reviewer-001',
          'Disagree with criterion-2 assessment — candidate has sufficient board experience.',
        ),
      ).resolves.toBeUndefined();
    });
  });
});
