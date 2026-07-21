/**
 * Independent kill switches for each Research AI capability (Phase 16 / PR32).
 *
 * Per the AI governance document (08-ai-governance.md):
 * "Each AI capability has an independent kill switch. When triggered,
 *  the capability returns no results, logs the deactivation, and does not
 *  affect any in-flight candidacy, stage, or client decision."
 *
 * Kill switches are configured via environment variables. Each follows the
 * pattern: RESEARCH_AI_ENABLE_<CAPABILITY_NAME>.
 * Default: true (capability ON). Set to 'false' to disable.
 */

// ---------------------------------------------------------------------------
// Kill-switch config interface
// ---------------------------------------------------------------------------

export type ResearchAiKillSwitches = {
  /** Natural-language search filter translation */
  nlSearchFilterEnabled: boolean;
  /** Target-company suggestion */
  targetCompanySuggestionEnabled: boolean;
  /** Relationship path suggestion */
  relationshipPathSuggestionEnabled: boolean;
};

// ---------------------------------------------------------------------------
// Environment variable keys
// ---------------------------------------------------------------------------

const ENV_NL_SEARCH_FILTER = 'RESEARCH_AI_ENABLE_NL_SEARCH_FILTER';
const ENV_TARGET_COMPANY_SUGGESTION = 'RESEARCH_AI_ENABLE_TARGET_COMPANY_SUGGESTION';
const ENV_RELATIONSHIP_PATH_SUGGESTION = 'RESEARCH_AI_ENABLE_RELATIONSHIP_PATH_SUGGESTION';

// ---------------------------------------------------------------------------
// Default: all capabilities enabled
// ---------------------------------------------------------------------------

const DEFAULT_ENABLED = true;

function envBoolean(key: string, defaultValue: boolean): boolean {
  const raw = process.env[key];

  if (raw === undefined || raw === '') {
    return defaultValue;
  }

  return raw.toLowerCase() === 'true';
}

/**
 * Read-only snapshot of all kill-switch states at boot time.
 * Environment variables are resolved once when the module initialises.
 */
export const RESEARCH_AI_KILL_SWITCHES: ResearchAiKillSwitches = {
  nlSearchFilterEnabled: envBoolean(ENV_NL_SEARCH_FILTER, DEFAULT_ENABLED),
  targetCompanySuggestionEnabled: envBoolean(
    ENV_TARGET_COMPANY_SUGGESTION,
    DEFAULT_ENABLED,
  ),
  relationshipPathSuggestionEnabled: envBoolean(
    ENV_RELATIONSHIP_PATH_SUGGESTION,
    DEFAULT_ENABLED,
  ),
};
