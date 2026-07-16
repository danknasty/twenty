/* @license Enterprise */

import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';

export interface DeadLetterRecord {
  id: string;
  eventId: string;
  idempotencyKey: string;
  originalQueue: string;
  payload: Record<string, unknown>;
  lastErrorCode: string;
  attempts: number;
  isReplayed: boolean;
  replayedAt?: Date;
  createdAt: Date;
}

/**
 * Dead-letter service — stores permanently failed events and enables replay.
 * Replay re-enqueues the event to the sync queue via MessageQueueService.
 */
@Injectable()
export class DeadLetterService {
  private readonly logger = new Logger(DeadLetterService.name);

  // In-memory store — replaced by real workspace-entity persistence in a later PR
  private readonly store: Map<string, DeadLetterRecord> = new Map();

  constructor(
    @InjectMessageQueue(MessageQueue.syncQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  /**
   * Move an event to the dead-letter store.
   */
  async moveToDeadLetter(
    _workspaceId: string,
    params: {
      eventId: string;
      idempotencyKey: string;
      originalQueue: string;
      payload: Record<string, unknown>;
      lastErrorCode: string;
      attempts: number;
    },
  ): Promise<void> {
    const record: DeadLetterRecord = {
      id: crypto.randomUUID(),
      eventId: params.eventId,
      idempotencyKey: params.idempotencyKey,
      originalQueue: params.originalQueue,
      payload: params.payload,
      lastErrorCode: params.lastErrorCode,
      attempts: params.attempts,
      isReplayed: false,
      createdAt: new Date(),
    };

    this.store.set(record.id, record);

    this.logger.warn(
      `Dead-lettered event ${params.eventId} (${params.lastErrorCode})`,
    );
  }

  /**
   * Replay a dead-lettered event — marks isReplayed=true and re-enqueues to syncQueue.
   */
  async replay(
    _workspaceId: string,
    deadLetterId: string,
  ): Promise<void> {
    const record = this.store.get(deadLetterId);

    if (!record) {
      this.logger.warn(`Dead-letter entry ${deadLetterId} not found`);
      return;
    }

    if (record.isReplayed) {
      this.logger.warn(`Dead-letter entry ${deadLetterId} already replayed`);
      return;
    }

    record.isReplayed = true;
    record.replayedAt = new Date();

    // Re-enqueue to sync queue
    await this.messageQueueService.add(
      'process-dead-letter-replay',
      {
        eventId: record.eventId,
        idempotencyKey: record.idempotencyKey,
        payload: record.payload,
        originalQueue: record.originalQueue,
      },
      { retryLimit: 3 },
    );

    this.logger.log(
      `Replayed dead-letter entry ${deadLetterId} (${record.eventId})`,
    );
  }

  /**
   * Retrieve a dead-letter record by its ID.
   */
  async getRecord(deadLetterId: string): Promise<DeadLetterRecord | undefined> {
    return this.store.get(deadLetterId);
  }

  /**
   * Find all dead-letter records for a given eventId.
   */
  async findByEventId(
    _workspaceId: string,
    eventId: string,
  ): Promise<DeadLetterRecord | undefined> {
    for (const record of this.store.values()) {
      if (record.eventId === eventId) {
        return record;
      }
    }
    return undefined;
  }

  // For testing
  _clearStore(): void {
    this.store.clear();
  }
}
