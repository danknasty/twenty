/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';

export type IdempotencyOutcome =
  | { outcome: 'new' }
  | { outcome: 'alreadyProcessed' }
  | { outcome: 'retry'; currentStatus: string };

/**
 * Idempotency service — determines whether an event should be processed,
 * skipped (already done), or retried (crash recovery).
 *
 * Logic:
 * - No row exists → `new` (proceed with processing)
 * - Row exists, status = RECEIVED or PROCESSING → `retry` (crash recovery — re-process)
 * - Row exists, status = PROCESSED → `alreadyProcessed` (skip)
 *
 * FAILED and DEAD_LETTERED statuses are treated as `retry` (they can be re-processed).
 */
@Injectable()
export class IdempotencyService {
  constructor(
    private readonly inboundEventLedgerService: InboundEventLedgerService,
  ) {}

  async checkAndRecord(
    workspaceId: string,
    event: ExternalSyncEvent,
  ): Promise<IdempotencyOutcome> {
    // 1. Look up existing row by eventId
    const existing = await this.inboundEventLedgerService.findByEventId(
      workspaceId,
      event.eventId,
    );

    // 2. If no row → recordReceipt, return { outcome: 'new' }
    if (!existing) {
      await this.inboundEventLedgerService.recordReceipt(workspaceId, event);

      return { outcome: 'new' };
    }

    // 3. If row exists and status === 'PROCESSED' → return { outcome: 'alreadyProcessed' }
    if (existing.status === 'PROCESSED') {
      return { outcome: 'alreadyProcessed' };
    }

    // 4. If row exists and status is RECEIVED, PROCESSING, FAILED, or DEAD_LETTERED
    //    → return { outcome: 'retry', currentStatus }
    return { outcome: 'retry', currentStatus: existing.status };
  }
}
