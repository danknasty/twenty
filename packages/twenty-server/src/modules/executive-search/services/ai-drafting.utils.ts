import { type AppAgentsWorkspaceEntity } from 'src/modules/executive-search/standard-objects/app-agents.workspace-entity';

/**
 * Simple string hash for audit trail inputHash / responseHash.
 * In production this would use SHA-256.
 */
export function hashString(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);

    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return `hash-${Math.abs(hash).toString(16)}`;
}

/**
 * Assemble the full prompt from template + context + instructions.
 */
export function assemblePrompt(
  templateText: string,
  context: Record<string, unknown>,
  additionalInstructions?: string,
): string {
  let prompt = templateText;

  prompt += `\n\n--- CONTEXT ---\n${JSON.stringify(context, null, 2)}`;

  if (additionalInstructions) {
    prompt += `\n\n--- ADDITIONAL INSTRUCTIONS ---\n${additionalInstructions}`;
  }

  prompt +=
    '\n\n--- RESPONSE FORMAT ---\nReturn your draft as plain text. This is a draft only — it requires human review and approval before use.';

  return prompt;
}

/**
 * Build a redaction manifest describing which fields were included / excluded.
 */
export function buildRedactionManifest(
  context: Record<string, unknown>,
): Record<string, unknown> {
  return {
    fieldsIncluded: Object.keys(context),
    fieldsRedacted: [],
    redactionPolicy: 'positive-allowlist',
    redactedAt: new Date().toISOString(),
  };
}

/**
 * Build the guardrail results payload returned to the client.
 */
export function buildGuardrailResults(
  agent: AppAgentsWorkspaceEntity,
): Record<string, unknown> {
  return {
    checkedAt: new Date().toISOString(),
    aiDraftLabelApplied: true,
    humanReviewRequired: agent.humanReviewRequired,
    approvalRequired: agent.approvalRequired,
    consentRequired: agent.consentRequired,
    killSwitchEnabled: agent.killSwitchEnabled,
    noAutoStageChange: true,
  };
}

/**
 * Build the detailed guardrail check results for the audit log.
 */
export function buildGuardrailChecks(
  agent: AppAgentsWorkspaceEntity,
): Record<string, unknown> {
  return {
    killSwitchCheck: { passed: !agent.killSwitchEnabled },
    humanReviewGate: { required: agent.humanReviewRequired },
    approvalGate: { required: agent.approvalRequired },
    consentGate: { required: agent.consentRequired },
    aiDraftLabel: { applied: true },
    noAutoStageChange: { enforced: true },
  };
}
