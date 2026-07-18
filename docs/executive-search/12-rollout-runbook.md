# 12 — Rollout Runbook

## Purpose

Production go-live runbook for the Executive Search Operating System. Covers feature-flag activation sequence, verification checkpoints, rollback procedures, and monitoring setup.

## Pre-Flight Checklist

Before first feature-flag activation:

- [ ] All 18 phases merged to `main` and deployed to staging
- [ ] Staging environment configured with Directus sandbox
- [ ] HMAC signing keys provisioned for Directus webhook endpoint
- [ ] Database migrations run (`yarn workspace twenty-server database:upgrade`)
- [ ] Snapshot tests pass (`yarn test:snapshot`)
- [ ] Integration test suite green (`yarn workspace twenty-server test:integration`)
- [ ] Seed data verified (feature flags, standard objects, roles)

---

## Activation Sequence

Activate gates in this exact order. Wait for verification at each step before proceeding.

### Gate 1 — Read-Only Sync (Day 0)

| Flag | `IS_EXECUTIVE_SEARCH_SYNC_ENABLED` | `true` |
|---|---|---|
| **Scope** | Directus → Twenty one-way sync (read-only bridge) | |
| **Verification** | External entities appear in Twenty; webhook events process without errors | |
| **Rollback** | Set flag to `false`; no data loss (read-only) | |
| **Monitoring** | Sync latency < 30s; webhook 5xx rate < 1% | |

### Gate 2 — Internal CRM/BD (Day 1)

| Flag | No feature flag — core standard objects are always active |
|---|---|
| **Scope** | All executive-search standard objects available to internal users |
| **Verification** | Firm users can create/edit: client profiles, assignments, candidacies, candidates |
| **Rollback** | Remove standard object registrations (requires migration rollback) |
| **Monitoring** | CRUD operations succeed with < 500ms p95 | 

### Gate 3 — Outbound Publish (Day 2)

| Flag | `IS_EXECUTIVE_SEARCH_DIRECTUS_OUTBOUND_ENABLED` | `true` |
|---|---|---|
| **Scope** | Twenty → Directus outbound publish for candidate-visible projections |
| **Verification** | Candidate profile updates flow from Twenty to Directus within 60s |
| **Rollback** | Set flag to `false`; pending outbox events drained before disable |
| **Monitoring** | Outbox queue depth < 100; publish error rate < 0.5% |

### Gate 4 — Directus Inbound Writes (Day 3)

| Flag | `IS_EXECUTIVE_SEARCH_DIRECTUS_INBOUND_ENABLED` | `true` |
|---|---|---|
| **Scope** | Enable Directus → Twenty writes for candidate portal actions |
| **Verification** | Candidate consent updates, profile edits flow inbound |
| **Rollback** | Set flag to `false`; process pending inbox before disabling |
| **Monitoring** | Inbox processing latency < 10s; DLQ growth rate < 5/min |

### Gate 5 — Client Portal (Day 5)

| Flag | `IS_EXECUTIVE_SEARCH_CLIENT_PORTAL_ENABLED` | `true` |
|---|---|---|
| **Scope** | Client committee members can access shared assignment records |
| **Verification** | Client sees only explicitly shared records; cannot enumerate candidates |
| **Rollback** | Set flag to `false` |
| **Monitoring** | Client-scoped RLS predicates active; audit log of client accesses |

### Gate 6 — AI Candidate-Affecting (Day 7+)

| Flag | `IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED` | `true` |
|---|---|---|
| **Scope** | AI-powered features go live (review-only; no auto-decisions) |
| **Verification** | AI outputs require human approval before client-facing; guardrails active |
| **Rollback** | Set flag to `false` |
| **Pre-requisite** | D3 — AI Authority Checkpoint must have passed |

### Gate 7 — Automatic Features (Week 2+)

Activate only after Gates 1-6 have run stably for at least 48 hours:

