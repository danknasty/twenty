import { Test, type TestingModule } from '@nestjs/testing';

import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { RelationshipPathSuggestionService } from 'src/modules/executive-search/services/ai/relationship-path-suggestion.service';
import { RelationshipEdgeWorkspaceEntity } from 'src/modules/executive-search/standard-objects/relationship-edge.workspace-entity';
import { ExecutiveProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-profile.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

// Mock FeatureFlagService to avoid importing the full engine dependency chain
jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => ({
  FeatureFlagService: jest.fn().mockImplementation(() => ({
    isFeatureEnabled: jest.fn(),
  })),
}));

// Mock GlobalWorkspaceOrmManager
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => {
    const mockExecuteInWorkspaceContext = jest
      .fn()
      .mockImplementation((fn: () => any) => fn());

    return {
      GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
        executeInWorkspaceContext: mockExecuteInWorkspaceContext,
        getRepository: jest.fn(),
      })),
    };
  },
);

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

describe('RelationshipPathSuggestionService', () => {
  let service: RelationshipPathSuggestionService;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockAiContextFirewallService: jest.Mocked<AiContextFirewallService>;
  let mockGlobalWorkspaceOrmManager: any;
  let mockRelationshipEdgeRepo: any;
  let mockExecutiveProfileRepo: any;
  let mockPersonRepo: any;

  const workspaceId = 'workspace-1';
  const sourcePersonId = 'person-source-1';
  const targetPersonId = 'person-target-1';

  const authContext = {
    type: 'user' as const,
    workspace: { id: workspaceId },
    workspaceMemberId: 'member-1',
    user: { id: 'user-1' } as any,
    userWorkspaceId: 'user-workspace-1',
    workspaceMember: { id: 'member-1' } as any,
  };

  beforeEach(async () => {
    mockFeatureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    mockAiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
      validateAiContextAllowlist: jest.fn(),
      filterProhibited: jest.fn(),
    } as any;

    mockRelationshipEdgeRepo = {
      find: jest.fn(),
    };

    mockExecutiveProfileRepo = {
      findOne: jest.fn(),
    };

    mockPersonRepo = {
      find: jest.fn(),
    };

    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation((fn: () => any) => fn()),
      getRepository: jest.fn().mockImplementation((_wsId, entity: any) => {
        if (entity === RelationshipEdgeWorkspaceEntity) {
          return Promise.resolve(mockRelationshipEdgeRepo);
        }
        if (entity === ExecutiveProfileWorkspaceEntity) {
          return Promise.resolve(mockExecutiveProfileRepo);
        }
        if (entity === PersonWorkspaceEntity) {
          return Promise.resolve(mockPersonRepo);
        }
        return Promise.resolve({ find: jest.fn(), findOne: jest.fn() });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipPathSuggestionService,
        {
          provide: FeatureFlagService,
          useValue: mockFeatureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: mockAiContextFirewallService,
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get<RelationshipPathSuggestionService>(
      RelationshipPathSuggestionService,
    );
  });

  describe('suggestRelationshipPaths', () => {
    it('returns isEnabled=false and noAutoSend=true when feature flag is disabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(result.isEnabled).toBe(false);
      expect(result.noAutoSend).toBe(true);
      expect(result.paths).toEqual([]);
      expect(result.traceId).toMatch(/^rel-path-/);
    });

    it('always returns noAutoSend=true even when enabled', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      mockPersonRepo.find.mockResolvedValue([]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(result.noAutoSend).toBe(true);
      expect(result.isEnabled).toBe(true);
    });

    it('finds direct relationship path between source and target', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const directEdge = {
        id: 'edge-1',
        sourcePersonId,
        targetPersonId,
        summary: 'Former colleagues at Acme Corp',
        strength: 'STRONG',
        source: 'MANUAL',
        relationshipType: 'COLLEAGUE',
        context: 'Worked together 2018-2023',
      };

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce([directEdge])
        .mockResolvedValueOnce([directEdge]);

      mockPersonRepo.find.mockResolvedValue([
        {
          id: sourcePersonId,
          name: { firstName: 'Alice', lastName: 'Johnson' },
        },
        {
          id: targetPersonId,
          name: { firstName: 'Bob', lastName: 'Smith' },
        },
      ]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(result.isEnabled).toBe(true);
      expect(result.paths).toHaveLength(1);
      expect(result.paths[0].pathLength).toBe(1);
      expect(result.paths[0].averageConfidence).toBe(0.9);
      expect(result.paths[0].steps).toHaveLength(2);
      expect(result.paths[0].summary).toContain('Direct relationship');
      expect(result.summary).toContain('Found 1 relationship path');
    });

    it('finds one-hop paths via mutual connections', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const intermediaryId = 'person-intermediary-1';

      // Source has relationship with intermediary
      const sourceEdges = [
        {
          id: 'edge-source-intermediary',
          sourcePersonId,
          targetPersonId: intermediaryId,
          summary: 'Board connection',
          strength: 'MODERATE',
          source: 'INFERRED',
          relationshipType: 'BOARD',
          context: 'Both on board of TechNonprofit',
        },
      ];

      // Target has relationship with intermediary
      const targetEdges = [
        {
          id: 'edge-intermediary-target',
          sourcePersonId: intermediaryId,
          targetPersonId,
          summary: 'Investment connection',
          strength: 'WEAK',
          source: 'INFERRED',
          relationshipType: 'INVESTOR',
          context: 'Investor in previous startup',
        },
      ];

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce(sourceEdges)
        .mockResolvedValueOnce(targetEdges);

      mockPersonRepo.find.mockResolvedValue([
        {
          id: sourcePersonId,
          name: { firstName: 'Alice', lastName: 'Johnson' },
        },
        {
          id: targetPersonId,
          name: { firstName: 'Bob', lastName: 'Smith' },
        },
        {
          id: intermediaryId,
          name: { firstName: 'Carol', lastName: 'Williams' },
        },
      ]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(result.isEnabled).toBe(true);
      expect(result.paths).toHaveLength(1);
      expect(result.paths[0].pathLength).toBe(2);
      expect(result.paths[0].steps).toHaveLength(3);

      // Verify the intermediary person is in the path
      const intermediaryStep = result.paths[0].steps.find(
        (s) => s.personId === intermediaryId,
      );
      expect(intermediaryStep).toBeDefined();
      expect(intermediaryStep!.personName).toBe('Carol Williams');
    });

    it('returns paths sorted by confidence descending', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const intermediaryId1 = 'person-intermediary-1';
      const intermediaryId2 = 'person-intermediary-2';

      // Source has MODERATE relationship with intermediary1
      const sourceEdges = [
        {
          id: 'edge-src-i1',
          sourcePersonId,
          targetPersonId: intermediaryId1,
          summary: 'Colleagues',
          strength: 'MODERATE',
          source: 'MANUAL',
        },
        {
          id: 'edge-src-i2',
          sourcePersonId,
          targetPersonId: intermediaryId2,
          summary: 'Alumni',
          strength: 'STRONG',
          source: 'MANUAL',
        },
      ];

      // Target has WEAK relationship with intermediary1, MODERATE with intermediary2
      const targetEdges = [
        {
          id: 'edge-i1-tgt',
          sourcePersonId: intermediaryId1,
          targetPersonId,
          summary: 'Met once',
          strength: 'WEAK',
          source: 'MANUAL',
        },
        {
          id: 'edge-i2-tgt',
          sourcePersonId: intermediaryId2,
          targetPersonId,
          summary: 'Former coworkers',
          strength: 'MODERATE',
          source: 'MANUAL',
        },
      ];

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce(sourceEdges)
        .mockResolvedValueOnce(targetEdges);

      mockPersonRepo.find.mockResolvedValue([
        { id: sourcePersonId, name: { firstName: 'A', lastName: 'S' } },
        { id: targetPersonId, name: { firstName: 'B', lastName: 'T' } },
        {
          id: intermediaryId1,
          name: { firstName: 'C', lastName: 'I1' },
        },
        {
          id: intermediaryId2,
          name: { firstName: 'D', lastName: 'I2' },
        },
      ]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      // Both one-hop paths should be found
      expect(result.paths.length).toBeGreaterThanOrEqual(2);

      // Path via intermediary2 (STRONG+MODERATE) should have higher confidence than
      // path via intermediary1 (MODERATE+WEAK)
      const pathI2 = result.paths.find((p) =>
        p.steps.some((s) => s.personId === intermediaryId2),
      );
      const pathI1 = result.paths.find((p) =>
        p.steps.some((s) => s.personId === intermediaryId1),
      );

      expect(pathI2).toBeDefined();
      expect(pathI1).toBeDefined();
      expect(pathI2!.averageConfidence).toBeGreaterThan(
        pathI1!.averageConfidence,
      );

      // Should be sorted
      for (let i = 0; i < result.paths.length - 1; i++) {
        expect(result.paths[i].averageConfidence).toBeGreaterThanOrEqual(
          result.paths[i + 1].averageConfidence,
        );
      }
    });

    it('resolves target person from executive profile when targetPersonId is null', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const executiveProfileId = 'exec-profile-1';

      mockExecutiveProfileRepo.findOne.mockResolvedValue({
        id: executiveProfileId,
        personId: targetPersonId,
      });

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      mockPersonRepo.find.mockResolvedValue([
        {
          id: sourcePersonId,
          name: { firstName: 'Alice', lastName: 'J' },
        },
        {
          id: targetPersonId,
          name: { firstName: 'Bob', lastName: 'S' },
        },
      ]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        null,
        executiveProfileId,
        workspaceId,
        authContext,
      );

      expect(result.targetPersonId).toBe(targetPersonId);
      expect(result.targetExecutiveProfileId).toBe(executiveProfileId);
      expect(mockExecutiveProfileRepo.findOne).toHaveBeenCalledWith({
        where: { id: executiveProfileId },
      });
    });

    it('returns empty paths when no relationship edges exist', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      mockPersonRepo.find.mockResolvedValue([]);

      const result = await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(result.paths).toEqual([]);
      expect(result.summary).toContain('No relationship paths found');
    });

    it('calls AiContextFirewallService for input sanitization', async () => {
      mockFeatureFlagService.isFeatureEnabled.mockResolvedValue(true);

      mockRelationshipEdgeRepo.find
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      mockPersonRepo.find.mockResolvedValue([]);

      await service.suggestRelationshipPaths(
        sourcePersonId,
        targetPersonId,
        null,
        workspaceId,
        authContext,
      );

      expect(
        mockAiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([
          'sourcePersonId',
          'summary',
          'relationshipType',
          'strength',
        ]),
      );
    });
  });
});
