import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { ExecutiveSearchException } from 'src/modules/executive-search/exceptions/executive-search.exception';
import { PositionSpecificationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/position-specification.workspace-entity';
import { SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { MarketMapWorkspaceEntity } from 'src/modules/executive-search/standard-objects/market-map.workspace-entity';
import { TargetCompanyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/target-company.workspace-entity';

/**
 * A single suggested target company with rationale.
 */
export interface TargetCompanySuggestion {
  /** The name of the target company */
  companyName: string;
  /** Domain of the company */
  domain: string | null;
  /** Industry of the company */
  industry: string | null;
  /** Tier classification (TARGET, SECONDARY, EXPLORATORY) */
  tier: string;
  /** Human-readable rationale for why this company is suggested */
  rationale: string;
  /** Confidence score 0-1 */
  confidence: number;
}

/**
 * Result of target company suggestion processing.
 */
export interface TargetCompanySuggestionResult {
  /** The position specification that was analyzed */
  positionSpecificationId: string;
  /** The search assignment that was analyzed */
  searchAssignmentId: string;
  /** List of suggested target companies */
  suggestions: TargetCompanySuggestion[];
  /** Human-readable summary of the suggestion logic */
  summary: string;
  /** Unique trace identifier for provenance/audit trail */
  traceId: string;
  /** Whether this capability is currently enabled */
  isEnabled: boolean;
}

@Injectable()
export class TargetCompanySuggestionService {
  private readonly logger = new Logger(TargetCompanySuggestionService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Suggests target companies for a given position specification and search
   * assignment based on market data and position requirements.
   *
   * All suggestions are advisory — the researcher reviews and selects which
   * target companies to pursue. No automated actions are taken.
   *
   * Kill switch: the IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED feature flag
   * gates this capability. When disabled, the result will have isEnabled=false.
   */
  async suggestTargetCompanies(
    positionSpecificationId: string,
    searchAssignmentId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<TargetCompanySuggestionResult> {
    const traceId = this.generateTraceId();

    // 1. Kill switch: check feature flag
    const isEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!isEnabled) {
      return {
        positionSpecificationId,
        searchAssignmentId,
        suggestions: [],
        summary:
          'AI-powered target company suggestions are currently disabled for this workspace.',
        traceId,
        isEnabled: false,
      };
    }

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // 2. Sanitize input fields through AI context firewall
        this.aiContextFirewallService.assertAiContextAllowlistSafe([
          'name',
          'keyResponsibilities',
          'requiredQualifications',
          'preferredQualifications',
          'reportingLine',
        ]);

        // 3. Load position specification and search assignment
        const positionSpecRepo =
          await this.globalWorkspaceOrmManager.getRepository<PositionSpecificationWorkspaceEntity>(
            workspaceId,
            PositionSpecificationWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const positionSpec = await positionSpecRepo.findOne({
          where: { id: positionSpecificationId },
        });

        if (!positionSpec) {
          throw new ExecutiveSearchException(
            'POSITION_SPECIFICATION_NOT_FOUND' as any,
            `Position specification ${positionSpecificationId} not found`,
          );
        }

        // 4. Load market map(s) associated with the search assignment
        const marketMapRepo =
          await this.globalWorkspaceOrmManager.getRepository<MarketMapWorkspaceEntity>(
            workspaceId,
            MarketMapWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const marketMaps = await marketMapRepo.find({
          where: { researchStrategy: { searchAssignmentId } as any },
        });

        // 5. Load existing target companies from market maps
        const targetCompanyRepo =
          await this.globalWorkspaceOrmManager.getRepository<TargetCompanyWorkspaceEntity>(
            workspaceId,
            TargetCompanyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const existingTargets: TargetCompanyWorkspaceEntity[] = [];
        for (const marketMap of marketMaps) {
          const targets = await targetCompanyRepo.find({
            where: { marketMapId: marketMap.id },
          });
          existingTargets.push(...targets);
        }

        // 6. Generate suggestions from existing target companies and position spec analysis
        const suggestions = this.generateSuggestions(
          positionSpec,
          existingTargets,
        );

        const summary = this.buildSummary(
          positionSpec.name,
          suggestions,
          marketMaps.length,
        );

        return {
          positionSpecificationId,
          searchAssignmentId,
          suggestions,
          summary,
          traceId,
          isEnabled: true,
        };
      },
      authContext,
    );
  }

  /**
   * Generate target company suggestions based on the position specification
   * and existing market data.
   */
  private generateSuggestions(
    positionSpec: PositionSpecificationWorkspaceEntity,
    existingTargets: TargetCompanyWorkspaceEntity[],
  ): TargetCompanySuggestion[] {
    const suggestions: TargetCompanySuggestion[] = [];

    // Promote existing target companies with rationale based on position spec
    for (const target of existingTargets) {
      const rationale = this.buildRationale(target, positionSpec);

      suggestions.push({
        companyName: target.companyName,
        domain: target.domain,
        industry: target.industry,
        tier: target.tier,
        rationale,
        confidence: this.estimateTierConfidence(target.tier),
      });
    }

    // If no targets exist, provide a guidance message
    if (suggestions.length === 0) {
      this.logger.log(
        `No existing target companies found for position spec "${positionSpec.name}". Market map creation needed.`,
      );
    }

    return suggestions;
  }

  /**
   * Build a rationale for why a target company fits the position specification.
   */
  private buildRationale(
    target: TargetCompanyWorkspaceEntity,
    positionSpec: PositionSpecificationWorkspaceEntity,
  ): string {
    const parts: string[] = [];

    if (target.industry) {
      parts.push(`Operates in ${target.industry} industry`);
    }
    if (target.sizeBand) {
      parts.push(`Company size band: ${target.sizeBand}`);
    }
    if (target.attractiveness) {
      parts.push(`Attractiveness rating: ${target.attractiveness}`);
    }
    if (target.rationale) {
      parts.push(target.rationale);
    }
    if (positionSpec.requiredQualifications) {
      parts.push(
        `Position requires: ${typeof positionSpec.requiredQualifications === 'string' ? positionSpec.requiredQualifications.substring(0, 100) : 'Specialized qualifications'}`,
      );
    }

    if (parts.length === 0) {
      return `Target company "${target.companyName}" mapped at tier ${target.tier}. Researcher should validate fit.`;
    }

    return parts.join('. ') + '.';
  }

  /**
   * Estimate confidence based on target company tier.
   */
  private estimateTierConfidence(tier: string): number {
    switch (tier) {
      case 'TARGET':
        return 0.85;
      case 'SECONDARY':
        return 0.6;
      case 'EXPLORATORY':
        return 0.35;
      default:
        return 0.5;
    }
  }

  /**
   * Build a human-readable summary of the suggestion results.
   */
  private buildSummary(
    positionName: string,
    suggestions: TargetCompanySuggestion[],
    marketMapCount: number,
  ): string {
    if (suggestions.length === 0) {
      return `No target companies found for position "${positionName}". No market maps exist for this assignment — consider creating a market map first.`;
    }

    const tiers = suggestions
      .reduce(
        (acc, s) => {
          acc[s.tier] = (acc[s.tier] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const tierSummary = Object.entries(tiers)
      .map(([tier, count]) => `${count} ${tier.toLowerCase()}`)
      .join(', ');

    return `Found ${suggestions.length} target companies across ${marketMapCount} market map(s) for position "${positionName}": ${tierSummary}. Researcher should review and validate each suggestion.`;
  }

  /**
   * Generate a unique trace ID for audit/provenance tracking.
   */
  private generateTraceId(): string {
    return `tgt-sug-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}
