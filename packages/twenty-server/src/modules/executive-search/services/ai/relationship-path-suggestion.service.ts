import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { AiContextFirewallService } from 'src/modules/executive-search/firewall/enforcement/ai-context-firewall.service';
import { ExecutiveSearchException } from 'src/modules/executive-search/exceptions/executive-search.exception';
import { RelationshipEdgeWorkspaceEntity } from 'src/modules/executive-search/standard-objects/relationship-edge.workspace-entity';
import { ExecutiveProfileWorkspaceEntity } from 'src/modules/executive-search/standard-objects/executive-profile.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { RelationshipSource } from 'src/modules/executive-search/common/enums/relationship-source.enum';

/**
 * A single step in a relationship path between a partner and a candidate.
 */
export interface RelationshipPathStep {
  /** Person at this step of the path */
  personId: string;
  /** Name of the person at this step */
  personName: string;
  /** The relationship edge connecting to the next step */
  edgeSummary: string | null;
  /** Strength of the relationship at this edge */
  edgeStrength: string;
  /** The relationship source (inferred or known) */
  edgeSource: string;
}

/**
 * A complete relationship path suggestion from partner to candidate.
 */
export interface RelationshipPath {
  /** Ordered steps from partner to candidate (or candidate to partner) */
  steps: RelationshipPathStep[];
  /** Total path length (number of edges traversed) */
  pathLength: number;
  /** Average confidence across all edges in the path */
  averageConfidence: number;
  /** Human-readable summary of the path */
  summary: string;
}

/**
 * Result of relationship path suggestion processing.
 */
export interface RelationshipPathSuggestionResult {
  /** The source person ID */
  sourcePersonId: string;
  /** The target person ID */
  targetPersonId: string;
  /** The target executive profile ID (if provided) */
  targetExecutiveProfileId: string | null;
  /** Suggested relationship paths */
  paths: RelationshipPath[];
  /** Human-readable summary */
  summary: string;
  /** Unique trace identifier for provenance/audit trail */
  traceId: string;
  /** Whether this capability is currently enabled */
  isEnabled: boolean;
  /** WARNING: No auto-send. User must explicitly decide to reach out. */
  readonly noAutoSend: true;
}

@Injectable()
export class RelationshipPathSuggestionService {
  private readonly logger = new Logger(RelationshipPathSuggestionService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly aiContextFirewallService: AiContextFirewallService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Suggests relationship paths between a partner (source person) and a
   * candidate (target person or executive profile) based on known relationship
   * edges in the system.
   *
   * CRITICAL: No auto-send. All path suggestions are advisory only. The user
   * must explicitly review and decide whether or how to reach out through the
   * recommended path. The returned result enforces this with a `noAutoSend`
   * flag set to `true`.
   *
   * Risk level: MEDIUM — relationship paths are suggestions, not automated actions.
   *
   * Kill switch: the IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED feature flag
   * gates this capability. When disabled, the result will have isEnabled=false.
   */
  async suggestRelationshipPaths(
    sourcePersonId: string,
    targetPersonId: string | null,
    targetExecutiveProfileId: string | null,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<RelationshipPathSuggestionResult> {
    const traceId = this.generateTraceId();

    // 1. Kill switch: check feature flag
    const isEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
      workspaceId,
    );

    if (!isEnabled) {
      return {
        sourcePersonId,
        targetPersonId: targetPersonId ?? '',
        targetExecutiveProfileId,
        paths: [],
        summary:
          'AI-powered relationship path suggestions are currently disabled for this workspace.',
        traceId,
        isEnabled: false,
        noAutoSend: true,
      };
    }

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // 2. Sanitize input through AI context firewall
        this.aiContextFirewallService.assertAiContextAllowlistSafe([
          'sourcePersonId',
          'targetPersonId',
          'summary',
          'relationshipType',
          'strength',
          'source',
          'context',
          'notes',
        ]);

        // 3. Resolve target person from executive profile if targetPersonId is not provided
        let resolvedTargetPersonId = targetPersonId;

        if (!resolvedTargetPersonId && targetExecutiveProfileId) {
          const executiveProfileRepo =
            await this.globalWorkspaceOrmManager.getRepository<ExecutiveProfileWorkspaceEntity>(
              workspaceId,
              ExecutiveProfileWorkspaceEntity,
              { shouldBypassPermissionChecks: true },
            );

          const profile = await executiveProfileRepo.findOne({
            where: { id: targetExecutiveProfileId },
          });

          if (!profile) {
            throw new ExecutiveSearchException(
              'EXECUTIVE_PROFILE_NOT_FOUND' as any,
              `Executive profile ${targetExecutiveProfileId} not found`,
            );
          }

          resolvedTargetPersonId = profile.personId;
        }

        if (!resolvedTargetPersonId) {
          throw new ExecutiveSearchException(
            'TARGET_PERSON_REQUIRED' as any,
            'Either targetPersonId or targetExecutiveProfileId must be provided',
          );
        }

        // 4. Load relationship edges for both source and target
        const relationshipEdgeRepo =
          await this.globalWorkspaceOrmManager.getRepository<RelationshipEdgeWorkspaceEntity>(
            workspaceId,
            RelationshipEdgeWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        // Source person's relationships
        const sourceEdges = await relationshipEdgeRepo.find({
          where: [
            { sourcePersonId },
            { targetPersonId: sourcePersonId },
          ],
        });

        // Target person's relationships
        const targetEdges = await relationshipEdgeRepo.find({
          where: [
            { sourcePersonId: resolvedTargetPersonId },
            { targetPersonId: resolvedTargetPersonId },
          ],
        });

        // 5. Load person names for display
        const personRepo =
          await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            workspaceId,
            PersonWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const allPersonIds = this.collectPersonIds(
          sourcePersonId,
          resolvedTargetPersonId,
          sourceEdges,
          targetEdges,
        );

        const persons = await personRepo.find({
          where: allPersonIds.map((id) => ({ id })),
        });

        const personNameMap = new Map<string, string>();
        for (const person of persons) {
          const fullName = `${person.name?.firstName ?? ''} ${person.name?.lastName ?? ''}`.trim();
          personNameMap.set(person.id, fullName || person.id);
        }
        personNameMap.set(sourcePersonId, personNameMap.get(sourcePersonId) ?? 'Source');
        personNameMap.set(
          resolvedTargetPersonId,
          personNameMap.get(resolvedTargetPersonId) ?? 'Target',
        );

        // 6. Find relationship paths (direct + 1-hop)
        const paths = this.findPaths(
          sourcePersonId,
          resolvedTargetPersonId,
          sourceEdges,
          targetEdges,
          personNameMap,
        );

        // 7. Build summary
        const summary = this.buildSummary(
          personNameMap.get(sourcePersonId) ?? sourcePersonId,
          personNameMap.get(resolvedTargetPersonId) ?? resolvedTargetPersonId,
          paths,
        );

        return {
          sourcePersonId,
          targetPersonId: resolvedTargetPersonId,
          targetExecutiveProfileId,
          paths,
          summary,
          traceId,
          isEnabled: true,
          noAutoSend: true,
        };
      },
      authContext,
    );
  }

