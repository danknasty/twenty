import { Injectable } from '@nestjs/common';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceEntityManager } from 'src/engine/twenty-orm/entity-manager/workspace-entity-manager';
import { ConvertOpportunityToAssignmentDTO } from 'src/modules/executive-search/dtos/convert-opportunity-to-assignment.dto';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';
import { AssignmentTeamMemberRole } from 'src/modules/executive-search/common/enums/assignment-team-member-role.enum';
import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';
import { SearchEngagementTermsStatus } from 'src/modules/executive-search/common/enums/search-engagement-terms-status.enum';
import { SearchMilestoneStatus } from 'src/modules/executive-search/common/enums/search-milestone-status.enum';
import { SearchAssignmentWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-assignment.workspace-entity';
import { AssignmentTeamMemberWorkspaceEntity } from 'src/modules/executive-search/standard-objects/assignment-team-member.workspace-entity';
import { SearchMilestoneWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-milestone.workspace-entity';
import { SearchEngagementTermsWorkspaceEntity } from 'src/modules/executive-search/standard-objects/search-engagement-terms.workspace-entity';
import { OffLimitsGuardService } from 'src/modules/executive-search/services/off-limits-guard.service';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

@Injectable()
export class ConvertOpportunityToAssignmentService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly offLimitsGuardService: OffLimitsGuardService,
  ) {}

  async convertOpportunityToAssignment(
    opportunityId: string,
    workspaceId: string,
    authContext: WorkspaceAuthContext,
  ): Promise<ConvertOpportunityToAssignmentDTO> {
    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        // 1. Load opportunity
        const opportunityRepository =
          await this.globalWorkspaceOrmManager.getRepository<OpportunityWorkspaceEntity>(
            workspaceId,
            OpportunityWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const opportunity = await opportunityRepository.findOne({
          where: { id: opportunityId },
        });

        if (!opportunity) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_FOUND,
            `Opportunity with id ${opportunityId} not found`,
          );
        }

        // 2. Idempotency check — return existing assignment if already converted
        const searchAssignmentRepository =
          await this.globalWorkspaceOrmManager.getRepository<SearchAssignmentWorkspaceEntity>(
            workspaceId,
            SearchAssignmentWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const existingAssignment = await searchAssignmentRepository.findOne({
          where: { opportunityId: opportunity.id },
        });

        if (existingAssignment) {
          return {
            assignmentId: existingAssignment.id,
            status: existingAssignment.status,
          };
        }

        // 3. Assert opportunity is won (stage === 'CUSTOMER')
        if (opportunity.stage !== 'CUSTOMER') {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_WON,
            `Opportunity ${opportunityId} is not in won stage`,
          );
        }

        // 4. Resolve client company
        if (!opportunity.companyId) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.CLIENT_COMPANY_REQUIRED,
            `Opportunity ${opportunityId} has no company assigned`,
          );
        }

        // 5. Find approved engagement terms
        const engagementTermsRepository =
          await this.globalWorkspaceOrmManager.getRepository<SearchEngagementTermsWorkspaceEntity>(
            workspaceId,
            SearchEngagementTermsWorkspaceEntity,
            { shouldBypassPermissionChecks: true },
          );

        const approvedTerms = await engagementTermsRepository.findOne({
          where: {
            opportunityId: opportunity.id,
            status: SearchEngagementTermsStatus.APPROVED,
          },
        });

        if (!approvedTerms) {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.NO_APPROVED_ENGAGEMENT_TERMS,
            `No approved engagement terms for opportunity ${opportunityId}`,
          );
        }

        // 6. Off-limits guard check
        const offLimitsResult = await this.offLimitsGuardService.check();

        if (offLimitsResult.status !== 'CLEAR') {
          throw new ExecutiveSearchException(
            ExecutiveSearchExceptionCode.OFF_LIMITS_BLOCKED,
            'Off-limits check failed',
          );
        }

        // 7. DB transaction – all writes atomically
        const workspaceDataSource =
          await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

        return workspaceDataSource.transaction(
          async (transactionManager: WorkspaceEntityManager) => {
            // a. Create searchAssignment
            const assignmentInsert = await searchAssignmentRepository.insert(
              {
                name: `${opportunity.name} — Search`,
                status: SearchAssignmentStatus.BD_HANDOFF,
                clientCompanyId: opportunity.companyId,
                opportunityId: opportunity.id,
                engagementTermsId: approvedTerms.id,
              } as any,
              // oxlint-disable-next-line typescript/no-explicit-any
              transactionManager as any,
            );

            const assignmentId =
              assignmentInsert.identifiers[0]?.id as string;

            // b. Create assignmentTeamMember for opportunity owner (if set)
            if (opportunity.ownerId) {
              const teamMemberRepository =
                await this.globalWorkspaceOrmManager.getRepository<AssignmentTeamMemberWorkspaceEntity>(
                  workspaceId,
                  AssignmentTeamMemberWorkspaceEntity,
                  { shouldBypassPermissionChecks: true },
                );

              await teamMemberRepository.insert(
                {
                  workspaceMemberId: opportunity.ownerId,
                  role: AssignmentTeamMemberRole.PARTNER,
                  isLead: true,
                  assignmentId,
                } as any,
                // oxlint-disable-next-line typescript/no-explicit-any
                transactionManager as any,
              );
            }

            // c. Create searchMilestone (Kickoff)
            const milestoneRepository =
              await this.globalWorkspaceOrmManager.getRepository<SearchMilestoneWorkspaceEntity>(
                workspaceId,
                SearchMilestoneWorkspaceEntity,
                { shouldBypassPermissionChecks: true },
              );

            await milestoneRepository.insert(
              {
                name: 'Kickoff',
                status: SearchMilestoneStatus.PENDING,
                assignmentId,
              } as any,
              // oxlint-disable-next-line typescript/no-explicit-any
              transactionManager as any,
            );

            // d. Write timelineActivity
            const timelineActivityRepository =
              await this.globalWorkspaceOrmManager.getRepository<TimelineActivityWorkspaceEntity>(
                workspaceId,
                'timelineActivity',
                { shouldBypassPermissionChecks: true },
              );

            await timelineActivityRepository.insert(
              {
                name: 'searchAssignment.created',
                properties: {},
                workspaceMemberId:
                  authContext.type === 'user'
                    ? authContext.workspaceMemberId
                    : null,
              } as any,
              // oxlint-disable-next-line typescript/no-explicit-any
              transactionManager as any,
            );

            return {
              assignmentId,
              status: SearchAssignmentStatus.BD_HANDOFF,
            };
          },
        );
      },
      authContext,
    );
  }
}
