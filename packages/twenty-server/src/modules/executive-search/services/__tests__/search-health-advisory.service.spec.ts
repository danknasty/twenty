import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { SearchHealthAdvisoryService } from 'src/modules/executive-search/services/search-health-advisory.service';
import { CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

const mockExecuteInWorkspaceContext = jest
  .fn()
  .mockImplementation((fn: () => any, _authContext?: any) => fn());

const mockGetRepository = jest.fn();

jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
      executeInWorkspaceContext: mockExecuteInWorkspaceContext,
      getRepository: mockGetRepository,
    })),
  }),
);

describe('SearchHealthAdvisoryService', () => {
  let service: SearchHealthAdvisoryService;
  let mockAssignmentRepo: any;
  let mockCandidacyRepo: any;

  const workspaceId = 'workspace-1';
  const authContext = {
    type: 'user' as const,
    workspace: { id: workspaceId },
  } as any;

  const searchAssignmentId = 'assignment-1';

  const mockAssignment = {
    id: searchAssignmentId,
    name: 'CEO Search',
    status: 'ACTIVE',
  };

  const makeCandidacy = (id: string, status: CandidacyStatus) => ({
    id,
    name: `Candidate ${id}`,
    status,
    searchAssignmentId,
    currentStage: null,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    mockAssignmentRepo = {
      findOne: jest.fn().mockResolvedValue(mockAssignment),
    };

    mockCandidacyRepo = {
      find: jest.fn().mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.SHORTLIST),
        makeCandidacy('c-2', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-3', CandidacyStatus.PRESENTED),
        makeCandidacy('c-4', CandidacyStatus.RESEARCHING),
        makeCandidacy('c-5', CandidacyStatus.PLACED),
      ]),
    };

    mockGetRepository.mockImplementation(
      (_workspaceId: string, EntityClass: any) => {
        const name = EntityClass?.name ?? '';
        if (name.includes('SearchAssignment')) return mockAssignmentRepo;
        if (name.includes('SearchCandidacy')) return mockCandidacyRepo;
        return {};
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchHealthAdvisoryService, GlobalWorkspaceOrmManager],
    }).compile();

    service = module.get(SearchHealthAdvisoryService);
  });

  describe('computeSearchHealth', () => {
    it('returns HEALTHY when no warnings (pipeline depth >= 3, conversion >= 0.3, placement >= 0.2)', async () => {
      // 7 candidates: enough depth, 1 interviewed (CLIENT_INTERVIEW = 1/7 = 14% < 30% → WARNING)
      // Let's adjust to make it HEALTHY:
      mockCandidacyRepo.find.mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-2', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-3', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-4', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-5', CandidacyStatus.PLACED),
        makeCandidacy('c-6', CandidacyStatus.PLACED),
      ]);

      const result = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.overallHealth).toBe('HEALTHY');
      expect(result.searchAssignmentId).toBe(searchAssignmentId);
      expect(result.metrics).toHaveLength(5);
      expect(result.computedAt).toBeDefined();

      // Pipeline depth = 6 → OK
      const depthMetric = result.metrics.find(
        (m) => m.metricCode === 'candidacy_pipeline_depth',
      );
      expect(depthMetric?.severity).toBe('OK');
      expect(depthMetric?.value).toBe(6);

      // Interview conversion = 6/6 = 100% → OK
      const convMetric = result.metrics.find(
        (m) => m.metricCode === 'stage_conversion_rate',
      );
      expect(convMetric?.severity).toBe('OK');

      // Placement rate = 2/6 = 33% → OK
      const placeMetric = result.metrics.find(
        (m) => m.metricCode === 'placement_rate',
      );
      expect(placeMetric?.severity).toBe('OK');
    });

    it('returns ATTENTION_NEEDED when pipeline is thin and no interviews/placements', async () => {
      mockCandidacyRepo.find.mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.RESEARCHING),
      ]);

      const result = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.overallHealth).toBe('ATTENTION_NEEDED');

      // Pipeline depth 1 → WARNING
      const depthMetric = result.metrics.find(
        (m) => m.metricCode === 'candidacy_pipeline_depth',
      );
      expect(depthMetric?.severity).toBe('WARNING');

      // Interview conversion 0/1 → WARNING
      const convMetric = result.metrics.find(
        (m) => m.metricCode === 'stage_conversion_rate',
      );
      expect(convMetric?.severity).toBe('WARNING');

      // Placement rate 0/1 → WARNING
      const placeMetric = result.metrics.find(
        (m) => m.metricCode === 'placement_rate',
      );
      expect(placeMetric?.severity).toBe('WARNING');
    });

    it('throws NOT_FOUND when assignment is missing', async () => {
      mockAssignmentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.computeSearchHealth(
          searchAssignmentId,
          workspaceId,
          authContext,
        ),
      ).rejects.toMatchObject({
        code: ExecutiveSearchExceptionCode.NOT_FOUND,
      });
    });

    it('computes interviewed count from candidacy statuses at or beyond CLIENT_INTERVIEW', async () => {
      mockCandidacyRepo.find.mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-2', CandidacyStatus.FINALIST),
        makeCandidacy('c-3', CandidacyStatus.REFERENCES_STAGE),
        makeCandidacy('c-4', CandidacyStatus.DILIGENCE),
        makeCandidacy('c-5', CandidacyStatus.OFFER_NEGOTIATION),
        makeCandidacy('c-6', CandidacyStatus.PLACED),
        makeCandidacy('c-7', CandidacyStatus.SHORTLIST),
        makeCandidacy('c-8', CandidacyStatus.PRESENTED),
      ]);

      const result = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      // 8 total, 6 interviewed, 1 placed
      const convMetric = result.metrics.find(
        (m) => m.metricCode === 'stage_conversion_rate',
      );
      expect(convMetric?.value).toBe(6 / 8);

      const placeMetric = result.metrics.find(
        (m) => m.metricCode === 'placement_rate',
      );
      expect(placeMetric?.value).toBe(1 / 8);
    });

    it('returns CAUTION with exactly 1 warning', async () => {
      // 5 candidates, 2 interviewed (40% conv = OK), 1 placed (20% = OK),
      // pipeline depth 5 = OK. No warnings.
      // Let's get exactly 1 warning: pipeline depth < 3 but everything else OK.
      // Actually we need exactly 1 WARNING. Let's make depth thin but conversion ok.
      mockCandidacyRepo.find.mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-2', CandidacyStatus.CLIENT_INTERVIEW),
      ]);

      const result = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      // depth = 2 → WARNING, conversion = 2/2=100% → OK, placement = 0/2=0% → WARNING
      // So 2 warnings → ATTENTION_NEEDED.

      // Let's adjust: 3 candidates, 1 interviewed, 0 placed
      // depth 3 → OK, conversion 1/3=33% → OK, placement 0/3=0% → WARNING
      mockCandidacyRepo.find.mockResolvedValue([
        makeCandidacy('c-1', CandidacyStatus.CLIENT_INTERVIEW),
        makeCandidacy('c-2', CandidacyStatus.RESEARCHING),
        makeCandidacy('c-3', CandidacyStatus.PRESENTED),
      ]);

      const result2 = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result2.overallHealth).toBe('CAUTION');
    });

    it('handles empty candidacy list gracefully', async () => {
      mockCandidacyRepo.find.mockResolvedValue([]);

      const result = await service.computeSearchHealth(
        searchAssignmentId,
        workspaceId,
        authContext,
      );

      expect(result.overallHealth).toBe('ATTENTION_NEEDED');
      expect(result.metrics).toHaveLength(5);

      const depthMetric = result.metrics.find(
        (m) => m.metricCode === 'candidacy_pipeline_depth',
      );
      expect(depthMetric?.value).toBe(0);
      expect(depthMetric?.severity).toBe('WARNING');
    });
  });
});
