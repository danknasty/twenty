/* @license Enterprise */

import { Logger } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { OUTBOX_RELAY_JOB_NAME } from 'src/engine/core-modules/executive-search/executive-search.constants';
import { OutboxService } from 'src/engine/core-modules/executive-search/services/outbox.service';
import { OutboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/outbound-event-ledger.service';
import { computeContentHash } from 'src/engine/core-modules/executive-search/utils/compute-content-hash.util';

export type OutboxRelayJobData = {
  workspaceId: string;
};

/**
 * Outbox relay job.
 *
 * Drains PENDING outbox events for a workspace, records each as an
 * outbound event ledger entry, then marks the outbox event as PUBLISHED
 * on success or FAILED on failure.
 *
 * Guarded by IS_EXECUTIVE_SEARCH_SYNC_ENABLED feature flag (placeholder).
 * Real HTTP send to Directus will be added in PR4.
 */
@Processor(MessageQueue.outboxRelayQueue)
export class OutboxRelayJob {
  private readonly logger = new Logger(OutboxRelayJob.name);

  constructor(
    private readonly outboxService: OutboxService,
    private readonly outboundEventLedgerService: OutboundEventLedgerService,
  ) {}

  @Process(OUTBOX_RELAY_JOB_NAME)
  async handle(data: OutboxRelayJobData): Promise<void> {
    const { workspaceId } = data;

    // TODO(PR4): check IS_EXECUTIVE_SEARCH_SYNC_ENABLED feature flag
    // const isEnabled = await this.featureFlagService.isEnabled(
    //   workspaceId,
    //   'IS_EXECUTIVE_SEARCH_SYNC_ENABLED',
    // );
    // if (!isEnabled) {
    //   this.logger.debug(
    //     `Executive search sync disabled for workspace ${workspaceId}, skipping relay`,
    //   );
    //   return;
    // }

    this.logger.log(
      `Starting outbox relay for workspace ${workspaceId}`,
    );

    // 1. Get all PENDING events for this workspace
    const pendingEvents = await this.outboxService.getPending(workspaceId);

    if (pendingEvents.length === 0) {
      this.logger.debug(
        `No pending outbox events for workspace ${workspaceId}`,
      );
      return;
    }

    this.logger.log(
      `Found ${pendingEvents.length} pending outbox events for workspace ${workspaceId}`,
    );

    // 2. Process each event
    for (const event of pendingEvents) {
      try {
        // a. Compute content hashes
        const afterHash = computeContentHash(event.payload);

        // b. Write to outbound event ledger
        await this.outboundEventLedgerService.recordOutbound(workspaceId, {
          eventId: event.id,
          eventType: event.eventType,
          targetCollection: event.aggregateType,
          targetRecordId: event.aggregateId,
          beforeHash: undefined, // No previous state for new events
          afterHash,
        });

        // c. Mark outbox event as PUBLISHED
        await this.outboxService.markPublished(workspaceId, event.id);

        this.logger.log(
          `Relayed outbox event ${event.id} (${event.eventType}) for workspace ${workspaceId}`,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        // d. On failure: mark as FAILED and increment attempts
        await this.outboxService.markFailed(workspaceId, event.id);

        this.logger.error(
          `Failed to relay outbox event ${event.id} for workspace ${workspaceId}: ${errorMessage}`,
        );
      }
    }

    this.logger.log(
      `Completed outbox relay for workspace ${workspaceId}`,
    );
  }
}
