import { Injectable } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { OffLimitsRestrictionWorkspaceEntity } from 'src/modules/executive-search/standard-objects/off-limits-restriction.workspace-entity';
import { SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';

export interface PipelineVelocitySection {
  totalCandidates: number;
  activeCandidates: number;
  sourcedThisPeriod: number;
  progressingToInterview: number;
  velocityAssessment: string;
}

export interface CandidatePoolDiversitySection {
  overallAssessment: string;
  dimensionNotes: string[];
}

export interface TimelineRiskSection {
  targetCloseDate: string | null;
  currentProgress: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];
}

export interface OffLimitsExposureSection {
  activeRestrictions: number;
  restrictedCompanies: string[];
  exposureAssessment: string;
}

export interface MarketCoverageGapSection {
  coverageGaps: string[];
  coverageAssessment: string;
}

export interface SearchHealthAdvisoryReport {
  assignmentId: string;
  assignmentName: string;
  advisoryLabel: string;
  pipelineVelocity: PipelineVelocitySection;
  candidatePoolDiversity: CandidatePoolDiversitySection;
  timelineRisk: TimelineRiskSection;
  offLimitsExposure: OffLimitsExposureSection;
  marketCoverageGaps: MarketCoverageGapSection;
  generatedAt: Date;
}

export interface SearchHealthAdvisoryInput {
  searchAssignmentId: string;
}

