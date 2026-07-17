// commercial-firewall.test.mjs — Node test runner contract tests for the
// Phase 3 commercial selection firewall governance package. Run with: node --test

import { describe, it } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';
import { readCsv, parseCsvLine } from '../scripts/lib/csv.mjs';
import { FIREWALL_CONTEXTS, DENYLIST_RULES } from './constants.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---------------------------------------------------------------------------
// Valid field-or-pattern parsing helpers
// ---------------------------------------------------------------------------

// Valid object name: starts with lowercase letter, contains word chars,
// and may end with a single asterisk wildcard (e.g. linkedin_*).
const OBJECT_NAME_RE = /^[a-z][a-z0-9_]*\*?$/;

// Valid field name: starts with a lowercase letter or asterisk, contains
// word chars, asterisks, or forward slashes (e.g. password/security_fields).
const FIELD_NAME_RE = /^[a-z*][a-z0-9_*\/]*$/;

/**
 * Parse a field_or_pattern value like "executives.subscription_tier"
 * into { objectName, fieldName }. Supports wildcards: "candidate_demographics_voluntary.*",
 * "linkedin_*.profile_engagement_content_activity".
 * Values with a dot produce two parts; values without a dot treat the
 * whole string as an object name and use an empty field name.
 */
export function parseFieldOrPattern(value) {
  const dotIndex = value.indexOf('.');
  if (dotIndex === -1) {
    return { objectName: value, fieldName: '' };
  }
  return {
    objectName: value.substring(0, dotIndex),
    fieldName: value.substring(dotIndex + 1),
  };
}

/**
 * Assert that a field_or_pattern value parses to a valid object name and
 * field name.
 */
