# 13 — Performance Benchmarks

## Purpose

Performance benchmarks, service-level objectives (SLOs), and measurement
methodology for the Executive Search Operating System. This document defines the
latency targets for the key read paths (candidacy listing, candidate search,
sync reconciliation), the throughput and end-to-end-latency targets for the sync
subsystem (inbox, outbox, reconciliation), and the baseline SLOs that gate
production go-live for the Phase 18 rollout.

It is the operational companion to:

- `10-test-strategy.md` — *Performance tests* section (the list of operations
  that must be measured at representative scale).
- `12-rollout-runbook.md` — pre-flight and verification checkpoints.
- `sync-runbook.md` — sync flow and failure semantics.
- `event-contracts.md` — the envelope, idempotency, and ordering guarantees the
  throughput targets are measured against.

All targets below are **baseline** targets (see §4). They are the minimum bar a
query or path must clear before it is allowed into production. Tighter targets
may be negotiated per operation as scale grows; the baseline is the regression
floor.

## Scope and key operations

The benchmarks cover the operations called out in the Phase 18 exit gate and the
*Performance tests* list in `10-test-strategy.md`:

| Operation              | Code surface                                                                                                                                                | Path                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Candidacy listing      | `SearchCandidacyWorkspaceEntity` reads, scoped by `searchAssignmentId` / `status`, paged                                                                   | GraphQL list read             |
| Candidate search       | `ResearchCandidateWorkspaceEntity` + `ExecutiveProfileWorkspaceEntity` filtered/sorted reads, commercial-firewall-filtered                                  | GraphQL filtered search       |
| Sync reconciliation    | `ExecutiveSearchReconciliationService.startRun` and registered `ReconciliationEngine.reconcile` (dry-run / read-only)                                       | Reconciliation job            |
| Outbox throughput      | `ExecutiveSearchOutboxService.enqueue` + `ExecutiveSyncProcessOutboxJob` drain on `ExternalSyncOutboxWorkspaceEntity`                                      | Transactional outbox pipeline |
| Inbox processing       | `ExecutiveSearchInboxService` consume + `IdempotencyKeyService` dedup against `ExternalSyncInboxWorkspaceEntity`                                            | Inbound sync pipeline         |
| Sync end-to-end latency| Webhook receipt (`InboundEventLedger`) → Twenty record write → outbound `ExternalSyncOutboxWorkspaceEntity` `SENT`                                           | Inbound → outbound round trip |

## 1. Query latency benchmarks

Targets are measured **server-side**, from the moment the resolver/service
function is entered to the moment the data is materialized (before serialization
to the wire). p50 / p95 / p99 are computed over the timed-iteration sample after
warmup (see §3). `p95` is the enforced baseline gate.

| Operation                              | p50    | p95     | p99     | Notes                                                                                  |
| -------------------------------------- | ------ | ------- | ------- | -------------------------------------------------------------------------------------- |
| Candidacy listing (page of 25)         | < 80 ms  | < 300 ms  | < 600 ms  | Scoped by `searchAssignmentId`; index on `(searchAssignmentId, status, assignedAt)`    |
| Candidate search — single assignment   | < 120 ms | < 400 ms  | < 800 ms  | Filtered/sorted `researchCandidate`; firewall post-filter applied in-process            |
| Candidate search — firm-wide           | < 200 ms | < 500 ms  | < 1000 ms | Cross-assignment fan-out; the **p95 < 500 ms** baseline gate applies here              |
| Sync reconciliation — single object    | < 150 ms | < 500 ms  | < 1200 ms | Read-only `reconcile()` over a bounded record set                                      |
| Sync reconciliation — full sweep       | n/a    | < 2000 ms | < 5000 ms | Batched across objects; not a request-path latency                                      |
| Reconciliation finding materialization | < 50 ms  | < 200 ms  | < 400 ms  | Persisting `ExternalSyncReconciliationWorkspaceEntity.findings`                         |

**Baseline gate (all request-path reads):** `p95 < 500 ms`. Any query exceeding
p95 500 ms blocks the Phase 18 go-live until the plan is improved or the query
is indexed.

### Query-plan budget

In addition to wall-clock targets, every query path must satisfy a query-plan
budget, captured via `EXPLAIN ANALYZE`:

- No request-path query may perform a sequential scan on a row count above the
  representative dataset size (see §3).
- No request-path query may exceed **100 ms** of planning + execution time at the
  database (the remainder of the p95 budget is ORM and firewall post-filter).
- Reconciliation sweeps may sequential-scan but must page; unbounded scans are
  treated as a regression.

## 2. Sync throughput benchmarks

