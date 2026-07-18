import { Injectable } from '@nestjs/common';

import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CandidacyStageEventWorkspaceEntity } from 'src/modules/executive-search/standard-objects/candidacy-stage-event.workspace-entity';
import { SearchCandidacyWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-candidacy.workspace-entity';
import { CANDIDACY_STATUS_TRANSITIONS } from 'src/modules/executive-search/constants/candidacy-status-transitions.constant';
import { CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';
import { OffLimitsGuardService } from 'src/modules/executive-search/services/off-limits-guard.service';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

@Injectable()
export class CandidacyStateTransitionService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly offLimitsGuardService: OffLimitsGuardService,
  ) {}

  validateTransition(
    from: CandidacyStatus,
    to: CandidacyStatus,
  ): boolean {
    const allowed = CANDIDACY_STATUS_TRANSITIONS[from];

    return allowed.includes(to);
  }

  getAllowedTransitions(from: CandidacyStatus): CandidacyStatus[] {
    return CANDIDACY_STATUS_TRANSITIONS[from];
  }

  async transition(
    candidacy: SearchCandidacyWorkspaceEntity,
    to: CandidacyStatus,
    actorId?: string,
    actorKind?: string,
    reason?: string,
  ): Promise<CandidacyStageEventWorkspaceEntity> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const from = candidacy.status;

        // 1. Validate the transition is legal
        const allowed = CANDIDACY_STATUS_TRANSITIONS[from];

        if (!allowed.includes(to)) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION,
            `Invalid candidacy status transition from ${from} to ${to}`,
          );
        }

        // 2. Perform the transition in an atomic transaction
        const workspaceDataSource =
          await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

        return workspaceDataSource.transaction(
          async (transactionManager) => {
            const candidacyRepository =
              await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
                getWorkspaceId(),
                SearchCandidacyWorkspaceEntity,
                { shouldBypassPermissionChecks: true },
              );

            const stageEventRepository =
              await this.globalWorkspaceOrmManager.getRepository<CandidacyStageEventWorkspaceEntity>(
                getWorkspaceId(),
                CandidacyStageEventWorkspaceEntity,
                { shouldBypassPermissionChecks: true },
              );

            // 3. Update the candidacy status
            await candidacyRepository.update(
              { id: candidacy.id },
              { status: to } as any,
              // oxlint-disable-next-line typescript/no-explicit-any
              transactionManager as any,
            );

            // 4. Create the stage event record
            const transitionedAt = new Date().toISOString();

            const eventInsert = await stageEventRepository.insert(
              {
                candidacyId: candidacy.id,
                stage: to,
                stageFrom: from,
                stageTo: to,
                transitionedAt,
                transitionedById: actorId ?? null,
                actorKind: actorKind ?? null,
                reason: reason ?? null,
              } as any,
              // oxlint-disable-next-line typescript/no-explicit-any
              transactionManager as any,
            );

            const eventId =
              eventInsert.identifiers[0]?.id as string;

            return {
              id: eventId,
              candidacyId: candidacy.id,
              stage: to,
              stageFrom: from,
              stageTo: to,
              transitionedAt,
              transitionedById: actorId ?? null,
              actorKind: actorKind ?? null,
              reason: reason ?? null,
              candidacy: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
            } as CandidacyStageEventWorkspaceEntity;
          },
        );
      },
    );
  }

  async checkOffLimitsAndConflicts(
    candidacyId: string,
  ): Promise<{ blocked: boolean; reason?: string }> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // Load the candidacy to find the associated person/company
        const candidacyRepository =
          await this.globalWorkspaceOrmManager.getRepository<SearchCandidacyWorkspaceEntity>(
            getWorkspaceId(),
            SearchCandidacyWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const candidacy = await candidacyRepository.findOne({
          where: { id: candidacyId },
        });

        if (!candidacy) {
          return { blocked: false };
        }

        // Check OffLimitsRestriction records related to the person or company
        const offLimitsResult =
          await this.offLimitsGuardService.check();

        if (offLimitsResult.status !== 'CLEAR') {
          return {
            blocked: true,
            reason: 'Off-limits restriction blocks this candidacy',
          };
        }

        // Check ConflictCheck records for the person
        const conflictCheckRepository =
          await this.globalWorkspaceOrmManager.getRepository<any>(
            getWorkspaceId(),
            'conflictCheck',
            { shouldBypassPermissionChecks: true },
          );

        const conflictChecks = await conflictCheckRepository.find({
          where: { subjectPersonId: candidacy.personId },
        });

        const blockingConflict = conflictChecks.find(
          (check: any) => check.outcome === 'CONFIRMED',
        );

        if (blockingConflict) {
          return {
            blocked: true,
            reason: blockingConflict.outcomeReason ?? 'Conflict detected',
          };
        }

        return { blocked: false };
      },
    );
  }
}

/**
 * Helper to retrieve the workspaceId from the async local storage auth context.
 * Must be called within an executeInWorkspaceContext callback or a GraphQL resolver context.
 */
function getWorkspaceId(): string {
  const authContext = getWorkspaceAuthContext();

  return authContext.workspace.id;
}
