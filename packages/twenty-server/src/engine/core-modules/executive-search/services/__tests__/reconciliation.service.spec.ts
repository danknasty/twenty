/* @license Enterprise */

import { describe, expect, it, beforeEach } from '@jest/globals';

import {
  ReconciliationService,
  ReconciliationComparator,
  NoOpReconciliationComparator,
  type ReconciliationFinding,
} from 'src/engine/core-modules/executive-search/services/reconciliation.service';

describe('ReconciliationService', () => {
  let service: ReconciliationService;

  beforeEach(() => {
    service = new ReconciliationService();
  });

  describe('startRun', () => {
    it('should create a COMPLETED run with 0 findings (NoOp comparator)', async () => {
      const result = await service.startRun('ws-001');

      expect(result.runId).toBeDefined();
      expect(result.status).toBe('COMPLETED');
      expect(result.findingsCount).toBe(0);
    });

    it('should persist finding data from a custom comparator', async () => {
      const customFindings: ReconciliationFinding[] = [
        {
          externalCollection: 'executives',
          externalId: 'ext-001',
          twentyRecordId: 'rec-001',
          findingType: 'MISMATCH',
          severity: 'HIGH',
          details: { field: 'name', expected: 'John', actual: 'Jane' },
        },
      ];

      const customComparator: ReconciliationComparator = {
        compare: jest
          .fn<() => Promise<ReconciliationFinding[]>>()
          .mockResolvedValue(customFindings),
      };

      service.setComparator(customComparator);

      const result = await service.startRun('ws-001');

      expect(result.status).toBe('COMPLETED');
      expect(result.findingsCount).toBe(1);

      const persistedFindings = service.getFindings(result.runId);
      expect(persistedFindings).toEqual(customFindings);
    });

    it('should have findingsCount matching actual findings length', async () => {
      const findings: ReconciliationFinding[] = [
        {
          externalCollection: 'executives',
          externalId: 'ext-001',
          twentyRecordId: 'rec-001',
          findingType: 'MISMATCH',
          severity: 'LOW',
          details: {},
        },
        {
          externalCollection: 'executives',
          externalId: 'ext-002',
          twentyRecordId: 'rec-002',
          findingType: 'MISSING_IN_EXTERNAL',
          severity: 'MEDIUM',
          details: {},
        },
        {
          externalCollection: 'boards',
          externalId: 'ext-003',
          twentyRecordId: 'rec-003',
          findingType: 'MISSING_IN_TWENTY',
          severity: 'CRITICAL',
          details: {},
        },
      ];

      const customComparator: ReconciliationComparator = {
        compare: jest
          .fn<() => Promise<ReconciliationFinding[]>>()
          .mockResolvedValue(findings),
      };

      service.setComparator(customComparator);

      const result = await service.startRun('ws-001');

      expect(result.findingsCount).toBe(3);

      const persistedFindings = service.getFindings(result.runId);
      expect(persistedFindings.length).toBe(3);
      expect(persistedFindings).toEqual(findings);
    });
  });

  describe('getRun', () => {
    it('should return the run record for a completed run', async () => {
      const result = await service.startRun('ws-001');

      const run = service.getRun(result.runId);

      expect(run).toBeDefined();
      expect(run!.id).toBe(result.runId);
      expect(run!.status).toBe('COMPLETED');
      expect(run!.startedAt).toBeInstanceOf(Date);
      expect(run!.completedAt).toBeInstanceOf(Date);
    });

    it('should return undefined for a non-existent run', () => {
      const run = service.getRun('non-existent');
      expect(run).toBeUndefined();
    });
  });

  describe('getFindings', () => {
    it('should return an empty array for a non-existent run', () => {
      const findings = service.getFindings('non-existent');
      expect(findings).toEqual([]);
    });
  });
});
