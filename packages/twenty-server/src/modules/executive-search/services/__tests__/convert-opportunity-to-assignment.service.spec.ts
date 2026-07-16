import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ConvertOpportunityToAssignmentService } from 'src/modules/executive-search/services/convert-opportunity-to-assignment.service';
import { OffLimitsGuardService } from 'src/modules/executive-search/services/off-limits-guard.service';
import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

// Mock the problematic module dependencies before any imports are evaluated
jest.mock('src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager', () => {
  const mockExecuteInWorkspaceContext = jest
    .fn()
    .mockImplementation((fn: () => any, _authContext?: any) => fn());

  const mockGetRepository = jest.fn();

  const mockTransaction = jest
    .fn()
    .mockImplementation(
      async (cb: (manager: any) => Promise<any>) => {
        return cb({});
      },
    );

  return {
    GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
      executeInWorkspaceContext: mockExecuteInWorkspaceContext,
      getRepository: mockGetRepository,
      getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue({
        transaction: mockTransaction,
      }),
    })),
  };
});

describe('ConvertOpportunityToAssignmentService', () => {
  let service: ConvertOpportunityToAssignmentService;
  let mockOpportunityRepository: any;
  let mockSearchAssignmentRepository: any;
  let mockEngagementTermsRepository: any;
  let mockTeamMemberRepository: any;
  let mockMilestoneRepository: any;
  let mockTimelineActivityRepository: any;
  let mockGlobalWorkspaceOrmManager: any;
  let mockOffLimitsGuardService: any;
  let mockTransactionImpl: any;

  const workspaceId = 'workspace-1';
  const authContext = {
    type: 'user' as const,
    workspace: { id: workspaceId },
    workspaceMemberId: 'member-1',
    user: { id: 'user-1' },
    userWorkspaceId: 'user-workspace-1',
    workspaceMember: { id: 'member-1', name: { firstName: 'Test', lastName: 'User' } },
  };

  const opportunityId = 'opportunity-1';
  const companyId = 'company-1';
  const engagementTermsId = 'terms-1';

  const mockOpportunity = {
    id: opportunityId,
    name: 'Test Opportunity',
    stage: 'CUSTOMER',
    companyId,
    ownerId: 'owner-1',
  };

  const mockEngagementTerms = {
    id: engagementTermsId,
    status: 'APPROVED',
    opportunityId,
  };

  const mockAssignment = {
    id: 'assignment-1',
    name: 'Test Opportunity — Search',
    status: SearchAssignmentStatus.BD_HANDOFF,
    clientCompanyId: companyId,
    opportunityId,
    engagementTermsId,
  };

  const setupRepositories = () => {
    mockOpportunityRepository = {
      findOne: jest.fn(),
    };
    mockSearchAssignmentRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };
    mockEngagementTermsRepository = {
      findOne: jest.fn(),
    };
    mockTeamMemberRepository = {
      insert: jest.fn(),
    };
    mockMilestoneRepository = {
      insert: jest.fn(),
    };
    mockTimelineActivityRepository = {
      insert: jest.fn(),
    };

    const repositoryMap: Record<string, any> = {
      opportunity: mockOpportunityRepository,
      OpportunityWorkspaceEntity: mockOpportunityRepository,
      searchAssignment: mockSearchAssignmentRepository,
      SearchAssignmentWorkspaceEntity: mockSearchAssignmentRepository,
      searchEngagementTerms: mockEngagementTermsRepository,
      SearchEngagementTermsWorkspaceEntity: mockEngagementTermsRepository,
      assignmentTeamMember: mockTeamMemberRepository,
      AssignmentTeamMemberWorkspaceEntity: mockTeamMemberRepository,
      searchMilestone: mockMilestoneRepository,
      SearchMilestoneWorkspaceEntity: mockMilestoneRepository,
      timelineActivity: mockTimelineActivityRepository,
    };

    mockGlobalWorkspaceOrmManager.getRepository.mockImplementation(
      (_workspaceId: string, entityOrName: any, _options?: any) => {
        const key =
          typeof entityOrName === 'string'
            ? entityOrName
            : entityOrName.name;

        return Promise.resolve(repositoryMap[key]);
      },
    );
  };

  beforeEach(async () => {
    mockTransactionImpl = jest
      .fn()
      .mockImplementation(
        async (cb: (manager: any) => Promise<any>) => {
          return cb({});
        },
      );

    // Create mock orm manager with fresh callbacks
    mockGlobalWorkspaceOrmManager = {
      executeInWorkspaceContext: jest
        .fn()
        .mockImplementation(
          (fn: () => any, _authContext?: any) => fn(),
        ),
      getRepository: jest.fn(),
      getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue({
        transaction: mockTransactionImpl,
      }),
    };

    mockOffLimitsGuardService = {
      check: jest.fn().mockResolvedValue({ status: 'CLEAR' }),
    };

    setupRepositories();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConvertOpportunityToAssignmentService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
        {
          provide: OffLimitsGuardService,
          useValue: mockOffLimitsGuardService,
        },
      ],
    }).compile();

    service = module.get<ConvertOpportunityToAssignmentService>(
      ConvertOpportunityToAssignmentService,
    );
  });

  describe('Happy path', () => {
    it('should create assignment, team member, milestone and timeline activity, returning DTO with BD_HANDOFF status', async () => {
      mockOpportunityRepository.findOne.mockResolvedValue(mockOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(null);
      mockEngagementTermsRepository.findOne.mockResolvedValue(
        mockEngagementTerms,
      );
      mockSearchAssignmentRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'assignment-1' }],
      });
      mockTeamMemberRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'team-member-1' }],
      });
      mockMilestoneRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'milestone-1' }],
      });
      mockTimelineActivityRepository.insert.mockResolvedValue({});

      const result = await service.convertOpportunityToAssignment(
        opportunityId,
        workspaceId,
        authContext,
      );

      expect(result).toEqual({
        assignmentId: 'assignment-1',
        status: SearchAssignmentStatus.BD_HANDOFF,
      });

      expect(mockSearchAssignmentRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Opportunity — Search',
          status: SearchAssignmentStatus.BD_HANDOFF,
          clientCompanyId: companyId,
          opportunityId,
          engagementTermsId,
        }),
        expect.anything(),
      );

      expect(mockTeamMemberRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceMemberId: 'owner-1',
          role: 'PARTNER',
          isLead: true,
          assignmentId: 'assignment-1',
        }),
        expect.anything(),
      );

      expect(mockMilestoneRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Kickoff',
          status: 'PENDING',
          assignmentId: 'assignment-1',
        }),
        expect.anything(),
      );

      expect(mockTimelineActivityRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'searchAssignment.created',
        }),
        expect.anything(),
      );
    });
  });

  describe('Idempotency', () => {
    it('should return existing assignment without creating duplicates', async () => {
      const existingAssignment = {
        id: 'existing-assignment-1',
        status: SearchAssignmentStatus.BD_HANDOFF,
        opportunityId,
      };

      mockOpportunityRepository.findOne.mockResolvedValue(mockOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(
        existingAssignment,
      );

      const result = await service.convertOpportunityToAssignment(
        opportunityId,
        workspaceId,
        authContext,
      );

      expect(result).toEqual({
        assignmentId: 'existing-assignment-1',
        status: SearchAssignmentStatus.BD_HANDOFF,
      });

      expect(mockSearchAssignmentRepository.insert).not.toHaveBeenCalled();
      expect(mockTeamMemberRepository.insert).not.toHaveBeenCalled();
      expect(mockMilestoneRepository.insert).not.toHaveBeenCalled();
      expect(mockTimelineActivityRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('OPPORTUNITY_NOT_FOUND', () => {
    it('should throw when opportunity does not exist', async () => {
      mockOpportunityRepository.findOne.mockResolvedValue(null);

      await expect(
        service.convertOpportunityToAssignment(
          opportunityId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_FOUND,
        }),
      );
    });
  });

  describe('OPPORTUNITY_NOT_WON', () => {
    it('should throw when stage is not CUSTOMER', async () => {
      const lostOpportunity = { ...mockOpportunity, stage: 'QUALIFIED' };

      mockOpportunityRepository.findOne.mockResolvedValue(lostOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.convertOpportunityToAssignment(
          opportunityId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_WON,
        }),
      );
    });
  });

  describe('CLIENT_COMPANY_REQUIRED', () => {
    it('should throw when opportunity has no company', async () => {
      const noCompanyOpportunity = { ...mockOpportunity, companyId: null };

      mockOpportunityRepository.findOne.mockResolvedValue(noCompanyOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.convertOpportunityToAssignment(
          opportunityId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.CLIENT_COMPANY_REQUIRED,
        }),
      );
    });
  });

  describe('NO_APPROVED_ENGAGEMENT_TERMS', () => {
    it('should throw when no approved engagement terms exist', async () => {
      mockOpportunityRepository.findOne.mockResolvedValue(mockOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(null);
      mockEngagementTermsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.convertOpportunityToAssignment(
          opportunityId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.NO_APPROVED_ENGAGEMENT_TERMS,
        }),
      );
    });
  });

  describe('Atomicity/rollback', () => {
    it('should roll back all writes when a repository save fails mid-transaction', async () => {
      mockOpportunityRepository.findOne.mockResolvedValue(mockOpportunity);
      mockSearchAssignmentRepository.findOne.mockResolvedValue(null);
      mockEngagementTermsRepository.findOne.mockResolvedValue(
        mockEngagementTerms,
      );
      mockSearchAssignmentRepository.insert.mockResolvedValue({
        identifiers: [{ id: 'assignment-1' }],
      });
      mockTeamMemberRepository.insert.mockRejectedValue(
        new Error('DB failure'),
      );

      await expect(
        service.convertOpportunityToAssignment(
          opportunityId,
          workspaceId,
          authContext,
        ),
      ).rejects.toThrow('DB failure');

      // The transaction should have been invoked
      expect(mockTransactionImpl).toHaveBeenCalled();
    });
  });
});