Throughput is measured at steady state with a pre-populated backlog so that the
worker pool is saturated (not inflight-starved). Two metrics are tracked:

| Metric                              | Target                          | How measured                                                                                              |
| ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Outbox sustained throughput         | **> 100 events/sec**            | Drain rate of `ExternalSyncOutboxWorkspaceEntity` rows moving `PENDING → SENT` across the worker pool     |
| Outbox burst enqueue rate           | > 500 events/sec (enqueue only) | `ExecutiveSearchOutboxService.enqueue` calls/sec, dedup path included                                     |
| Inbox sustained processing rate     | > 100 events/sec                | `ExternalSyncInboxWorkspaceEntity` rows consumed/sec after idempotency dedup                              |
| Idempotency-key lookup latency      | p95 < 20 ms                     | Per-event `IdempotencyKeyService` check; hot path on every inbound event                                  |
| Sync end-to-end latency             | **p95 < 30 s, p99 < 60 s**      | Webhook receipt timestamp → matching outbound `ExternalSyncOutboxWorkspaceEntity` row reaches `SENT`       |
| Reconciliation run wall-clock       | < 5 min for full sweep          | Single `startRun` → `COMPLETED` over the representative dataset                                           |
| DLQ / replay correctness            | 100% replayable                 | Not a latency target; every DLQ entry must replay cleanly under load (see `sync-runbook.md`)              |

**Baseline gate:** `outbox throughput > 100 events/sec` and
`sync end-to-end latency p95 < 30 s`. Both must hold simultaneously under the
representative concurrent load defined in §3.

### Throughput is "goodput", not gross throughput

Throughput counts **successfully processed** events only:

- Events that land in the DLQ do not count toward the numerator.
- Duplicate (idempotency-skipped) events do not count toward the numerator but
  *do* count toward the offered load, so they show up as degraded throughput.
- Events that violate the field-ownership guard and are dropped are reported as a
  separate `guard_drop_rate`, not counted as processed.

## 3. Benchmark methodology

### Representative dataset

All latency and throughput numbers are reported against a named fixture set so
they are reproducible. The baseline dataset is:

- **10 workspaces**, **1 firm (client)** of interest per workspace.
- **10 000** `ExecutiveProfileWorkspaceEntity` rows per workspace.
- **50** `SearchAssignmentWorkspaceEntity` rows per workspace.
- **25 000** `SearchCandidacyWorkspaceEntity` rows per workspace (5 assignments ×
  500 candidacies, × the rest spread across firm-wide).
- **100 000** `ExternalSyncOutboxWorkspaceEntity` rows in the backlog for the
  throughput runs (pre-populated `PENDING`).
- **100 000** `ExternalSyncInboxWorkspaceEntity` rows for the inbox run.

Dataset size, the seed script name, and the hardware profile (see §5) are
captured in every recorded result. A result recorded against a different dataset
or hardware profile is **not comparable** to the baseline and must be labeled.

### Measurement protocol

1. **Warmup.** Run `warmupIterations` (default 50) invocations of the operation
   and discard the samples. This primes the TypeORM query plan cache, the
   statement cache, and the OS page cache.
2. **Timed iterations.** Run `iterations` (default 200 for query latency, 1000
   for the throughput ramp) invocations. Record each latency via the Node
   monotonic clock (`perf_hooks.performance.now()`), **not** `Date.now()` and
   **not** the jest-faked timers (see Tooling below).
3. **Percentiles.** Compute p50 / p95 / p99 with the nearest-rank method on the
   sorted sample. Do not average; report the distribution.
4. **Concurrency.** Query-latency benchmarks run single-flight (one in-flight
   request at a time) to isolate query cost. Throughput benchmarks run at the
   representative concurrency (see §5) to measure the saturated drain rate.
5. **Steady state.** Throughput is measured only after the worker pool has been
   saturated for ≥ 30 s; the first 30 s of drain are discarded.

### Tooling

| Layer               | Tool                                                      | Use                                                                                                                                                  |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query latency harness | jest, the `jest.config.mjs` unit config                 | The scaffold at `packages/twenty-server/test/benchmarks/executive-search-benchmarks.spec.ts` runs the latency harness. `jest.config.mjs` picks up `test/benchmarks/*.spec.ts` via the `.*\.spec\.ts$` regex and the `^test/(.*)` module map. |
| Live-DB latency       | jest + `jest-integration.config.ts`                     | Once the latency harness is wired to a live workspace, run it under the integration config (`.integration-spec.ts`) so the global setup/teardown provisions the schema. |
| Load / concurrency    | **k6**                                                    | GraphQL/HTTP-level load for p95-under-load and the throughput ramp. Scripts live under `docs/executive-search/scripts/` and are versioned with the dataset seed. |
| Query plans           | `EXPLAIN (ANALYZE, BUFFERS)` and `pg_stat_statements`   | Captured for every measured query path and attached to the result record. Required evidence for the §4 baseline gate.                                 |
| DB-level counters     | `pg_stat_statements`, outbox/inbox row-state counts     | Cross-check that the application-reported throughput matches actual row-state transitions.                                                            |