  /**
   * Collect all unique person IDs from edges for batch lookup.
   */
  private collectPersonIds(
    sourcePersonId: string,
    targetPersonId: string,
    sourceEdges: RelationshipEdgeWorkspaceEntity[],
    targetEdges: RelationshipEdgeWorkspaceEntity[],
  ): string[] {
    const ids = new Set<string>([sourcePersonId, targetPersonId]);

    for (const edge of [...sourceEdges, ...targetEdges]) {
      if (edge.sourcePersonId) ids.add(edge.sourcePersonId);
      if (edge.targetPersonId) ids.add(edge.targetPersonId);
    }

    return Array.from(ids);
  }

  /**
   * Find relationship paths between source and target persons.
   * Searches for direct edges and 1-hop intermediate connections.
   */
  private findPaths(
    sourcePersonId: string,
    targetPersonId: string,
    sourceEdges: RelationshipEdgeWorkspaceEntity[],
    targetEdges: RelationshipEdgeWorkspaceEntity[],
    personNameMap: Map<string, string>,
  ): RelationshipPath[] {
    const paths: RelationshipPath[] = [];

    // 1. DIRECT PATH: check if there's a direct edge between source and target
    const directEdge = sourceEdges.find(
      (e) =>
        (e.sourcePersonId === targetPersonId &&
          e.targetPersonId === sourcePersonId) ||
        (e.sourcePersonId === sourcePersonId &&
          e.targetPersonId === targetPersonId),
    );

    if (directEdge) {
      const strength = directEdge.strength ?? 'UNKNOWN';
      const confidence = this.strengthToConfidence(strength);

      paths.push({
        steps: [
          {
            personId: sourcePersonId,
            personName: personNameMap.get(sourcePersonId) ?? 'Source',
            edgeSummary: null,
            edgeStrength: '',
            edgeSource: '',
          },
          {
            personId: targetPersonId,
            personName: personNameMap.get(targetPersonId) ?? 'Target',
            edgeSummary: directEdge.summary,
            edgeStrength: strength,
            edgeSource: directEdge.source ?? 'UNKNOWN',
          },
        ],
        pathLength: 1,
        averageConfidence: confidence,
        summary: `Direct relationship between ${personNameMap.get(sourcePersonId) ?? 'source'} and ${personNameMap.get(targetPersonId) ?? 'target'} (strength: ${strength}, source: ${directEdge.source ?? 'unknown'})`,
      });
    }

    // 2. ONE-HOP PATHS: find intermediaries connected to both source and target
    const intermediaryIds = this.findIntermediaries(
      sourcePersonId,
      targetPersonId,
      sourceEdges,
      targetEdges,
    );

    for (const intermediaryId of intermediaryIds) {
      const edgeToSource = this.getEdgeBetween(
        sourcePersonId,
        intermediaryId,
        sourceEdges,
      );
      const edgeToTarget = this.getEdgeBetween(
        intermediaryId,
        targetPersonId,
        targetEdges,
      );

      if (!edgeToSource || !edgeToTarget) continue;

      const confidence =
        (this.strengthToConfidence(edgeToSource.strength ?? 'UNKNOWN') +
          this.strengthToConfidence(edgeToTarget.strength ?? 'UNKNOWN')) /
        2;

      paths.push({
        steps: [
          {
            personId: sourcePersonId,
            personName: personNameMap.get(sourcePersonId) ?? 'Source',
            edgeSummary: null,
            edgeStrength: '',
            edgeSource: '',
          },
          {
            personId: intermediaryId,
            personName: personNameMap.get(intermediaryId) ?? 'Unknown',
            edgeSummary: edgeToSource.summary,
            edgeStrength: edgeToSource.strength ?? 'UNKNOWN',
            edgeSource: edgeToSource.source ?? 'UNKNOWN',
          },
          {
            personId: targetPersonId,
            personName: personNameMap.get(targetPersonId) ?? 'Target',
            edgeSummary: edgeToTarget.summary,
            edgeStrength: edgeToTarget.strength ?? 'UNKNOWN',
            edgeSource: edgeToTarget.source ?? 'UNKNOWN',
          },
        ],
        pathLength: 2,
        averageConfidence: Math.round(confidence * 100) / 100,
        summary: `Path via ${personNameMap.get(intermediaryId) ?? 'intermediary'} (${edgeToSource.summary ?? 'connection'}; ${edgeToTarget.summary ?? 'connection'})`,
      });
    }

    // Sort by confidence descending, then by path length ascending
    paths.sort((a, b) => {
      if (b.averageConfidence !== a.averageConfidence) {
        return b.averageConfidence - a.averageConfidence;
      }
      return a.pathLength - b.pathLength;
    });

    return paths;
  }

