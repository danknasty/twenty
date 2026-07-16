/* @license Enterprise */

import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { computeContentHash } from 'src/engine/core-modules/executive-search/utils/compute-content-hash.util';

export enum InboundEventStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  DEAD_LETTERED = 'DEAD_LETTERED',
}

export interface InboundEventRecord {
  id: string;
  eventId: string;
  idempotencyKey: string;
  sourceSystem: string;
  sourceCollection: string;
  sourceRecordId: string;
  payloadHash: string;
  status: InboundEventStatus;
  receivedAt: Date;
  processedAt?: Date;
  errorMessage?: string;
}

/**
 * Manages the inbound event lifecycle: RECEIVED → PROCESSING → PROCESSED/FAILED/DEAD_LETTERED.
 * Dedup by (workspaceId, eventId) via unique constraint.
 *
 * Processing rules:
 * - recordReceipt: inserts a row with status RECEIVED. Unique constraint on eventId throws if duplicate.
 * - markProcessing: RECEIVED → PROCESSING
 * - markProcessed: PROCESSING → PROCESSED
 * - markFailed: PROCESSING → FAILED
 * - markDeadLettered: PROCESSING → DEAD_LETTERED
 * - findByEventId: lookup for idempotency check
 */
@Injectable()
export class InboundEventLedgerService {
  private readonly logger = new Logger(InboundEventLedgerService.name);

  // In-memory store — replaced by real workspace-entity persistence in a later PR
  private readonly store: Map<string, InboundEventRecord> = new Map();

  /**
   * Persist a receipt. Unique constraint on eventId prevents actual duplication;
   * in-memory we simulate by checking existence.
   */
  async recordReceipt(
    workspaceId: string,
    event: ExternalSyncEvent,
  ): Promise<void> {
    const dedupKey = `${workspaceId}::event::${event.eventId}`;

    if (this.store.has(dedupKey)) {
      this.logger.warn(
        `Duplicate eventId ${event.eventId} for workspace ${workspaceId}`,
      );
      return;
    }

    const record: InboundEventRecord = {
      id: crypto.randomUUID(),
      eventId: event.eventId,
      idempotencyKey: event.idempotencyKey,
      sourceSystem: event.sourceSystem,
      sourceCollection: event.sourceCollection,
      sourceRecordId: event.sourceRecordId,
      payloadHash: computeContentHash(
        (event.payload ?? {}) as Record<string, unknown>,
      ),
      status: InboundEventStatus.RECEIVED,
      receivedAt: new Date(),
    };

    this.store.set(dedupKey, record);

    this.logger.log(
      `Recorded inbound event receipt ${event.eventId} (workspace ${workspaceId})`,
    );
  }

  /**
   * Transition status from RECEIVED → PROCESSING.
   */
  async markProcessing(workspaceId: string, eventId: string): Promise<void> {
    await this.updateStatus(workspaceId, eventId, InboundEventStatus.PROCESSING);
  }

  /**
   * Transition status from PROCESSING → PROCESSED.
   */
  async markProcessed(workspaceId: string, eventId: string): Promise<void> {
    await this.updateStatus(
      workspaceId,
      eventId,
      InboundEventStatus.PROCESSED,
      { processedAt: new Date() },
    );
  }

  /**
   * Transition status from PROCESSING → FAILED with error message.
   */
  async markFailed(
    workspaceId: string,
    eventId: string,
    errorMessage: string,
  ): Promise<void> {
    await this.updateStatus(workspaceId, eventId, InboundEventStatus.FAILED, {
      errorMessage,
    });
  }

  /**
   * Transition status from PROCESSING → DEAD_LETTERED.
   */
  async markDeadLettered(
    workspaceId: string,
    eventId: string,
  ): Promise<void> {
    await this.updateStatus(
      workspaceId,
      eventId,
      InboundEventStatus.DEAD_LETTERED,
    );
  }

  /**
   * Look up a record by eventId for idempotency checks.
   */
  async findByEventId(
    workspaceId: string,
    eventId: string,
  ): Promise<{ status: string } | null> {
    const dedupKey = `${workspaceId}::event::${eventId}`;
    const record = this.store.get(dedupKey);

    if (!record) {
      return null;
    }

    return { status: record.status };
  }

  private async updateStatus(
    workspaceId: string,
    eventId: string,
    status: InboundEventStatus,
    additional?: Partial<Pick<InboundEventRecord, 'processedAt' | 'errorMessage'>>,
  ): Promise<void> {
    const dedupKey = `${workspaceId}::event::${eventId}`;
    const record = this.store.get(dedupKey);

    if (!record) {
      this.logger.warn(
        `Inbound event record not found for eventId ${eventId} (workspace ${workspaceId})`,
      );
      return;
    }

    record.status = status;

    if (additional?.processedAt) {
      record.processedAt = additional.processedAt;
    }

    if (additional?.errorMessage) {
      record.errorMessage = additional.errorMessage;
    }
  }

  // For testing
  _clearStore(): void {
    this.store.clear();
  }
}
