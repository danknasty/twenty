import { Logger, Scope } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

export type DrainOutboxJobData = {
  workspaceId: string;
};

export const OUTBOX_DRAIN_BATCH_SIZE = 100;
export const OUTBOX_MAX_ATTEMPTS = 5;

@Processor({
  queueName: MessageQueue.outboxQueue,
  scope: Scope.REQUEST,
})
export class DrainOutboxJob {
  private readonly logger = new Logger(DrainOutboxJob.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  @Process(DrainOutboxJob.name)
  async handle(data: DrainOutboxJobData): Promise<void> {
    const { workspaceId } = data;

    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        await this.drainWorkspace(workspaceId);
      },
      authContext,
      { lite: true },
    );
  }

  private async drainWorkspace(workspaceId: string): Promise<void> {
    const workspaceDataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();
    const queryRunner = workspaceDataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const pendingRows = await queryRunner.manager.query(
        `SELECT * FROM "workspaceEventOutbox" WHERE "status" = $1 ORDER BY "createdAt" ASC LIMIT $2`,
        [OutboxStatus.PENDING, OUTBOX_DRAIN_BATCH_SIZE],
      );

      if (pendingRows.length === 0) {
        await queryRunner.commitTransaction();

        return;
      }

      for (const row of pendingRows) {
        try {
          await queryRunner.manager.update(
            'workspaceEventOutbox',
            { id: row.id },
            {
              status: OutboxStatus.IN_PROGRESS,
              lastAttemptAt: new Date(),
              updatedAt: new Date(),
            },
          );

          const eventPayload =
            typeof row.eventPayload === 'string'
              ? JSON.parse(row.eventPayload)
              : row.eventPayload;

          const batch = {
            name: row.eventName,
            workspaceId,
            objectMetadata: eventPayload.objectMetadata ?? null,
            events: eventPayload.events ?? [],
          };

          const nameParts = row.eventName.split('.');
          const action = nameParts.length > 1 ? nameParts.pop() : 'created';
          const objectMetadataNameSingular = nameParts.join('.');

          this.workspaceEventEmitter.emitDatabaseBatchEvent({
            objectMetadataNameSingular,
            action,
            events: batch.events,
            objectMetadata: batch.objectMetadata,
            workspaceId,
          });

          await queryRunner.manager.update(
            'workspaceEventOutbox',
            { id: row.id },
            {
              status: OutboxStatus.DELIVERED,
              deliveredAt: new Date(),
              updatedAt: new Date(),
            },
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          const newAttemptCount = (row.attemptCount ?? 0) + 1;

          const updateData: Record<string, unknown> = {
            attemptCount: newAttemptCount,
            lastAttemptAt: new Date(),
            lastErrorMessage: errorMessage,
            updatedAt: new Date(),
          };

          if (newAttemptCount >= OUTBOX_MAX_ATTEMPTS) {
            updateData.status = OutboxStatus.DEAD_LETTERED;
          } else {
            const backoffMs = Math.min(
              1000 * Math.pow(2, newAttemptCount - 1),
              300_000,
            );
            updateData.nextAttemptAt = new Date(Date.now() + backoffMs);
          }

          await queryRunner.manager.update(
            'workspaceEventOutbox',
            { id: row.id },
            updateData,
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to drain outbox for workspace ${workspaceId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
