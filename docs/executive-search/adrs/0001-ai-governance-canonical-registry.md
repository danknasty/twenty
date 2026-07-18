# ADR-0001: AI Governance Canonical Registry (ACCEPTED)

**Status:** ACCEPTED — Option C (Twenty-canonical-after-migration).
**Date:** 2026-07-15.
**Decided:** 2026-07-18.

## Context

Both Directus and Twenty have AI governance infrastructure. Directus owns: `ai_model_registry`, `prompt_templates`, `assessment_runs`, `assessment_evidence`, `assessment_guardrail_checks`, `ai_request_log`, `audit_runs`, `audit_metrics`, `audit_findings`, and `user_contest_ai_score`. Twenty owns: agent entities, model config, execution records (turns/messages/parts), monitoring/evaluation, chat, and role-scoped agent tools.

Without a canonical decision, both systems could independently label a prompt or model "current," creating contradictory governance states.

## Decision required

Exactly one of:

### Option A — Directus-canonical

Directus governance collections remain canonical. Twenty writes through a governed Directus API.

**Pros:** preserves existing candidate-facing governance (consent, contest); no Directus migration risk.
**Cons:** Twenty AI capabilities depend on Directus availability; latency; tight coupling.
**Security:** Directus access controls remain authoritative.
**Migration cost:** low — Twenty adapts to read/write Directus registry.

### Option B — Shared-service-canonical

A standalone AI governance service becomes canonical; both systems reference it.

**Pros:** clean separation; neither system is a dependency of the other; future-proof.
**Cons:** new infrastructure to build and operate; both systems need adapter work.
**Security:** dedicated governance service with its own access model.
**Migration cost:** high — new service, dual adapters.

### Option C — Twenty-canonical-after-migration

Twenty becomes canonical after explicit migration, with backward-compatible Directus projections.

**Pros:** aligns with Twenty becoming the internal OS; single internal governance surface.
**Cons:** requires migrating Directus governance data; Directus portal must read projections.
**Security:** Twenty permission engine governs all AI access.
**Migration cost:** medium-high — migration with backward compatibility.

## Required evidence before decision

- Current Directus AI governance data volume and usage patterns.
- Candidate consent/contest flow dependency on Directus collections.
- Twenty agent execution volume and model diversity.
- Latency requirements for AI governance lookups.

## Recommendation

Option C accepted (2026-07-18). See Decision section below.

## Decision (2026-07-18)

**Option C — Twenty-canonical-after-migration** selected.

**Rationale:**
- Directus is being migrated away from. Making it canonical for AI governance would create an ongoing dependency on a legacy system, contradicting the migration trajectory.
- Twenty's AI infrastructure (`engine/metadata-modules/ai/`) is already richer than Directus's — agent entities, execution records with full audit trails, per-turn evaluation scoring, model config registry, queue-backed chat, and role-scoped agent tools. Most of what a canonical registry needs already exists.
- Option B (shared service) is overengineered for a two-system landscape where one system is being phased out.
- Option A's coupling cost is ongoing and grows with every AI capability added in later phases. Option C's migration cost is one-time.

**Implementation requirements:**
- Migrate Directus AI governance history into Twenty (`ai_model_registry`, `prompt_templates`, `assessment_runs`, `assessment_evidence`, `assessment_guardrail_checks`, `ai_request_log`, `audit_runs`, `audit_metrics`, `audit_findings`, `user_contest_ai_score`).
- Build backward-compatible read projections for the Directus portal so candidate consent/contest flows remain functional.
- Twenty permission engine governs all AI access.
- Timeline: migration work spans PR35 (migration/backfill phase), with registry declarations in PR30 (AI governance).