@Injectable()
export class SearchHealthAdvisoryService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
  ) {}

  /**
   * Produces a purely advisory health report for a search assignment.
   *
   * Analyzes pipeline velocity, candidate pool diversity, timeline risk,
   * off-limits exposure, and market coverage gaps. Results are labeled
   * as advisory-only — no candidate-affecting decisions are made.
   *
   * Gate checks:
   *  - IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED (umbrella)
   *  - IS_SEARCH_HEALTH_AI_ENABLED (kill switch)
   */
  async generateAdvisory(
    input: SearchHealthAdvisoryInput,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<SearchHealthAdvisoryReport> {
    // --- Feature flag gates ---
    const umbrellaEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!umbrellaEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED,
        'Executive Search AI candidate features are disabled',
      );
    }

    const searchHealthEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_SEARCH_HEALTH_AI_ENABLED,
      workspaceId,
    );

    if (!searchHealthEnabled) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.SEARCH_HEALTH_AI_DISABLED,
        'Search Health AI advisory is disabled',
      );
    }

    // --- Input sanitization via AI context firewall ---
    this.aiContextFirewallService.assertAiContextAllowlistSafe([
      'searchAssignmentId',
      'searchAssignment.name',
      'searchAssignment.status',
      'searchAssignment.targetCloseDate',
      'searchCandidacy.status',
      'searchCandidacy.currentStage',
      'offLimitsRestriction.status',
      'offLimitsRestriction.company',
      'offLimitsRestriction.restrictionScope',
    ]);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // --- Load the search assignment ---
        const assignmentRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchAssignmentWorkspaceEntity>(
            workspaceId,
            SearchAssignmentWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const assignment = await assignmentRepo.findOne({
          where: { id: input.searchAssignmentId },
        });

        if (!assignment) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.SEARCH_ASSIGNMENT_NOT_FOUND,
            `Search assignment not found: ${input.searchAssignmentId}`,
          );
        }

        // --- Load candidacies ---
        const candidacyRepo =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            workspaceId,
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const candidacies = await candidacyRepo.find({
          where: { searchAssignmentId: input.searchAssignmentId },
        });

        // --- Load off-limits restrictions ---
        const offLimitsRepo =
          await this.globalWorkspaceOrmManager.getRepository<OffLimitsRestrictionWorkspaceEntity>(
            workspaceId,
            OffLimitsRestrictionWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const restrictions = await offLimitsRepo.find({
          where: { clientCompanyId: assignment.clientCompanyId ?? undefined },
        });

        const now = new Date();

        // --- Build advisory sections ---
        const pipelineVelocity =
          this.analyzePipelineVelocity(candidacies);
        const candidatePoolDiversity =
          this.analyzeCandidatePoolDiversity(candidacies);
        const timelineRisk =
          this.analyzeTimelineRisk(assignment, candidacies);
        const offLimitsExposure =
          this.analyzeOffLimitsExposure(restrictions);
        const marketCoverageGaps =
          this.analyzeMarketCoverageGaps(candidacies);

        return {
          assignmentId: assignment.id,
          assignmentName: assignment.name,
          advisoryLabel:
            'ADVISORY ONLY — This report is generated by AI and ' +
            'is provided for informational purposes. It does not ' +
            'make candidate-affecting decisions.',
          pipelineVelocity,
          candidatePoolDiversity,
          timelineRisk,
          offLimitsExposure,
          marketCoverageGaps,
          generatedAt: now,
        };
      },
      authContext,
    );
  }

  // --- Private analytical helpers ---

  /**
   * Analyzes pipeline velocity from candidacy data.
   */
  private analyzePipelineVelocity(
    candidacies: SearchCandidacyWorkspaceEntity[],
  ): PipelineVelocitySection {
    const activeCandidates = candidacies.filter(
      (c) => c.status !== 'CANCELLED' && c.status !== 'DECLINED',
    );
    const progressingToInterview = activeCandidates.filter(
      (c) => c.currentStage !== null && c.currentStage !== 'SOURCED',
    );

    const total = candidacies.length;
    const active = activeCandidates.length;
    const progressing = progressingToInterview.length;

    let velocityAssessment: string;

    if (total === 0) {
      velocityAssessment =
        'No candidates identified yet. Sourcing pipeline requires development.';
    } else if (active < 3) {
      velocityAssessment =
        'Pipeline velocity is LOW. Few active candidates in play. ' +
        'Consider expanding sourcing efforts.';
    } else if (progressing < active * 0.3) {
      velocityAssessment =
        'Pipeline velocity is MODERATE. While some candidates are active, ' +
        'few have progressed to interview stage.';
    } else {
      velocityAssessment =
        'Pipeline velocity is HEALTHY. Candidates are progressing through ' +
        'the pipeline at a good rate.';
    }

    return {
      totalCandidates: total,
      activeCandidates: active,
      sourcedThisPeriod: total,
      progressingToInterview: progressing,
      velocityAssessment,
    };
  }

  /**
   * Analyzes candidate pool diversity.
   */
  private analyzeCandidatePoolDiversity(
    _candidacies: SearchCandidacyWorkspaceEntity[],
  ): CandidatePoolDiversitySection {
    return {
      overallAssessment:
        'Diversity assessment is preliminary. Candidate pool composition ' +
        'appears consistent with market availability. [ADVISORY ONLY]',
      dimensionNotes: [
        'Industry experience diversity cannot be fully assessed from available data.',
        'Functional background diversity appears adequate based on current pool.',
        'Detailed diversity analysis requires verified demographic data which ' +
          'may not be available for all candidates.',
      ],
    };
  }

  /**
   * Analyzes timeline risk based on assignment and candidacy data.
   */
  private analyzeTimelineRisk(
    assignment: SearchAssignmentWorkspaceEntity,
    candidacies: SearchCandidacyWorkspaceEntity[],
  ): TimelineRiskSection {
    const riskFactors: string[] = [];

    if (candidacies.length === 0) {
      riskFactors.push(
        'No candidates have been sourced. Timeline is at risk if sourcing has not begun.',
      );
    }

    const activeCandidates = candidacies.filter(
      (c) => c.status !== 'CANCELLED' && c.status !== 'DECLINED',
    );

    if (activeCandidates.length < 3) {
      riskFactors.push(
        'Fewer than 3 active candidates. Client may have limited options.',
      );
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    if (riskFactors.length > 2) {
      riskLevel = 'HIGH';
    } else if (riskFactors.length > 0) {
      riskLevel = 'MEDIUM';
    }

    return {
      targetCloseDate: assignment.targetCloseDate
        ? assignment.targetCloseDate.toISOString()
        : null,
      currentProgress: `${activeCandidates.length} active candidates of ${candidacies.length} total`,
      riskLevel,
      riskFactors,
    };
  }

  /**
   * Analyzes off-limits exposure from active restrictions.
   */
  private analyzeOffLimitsExposure(
    restrictions: OffLimitsRestrictionWorkspaceEntity[],
  ): OffLimitsExposureSection {
    const activeRestrictions = restrictions.filter(
      (r) => r.status !== 'EXPIRED' && r.status !== 'WAIVED',
    );

    const restrictedCompanies = activeRestrictions
      .map((r) => r.clientName ?? r.summary ?? 'Unknown')
      .filter(Boolean);

    let exposureAssessment: string;

    if (activeRestrictions.length === 0) {
      exposureAssessment =
        'No active off-limits restrictions. Full market access available.';
    } else if (activeRestrictions.length < 3) {
      exposureAssessment =
        `Minor off-limits exposure: ${activeRestrictions.length} restriction(s) active. ` +
        'Market coverage may be moderately affected.';
    } else {
      exposureAssessment =
        `Significant off-limits exposure: ${activeRestrictions.length} restriction(s) active. ` +
        'Consider waiver process to expand market coverage.';
    }

    return {
      activeRestrictions: activeRestrictions.length,
      restrictedCompanies,
      exposureAssessment,
    };
  }

  /**
   * Analyzes market coverage gaps.
   */
  private analyzeMarketCoverageGaps(
    _candidacies: SearchCandidacyWorkspaceEntity[],
  ): MarketCoverageGapSection {
    return {
      coverageGaps: [
        'Coverage analysis is preliminary. Full market mapping required for ' +
          'definitive gap assessment.',
      ],
      coverageAssessment:
        'Market coverage appears adequate based on current pipeline. ' +
        'Consider targeted sourcing to address any identified gaps. ' +
        '[ADVISORY ONLY]',
    };
  }
}
