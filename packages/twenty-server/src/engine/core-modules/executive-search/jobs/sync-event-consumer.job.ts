/* @license Enterprise */

import { Logger } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { SYNC_EVENT_CONSUMER_JOB_NAME } from 'src/engine/core-modules/executive-search/executive-search.constants';
import { DeadLetterService } from 'src/engine/core-modules/executive-search/services/dead-letter.service';
import { IdempotencyService } from 'src/engine/core-modules/executive-search/services/idempotency.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';

export type SyncEventConsumerJobData = {
  workspaceId: string;
  event: ExternalSyncEvent;
};

/**
 * Consumes sync events from the sync queue.
 *
 * Handles idempotency (prevents duplicate processing), echo prevention
 * (skips events originating from Twenty), and dead-lettering on final
 * failure.
 *
 * Processing rules:
 * - sourceSystem === 'TWENTY' → skipped (echo prevention)
 * - Already PROCESSED → skipped (idempotency)
 * - RECEIVED / PROCESSING / FAILED / DEAD_LETTERED → resume / retry
 * - Processing error → dead-lettered
 */
@Processor(MessageQueue.syncQueue)
export class SyncEventConsumerJob {
  private readonly logger = new Logger(SyncEventConsumerJob.name);

  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly inboundEventLedgerService: InboundEventLedgerService,
    private readonly deadLetterService: DeadLetterService,
  ) {}

  @Process(SYNC_EVENT_CONSUMER_JOB_NAME)
  async handle(data: SyncEventConsumerJobData): Promise<void> {
    const { workspaceId, event } = data;

    // 1. Echo prevention: skip events originating from Twenty
    if (event.sourceSystem === 'TWENTY') {
      this.logger.debug(
        `Skipping event ${event.eventId} from sourceSystem TWENTY (echo prevention)`,
      );
      return;
    }

    // 2. Idempotency (status-aware: skip only PROCESSED)
    const outcome = await this.idempotencyService.checkAndRecord(
      workspaceId,
      event,
    );

    if (outcome.outcome === 'alreadyProcessed') {
      this.logger.debug(
        `Event ${event.eventId} already processed — skipping`,
      );
      return; // Already done, ack the job
    }
    // 'retry' or 'new' → continue processing

    // 3. Mark processing
    await this.inboundEventLedgerService.markProcessing(
      workspaceId,
      event.eventId,
    );

    // 4. Process (placeholder — no-op while default-off)
    try {
      await this.processInboundEvent(workspaceId, event);
      await this.inboundEventLedgerService.markProcessed(
        workspaceId,
        event.eventId,
      );
    } catch (error) {
      // NOTE: The current @Process handler signature receives only job.data
      // (no access to attemptsMade), so we cannot distinguish intermediate
      // retries from the final attempt. In PR3 (no-op processing) this path is
      // unreachable because processInboundEvent never throws.
      //
      // Before PR5 wires real processing logic, the handler signature must be
      // extended to surface BullMQ job metadata (attemptsMade / retryLimit)
      // so this block can gate: if (attemptsMade >= retryLimit) { dead-letter
      // + markDeadLettered } else { throw error for retry }.
      //
      // For now, dead-letter on any processing error to avoid infinite
      // retry loops during development.

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Processing failed for event ${event.eventId}: ${errorMessage}`,
      );

      await this.deadLetterService.moveToDeadLetter(workspaceId, {
        eventId: event.eventId,
        idempotencyKey: event.idempotencyKey,
        originalQueue: MessageQueue.syncQueue,
        payload: event as unknown as Record<string, unknown>,
        lastErrorCode: 'PROCESSING_ERROR',
        attempts: 1,
      });

      await this.inboundEventLedgerService.markDeadLettered(
        workspaceId,
        event.eventId,
      );

      throw error; // Re-throw to let BullMQ know it failed
    }
  }

  /**
   * Placeholder — gated on IS_EXECUTIVE_SEARCH_SYNC_ENABLED.
   *
   * No-op while default-off. When feature flag is enabled + domain objects
   * exist, this delegates to the appropriate adapter (PR4 Directus adapter,
   * PR5 executive profile, etc.).
   */
  private async processInboundEvent(
    _workspaceId: string,
    _event: ExternalSyncEvent,
  ): Promise<void> {
    // No-op: domain logic is PR5+
  }
}
