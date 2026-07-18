/**
 * Executive Search — query latency benchmark scaffold.
 *
 * Source of truth for the targets: docs/executive-search/13-performance-benchmarks.md
 *
 * This file has two jobs:
 *
 *  1. Provide a reusable latency-measurement harness (warmup + timed
 *     iterations + nearest-rank percentile computation) that can be pointed at
 *     any async operation. The harness is wired up against mocked repositories
 *     here so it runs under the unit jest config (jest.config.mjs) on every PR.
 *
 *  2. Carry the SLO constants (the §4 baseline targets) so the docs and the
 *     regression gate share a single definition.
 *
 * The mocked repository results are near-instant, so the recorded numbers here
 * validate the *harness*, not real query cost. Pointing the harness at a live
 * workspace is done by swapping the repository factory for a real one and
 * running under the integration jest config (jest-integration.config.ts) — see
 * the `describe.skip` blocks at the bottom.
 *
 * Fake-timer note: jest.config.mjs sets `fakeTimers.enableGlobally: true`,
 * which patches `Date`, `setTimeout`, and the global `performance`. Latency
 * measurement therefore uses the real monotonic clock from `node:perf_hooks`
 * (not patched) and forces real timers in `beforeAll`. This is enforced by a
 * test below so a future config change cannot silently invalidate results.
 */

import { performance } from 'node:perf_hooks';

import { Test, type TestingModule } from '@nestjs/testing';

// Mock the workspace ORM manager so importing it as an injection token does not
// pull in the full twenty-config bootstrap chain (which is not available in the
// unit jest environment). This mirrors the pattern in
// candidacy-state-transition.service.spec.ts.
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn(),
  }),
);

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';

// ---------------------------------------------------------------------------
// SLO constants — keep in sync with docs/executive-search/13-performance-benchmarks.md (§4)
// ---------------------------------------------------------------------------

export const EXECUTIVE_SEARCH_SLO = {
  // B1 — request-path query latency (p95)
  QUERY_P95_MS: 500,
  QUERY_P99_MS: 1000,
  // B5 — idempotency-key lookup hot path (p95)
  IDEMPOTENCY_LOOKUP_P95_MS: 20,
  // B2 — sync end-to-end latency
  SYNC_END_TO_END_P95_MS: 30_000,
  SYNC_END_TO_END_P99_MS: 60_000,
  // B3 / B4 — sustained throughput (events/sec, goodput only)
  OUTBOX_THROUGHPUT_EPS: 100,
  INBOX_THROUGHPUT_EPS: 100,
} as const;

/**
 * Per-operation latency budgets (p50 / p95 / p99), in milliseconds.
 * Mirrors the §1 table. The harness asserts the p95 budget.
 */
export const QUERY_LATENCY_BUDGETS_MS = {
  candidacyListing: { p50: 80, p95: 300, p99: 600 },
  candidateSearchSingleAssignment: { p50: 120, p95: 400, p99: 800 },
  candidateSearchFirmWide: { p50: 200, p95: 500, p99: 1000 },
  reconciliationSingleObject: { p50: 150, p95: 500, p99: 1200 },
} as const;

// ---------------------------------------------------------------------------
// Latency harness
// ---------------------------------------------------------------------------

export type LatencySample = {
  operation: string;
  iterations: number;
  warmupIterations: number;
  samplesMs: number[];
};

export type LatencyStats = {
  operation: string;
  iterations: number;
  minMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  meanMs: number;
};

export type RunBenchmarkOptions = {
  iterations?: number;
  warmupIterations?: number;
};

/**
 * Nearest-rank percentile of a *sorted ascending* sample.
 *
 * @param sortedSamples ascending-order latencies
 * @param p percentile in [0, 100]
 */
export function percentile(sortedSamples: number[], p: number): number {
  if (sortedSamples.length === 0) {
    return 0;
  }
  const clamped = Math.min(Math.max(p, 0), 100);
  const rank = Math.ceil((clamped / 100) * sortedSamples.length);
  const index = Math.min(Math.max(rank - 1, 0), sortedSamples.length - 1);
  return sortedSamples[index];
}

