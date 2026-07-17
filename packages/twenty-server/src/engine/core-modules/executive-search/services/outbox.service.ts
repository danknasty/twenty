/* @license Enterprise */

import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

export interface OutboxEvent {
  id: string;
  workspaceId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  createdAt: Date;
  publishedAt?: Date;
  attempts: number;
}

export type OutboxEventStatus = OutboxEvent['status'];

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  // In-memory store — replaced by real workspace-entity persistence in a later PR
  private readonly store: Map<string, OutboxEvent> = new Map();

  /**
   * Append an event to the outbox within an existing transaction scope.
   * The caller passes the same queryRunner/entityManager so the outbox
   * write commits/rolls back atomically with the business write.
   *
   * At PR2 time we use in-memory storage; the real DB-backed version
   * will use the same queryRunner as the business write.
   */
  async append(
    workspaceId: string,
    params: {
      aggregateType: string;
      aggregateId: string;
      eventType: string;
      payload: Record<string, unknown>;
    },
  ): Promise<void> {
    const event: OutboxEvent = {
      id: crypto.randomUUID(),
      workspaceId,
      aggregateType: params.aggregateType,
      aggregateId: params.aggregateId,
      eventType: params.eventType,
      payload: params.payload,
      status: 'PENDING',
      createdAt: new Date(),
      attempts: 0,
    };

    const storeKey = `${workspaceId}::${event.id}`;
    this.store.set(storeKey, event);

    this.logger.log(
      `Appended outbox event ${event.id} (${params.eventType}) for workspace ${workspaceId}`,
    );
  }

  /**
   * Get all PENDING events for a workspace.
   */
  async getPending(workspaceId: string): Promise<OutboxEvent[]> {
    return Array.from(this.store.values()).filter(
      (event) => event.workspaceId === workspaceId && event.status === 'PENDING',
    );
  }

  /**
   * Mark an event as PUBLISHED.
   */
  async markPublished(workspaceId: string, eventId: string): Promise<void> {
    const storeKey = `${workspaceId}::${eventId}`;
    const event = this.store.get(storeKey);

    if (!event) {
      this.logger.warn(
        `Outbox event ${eventId} not found for workspace ${workspaceId}`,
      );
      return;
    }

    event.status = 'PUBLISHED';
    event.publishedAt = new Date();

    this.logger.log(
      `Marked outbox event ${eventId} as PUBLISHED (workspace ${workspaceId})`,
    );
  }

  /**
   * Mark an event as FAILED and increment its attempt count.
   */
  async markFailed(workspaceId: string, eventId: string): Promise<void> {
    const storeKey = `${workspaceId}::${eventId}`;
    const event = this.store.get(storeKey);

    if (!event) {
      this.logger.warn(
        `Outbox event ${eventId} not found for workspace ${workspaceId}`,
      );
      return;
    }

    event.status = 'FAILED';
    event.attempts += 1;

    this.logger.warn(
      `Marked outbox event ${eventId} as FAILED (attempt ${event.attempts}, workspace ${workspaceId})`,
    );
  }

  // For testing
  _clearStore(): void {
    this.store.clear();
  }
}
