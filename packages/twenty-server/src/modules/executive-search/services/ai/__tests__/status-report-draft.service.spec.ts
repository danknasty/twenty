import { Test, type TestingModule } from '@nestjs/testing';

import { FeatureFlagKey } from 'twenty-shared/types';

jest.mock('src/engine/core-modules/feature-flag/services/feature-flag.service', () => {
  return {
    FeatureFlagService: jest.fn().mockImplementation(() => ({
      isFeatureEnabled: jest.fn(),
    })),
  };
});

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { DraftingGateService } from 'src/modules/executive-search/services/ai/drafting-gate.service';
import { StatusReportDraftService } from 'src/modules/executive-search/services/ai/status-report-draft.service';
import { AiDraftStatus } from 'src/modules/executive-search/common/enums/ai-draft-status.enum';

describe('StatusReportDraftService', () => {
  let service: StatusReportDraftService;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let aiContextFirewallService: jest.Mocked<AiContextFirewallService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusReportDraftService,
        {
          provide: FeatureFlagService,
          useValue: {
            isFeatureEnabled: jest.fn(),
          },
        },
        {
          provide: AiContextFirewallService,
          useValue: {
            filterProhibited: jest.fn().mockImplementation((fields) => fields),
            validateAiContextAllowlist: jest.fn().mockReturnValue([]),
            assertAiContextAllowlistSafe: jest.fn(),
          },
        },
        DraftingGateService,
      ],
    }).compile();

    service = module.get<StatusReportDraftService>(StatusReportDraftService);
    featureFlagService = module.get(FeatureFlagService);
    aiContextFirewallService = module.get(AiContextFirewallService);
  });

  describe('draftStatusReport', () => {
    const mockInput = {
      assignmentTitle: 'CFO Search — Acme Corp',
      currentStatus: 'Active',
      milestones: [
        { name: 'Initial Sourcing', status: 'Complete' },
        { name: 'Candidate Screening', status: 'In Progress', targetDate: '2026-08-15' },
        { name: 'Client Presentations', status: 'Not Started' },
      ],
      recentActivities: [
        'Sourced 15 potential candidates from target companies',
        'Completed initial screening calls with 5 candidates',
      ],
      upcomingActivities: [
        'Schedule deep-dive interviews with shortlisted candidates',
        'Prepare candidate presentation materials',
      ],
      blockers: [
        'Candidate availability for interviews is limited during August',
      ],
      candidatePipeline: '5 candidates in screening, 2 ready for presentation',
    };

    it('returns null when AI candidate feature flag is disabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(false);

      const result = await service.draftStatusReport(
        'workspace-1',
        mockInput,
      );

      expect(result).toBeNull();
    });

    it('returns a labeled draft when feature flag is enabled', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftStatusReport(
        'workspace-1',
        mockInput,
      );

      expect(result).not.toBeNull();
      expect(result!.content).toContain('AI DRAFT — Requires Human Review');
      expect(result!.content).toContain('CFO Search — Acme Corp');
      expect(result!.content).toContain('Active');
      expect(result!.status).toBe(AiDraftStatus.PENDING_REVIEW);
    });

    it('includes provenance metadata', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftStatusReport(
        'workspace-1',
        mockInput,
        'assign-101',
      );

      expect(result!.provenance.capability).toBe('STATUS_REPORT');
      expect(result!.provenance.subject).toBe('CFO Search — Acme Corp');
      expect(result!.provenance.assignmentId).toBe('assign-101');
      expect(result!.provenance.model).toBe('gpt-4');
      expect(result!.provenance.promptVersion).toBe('1.0.0');
    });

    it('sanitizes input through AI context firewall', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      await service.draftStatusReport('workspace-1', mockInput);

      expect(aiContextFirewallService.filterProhibited).toHaveBeenCalled();
    });

    it('includes milestones, activities, and blockers in output', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftStatusReport(
        'workspace-1',
        mockInput,
      );

      expect(result!.content).toContain('Milestones');
      expect(result!.content).toContain('Recent Activities');
      expect(result!.content).toContain('Upcoming Activities');
      expect(result!.content).toContain('Blockers');
      expect(result!.content).toContain('Initial Sourcing');
      expect(result!.content).toContain('Candidate availability');
    });

    it('uses recent activities as input refs', async () => {
      featureFlagService.isFeatureEnabled.mockResolvedValue(true);

      const result = await service.draftStatusReport(
        'workspace-1',
        mockInput,
      );

      expect(result!.provenance.inputRefs).toContain(
        'Sourced 15 potential candidates from target companies',
      );
    });
  });
});
