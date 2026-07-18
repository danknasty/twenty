import { ModelRegistryStatus } from '../model-registry-status.enum';
import { PromptTemplateStatus } from '../prompt-template-status.enum';
import { ProviderCallStatus } from '../provider-call-status.enum';
import { AppAgentStatus } from '../app-agent-status.enum';
import { AppAgentCapability } from '../app-agent-capability.enum';

describe('AI Governance Enums', () => {
  it('ModelRegistryStatus has expected values', () => {
    expect(Object.values(ModelRegistryStatus)).toEqual([
      'DRAFT',
      'CURRENT',
      'DEPRECATED',
      'RETIRED',
    ]);
    expect(Object.values(ModelRegistryStatus)).toMatchSnapshot();
  });

  it('PromptTemplateStatus has expected values', () => {
    expect(Object.values(PromptTemplateStatus)).toEqual([
      'DRAFT',
      'PUBLISHED',
      'DEPRECATED',
      'ARCHIVED',
    ]);
    expect(Object.values(PromptTemplateStatus)).toMatchSnapshot();
  });

  it('ProviderCallStatus has expected values', () => {
    expect(Object.values(ProviderCallStatus)).toEqual([
      'SUCCESS',
      'ERROR',
      'TIMEOUT',
      'GUARDRAIL_BLOCKED',
      'RATE_LIMITED',
    ]);
    expect(Object.values(ProviderCallStatus)).toMatchSnapshot();
  });

  it('AppAgentStatus has expected values', () => {
    expect(Object.values(AppAgentStatus)).toEqual([
      'ENABLED',
      'DISABLED',
      'SHADOW_MODE',
    ]);
    expect(Object.values(AppAgentStatus)).toMatchSnapshot();
  });

  it('AppAgentCapability has expected values', () => {
    expect(Object.values(AppAgentCapability)).toEqual([
      'ASSIGNMENT_INTAKE',
      'POSITION_SPECIFICATION_DRAFT',
      'RESEARCH_STRATEGY_DRAFT',
      'STATUS_REPORT_DRAFT',
      'CANDIDATE_PRESENTATION_DRAFT',
      'NL_SEARCH_FILTERS',
      'TARGET_COMPANY_SUGGEST',
      'RELATIONSHIP_PATH_SUGGEST',
      'CRITERION_ASSESSMENT_SHADOW',
      'BOARD_MATRIX_EVALUATION',
      'SEARCH_HEALTH_ADVISORY',
    ]);
    expect(Object.values(AppAgentCapability)).toMatchSnapshot();
  });
});
