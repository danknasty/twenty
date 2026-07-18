# 12 — Rollout Runbook

## Executive Search OS — Production Go-Live

### Current state (Phase 0–14 merged)

All standard objects through Phase 14 (analytics) are registered in the Twenty metadata system. The D3 AI Authority Checkpoint is passed (ADR-0001 accepted: Twenty-canonical). AI governance registry (PR30) is the next active phase.

### Feature flags

The following remain **default-off** until their specific exit gates complete:

| Feature | Gate | Status |
|---|---|---|
| Directus inbound sync | R2 — Durable read-only bridge | Hold |
| Directus outbound writes | After shadow-sync validation | Hold |
| Client portal access | R8 — Client collaboration alpha | Hold |
| Candidate-affecting AI (review-only) | R11 — Low-risk AI drafting | Hold |
| Automatic client sharing | R8 | Hold |
| Automatic stage changes | Never (policy) | Permanent hold |
| Recording | Consent infrastructure | Hold |
| External enrichment | Governance review | Hold |

### Security checklist

- [ ] Field-level permission audit for all executive search standard objects
- [ ] Client firewall rules verified (commercial-selection-firewall.csv)
- [ ] Off-limits/conflict guards tested in staging
- [ ] Sync bridge: no outbound writes during read-only phase
- [ ] AI governance: prohibited uses blocklist enforced (see 08-ai-governance.md §Prohibited AI uses)
- [ ] Retention/legal-hold propagation verified between Twenty and Directus
- [ ] Candidate consent/contest flows functional on Directus portal projections
- [ ] Secret and credential rotation completed for production

### Performance benchmarks

| Metric | Target | Measured |
|---|---|---|
| Standard object metadata bootstrap | <5s | — |
| Sync event processing latency | <2s p95 | — |
| Search query latency (full-text) | <500ms p95 | — |
| Candidacy pipeline state transitions | <100ms | — |
| AI prompt template resolution | <50ms | — |

### Accessibility compliance

- [ ] WCAG 2.1 AA compliance for all executive search record pages
- [ ] Keyboard navigation for all pipeline and slate views
- [ ] Screen reader labels on all status indicators and stage transition controls
- [ ] Color contrast ratios meet 4.5:1 minimum for text

### Rollout stages

1. **Staging deployment** — Deploy all merged Phase 0–16 PRs to staging
2. **Smoke test** — Verify standard object bootstrap, search, candidacy pipeline
3. **Shadow sync validation** (Phase 17) — Process inbound Directus events read-only; compare projections
4. **Data migration dry run** — Identity matching with human resolution queue
5. **Cut-over stage 1** — Enable read-only Directus sync; external entity links created
6. **Cut-over stage 2** — Enable field ownership cutover (staged, reversible)
7. **Production go-live** — Flip feature flags per gate checklist
8. **Monitor** — 72-hour monitoring period with rollback readiness

### Rollback plan

- Field ownership: revert to previous authority configuration (non-destructive)
- Outbound projections: pause without data loss (outbox queues events)
- Identity links: deactivate without deletion
- No destructive reconciliation runs automatically

### Emergency contacts

*Document per deployment environment.*
