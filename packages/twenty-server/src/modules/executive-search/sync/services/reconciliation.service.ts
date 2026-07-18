import { Injectable, Logger } from '@nestjs/common';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ExternalSyncReconciliationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-reconciliation.workspace-entity';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import type { ReconciliationFinding } from 'src/modules/executive-search/reconciliation/reconciliation-finding.type';

export const RECONCILIATION_STATUS = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type RunPostMigrationCheckOptions = {
  objectName?: string;
  recordIds?: string[];
};

/**
 * Reconciliation service.
 *
 * Tracks reconciliation runs that compare Twenty records against
 * external system records. Findings are stored as structured JSON.
 */
@Injectable()
export class ExecutiveSearchReconciliationService {
  private readonly logger = new Logger(
    ExecutiveSearchReconciliationService.name,
  );

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly reconciliationEngineRegistry: ReconciliationEngineRegistry,
  ) {}

  /**
   * Start a new reconciliation run.
   */
  async startRun(
    workspaceId: string,
    externalSystemName: string,
    entityName: string,
  ): Promise<ExternalSyncReconciliationWorkspaceEntity> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository = await this.globalWorkspaceOrmManager.getRepository(
          workspaceId,
          ExternalSyncReconciliationWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        const entity = repository.create({
          workspaceId,
          externalSystemName,
          entityName,
          startedAt: new Date().toISOString(),
          completedAt: null,
          status: RECONCILIATION_STATUS.RUNNING,
          totalCompared: 0,
          matched: 0,
          onlyInTwenty: 0,
          onlyInExternal: 0,
          differenceCount: 0,
          findings: null,
        });

        return repository.save(entity);
      },
      authContext,
    );
  }

  /**
   * Complete a reconciliation run with results.
   */
  async completeRun(
    workspaceId: string,
    runId: string,
    results: {
      totalCompared: number;
      matched: number;
      onlyInTwenty: number;
      onlyInExternal: number;
      differenceCount: number;
      findings: Record<string, unknown> | null;
    },
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repository = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalSyncReconciliationWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      // TwentyORM workspace-scoped repository update expects plain values
      await repository.update(runId, {
        status: RECONCILIATION_STATUS.COMPLETED,
        completedAt: new Date().toISOString(),
        totalCompared: results.totalCompared,
        matched: results.matched,
        onlyInTwenty: results.onlyInTwenty,
        onlyInExternal: results.onlyInExternal,
        differenceCount: results.differenceCount,
        findings: results.findings,
      } as any);
    }, authContext);
  }

  /**
   * List recent reconciliation runs.
   */
  async listRecent(
    workspaceId: string,
    limit = 20,
  ): Promise<ExternalSyncReconciliationWorkspaceEntity[]> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository = await this.globalWorkspaceOrmManager.getRepository(
          workspaceId,
          ExternalSyncReconciliationWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        return repository.find({
          order: { startedAt: 'DESC' },
          take: limit,
        });
      },
      authContext,
    );
  }

  /**
   * Run the post-migration reconciliation check.
   *
   * Executes both read-only reconciliation engines (count comparison and
   * referential-integrity), persists the aggregated findings to a new
   * `externalSyncReconciliation` run, and returns the findings.
   *
   * Each engine enumerates its own entity pairs and ignores `objectName` /
   * `recordIds`, which are only accepted for interface compatibility.
   */
  async runPostMigrationCheck(
    workspaceId: string,
    options?: RunPostMigrationCheckOptions,
  ): Promise<ReconciliationFinding[]> {
    const countEngine = this.reconciliationEngineRegistry.get(
      'count-reconciliation',
    );
    const referentialEngine = this.reconciliationEngineRegistry.get(
      'referential-integrity',
    );

    const run = await this.startRun(
      workspaceId,
      'directus',
      'post-migration-check',
    );

    const reconcileArgs = {
      workspaceId,
      objectName: options?.objectName ?? 'post-migration-check',
      ...(options?.recordIds ? { recordIds: options.recordIds } : {}),
    };

    const findings: ReconciliationFinding[] = [];

    try {
      const [countFindings, referentialFindings] = await Promise.all([
        countEngine.reconcile(reconcileArgs),
        referentialEngine.reconcile(reconcileArgs),
      ]);

      findings.push(...countFindings, ...referentialFindings);
    } catch (error) {
      this.logger.error(
        `Post-migration reconciliation failed: ${this.formatError(error)}`,
      );

      await this.completeRun(workspaceId, run.id, {
        totalCompared: findings.length,
        matched: 0,
        onlyInTwenty: 0,
        onlyInExternal: 0,
        differenceCount: findings.length,
        findings: {
          status: 'failed',
          error: this.formatError(error),
          partialFindings: findings,
        },
      });

      throw error;
    }

    const onlyInExternal = findings.filter(
      (finding) =>
        finding.kind === 'EXISTENCE' && finding.detail.startsWith('Directus'),
    ).length;
    const onlyInTwenty = findings.filter(
      (finding) =>
        finding.kind === 'EXISTENCE' && finding.detail.startsWith('Twenty'),
    ).length;

    await this.completeRun(workspaceId, run.id, {
      totalCompared: findings.length,
      matched: 0,
      onlyInTwenty,
      onlyInExternal,
      differenceCount: findings.length,
      findings: { findings },
    });

    return findings;
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
