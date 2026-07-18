import { Injectable, Logger } from '@nestjs/common';

import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ExternalSyncInboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-inbox.workspace-entity';
import { ExternalSyncOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/external-sync-outbox.workspace-entity';

export type InboxEventInput = {
  workspaceId: string;
  externalEventId: string;
  externalSystemName: string;
  eventType: string;
  entityName: string;
  entityId: string;
  payload: Record<string, unknown>;
};

export const INBOX_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
  DUPLICATE: 'DUPLICATE',
  ECHO: 'ECHO',
} as const;

/** Inbox event suffix/type used by the shadow-sync (comparison-only) pipeline. */
export const SHADOW_SYNC_EVENT_SUFFIX = '.shadow_sync';
export const SHADOW_SYNC_EVENT_TYPE = 'shadow_sync';

/** Result of attempting to apply a single inbox event. */
export type InboxApplyResult = {
  applied: boolean;
  reason?: string;
};

/**
 * Returns true when an inbox event is a `.shadow_sync` event.  These events are
 * comparison-only — they feed the shadow-sync drift engine and are NEVER
 * applied to domain data.
 */
export function isShadowSyncEvent(eventType: string): boolean {
  return (
    eventType === SHADOW_SYNC_EVENT_TYPE ||
    eventType.endsWith(SHADOW_SYNC_EVENT_SUFFIX)
  );
}

/**
 * Inbound event inbox with echo-loop prevention.
 *
 * Every external event is deduplicated by (externalSystemName, externalEventId).
 * Duplicates are marked DUPLICATE and never processed.  ECHO status is reserved
 * for events that originated from Twenty itself (loop prevention).
 */
@Injectable()
export class ExecutiveSearchInboxService {
  private readonly logger = new Logger(ExecutiveSearchInboxService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  /**
   * Receive an external event.  Returns the inbox entry (new or existing).
   * Duplicates are marked and never re-processed.
   */
  async receive(
    input: InboxEventInput,
  ): Promise<ExternalSyncInboxWorkspaceEntity | null> {
    const authContext = buildSystemAuthContext(input.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository = await this.globalWorkspaceOrmManager.getRepository(
          input.workspaceId,
          ExternalSyncInboxWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        // Idempotency: check for existing event from the same external source
        const existing = await repository.findOneBy({
          externalEventId: input.externalEventId,
          externalSystemName: input.externalSystemName,
        });

        if (existing) {
          this.logger.debug(
            `Duplicate inbox event "${input.externalEventId}" from "${input.externalSystemName}" — skipping`,
          );

          // If somehow still PENDING, mark as DUPLICATE
          if (existing.status === INBOX_STATUS.PENDING) {
            await repository.update(existing.id, {
              status: INBOX_STATUS.DUPLICATE,
            });
            existing.status = INBOX_STATUS.DUPLICATE;
          }

          return existing;
        }

        const entity = repository.create({
          workspaceId: input.workspaceId,
          externalEventId: input.externalEventId,
          externalSystemName: input.externalSystemName,
          eventType: input.eventType,
          entityName: input.entityName,
          entityId: input.entityId,
          payload: input.payload,
          status: INBOX_STATUS.PENDING,
          processedAt: null,
          error: null,
        });

        return repository.save(entity);
      },
      authContext,
    );
  }

  /**
   * Mark an inbox entry as PROCESSED.
   */
  async markProcessed(workspaceId: string, inboxId: string): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repository = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalSyncInboxWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      await repository.update(inboxId, {
        status: INBOX_STATUS.PROCESSED,
        processedAt: new Date().toISOString(),
      });
    }, authContext);
  }

  /**
   * Mark an inbox entry as FAILED.
   */
  async markFailed(
    workspaceId: string,
    inboxId: string,
    error: string,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const repository = await this.globalWorkspaceOrmManager.getRepository(
        workspaceId,
        ExternalSyncInboxWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );

      await repository.update(inboxId, {
        status: INBOX_STATUS.FAILED,
        error,
        processedAt: new Date().toISOString(),
      });
    }, authContext);
  }

  /**
   * Check if an event originated from Twenty (echo-loop prevention).
   * Returns true if the externalEventId matches any outbox eventId for this workspace.
   */
  async isEcho(workspaceId: string, externalEventId: string): Promise<boolean> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository = await this.globalWorkspaceOrmManager.getRepository(
          workspaceId,
          ExternalSyncOutboxWorkspaceEntity,
          { shouldBypassPermissionChecks: true },
        );

        const match = await repository.findOneBy({
          eventId: externalEventId,
        });

        return !!match;
      },
      authContext,
    );
  }

  /**
   * Apply a single inbox event to the domain.
   *
   * Shadow-sync (`.shadow_sync`) events are NEVER applied — they are
   * comparison-only and are consumed by the shadow-sync drift reconciliation
   * engine.  This guard short-circuits them unconditionally regardless of the
   * `IS_EXECUTIVE_SEARCH_SHADOW_SYNC_ENABLED` flag state, because the flag
   * controls whether the comparison *runs*, not whether these events are
   * applied.  All other event types fall through to the normal apply path.
   */
  async apply(
    workspaceId: string,
    inbox: Pick<
      ExternalSyncInboxWorkspaceEntity,
      'id' | 'eventType' | 'entityName' | 'entityId'
    >,
  ): Promise<InboxApplyResult> {
    if (isShadowSyncEvent(inbox.eventType)) {
      this.logger.debug(
        `Skipping shadow_sync event ${inbox.id} (${inbox.entityName}/${inbox.entityId}) — comparison-only, never applied`,
      );

      return {
        applied: false,
        reason:
          'shadow_sync events are comparison-only and are never applied to domain data',
      };
    }

    // Normal apply path.  No domain-mutating apply logic exists yet for the
    // remaining event types; consumers may extend this method when inbound
    // apply is introduced.
    return { applied: true };
  }
}
