/* @license Enterprise */

import crypto from 'crypto';

import { Injectable } from '@nestjs/common';

export interface ReconciliationFinding {
  externalCollection: string;
  externalId: string;
  twentyRecordId: string;
  findingType: string;
  severity: string;
  details: Record<string, unknown>;
}

export interface ReconciliationComparator {
  compare(workspaceId: string, runId: string): Promise<ReconciliationFinding[]>;
}

// NoOp comparator — returns empty array. Domain comparators wired in PR5+.
export class NoOpReconciliationComparator implements ReconciliationComparator {
  async compare(
    _workspaceId: string,
    _runId: string,
  ): Promise<ReconciliationFinding[]> {
    return [];
  }
}

interface RunRecord {
  id: string;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  recordsCompared: number;
  findingsCount: number;
}

@Injectable()
export class ReconciliationService {
  private runs: Map<string, RunRecord> = new Map();
  private findings: Map<string, ReconciliationFinding[]> = new Map();

  // Comparator can be swapped in tests. Production uses NoOp until PR5+.
  private comparator: ReconciliationComparator =
    new NoOpReconciliationComparator();

  setComparator(comparator: ReconciliationComparator): void {
    this.comparator = comparator;
  }

  async startRun(
    workspaceId: string,
  ): Promise<{ runId: string; status: string; findingsCount: number }> {
    const runId = crypto.randomUUID();
    const now = new Date();

    // Persist run as RUNNING (in-memory matching T3 pattern)
    this.runs.set(runId, {
      id: runId,
      status: 'RUNNING',
      startedAt: now,
      recordsCompared: 0,
      findingsCount: 0,
    });

    // Execute comparator
    const findings = await this.comparator.compare(workspaceId, runId);
    this.findings.set(runId, findings);

    // Mark complete
    this.runs.set(runId, {
      ...this.runs.get(runId)!,
      status: 'COMPLETED',
      completedAt: new Date(),
      findingsCount: findings.length,
    });

    return {
      runId,
      status: 'COMPLETED',
      findingsCount: findings.length,
    };
  }

  getRun(runId: string): RunRecord | undefined {
    return this.runs.get(runId);
  }

  getFindings(runId: string): ReconciliationFinding[] {
    return this.findings.get(runId) ?? [];
  }
}
