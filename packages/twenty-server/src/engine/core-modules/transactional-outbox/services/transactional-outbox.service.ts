import { Injectable } from '@nestjs/common';

import { QueryRunner } from 'typeorm';

import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';

export type AppendOutboxArgs = {
  eventName: string;
  eventPayload: Record<string, unknown>;
  idempotencyKey?: string;
};

@Injectable()
export class TransactionalOutboxService {
  async append(
    args: AppendOutboxArgs,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const { eventName, eventPayload, idempotencyKey } = args;

    await queryRunner.manager.insert(
      'workspaceEventOutbox',
      {
        idempotencyKey: idempotencyKey ?? null,
        eventName,
        eventPayload: JSON.stringify(eventPayload),
        status: OutboxStatus.PENDING,
        attemptCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  async markInProgress(
    id: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.update(
      'workspaceEventOutbox',
      { id },
      {
        status: OutboxStatus.IN_PROGRESS,
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  async markDelivered(
    id: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.update(
      'workspaceEventOutbox',
      { id },
      {
        status: OutboxStatus.DELIVERED,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }

  async markFailed(
    id: string,
    attemptCount: number,
    nextAttemptAt: Date | null,
    lastErrorMessage: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      attemptCount,
      lastAttemptAt: new Date(),
      lastErrorMessage,
      updatedAt: new Date(),
    };

    if (nextAttemptAt === null) {
      updateData.status = OutboxStatus.DEAD_LETTERED;
    } else {
      updateData.status = OutboxStatus.PENDING;
      updateData.nextAttemptAt = nextAttemptAt;
    }

    await queryRunner.manager.update(
      'workspaceEventOutbox',
      { id },
      updateData,
    );
  }
}