  /**
   * Find persons who have relationships with both source and target.
   */
  private findIntermediaries(
    sourcePersonId: string,
    targetPersonId: string,
    sourceEdges: RelationshipEdgeWorkspaceEntity[],
    targetEdges: RelationshipEdgeWorkspaceEntity[],
  ): string[] {
    const sourceConnections = new Set<string>();

    for (const edge of sourceEdges) {
      if (edge.sourcePersonId === sourcePersonId && edge.targetPersonId) {
        sourceConnections.add(edge.targetPersonId);
      }
      if (edge.targetPersonId === sourcePersonId && edge.sourcePersonId) {
        sourceConnections.add(edge.sourcePersonId);
      }
    }

    const targetConnections = new Set<string>();
    for (const edge of targetEdges) {
      if (
        edge.sourcePersonId === targetPersonId &&
        edge.targetPersonId
      ) {
        targetConnections.add(edge.targetPersonId);
      }
      if (
        edge.targetPersonId === targetPersonId &&
        edge.sourcePersonId
      ) {
        targetConnections.add(edge.sourcePersonId);
      }
    }

    return Array.from(sourceConnections).filter(
      (id) => targetConnections.has(id),
    );
  }

  /**
   * Get the relationship edge between two persons, if one exists.
   */
  private getEdgeBetween(
    personA: string,
    personB: string,
    edges: RelationshipEdgeWorkspaceEntity[],
  ): RelationshipEdgeWorkspaceEntity | null {
    return (
      edges.find(
        (e) =>
          (e.sourcePersonId === personA && e.targetPersonId === personB) ||
          (e.sourcePersonId === personB && e.targetPersonId === personA),
      ) ?? null
    );
  }

  /**
   * Convert relationship strength to a numeric confidence score.
   */
  private strengthToConfidence(strength: string): number {
    switch (strength) {
      case 'STRONG':
        return 0.9;
      case 'MODERATE':
        return 0.65;
      case 'WEAK':
        return 0.35;
      case 'UNKNOWN':
      default:
        return 0.2;
    }
  }

  /**
   * Build a human-readable summary of the suggestion results.
   */
  private buildSummary(
    sourceName: string,
    targetName: string,
    paths: RelationshipPath[],
  ): string {
    if (paths.length === 0) {
      return `No relationship paths found between ${sourceName} and ${targetName}. Consider expanding the relationship network or searching for alternative connections.`;
    }

    const directPaths = paths.filter((p) => p.pathLength === 1).length;
    const indirectPaths = paths.filter((p) => p.pathLength > 1).length;

    const parts: string[] = [
      `Found ${paths.length} relationship path(s) between ${sourceName} and ${targetName}`,
    ];

    if (directPaths > 0) {
      parts.push(`${directPaths} direct connection(s)`);
    }
    if (indirectPaths > 0) {
      parts.push(`${indirectPaths} indirect path(s) via mutual connections`);
    }

    parts.push(
      'All suggestions are advisory. No automated outreach — user must explicitly decide to initiate contact.',
    );

    return parts.join('. ') + '.';
  }

  /**
   * Generate a unique trace ID for audit/provenance tracking.
   */
  private generateTraceId(): string {
    return `rel-path-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}