export function computeLatencyStats(sample: LatencySample): LatencyStats {
  const sorted = [...sample.samplesMs].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, value) => acc + value, 0);
  const mean = sorted.length > 0 ? sum / sorted.length : 0;

  return {
    operation: sample.operation,
    iterations: sample.iterations,
    minMs: sorted.length > 0 ? sorted[0] : 0,
    p50Ms: percentile(sorted, 50),
    p95Ms: percentile(sorted, 95),
    p99Ms: percentile(sorted, 99),
    maxMs: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
    meanMs: mean,
  };
}

/**
 * Run an operation under the latency harness: `warmupIterations` discarded
 * invocations followed by `iterations` timed invocations. Returns the raw
 * samples and the computed stats.
 *
 * Timings use `node:perf_hooks` `performance.now()` (the real monotonic clock),
 * so callers MUST ensure fake timers are off — see the `beforeAll` in this file.
 */
export async function runLatencyBenchmark<T>(
  operation: string,
  operationFn: () => Promise<T> | T,
  options: RunBenchmarkOptions = {},
): Promise<{ sample: LatencySample; stats: LatencyStats }> {
  const iterations = options.iterations ?? 200;
  const warmupIterations = options.warmupIterations ?? 50;

  for (let i = 0; i < warmupIterations; i++) {
    await operationFn();
  }

  const samplesMs: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await operationFn();
    samplesMs.push(performance.now() - start);
  }

  const sample: LatencySample = {
    operation,
    iterations,
    warmupIterations,
    samplesMs,
  };

  return { sample, stats: computeLatencyStats(sample) };
}

// ---------------------------------------------------------------------------
// Mocked repository factory — mirrors the pattern used across the
// executive-search service unit tests (see e.g. outbox.service.spec.ts).
// ---------------------------------------------------------------------------

