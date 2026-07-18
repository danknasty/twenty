import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class WorkspaceEventOutboxWorkspaceEntity extends BaseWorkspaceEntity {
  eventName: string;
  eventPayload: Record<string, unknown> | null;
  idempotencyKey: string;
  status: string;
  attemptCount: number;
  lastAttemptAt: Date | null;
  nextAttemptAt: Date | null;
  lastErrorMessage: string | null;
  deliveredAt: Date | null;
}
