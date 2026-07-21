// Mock deep dependencies before any imports
jest.mock('twenty-shared/utils', () => ({
  CustomError: class MockCustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  },
  camelToSnakeCase: (s: string) => s.replace(/([A-Z])/g, '_$1').toLowerCase(),
}), { virtual: true });

jest.mock('src/engine/core-modules/twenty-config/config-variables', () => {
  const actual = jest.requireActual('src/engine/core-modules/twenty-config/config-variables');
  return {
    ...actual,
    ENTERPRISE_INSTANCE_TYPE: { PRODUCTION: 'production', DEVELOPMENT: 'development' },
  };
}, { virtual: false });

jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => {
  class MockFeatureFlagService {
    isFeatureEnabled = jest.fn();
  }
  return { FeatureFlagService: MockFeatureFlagService };
}, { virtual: false });

jest.mock('src/modules/executive-search/firewall/enforcement/ai-context-firewall.service', () => {
  class MockAiContextFirewallService {
    validateAiContextAllowlist = jest.fn();
    assertAiContextAllowlistSafe = jest.fn();
    filterProhibited = jest.fn();
  }
  return { AiContextFirewallService: MockAiContextFirewallService };
}, { virtual: false });

jest.mock('src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager', () => {
  class MockGlobalWorkspaceOrmManager {
    executeInWorkspaceContext = jest.fn();
    getRepository = jest.fn();
  }
  return { GlobalWorkspaceOrmManager: MockGlobalWorkspaceOrmManager };
}, { virtual: false });

import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

import { BoardMatrixEvaluationService } from '../board-matrix-evaluation.service';

