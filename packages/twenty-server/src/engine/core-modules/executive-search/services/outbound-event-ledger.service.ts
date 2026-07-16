/* @license Enterprise */

import crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';

export enum OutboundEventStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

export interface OutboundEventRecord {
  id: string;
  eventId: string;
  eventType: string;
  targetCollection: string;
  targetRecordId: string;
  beforeHash?: string;
  afterHash?: string;
  status: OutboundEventStatus;
  sentAt?: Date;
}

/**
 * Outbound event ledger — records outbound events destined for external systems,
 * manages status lifecycle (PENDING → SENT).
 */
@Injectable()
export class OutboundEventLedgerService {
  private readonly logger = new Logger(OutboundEventLedgerService.name);

  // In-memory store — replaced by real workspace-entity persistence in a later PR
  private readonly store: Map<string, OutboundEventRecord> = new Map();

  /**
   * Record a new outbound event with optional before/after hashes.
   */
  async recordOutbound(
    workspaceId: string,
    params: {
      eventId: string;
      eventType: string;
      targetCollection: string;
      targetRecordId: string;
      beforeHash?: string;
      afterHash?: string;
    },
  ): Promise<void> {
    const record: OutboundEventRecord = {
      id: crypto.randomUUID(),
      eventId: params.eventId,
      eventType: params.eventType,
      targetCollection: params.targetCollection,
      targetRecordId: params.targetRecordId,
      beforeHash: params.beforeHash,
      afterHash: params.afterHash,
      status: OutboundEventStatus.PENDING,
    };

    const storeKey = `${workspaceId}::event::${params.eventId}`;
    this.store.set(storeKey, record);

    this.logger.log(
      `Recorded outbound event ${params.eventId} for ${params.targetCollection} (workspace ${workspaceId})`,
    );
  }

  /**
   * Transition status from PENDING → SENT.
   */
  async markSent(workspaceId: string, eventId: string): Promise<void> {
    const storeKey = `${workspaceId}::event::${eventId}`;
    const record = this.store.get(storeKey);

    if (!record) {
      this.logger.warn(
        `Outbound event record not found for eventId ${eventId} (workspace ${workspaceId})`,
      );
      return;
    }

    record.status = OutboundEventStatus.SENT;
    record.sentAt = new Date();
  }

  // For testing
  _clearStore(): void {
    this.store.clear();
  }
}
