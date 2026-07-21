import { registerEnumType } from '@nestjs/graphql';

/**
 * Mirrors the governance capability categories from the AI governance spec.
 * Each value corresponds to an AiPromptCategory value and a per-capability
 * kill switch feature flag.
 */
export enum DraftType {
  ASSIGNMENT_INTAKE = 'ASSIGNMENT_INTAKE',
  POSITION_SPEC = 'POSITION_SPEC',
  RESEARCH_STRATEGY = 'RESEARCH_STRATEGY',
  STATUS_REPORT = 'STATUS_REPORT',
  CANDIDATE_PRESENTATION = 'CANDIDATE_PRESENTATION',
}

registerEnumType(DraftType, {
  name: 'DraftType',
  description: 'AI drafting capability type for governance tracking',
});