### Why `perf_hooks.performance.now()` and not jest timers

The `twenty-server` jest config enables fake timers globally
(`fakeTimers.enableGlobally: true` in `jest.config.mjs`). Fake timers patch
`Date`, `setTimeout`, and the global `performance`, so any timing that goes
through them is meaningless. The harness therefore:

- calls `jest.useRealTimers()` in `beforeAll`, and
- imports the **real** monotonic clock from `node:perf_hooks`
  (`import { performance } from 'node:perf_hooks'`), which is not patched by
  jest's fake timers.

This is enforced by a unit test in the scaffold so a future change to the fake
timer config cannot silently invalidate every recorded number.

## 4. Baseline targets (exit gate)

These are the SLOs the Phase 18 rollout must meet before production go-live.
They are the minimum bar; every measured path must clear all three.

| #   | Target                                   | Threshold               | Enforcement                                                                                       |
| --- | ---------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| B1  | Request-path query latency (p95)         | **< 500 ms**            | `EXPLAIN ANALYZE` plan + jest harness sample; recorded against the §3 dataset                      |
| B2  | Sync end-to-end latency (p95)            | **< 30 s**              | k6 ramp + ledger/outbox timestamp correlation; p99 must also be < 60 s                            |
| B3  | Outbox sustained throughput              | **> 100 events/sec**    | Goodput only (DLQ/duplicate/guard-drop excluded); measured at the §3 concurrency after 30 s warmup |
| B4  | Inbox sustained processing rate          | **> 100 events/sec**    | Goodput only; same protocol as B3                                                                 |
| B5  | Idempotency-key lookup (p95)             | **< 20 ms**             | Per-event hot path; drives B3/B4                                                                  |
| B6  | Reconciliation full-sweep wall-clock     | **< 5 min**             | Single `startRun` → `COMPLETED` over the §3 dataset                                               |

A measured result is `PASS` only if **all** applicable targets in the table are
met for that dataset/hardware profile. A single regression blocks go-live; it is
not averaged away across other passing targets.

### Regression gating

Benchmark results are recorded using the **Phase 0 baseline format** from
`10-test-strategy.md` (UTC timestamp, exact command, duration, exit code,
`PASS`/`FAIL`/`BLOCKED`, failure class, concise summary, transient log file).
For benchmarks the failure class vocabulary is extended with:

- `NONE` — all targets met.
- `REGRESSION` — a target regressed versus the last green baseline at the same
  dataset/hardware profile (even if still inside the absolute threshold, a > 20%
  p95 regression is flagged for review).
- `SCALE` — the dataset/hardware profile changed and the result is not directly
  comparable; recorded but not auto-gated.
- `ENVIRONMENT_DEPENDENCY` — the live DB / k6 harness was unavailable.

A CI job runs the query-latency harness (the unit-config scaffold) on every PR
that touches `src/modules/executive-search/**`. The harness itself is fast (mocked
repositories) and asserts the SLO constants and percentile math; the
live-DB numbers are recorded separately against tagged baselines and are the
source of truth for the B1–B6 gate.

## 5. Recording requirements

Every recorded benchmark result includes:

- **Operation** and **target table row** it maps to (§1 / §2).
- **Dataset**: seed script name + the §3 row counts actually present.
- **Hardware profile**: CPU, RAM, Postgres version, pool size, worker count,
  concurrency.
- **Build**: git SHA and whether optimizations (e.g. clickhouse) were enabled.
- **Samples**: `iterations`, `warmupIterations`, and the raw latency array (or a
  pointer to it) so the distribution can be re-derived.
- **Percentiles**: p50 / p95 / p99 (and min/max/mean for context).
- **Query plan**: `EXPLAIN (ANALYZE, BUFFERS)` output for each query path.
- **Status**: `PASS` / `FAIL` / `BLOCKED` with failure class per §4.

Results are stored alongside the Phase 0 baseline records referenced in
`10-test-strategy.md`; a benchmark `PASS` is a prerequisite for the
Phase 18 verification checkpoint in `12-rollout-runbook.md`.
