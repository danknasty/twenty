/* @license Enterprise */

import {
  Controller,
  Post,
  type RawBodyRequest,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { type Response } from 'express';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { type ExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.types';
import { validate as validateExternalSyncEvent } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.validator';
import {
  EXECUTIVE_SEARCH_SYNC_WEBHOOK_PATH,
  HMAC_SIGNATURE_HEADER,
  SYNC_EVENT_CONSUMER_JOB_NAME,
} from 'src/engine/core-modules/executive-search/executive-search.constants';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';
import { ExecutiveSearchRestApiExceptionFilter } from 'src/engine/core-modules/executive-search/exceptions/executive-search-rest-api.exception.filter';
import { HmacSignatureVerifierService } from 'src/engine/core-modules/executive-search/services/hmac-signature-verifier.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';
import { ServerVariableService } from 'src/engine/core-modules/executive-search/services/server-variable.service';
import { resolveWorkspaceFromKey } from 'src/engine/core-modules/executive-search/utils/resolve-workspace-from-workspace-key.util';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

@Controller()
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
@UseFilters(ExecutiveSearchRestApiExceptionFilter)
export class ExecutiveSearchSyncWebhookController {
  constructor(
    private readonly hmacVerifier: HmacSignatureVerifierService,
    private readonly serverVariableService: ServerVariableService,
    private readonly inboundEventLedgerService: InboundEventLedgerService,
    @InjectMessageQueue(MessageQueue.syncQueue)
    private readonly syncQueue: MessageQueueService,
  ) {}

  @Post([EXECUTIVE_SEARCH_SYNC_WEBHOOK_PATH])
  async handleSyncWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
  ): Promise<void> {
    // 1. Read rawBody from request (main.ts already sets rawBody: true)
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new ExecutiveSearchException(
        'Missing request body',
        ExecutiveSearchExceptionCode.INVALID_ENVELOPE,
      );
    }

    // 2. Parse JSON body
    const payload = request.body as Record<string, unknown>;

    if (!payload) {
      throw new ExecutiveSearchException(
        'Missing request body',
        ExecutiveSearchExceptionCode.INVALID_ENVELOPE,
      );
    }

    // 3. Extract workspaceKey from envelope
    const workspaceKey = payload.workspaceKey as string | undefined;

    if (!workspaceKey) {
      throw new ExecutiveSearchException(
        'Missing workspaceKey in request body',
        ExecutiveSearchExceptionCode.INVALID_ENVELOPE,
      );
    }

    // 4. Resolve workspaceId
    const workspaceId = await resolveWorkspaceFromKey(workspaceKey);

    // 5. Get HMAC secret for this workspace
    const signatureHeader = request.headers[HMAC_SIGNATURE_HEADER] as
      | string
      | undefined;

    if (!signatureHeader) {
      throw new ExecutiveSearchException(
        'Missing HMAC signature header',
        ExecutiveSearchExceptionCode.MISSING_SIGNATURE,
      );
    }

    const secret = await this.serverVariableService.getWebhookSecret(
      workspaceId,
    );

    if (!secret) {
      throw new ExecutiveSearchException(
        'Webhook secret not configured for workspace',
        ExecutiveSearchExceptionCode.WORKSPACE_NOT_FOUND,
      );
    }

    // 6. Verify HMAC signature
    this.hmacVerifier.verify(rawBody, signatureHeader, secret);

    // 7. Validate envelope schema
    const validation = validateExternalSyncEvent(payload);

    if (!validation.valid) {
      throw new ExecutiveSearchException(
        'Event envelope failed schema validation',
        ExecutiveSearchExceptionCode.INVALID_ENVELOPE,
      );
    }

    // 8. Record receipt (dedup via unique constraint on eventId)
    try {
      await this.inboundEventLedgerService.recordReceipt(
        workspaceId,
        payload as ExternalSyncEvent,
      );
    } catch {
      // Unique constraint violation = duplicate event — return 202 regardless
      // (don't leak dedup state to caller)
    }

    // 9. Enqueue to syncQueue
    await this.syncQueue.add(SYNC_EVENT_CONSUMER_JOB_NAME, {
      workspaceId,
      event: payload,
    });

    // 10. Return 202 Accepted
    response.status(202).json({ accepted: true });
  }
}