| Flag | Scope | Pre-requisite |
|---|---|---|
| `IS_EXECUTIVE_SEARCH_AUTO_CLIENT_SHARING_ENABLED` | Automatic client sharing of records | Manual sharing stable for 48h |
| `IS_EXECUTIVE_SEARCH_AUTO_STAGE_CHANGES_ENABLED` | Automatic candidacy stage transitions | Stage transition audit verified |
| `IS_EXECUTIVE_SEARCH_RECORDING_ENABLED` | Interview recording features | Consent framework verified |
| `IS_EXECUTIVE_SEARCH_EXTERNAL_ENRICHMENT_ENABLED` | External data enrichment | SSRF protections verified |

---

## Rollback Procedures

### Emergency Full Rollback

```bash
# 1. Disable all executive-search feature flags
UPDATE "core"."featureFlag" SET "value" = false 
WHERE "key" LIKE 'IS_EXECUTIVE_SEARCH_%';

# 2. Pause sync workers
# (via process manager or k8s scale-down)

# 3. Drain outbox/inbox queues
# (wait for pending events to process or DLQ)

# 4. Verify no in-flight operations
SELECT COUNT(*) FROM "core"."messageQueue" WHERE "status" = 'active';
```

### Per-Feature Rollback

Set the individual feature flag to `false`. No data migration needed — feature flags gate runtime behavior without schema changes.

---

## Monitoring Checklist

### Alerts to Configure

| Alert | Threshold | Severity |
|---|---|---|
| Sync webhook 5xx rate | > 1% over 5min | P1 |
| Outbox queue depth | > 500 pending | P2 |
| DLQ growth rate | > 10/min | P1 |
| Directus adapter connection failure | Any | P1 |
| Feature flag unexpected disable | Any change | P2 |
| Candidacy stage transition without audit event | Any occurrence | P1 |
| Client-scoped query without RLS predicate | Any occurrence | P0 |

### Dashboards

- **Sync Health**: DLQ depth, inbox/outbox latency, webhook success rate
- **Feature Flag State**: All executive-search flags and their current values
- **Permission Audit**: Query log sampling for field-level permission enforcement

---

## Exit Criteria

All gates must be verified before Phase 18 is considered complete:

- [ ] Gate 1: Read-only sync verified (staging, 24h)
- [ ] Gate 2: Internal CRM/BD verified
- [ ] Gate 3: Outbound publish verified
- [ ] Gate 4: Inbound writes verified
- [ ] Gate 5: Client portal verified (isolation confirmed)
- [ ] Gate 6: AI capabilities verified (human-review gates confirmed)
- [ ] Gate 7: Automatic features verified
- [ ] Security audit: All 15 abuse-case mitigations confirmed
- [ ] Performance: Query p95 < 500ms, sync latency < 30s
- [ ] Accessibility: WCAG 2.1 AA baseline met
- [ ] Documentation: All phase docs consistent and up to date

---

## Feature Flag Reference

| Key | Default | Description |
|---|---|---|
| `IS_EXECUTIVE_SEARCH_SYNC_ENABLED` | `false` | Enables Directus → Twenty sync bridge |
| `IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED` | `false` | Enables Twenty → Directus outbound publish |
| `IS_EXECUTIVE_SEARCH_DIRECTUS_INBOUND_ENABLED` | `false` | Enables Directus → Twenty inbound writes |
| `IS_EXECUTIVE_SEARCH_DIRECTUS_OUTBOUND_ENABLED` | `false` | Enables Twenty → Directus outbound writes |
| `IS_EXECUTIVE_SEARCH_CLIENT_PORTAL_ENABLED` | `false` | Enables client committee member access |
| `IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED` | `false` | Enables AI-powered features (review-only) |
| `IS_EXECUTIVE_SEARCH_AUTO_CLIENT_SHARING_ENABLED` | `false` | Enables automatic client record sharing |
| `IS_EXECUTIVE_SEARCH_AUTO_STAGE_CHANGES_ENABLED` | `false` | Enables automatic candidacy stage transitions |
| `IS_EXECUTIVE_SEARCH_RECORDING_ENABLED` | `false` | Enables interview recording features |
| `IS_EXECUTIVE_SEARCH_EXTERNAL_ENRICHMENT_ENABLED` | `false` | Enables external data enrichment |
