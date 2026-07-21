import { AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';
import { AppAgentStatus } from 'src/modules/executive-search/common/enums/app-agent-status.enum';
import {
  hashString,
  assemblePrompt,
  buildGuardrailResults,
  buildGuardrailChecks,
  buildRedactionManifest,
} from 'src/modules/executive-search/services/ai-drafting.utils';

// ---------------------------------------------------------------------------
// Enum validation
// ---------------------------------------------------------------------------

describe('AppAgentCapability (PR31 drafting capabilities)', () => {
  it('should include all 5 drafting capabilities', () => {
    expect(AppAgentCapability.ASSIGNMENT_INTAKE).toBe('ASSIGNMENT_INTAKE');
    expect(AppAgentCapability.POSITION_SPECIFICATION_DRAFT).toBe(
      'POSITION_SPECIFICATION_DRAFT',
    );
    expect(AppAgentCapability.RESEARCH_STRATEGY_DRAFT).toBe(
      'RESEARCH_STRATEGY_DRAFT',
    );
    expect(AppAgentCapability.STATUS_REPORT_DRAFT).toBe('STATUS_REPORT_DRAFT');
    expect(AppAgentCapability.CANDIDATE_PRESENTATION_DRAFT).toBe(
      'CANDIDATE_PRESENTATION_DRAFT',
    );
  });
});

describe('AppAgentStatus', () => {
  it('should have SHADOW_MODE', () => {
    expect(AppAgentStatus.SHADOW_MODE).toBe('SHADOW_MODE');
  });
});

// ---------------------------------------------------------------------------
// Pure utility functions
// ---------------------------------------------------------------------------

describe('hashString', () => {
  it('should return deterministic output for the same input', () => {
    const a = hashString('hello');
    const b = hashString('hello');

    expect(a).toBe(b);
  });

  it('should return different output for different inputs', () => {
    const a = hashString('hello');
    const b = hashString('world');

    expect(a).not.toBe(b);
  });

  it('should return a string starting with "hash-"', () => {
    const result = hashString('test');

    expect(result).toMatch(/^hash-[0-9a-f]+$/);
  });

  it('should handle empty string', () => {
    const result = hashString('');

    expect(result).toBe('hash-0');
  });
});

describe('assemblePrompt', () => {
  it('should include the template text', () => {
    const result = assemblePrompt('Base template', {});

    expect(result).toContain('Base template');
  });

  it('should include the CONTEXT section with JSON', () => {
    const result = assemblePrompt('Tpl', { key: 'value' });

    expect(result).toContain('--- CONTEXT ---');
    expect(result).toContain('"key"');
    expect(result).toContain('"value"');
  });

  it('should include additional instructions when provided', () => {
    const result = assemblePrompt('Tpl', {}, 'Be concise');

    expect(result).toContain('--- ADDITIONAL INSTRUCTIONS ---');
    expect(result).toContain('Be concise');
  });

  it('should omit additional instructions section when not provided', () => {
    const result = assemblePrompt('Tpl', {});

    expect(result).not.toContain('--- ADDITIONAL INSTRUCTIONS ---');
  });

  it('should include the RESPONSE FORMAT footer', () => {
    const result = assemblePrompt('Tpl', {});

    expect(result).toContain('--- RESPONSE FORMAT ---');
    expect(result).toContain('requires human review');
  });
});

describe('buildRedactionManifest', () => {
  it('should list included fields', () => {
    const result = buildRedactionManifest({ name: 'Alice', email: 'a@b.com' });

    expect(result.fieldsIncluded).toEqual(['name', 'email']);
  });

  it('should mark fieldsRedacted as empty (allowlist pre-filters)', () => {
    const result = buildRedactionManifest({ name: 'Alice' });

    expect(result.fieldsRedacted).toEqual([]);
  });

  it('should declare the redaction policy and timestamp', () => {
    const result = buildRedactionManifest({});

    expect(result.redactionPolicy).toBe('positive-allowlist');
    expect(result.redactedAt).toEqual(expect.any(String));
  });
});

describe('buildGuardrailResults', () => {
  function mockAgent(overrides: Record<string, unknown> = {}) {
    return {
      humanReviewRequired: false,
      approvalRequired: false,
      consentRequired: false,
      killSwitchEnabled: false,
      ...overrides,
    } as any;
  }

  it('should always set aiDraftLabelApplied and noAutoStageChange', () => {
    const result = buildGuardrailResults(mockAgent());

    expect(result.aiDraftLabelApplied).toBe(true);
    expect(result.noAutoStageChange).toBe(true);
  });

  it('should reflect agent gate flags', () => {
    const result = buildGuardrailResults(
      mockAgent({
        humanReviewRequired: true,
        approvalRequired: true,
        consentRequired: true,
        killSwitchEnabled: true,
      }),
    );

    expect(result.humanReviewRequired).toBe(true);
    expect(result.approvalRequired).toBe(true);
    expect(result.consentRequired).toBe(true);
    expect(result.killSwitchEnabled).toBe(true);
  });

  it('should include a checkedAt timestamp', () => {
    const result = buildGuardrailResults(mockAgent());

    expect(result.checkedAt).toEqual(expect.any(String));
  });
});

describe('buildGuardrailChecks', () => {
  function mockAgent(overrides: Record<string, unknown> = {}) {
    return {
      humanReviewRequired: false,
      approvalRequired: false,
      consentRequired: false,
      killSwitchEnabled: false,
      ...overrides,
    } as any;
  }

  it('killSwitchCheck should pass when kill switch is disabled', () => {
    const result = buildGuardrailChecks(
      mockAgent({ killSwitchEnabled: false }),
    );

    expect(result.killSwitchCheck).toEqual({ passed: true });
  });

  it('killSwitchCheck should fail when kill switch is enabled', () => {
    const result = buildGuardrailChecks(
      mockAgent({ killSwitchEnabled: true }),
    );

    expect(result.killSwitchCheck).toEqual({ passed: false });
  });

  it('should mirror agent gate flags in check results', () => {
    const result = buildGuardrailChecks(
      mockAgent({
        humanReviewRequired: true,
        approvalRequired: false,
        consentRequired: true,
      }),
    );

    expect(result.humanReviewGate).toEqual({ required: true });
    expect(result.approvalGate).toEqual({ required: false });
    expect(result.consentGate).toEqual({ required: true });
    expect(result.aiDraftLabel).toEqual({ applied: true });
    expect(result.noAutoStageChange).toEqual({ enforced: true });
  });
});