export function assertValidFieldOrPattern(value, rowLabel) {
  const { objectName, fieldName } = parseFieldOrPattern(value);
  const label = rowLabel ? ` (${rowLabel})` : '';

  assert.ok(
    OBJECT_NAME_RE.test(objectName),
    `invalid object name "${objectName}" in field_or_pattern "${value}"${label}`,
  );

  if (fieldName) {
    assert.ok(
      FIELD_NAME_RE.test(fieldName),
      `invalid field name "${fieldName}" in field_or_pattern "${value}"${label}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Commercial firewall — registry data contract', () => {
  it('commercial-selection-firewall.csv exists and is non-empty', () => {
    const csvPath = join(ROOT, 'commercial-selection-firewall.csv');
    assert.ok(existsSync(csvPath), 'firewall CSV must exist');
    const { rows } = readCsv(csvPath);
    assert.ok(rows.length > 0, 'firewall CSV must have at least one row');
  });

  it('every firewall row has a valid FirewallContext', () => {
    const csvPath = join(ROOT, 'commercial-selection-firewall.csv');
    const { rows } = readCsv(csvPath);
    assert.ok(rows.length > 0, 'firewall CSV must have at least one row');
    for (const r of rows) {
      assert.ok(
        FIREWALL_CONTEXTS.includes(r.context),
        `invalid context "${r.context}" for prohibited_selector "${r.prohibited_selector}" in firewall CSV`,
      );
    }
  });

  it('every firewall row has at least one row per context', () => {
    const csvPath = join(ROOT, 'commercial-selection-firewall.csv');
    const { rows } = readCsv(csvPath);
    const contextsSeen = new Set(rows.map((r) => r.context));
    for (const ctx of FIREWALL_CONTEXTS) {
      assert.ok(
        contextsSeen.has(ctx),
        `firewall CSV is missing rows for context "${ctx}"`,
      );
    }
  });

  it('firewall CSV row count is approximately 30', () => {
    const csvPath = join(ROOT, 'commercial-selection-firewall.csv');
    const { rows } = readCsv(csvPath);
    assert.strictEqual(rows.length, 30);
  });

  it('firewall CSV has no empty prohibited_selector or context cells', () => {
    const csvPath = join(ROOT, 'commercial-selection-firewall.csv');
    const { rows } = readCsv(csvPath);
    for (const r of rows) {
      assert.ok(
        r.prohibited_selector,
        `firewall row has empty prohibited_selector`,
      );
      assert.ok(r.context, `firewall row has empty context`);
      assert.ok(r.status, `firewall row has empty status`);
    }
  });
});

describe('Candidate-facing denylist — data contract', () => {
  it('candidate-facing-nonreplication-denylist.csv exists and is non-empty', () => {
    const csvPath = join(ROOT, 'candidate-facing-nonreplication-denylist.csv');
    assert.ok(existsSync(csvPath), 'denylist CSV must exist');
    const { rows } = readCsv(csvPath);
    assert.ok(rows.length > 0, 'denylist CSV must have at least one row');
  });

  it('every denylist row has a valid DenylistRule', () => {
    const csvPath = join(ROOT, 'candidate-facing-nonreplication-denylist.csv');
    const { rows } = readCsv(csvPath);
    assert.ok(rows.length > 0, 'denylist CSV must have at least one row');
    for (const r of rows) {
      assert.ok(
        DENYLIST_RULES.includes(r.rule),
        `invalid rule "${r.rule}" for field_or_pattern "${r.field_or_pattern}" in denylist CSV`,
      );
    }
  });

  it('denylist CSV row count is approximately 26', () => {
    const csvPath = join(ROOT, 'candidate-facing-nonreplication-denylist.csv');
    const { rows } = readCsv(csvPath);
    assert.strictEqual(rows.length, 26);
  });
});

describe('Denylist fieldOrPattern value parsing', () => {
  it('every denylist field_or_pattern value parses with valid object name and field name', () => {
    const csvPath = join(ROOT, 'candidate-facing-nonreplication-denylist.csv');
    const { rows } = readCsv(csvPath);
    for (const r of rows) {
      assertValidFieldOrPattern(
        r.field_or_pattern,
        `field_or_pattern = "${r.field_or_pattern}"`,
      );
    }
  });

  it('parseFieldOrPattern correctly splits on first dot', () => {
    const r1 = parseFieldOrPattern('executives.subscription_tier');
    assert.strictEqual(r1.objectName, 'executives');
    assert.strictEqual(r1.fieldName, 'subscription_tier');

    const r2 = parseFieldOrPattern('candidate_demographics_voluntary.*');
    assert.strictEqual(r2.objectName, 'candidate_demographics_voluntary');
    assert.strictEqual(r2.fieldName, '*');

    const r3 = parseFieldOrPattern('linkedin_*.profile_engagement_content_activity');
    assert.strictEqual(r3.objectName, 'linkedin_*');
    assert.strictEqual(r3.fieldName, 'profile_engagement_content_activity');

    const r4 = parseFieldOrPattern('executive_settings.password/security_fields');
    assert.strictEqual(r4.objectName, 'executive_settings');
    assert.strictEqual(r4.fieldName, 'password/security_fields');

    const r5 = parseFieldOrPattern('no_dot_value');
    assert.strictEqual(r5.objectName, 'no_dot_value');
    assert.strictEqual(r5.fieldName, '');
  });

  it('assertValidFieldOrPattern accepts known patterns', () => {
    const known = [
      'executives.subscription_tier',
      'executives.plan_level',
      'executives.is_premium',
      'executives.birthdate',
      'executives.gender',
      'candidate_demographics_voluntary.*',
      'candidate_demographics_justification.*',
      'accommodation_requests.medical_documents',
      'executive_settings.stripe_customer_id',
      'executive_settings.password/security_fields',
      'executive_psychographic.*',
      'magic_auth_challenges.otp_ciphertext_hash',
      'magic_auth_events.*',
      'directus_users.password_hash',
      'executive_settings.product_engagement_metrics',
      'ai_application_analysis.culture_fit_score',
      'ai_application_analysis.success_probability',
      'ai_application_analysis.matching_score',
      'ai_application_analysis.competitive_analysis',
      'executive_opportunity_single_page_analysis.raw_score',
      'profile_analyses.photo_analysis_scores',
      'linkedin_*.profile_engagement_content_activity',
      'learning_path_*.course_completion_quiz_activity',
      'pitch_practice_*.rehearsal_data',
      'social_login_events.*',
      'meilisearch_settings.*',
    ];
    for (const v of known) {
      assertValidFieldOrPattern(v);
    }
  });
});
