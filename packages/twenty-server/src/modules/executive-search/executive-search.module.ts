import { Module } from '@nestjs/common';

import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';
import { DirectusModule } from 'src/modules/executive-search/directus/directus.module';
import { CountReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/count-reconciliation.engine';
import { ReferentialIntegrityEngine } from 'src/modules/executive-search/reconciliation/engines/referential-integrity.engine';
import { ReconciliationEngineRegistry } from 'src/modules/executive-search/reconciliation/reconciliation-engine.registry';
import { ExecutiveSearchOutboxService } from 'src/modules/executive-search/sync/services/outbox.service';
import { ExecutiveSearchInboxService } from 'src/modules/executive-search/sync/services/inbox.service';
import { ExecutiveSearchDLQService } from 'src/modules/executive-search/sync/services/dlq.service';
import { ExecutiveSearchReplayService } from 'src/modules/executive-search/sync/services/replay.service';
import { ExecutiveSearchReconciliationService } from 'src/modules/executive-search/sync/services/reconciliation.service';
import { ExecutiveSearchOutboxRedriveCronCommand } from 'src/modules/executive-search/sync/jobs/executive-sync-outbox-redrive.cron.command';
import { OutboundEventMapperService } from 'src/modules/executive-search/outbound/services/outbound-event-mapper.service';
import { OutboundHmacSignerService } from 'src/modules/executive-search/outbound/services/outbound-hmac-signer.service';
import { DirectusConnectionConfigService } from 'src/modules/executive-search/outbound/services/directus-connection-config.service';
import { OutboundProjectionService } from 'src/modules/executive-search/outbound/services/outbound-projection.service';
import { OutboundProjectionListener } from 'src/modules/executive-search/outbound/listeners/outbound-projection.listener';
import { ExternalEntityLinkWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-entity-link.workspace-entity';
import { ExternalSyncOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-outbox.workspace-entity';
import { ExternalSyncInboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-inbox.workspace-entity';
import { ExternalSyncDLQWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-dlq.workspace-entity';
import { ExternalSyncCheckpointWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-checkpoint.workspace-entity';
import { ExternalSyncReconciliationWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-reconciliation.workspace-entity';
import { AssignmentStatusTransitionService } from 'src/modules/executive-search/services/assignment-status-transition.service';
import { ConvertOpportunityToAssignmentService } from 'src/modules/executive-search/services/convert-opportunity-to-assignment.service';
import { OffLimitsGuardService } from 'src/modules/executive-search/services/off-limits-guard.service';
import { CandidacyStateTransitionService } from 'src/modules/executive-search/services/candidacy-state-transition.service';
import { ConvertOpportunityToAssignmentResolver } from 'src/modules/executive-search/resolvers/convert-opportunity-to-assignment.resolver';
import { ShadowSyncDriftReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/shadow-sync-drift.engine';
import { ExecutiveShadowSyncDriftCronCommand } from 'src/modules/executive-search/migration/jobs/executive-shadow-sync-drift.cron.command';
import { IdentityMatchingService } from 'src/modules/executive-search/migration/services/identity-matching.service';
import { RetentionActionService } from 'src/modules/executive-search/migration/services/retention-action.service';
import { RetentionActionReconciliationEngine } from 'src/modules/executive-search/reconciliation/engines/retention-action-reconciliation.engine';
import { RetentionActionLogWorkspaceEntity } from 'src/modules/executive-search/standard-objects/retention-action-log.workspace-entity';
import { ExternalIdentityMatchQueueWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-identity-match-queue.workspace-entity';
import { AmbiguousMatchQueueService } from 'src/modules/executive-search/migration/services/ambiguous-match-queue.service';
import { BackfillService } from 'src/modules/executive-search/migration/services/backfill.service';
import { CutoverService } from 'src/modules/executive-search/migration/services/cutover.service';
import { RollbackService } from 'src/modules/executive-search/migration/services/rollback.service';
import { AmbiguousMatchQueueResolver } from 'src/modules/executive-search/migration/resolvers/ambiguous-match-queue.resolver';
import { ComputeAnalyticsMetricResolver } from 'src/modules/executive-search/resolvers/compute-analytics-metric.resolver';
import { ComputeAnalyticsMetricService } from 'src/modules/executive-search/services/compute-analytics-metric.service';

@Module({
  imports: [
    ObjectMetadataRepositoryModule.forFeature([
      ExternalEntityLinkWorkspaceEntity,
      ExternalSyncOutboxWorkspaceEntity,
      ExternalSyncInboxWorkspaceEntity,
      ExternalSyncDLQWorkspaceEntity,
      ExternalSyncCheckpointWorkspaceEntity,
      ExternalSyncReconciliationWorkspaceEntity,
      RetentionActionLogWorkspaceEntity,
      ExternalIdentityMatchQueueWorkspaceEntity,
    ]),
    TwentyORMModule,
    DirectusModule,
    WorkspaceEventEmitterModule,
  ],
  providers: [
    ReconciliationEngineRegistry,
    CountReconciliationEngine,
    ReferentialIntegrityEngine,
    ExecutiveSearchOutboxService,
    ExecutiveSearchInboxService,
    ExecutiveSearchDLQService,
    ExecutiveSearchReplayService,
    ExecutiveSearchReconciliationService,
    ExecutiveSearchOutboxRedriveCronCommand,
    OutboundHmacSignerService,
    DirectusConnectionConfigService,
    OutboundEventMapperService,
    OutboundProjectionService,
    OutboundProjectionListener,
    ConvertOpportunityToAssignmentService,
    AssignmentStatusTransitionService,
    OffLimitsGuardService,
    CandidacyStateTransitionService,
    ConvertOpportunityToAssignmentResolver,
    ShadowSyncDriftReconciliationEngine,
    ExecutiveShadowSyncDriftCronCommand,
    IdentityMatchingService,
    AmbiguousMatchQueueService,
    BackfillService,
    RetentionActionService,
    RetentionActionReconciliationEngine,
    CutoverService,
    RollbackService,
    AmbiguousMatchQueueResolver,,
ComputeAnalyticsMetricResolver,
    ComputeAnalyticsMetricService,
  ],
  exports: [
    ExecutiveSearchOutboxService,
    ExecutiveSearchDLQService,
    ExecutiveSearchReplayService,
    ExecutiveSearchReconciliationService,
    ExecutiveSearchOutboxRedriveCronCommand,
    OutboundHmacSignerService,
    DirectusConnectionConfigService,
    OutboundEventMapperService,
    OutboundProjectionService,
    ConvertOpportunityToAssignmentService,
    AssignmentStatusTransitionService,
    OffLimitsGuardService,
    CandidacyStateTransitionService,
    ReconciliationEngineRegistry,
    ShadowSyncDriftReconciliationEngine,
    IdentityMatchingService,
    AmbiguousMatchQueueService,
    BackfillService,
    RetentionActionService,
    CutoverService,
    RollbackService,
  ],
})
export class ExecutiveSearchModule {}
