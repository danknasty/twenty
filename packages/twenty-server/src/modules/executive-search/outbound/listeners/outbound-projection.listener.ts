import { Injectable, Logger } from '@nestjs/common';
import { FeatureFlagKey } from 'twenty-shared/types';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import { OutboundEventMapperService } from 'src/modules/executive-search/outbound/services/outbound-event-mapper.service';
import { RetentionActionService } from 'src/modules/executive-search/migration/services/retention-action.service';
import { ExecutiveSearchOutboxService } from 'src/modules/executive-search/sync/services/outbox.service';
import { ObjectRecordCreateEvent, ObjectRecordDestroyEvent, ObjectRecordDeleteEvent, ObjectRecordUpdateEvent } from 'twenty-shared/database-events';

@Injectable()
export class OutboundProjectionListener {
  private readonly logger = new Logger(OutboundProjectionListener.name);

  constructor(
    private readonly outboxService: ExecutiveSearchOutboxService,
    private readonly mapper: OutboundEventMapperService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly retentionActionService: RetentionActionService,
  ) {}

  @OnDatabaseBatchEvent('company', DatabaseEventAction.CREATED)
  async handleCompanyCreated(
    payload: WorkspaceEventBatch<ObjectRecordCreateEvent>,
  ): Promise<void> {
    await this.handleCompanyEvents(payload, DatabaseEventAction.CREATED);
  }

  @OnDatabaseBatchEvent('company', DatabaseEventAction.UPDATED)
  async handleCompanyUpdated(
    payload: WorkspaceEventBatch<ObjectRecordUpdateEvent>,
  ): Promise<void> {
    await this.handleCompanyEvents(payload, DatabaseEventAction.UPDATED);
  }

  @OnDatabaseBatchEvent('company', DatabaseEventAction.DELETED)
  async handleCompanyDeleted(
    payload: WorkspaceEventBatch<ObjectRecordDeleteEvent>,
  ): Promise<void> {
    await this.handleCompanyEvents(payload, DatabaseEventAction.DELETED);
  }

  @OnDatabaseBatchEvent('company', DatabaseEventAction.DESTROYED)
  async handleCompanyDestroyed(
    payload: WorkspaceEventBatch<ObjectRecordDestroyEvent>,
  ): Promise<void> {
    await this.handleCompanyEvents(payload, DatabaseEventAction.DESTROYED);
  }

  private async handleCompanyEvents(
    payload: WorkspaceEventBatch<any>,
    action: DatabaseEventAction,
  ): Promise<void> {
    const { workspaceId, events } = payload;

    // Guard: skip if no workspaceId or no events
    if (!workspaceId || !events?.length) return;

    // Feature-flag gate
    if (
      !(await this.featureFlagService.isFeatureEnabled(
        FeatureFlagKey.IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED,
        workspaceId,
      ))
    ) {
      return;
    }

    for (const event of events) {
      const isDeletion =
        action === DatabaseEventAction.DELETED ||
        action === DatabaseEventAction.DESTROYED;
      const record = isDeletion ? event.properties.before : event.properties.after;

      if (!record) continue;

      // Legal-hold hold-check: block outbound DELETE / DESTROY propagation for
      // records currently under legal hold. The hold is recorded in
      // `retentionActionLog` and queried via `isUnderLegalHold`.
      if (isDeletion) {
        const underLegalHold =
          await this.retentionActionService.isUnderLegalHold(
            workspaceId,
            'company',
            event.recordId,
          );

        if (underLegalHold) {
          this.logger.warn(
            `Blocking outbound DELETE for company ${event.recordId} — record is under legal hold`,
          );
          continue;
        }
      }

      // Map to event type (the mapper returns correct eventType per action)
      const mapped = this.mapper.mapCompanyEvent(action, record);

      // Build domain idempotency key (updatedAt is always present on Twenty standard objects)
      const domainIdempotencyKey = `${workspaceId}:${mapped.eventType}:${event.recordId}:${record.updatedAt}`;

      // Enqueue
      await this.outboxService.enqueue({
        workspaceId,
        eventType: mapped.eventType,
        entityName: 'company',
        entityId: event.recordId,
        domainIdempotencyKey,
        payload: mapped.payload,
      });
    }
  }
}
// TODO: Add opportunity listener once BQ1 (searchAssignment vs CRM opportunity) is resolved