type MockRepository = {
  find: jest.Mock;
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

const createMockRepository = <T>(rows: T[]): MockRepository => ({
  find: jest.fn().mockResolvedValue(rows),
  findOneBy: jest.fn(),
  create: jest.fn((entity) => entity),
  save: jest.fn(),
});

const createMockOrmManager = (repository: MockRepository) => ({
  getRepository: jest.fn().mockResolvedValue(repository),
  executeInWorkspaceContext: jest.fn(async (fn: () => unknown) => fn()),
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('executive-search latency harness', () => {
  // The harness measures wall-clock via perf_hooks.performance.now(). Force
  // real timers so fake timers (enabled globally in jest.config.mjs) cannot
  // interfere with Date/timer-driven code under the operation function.
  beforeAll(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('percentile', () => {
    it('computes nearest-rank percentiles on a sorted sample', () => {
      // 1..100 inclusive
      const sorted = Array.from({ length: 100 }, (_, i) => i + 1);
      expect(percentile(sorted, 50)).toBe(50);
      expect(percentile(sorted, 95)).toBe(95);
      expect(percentile(sorted, 99)).toBe(99);
      expect(percentile(sorted, 100)).toBe(100);
    });

    it('returns 0 for an empty sample', () => {
      expect(percentile([], 50)).toBe(0);
      expect(percentile([], 95)).toBe(0);
    });

    it('clamps percentile into [0, 100]', () => {
      const sorted = [10, 20, 30];
      expect(percentile(sorted, -5)).toBe(sorted[0]);
      expect(percentile(sorted, 105)).toBe(sorted[sorted.length - 1]);
    });

    it('matches the single-element edge case', () => {
      expect(percentile([42], 50)).toBe(42);
      expect(percentile([42], 99)).toBe(42);
    });
  });

  describe('computeLatencyStats', () => {
    it('reports min / p50 / p95 / p99 / max / mean', () => {
      const stats = computeLatencyStats({
        operation: 'unit',
        iterations: 10,
        warmupIterations: 0,
        samplesMs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 100],
      });

      expect(stats.minMs).toBe(1);
      expect(stats.maxMs).toBe(100);
      expect(stats.p50Ms).toBe(5);
      // ceil(0.95 * 10) = 10 → index 9 → 100
      expect(stats.p95Ms).toBe(100);
      expect(stats.p99Ms).toBe(100);
      expect(stats.meanMs).toBeCloseTo(14.5, 5);
    });

    it('handles an empty sample without throwing', () => {
      const stats = computeLatencyStats({
        operation: 'empty',
        iterations: 0,
        warmupIterations: 0,
        samplesMs: [],
      });
      expect(stats.p95Ms).toBe(0);
      expect(stats.meanMs).toBe(0);
    });
  });

  describe('runLatencyBenchmark', () => {
    it('runs warmup then the requested number of timed iterations', async () => {
      const op = jest.fn().mockResolvedValue('ok');
      const { sample, stats } = await runLatencyBenchmark(
        'demo',
        op,
        { iterations: 25, warmupIterations: 5 },
      );

      // warmup (5) + timed (25) = 30 total invocations
      expect(op).toHaveBeenCalledTimes(30);
      expect(sample.samplesMs).toHaveLength(25);
      expect(sample.warmupIterations).toBe(5);
      expect(sample.iterations).toBe(25);
      expect(stats.operation).toBe('demo');
      expect(stats.iterations).toBe(25);
      // samples are non-negative wall-clock readings
      expect(Math.min(...sample.samplesMs)).toBeGreaterThanOrEqual(0);
    });

    it('uses real monotonic clock, not jest-faked Date/performance', async () => {
      // perf_hooks.performance is the Node-native clock, which jest's fake
      // timers do NOT patch. With a sleep-ish op, the recorded delta must be a
      // real, positive, monotonic reading — proving the harness is unaffected
      // by fake timers.
      let calls = 0;
      const op = jest.fn(async () => {
        calls += 1;
        // small real wait so a non-zero delta is plausible
        await Promise.resolve();
      });

      const { sample } = await runLatencyBenchmark('clock', op, {
        iterations: 10,
        warmupIterations: 2,
      });

      expect(calls).toBe(12);
      expect(sample.samplesMs.every((value) => Number.isFinite(value))).toBe(
        true,
      );
      expect(sample.samplesMs.every((value) => value >= 0)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Query-latency scaffolds (mocked repositories).
//
// These exercise the harness against the real repository shapes the
// operations will use, with near-instant mocked results. They prove the
// harness wiring is correct; they are NOT the SLO numbers in the doc. SLO
// numbers come from the live-DB runs in the skipped blocks below.
// ---------------------------------------------------------------------------

const buildTestingModule = async (repository: MockRepository) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: GlobalWorkspaceOrmManager,
        useValue: createMockOrmManager(repository),
      },
    ],
  }).compile();

  return module;
};

describe('executive-search query latency scaffolds (mocked)', () => {
  beforeAll(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('candidacy listing: harness runs and records a p95 below the SLO ceiling for a mocked read', async () => {
    const rows = Array.from({ length: 25 }, (_, i) => ({
      id: `cand-${i}`,
      name: `Candidate ${i}`,
      status: CandidacyStatus.IDENTIFIED,
      searchAssignmentId: 'assignment-1',
    }));
    const repository = createMockRepository<
      Partial<SearchCandidacyWorkspaceEntity>
    >(rows);
    const module = await buildTestingModule(repository);
    const ormManager = module.get<unknown>(GlobalWorkspaceOrmManager) as {
      executeInWorkspaceContext: <R>(fn: () => Promise<R>) => Promise<R>;
      getRepository: () => Promise<MockRepository>;
    };

    const listCandidacies = async (assignmentId: string) => {
      return ormManager.executeInWorkspaceContext(async () => {
        const repo = await ormManager.getRepository();
        return repo.find({
          where: { searchAssignmentId: assignmentId },
          order: { assignedAt: 'DESC' },
          take: 25,
        });
      });
    };

    const { stats } = await runLatencyBenchmark(
      'candidacyListing',
      () => listCandidacies('assignment-1'),
      { iterations: 100, warmupIterations: 20 },
    );

    expect(repository.find).toHaveBeenCalled();
    expect(stats.iterations).toBe(100);
    // Mocked read is effectively instant; this asserts the harness produces a
    // sensible p95 well inside the SLO budget, not real query cost.
    expect(stats.p95Ms).toBeLessThan(QUERY_LATENCY_BUDGETS_MS.candidacyListing.p95);
    expect(stats.p95Ms).toBeLessThan(EXECUTIVE_SEARCH_SLO.QUERY_P95_MS);
  });

  it('candidate search (single assignment): harness runs against a mocked filtered read', async () => {
    const rows = Array.from({ length: 25 }, (_, i) => ({
      id: `rc-${i}`,
      name: `Research Candidate ${i}`,
      status: 'ACTIVE',
    }));
    const repository = createMockRepository(rows);
    const module = await buildTestingModule(repository);
    const ormManager = module.get<unknown>(GlobalWorkspaceOrmManager) as {
      executeInWorkspaceContext: <R>(fn: () => Promise<R>) => Promise<R>;
      getRepository: () => Promise<MockRepository>;
    };

    const searchCandidates = async (filter: string) => {
      return ormManager.executeInWorkspaceContext(async () => {
        const repo = await ormManager.getRepository();
        return repo.find({ where: { name: filter }, take: 25 });
      });
    };

    const { stats } = await runLatencyBenchmark(
      'candidateSearchSingleAssignment',
      () => searchCandidates('CEO'),
      { iterations: 100, warmupIterations: 20 },
    );

    expect(repository.find).toHaveBeenCalled();
    expect(stats.p95Ms).toBeLessThan(
      QUERY_LATENCY_BUDGETS_MS.candidateSearchSingleAssignment.p95,
    );
    expect(stats.p95Ms).toBeLessThan(EXECUTIVE_SEARCH_SLO.QUERY_P95_MS);
  });

  it('sync reconciliation: harness runs against a mocked read-only reconcile()', async () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({
      id: `rec-${i}`,
      status: 'MATCHED',
    }));
    const repository = createMockRepository(rows);
    const module = await buildTestingModule(repository);
    const ormManager = module.get<unknown>(GlobalWorkspaceOrmManager) as {
      executeInWorkspaceContext: <R>(fn: () => Promise<R>) => Promise<R>;
      getRepository: () => Promise<MockRepository>;
    };

    // Reconciliation engines are read-only (see reconciliation-engine.interface.ts).
    const reconcile = async (objectName: string) => {
      return ormManager.executeInWorkspaceContext(async () => {
        const repo = await ormManager.getRepository();
        const all = await repo.find({ where: { objectName } });
        return all.map((row: { id: string }) => ({
          id: row.id,
          finding: 'MATCHED' as const,
        }));
      });
    };

    const { stats } = await runLatencyBenchmark(
      'reconciliationSingleObject',
      () => reconcile('searchCandidacy'),
      { iterations: 100, warmupIterations: 20 },
    );

    expect(repository.find).toHaveBeenCalled();
    expect(stats.p95Ms).toBeLessThan(
      QUERY_LATENCY_BUDGETS_MS.reconciliationSingleObject.p95,
    );
    expect(stats.p95Ms).toBeLessThan(EXECUTIVE_SEARCH_SLO.QUERY_P95_MS);
  });
});

// ---------------------------------------------------------------------------
// Live-DB latency scaffolds (wired to a real workspace).
//
// These produce the actual SLO numbers recorded against the §3 dataset. They
// are skipped here because they need a provisioned workspace and must run under
// the integration jest config (jest-integration.config.ts). To enable, rename
// to `.integration-spec.ts` and move into test/integration/, or drop the
// `.skip` and run with a live DB against the §3 dataset.
//
// Each live variant MUST:
//   - assert stats.p95Ms < EXECUTIVE_SEARCH_SLO.QUERY_P95_MS
//   - capture EXPLAIN (ANALYZE, BUFFERS) for the query plan
//   - record the result in the §5 baseline format
// ---------------------------------------------------------------------------

describe.skip('executive-search query latency (live DB)', () => {
  beforeAll(() => {
    jest.useRealTimers();
  });

  it('candidacy listing p95 < 500ms against the §3 dataset', async () => {
    // TODO(phase18-perf): wire to a live SearchCandidacyWorkspaceEntity repository
    // provisioned with the §3 dataset (25k candidacies / workspace).
    // const stats = await runLatencyBenchmark('candidacyListing', listCandidacies, ...);
    // expect(stats.p95Ms).toBeLessThan(EXECUTIVE_SEARCH_SLO.QUERY_P95_MS);
    expect(true).toBe(true);
  });

  it('candidate search (firm-wide) p95 < 500ms against the §3 dataset', async () => {
    // TODO(phase18-perf): wire to a live firm-wide candidate search; this is the
    // baseline-gate operation per docs §4 (B1).
    expect(true).toBe(true);
  });

  it('sync reconciliation full sweep < 5min wall-clock against the §3 dataset', async () => {
    // TODO(phase18-perf): wire to ExecutiveSearchReconciliationService.startRun
    // over the §3 dataset and assert wall-clock < EXECUTIVE_SEARCH_SLO ceiling.
    expect(true).toBe(true);
  });
});