describe('BoardMatrixEvaluationService', () => {
  let service: BoardMatrixEvaluationService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;
  let globalWorkspaceOrmManager: jest.Mocked<GlobalWorkspaceOrmManager>;

  const mockWorkspaceId = 'workspace-1';
  const mockAuthContext = { type: 'user' as const, workspaceMemberId: 'member-1' };

  beforeEach(async () => {
    featureFlagService = {
      isFeatureEnabled: jest.fn(),
    } as any;

    aiContextFirewallService = {
      assertAiContextAllowlistSafe: jest.fn(),
    } as any;

    globalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest.fn(),
      getRepository: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardMatrixEvaluationService,
        {
          provide: FeatureFlagService,
          useValue: featureFlagService,
        },
        {
          provide: AiContextFirewallService,
          useValue: aiContextFirewallService,
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: globalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get<BoardMatrixEvaluationService>(
      BoardMatrixEvaluationService,
    );
  });

  describe('evaluateCandidate', () => {
    const mockInput = {
      boardCompositionProfileId: 'profile-1',
      searchCandidacyId: 'candidacy-1',
    };

    it('should throw when umbrella AI feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        }),
      );
    });

    it('should throw when board matrix AI feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(true)  // umbrella flag
        .mockResolvedValueOnce(false); // board matrix flag

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.BOARD_MATRIX_AI_DISABLED,
        }),
      );
    });

    it('should throw when board composition profile is not found', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const mockRepo = {
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      };

      globalWorkspaceOrmManager.getRepository.mockResolvedValue(mockRepo);
      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.BOARD_COMPOSITION_PROFILE_NOT_FOUND,
        }),
      );
    });

    it('should throw when no criteria found for profile', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const profile = { id: 'profile-1', name: 'Test Profile' };
      const candidacy = { id: 'candidacy-1' };

      const mockProfileRepo = {
        findOne: jest.fn().mockResolvedValue(profile),
      };
      const mockCandidacyRepo = {
        findOne: jest.fn().mockResolvedValue(candidacy),
      };
      const mockCriterionRepo = {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn(),
      };
      const mockEvalRepo = {
        save: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockProfileRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockCriterionRepo)
        .mockResolvedValueOnce(mockEvalRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrow(ExecutiveSearchException);

      await expect(
        service.evaluateCandidate(mockInput, mockWorkspaceId, mockAuthContext),
      ).rejects.toThrowError(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.BOARD_MATRIX_CRITERIA_NOT_FOUND,
        }),
      );
    });

    it('should successfully evaluate a candidate against criteria', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const profile = {
        id: 'profile-1',
        name: 'Tech Board Profile',
        status: 'ACTIVE',
      };
      const candidacy = { id: 'candidacy-1' };
      const criteria: any[] = [
        {
          id: 'crit-1',
          name: 'Financial Expertise',
          category: 'FINANCIAL_EXPERTISE',
          weight: 0.4,
          description: 'CFO or audit committee experience',
          isRequired: true,
          boardCompositionProfileId: 'profile-1',
        },
        {
          id: 'crit-2',
          name: 'Industry Knowledge',
          category: 'INDUSTRY_KNOWLEDGE',
          weight: 0.3,
          description: 'Deep SaaS industry experience',
          isRequired: false,
          boardCompositionProfileId: 'profile-1',
        },
        {
          id: 'crit-3',
          name: 'Independence',
          category: 'INDEPENDENCE',
          weight: 0.3,
          description: 'No material relationships with company',
          isRequired: true,
          boardCompositionProfileId: 'profile-1',
        },
      ];

      const mockProfileRepo = {
        findOne: jest.fn().mockResolvedValue(profile),
      };
      const mockCandidacyRepo = {
        findOne: jest.fn().mockResolvedValue(candidacy),
      };
      const mockCriterionRepo = {
        find: jest.fn().mockResolvedValue(criteria),
      };
      const mockEvalRepo = {
        save: jest.fn().mockResolvedValue({}),
        find: jest.fn().mockResolvedValue([]),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockProfileRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockCriterionRepo)
        .mockResolvedValueOnce(mockEvalRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      const result = await service.evaluateCandidate(
        mockInput,
        mockWorkspaceId,
        mockAuthContext,
      );

      expect(result.candidacyId).toBe('candidacy-1');
      expect(result.profileId).toBe('profile-1');
      expect(result.profileName).toBe('Tech Board Profile');
      expect(result.perCriterionEvaluations).toHaveLength(3);
      expect(result.requiresHumanReview).toBe(true);
      expect(result.humanReviewedAt).toBeNull();
      expect(result.weightedScore).not.toBeNull();
      expect(result.maxWeightedScore).not.toBeNull();
      expect(typeof result.summary).toBe('string');
      expect(typeof result.independenceAssessment).toBe('string');
      expect(typeof result.commitmentCapacityReview).toBe('string');
      expect(typeof result.diversityComplement).toBe('string');

      // Verify each criterion was evaluated
      for (const evalItem of result.perCriterionEvaluations) {
        expect(evalItem.score).toBe(7);
        expect(evalItem.maxScore).toBe(10);
        expect(evalItem.evidence).toContain(evalItem.criterionName);
        expect(evalItem.assessment).toContain(evalItem.criterionName);
      }

      // Verify persistence
      expect(mockEvalRepo.save).toHaveBeenCalledTimes(3);

      // Verify weighted score computation
      expect(result.weightedScore).toBeCloseTo(
        (7 / 10) * 0.4 + (7 / 10) * 0.3 + (7 / 10) * 0.3,
      );
      expect(result.maxWeightedScore).toBe(1.0);
    });

    it('should call AI context firewall for input sanitization', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const profile = { id: 'profile-1', name: 'Test Profile' };
      const candidacy = { id: 'candidacy-1' };

      const mockProfileRepo = {
        findOne: jest.fn().mockResolvedValue(profile),
      };
      const mockCandidacyRepo = {
        findOne: jest.fn().mockResolvedValue(candidacy),
      };
      const mockCriterionRepo = {
        find: jest.fn().mockResolvedValue([{
          id: 'crit-1',
          name: 'Test',
          category: 'OTHER',
          weight: 1,
          description: 'Test',
          isRequired: false,
          boardCompositionProfileId: 'profile-1',
        }]),
      };
      const mockEvalRepo = {
        save: jest.fn().mockResolvedValue({}),
        find: jest.fn().mockResolvedValue([]),
      };

      globalWorkspaceOrmManager.getRepository
        .mockResolvedValueOnce(mockProfileRepo)
        .mockResolvedValueOnce(mockCandidacyRepo)
        .mockResolvedValueOnce(mockCriterionRepo)
        .mockResolvedValueOnce(mockEvalRepo);

      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      await service.evaluateCandidate(
        mockInput,
        mockWorkspaceId,
        mockAuthContext,
      );

      expect(
        aiContextFirewallService.assertAiContextAllowlistSafe,
      ).toHaveBeenCalledWith(
        expect.arrayContaining([
          'boardCompositionProfileId',
          'searchCandidacyId',
        ]),
      );
    });
  });

  describe('markHumanReviewComplete', () => {
    it('should update evaluation records with human review timestamp', async () => {
      const mockEvalRepo = {
        find: jest.fn().mockResolvedValue([
          { id: 'eval-1', notes: 'Initial notes' },
          { id: 'eval-2', notes: null },
        ]),
        update: jest.fn().mockResolvedValue({}),
      };

      globalWorkspaceOrmManager.getRepository.mockResolvedValue(mockEvalRepo);
      globalWorkspaceOrmManager.executeInWorkspaceContext.mockImplementation(
        async (fn: any) => fn(),
      );

      await service.markHumanReviewComplete(
        'candidacy-1',
        mockWorkspaceId,
        mockAuthContext,
      );

      expect(mockEvalRepo.find).toHaveBeenCalledWith({
        where: { searchCandidacyId: 'candidacy-1' },
      });
      expect(mockEvalRepo.update).toHaveBeenCalledTimes(2);
      expect(mockEvalRepo.update).toHaveBeenCalledWith(
        'eval-1',
        expect.objectContaining({
          notes: expect.stringContaining('HUMAN REVIEWED'),
        }),
      );
    });
  });

  describe('feature flag checking order', () => {
    it('should check umbrella flag before board matrix flag', async () => {
      featureFlagService.isFeatureEnabled
        .mockResolvedValueOnce(false) // umbrella flag returns false
        .mockResolvedValueOnce(true); // board matrix flag would return true

      await expect(
        service.evaluateCandidate(
          { boardCompositionProfileId: 'any', searchCandidacyId: 'any' },
          mockWorkspaceId,
          mockAuthContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        }),
      );

      // Should NOT have checked the board matrix flag
      expect(featureFlagService.isFeatureEnabled).toHaveBeenCalledTimes(1);
    });
  });
});
