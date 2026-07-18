import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';

export class WorkspaceEventOutboxWorkspaceEntity extends BaseWorkspaceEntity {
  eventName: string;
  eventPayload: Record<string, unknown>;
  idempotencyKey: string | null;
  status: OutboxStatus;
  attemptCount: number;
  lastAttemptAt: string | null;
  nextAttemptAt: string | null;
  lastErrorMessage: string | null;
  deliveredAt: string | null;
}
