/* @license Enterprise */

import { type RawBodyRequest } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { type Response } from 'express';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { getQueueToken } from 'src/engine/core-modules/message-queue/utils/get-queue-token.util';
import {
  HMAC_SIGNATURE_HEADER,
  SYNC_EVENT_CONSUMER_JOB_NAME,
} from 'src/engine/core-modules/executive-search/executive-search.constants';
import { ExecutiveSearchSyncWebhookController } from 'src/engine/core-modules/executive-search/controllers/executive-search-sync-webhook.controller';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';
import { ExecutiveSearchRestApiExceptionFilter } from 'src/engine/core-modules/executive-search/exceptions/executive-search-rest-api.exception.filter';
import { HmacSignatureVerifierService } from 'src/engine/core-modules/executive-search/services/hmac-signature-verifier.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';
import { ServerVariableService } from 'src/engine/core-modules/executive-search/services/server-variable.service';
import { HttpExceptionHandlerService } from 'src/engine/core-modules/exception-handler/http-exception-handler.service';

const VALID_WORKSPACE_ID = '123e4567-e89b-4d3e-a456-426614174000';
const VALID_EVENT_ID = 'evt-001';

const validEnvelope = {
  eventId: VALID_EVENT_ID,
  eventType: 'executive.updated',
  eventVersion: 1,
  sourceSystem: 'DIRECTUS',
  sourceCollection: 'executives',
  sourceRecordId: 'dir-exec-42',
  sourceUpdatedAt: '2026-07-15T16:00:00Z',
  sourceHash: 'abc123',
  workspaceKey: VALID_WORKSPACE_ID,
  correlationId: 'corr-001',
  causationId: null,
  idempotencyKey: 'idem-001',
  occurredAt: '2026-07-15T16:00:01Z',
  actor: { type: 'CANDIDATE', id: 'dir-exec-42' },
  changedFields: ['current_title'],
  payload: null,
};

function createMockResponse(): jest.Mocked<Response> {
  const res: Partial<jest.Mocked<Response>> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };

  return res as jest.Mocked<Response>;
}

describe('ExecutiveSearchSyncWebhookController', () => {
  let controller: ExecutiveSearchSyncWebhookController;
  let hmacVerifier: jest.Mocked<HmacSignatureVerifierService>;
  let serverVariableService: jest.Mocked<ServerVariableService>;
  let inboundEventLedgerService: jest.Mocked<InboundEventLedgerService>;
  let syncQueue: jest.Mocked<MessageQueueService>;
  let response: jest.Mocked<Response>;

  beforeEach(async () => {
    hmacVerifier = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<HmacSignatureVerifierService>;

    serverVariableService = {
      getWebhookSecret: jest.fn(),
    } as unknown as jest.Mocked<ServerVariableService>;

    inboundEventLedgerService = {
      recordReceipt: jest.fn(),
    } as unknown as jest.Mocked<InboundEventLedgerService>;

    syncQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageQueueService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutiveSearchSyncWebhookController],
      providers: [
        { provide: HmacSignatureVerifierService, useValue: hmacVerifier },
        { provide: ServerVariableService, useValue: serverVariableService },
        {
          provide: InboundEventLedgerService,
          useValue: inboundEventLedgerService,
        },
        {
          provide: getQueueToken(MessageQueue.syncQueue),
          useValue: syncQueue,
        },
        {
          provide: HttpExceptionHandlerService,
          useValue: { handleError: jest.fn() },
        },
        ExecutiveSearchRestApiExceptionFilter,
      ],
    }).compile();

    controller = module.get<ExecutiveSearchSyncWebhookController>(
      ExecutiveSearchSyncWebhookController,
    );

    response = createMockResponse();

    serverVariableService.getWebhookSecret.mockResolvedValue(
      'test-secret-value',
    );
  });

  describe('Valid signature + valid envelope', () => {
    it('should return 202, record ledger row, and enqueue sync job', async () => {
      const rawBody = Buffer.from(JSON.stringify(validEnvelope), 'utf-8');

      const req = {
        rawBody,
        body: validEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await controller.handleSyncWebhook(req, response);

      expect(serverVariableService.getWebhookSecret).toHaveBeenCalledWith(
        VALID_WORKSPACE_ID,
      );
      expect(hmacVerifier.verify).toHaveBeenCalledWith(
        rawBody,
        't=1000000000,v1=abcdef123456',
        'test-secret-value',
      );
      expect(inboundEventLedgerService.recordReceipt).toHaveBeenCalledWith(
        VALID_WORKSPACE_ID,
        validEnvelope,
      );
      expect(syncQueue.add).toHaveBeenCalledWith(SYNC_EVENT_CONSUMER_JOB_NAME, {
        workspaceId: VALID_WORKSPACE_ID,
        event: validEnvelope,
      });
      expect(response.status).toHaveBeenCalledWith(202);
      expect(response.json).toHaveBeenCalledWith({ accepted: true });
    });
  });

  describe('Invalid signature', () => {
    it('should throw 401 ExecutiveSearchException (INVALID_SIGNATURE) when HMAC fails', async () => {
      hmacVerifier.verify.mockImplementation(() => {
        throw new ExecutiveSearchException(
          'HMAC signature mismatch',
          ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        );
      });

      const req = {
        rawBody: Buffer.from(JSON.stringify(validEnvelope), 'utf-8'),
        body: validEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=badbadbad',
        },
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
      expect(syncQueue.add).not.toHaveBeenCalled();
    });

    it('should throw 401 when HMAC signature header is missing', async () => {
      const req = {
        rawBody: Buffer.from(JSON.stringify(validEnvelope), 'utf-8'),
        body: validEnvelope,
        headers: {},
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
      expect(syncQueue.add).not.toHaveBeenCalled();
    });

    it('should throw 401 when HMAC secret is not configured for workspace', async () => {
      serverVariableService.getWebhookSecret.mockResolvedValue(null);

      const req = {
        rawBody: Buffer.from(JSON.stringify(validEnvelope), 'utf-8'),
        body: validEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
      expect(syncQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('Invalid envelope schema', () => {
    it('should throw 422 ExecutiveSearchException (INVALID_ENVELOPE) when envelope is malformed', async () => {
      const invalidBody = { badField: 'no-structure' };

      const req = {
        rawBody: Buffer.from(JSON.stringify(invalidBody), 'utf-8'),
        body: invalidBody,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      // getWebhookSecret throws because workspaceKey is missing
      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(syncQueue.add).not.toHaveBeenCalled();
    });

    it('should throw 422 when workspaceKey is missing from payload', async () => {
      const { workspaceKey: _, ...missingKey } = validEnvelope;

      const req = {
        rawBody: Buffer.from(JSON.stringify(missingKey), 'utf-8'),
        body: missingKey,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(syncQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('Duplicate eventId', () => {
    it('should return 202 and not leak dedup state or enqueue twice', async () => {
      inboundEventLedgerService.recordReceipt.mockRejectedValue(
        new Error('duplicate key'),
      );

      const rawBody = Buffer.from(JSON.stringify(validEnvelope), 'utf-8');

      const req = {
        rawBody,
        body: validEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await controller.handleSyncWebhook(req, response);

      // Should still return 202 even when ledger rejects duplicate
      expect(response.status).toHaveBeenCalledWith(202);
      expect(response.json).toHaveBeenCalledWith({ accepted: true });

      // Should still enqueue the job (idempotency is at consumer level)
      expect(syncQueue.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('Stale timestamp', () => {
    it('should throw 401 when timestamp is outside tolerance window', async () => {
      hmacVerifier.verify.mockImplementation(() => {
        throw new ExecutiveSearchException(
          'Timestamp is outside the allowed tolerance window',
          ExecutiveSearchExceptionCode.STALE_TIMESTAMP,
        );
      });

      const rawBody = Buffer.from(JSON.stringify(validEnvelope), 'utf-8');

      const req = {
        rawBody,
        body: validEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
      expect(syncQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('Invalid workspace key', () => {
    it('should throw 404 when workspaceKey is not a valid UUID', async () => {
      const invalidKeyEnvelope = {
        ...validEnvelope,
        workspaceKey: 'not-a-uuid',
      };

      const req = {
        rawBody: Buffer.from(JSON.stringify(invalidKeyEnvelope), 'utf-8'),
        body: invalidKeyEnvelope,
        headers: {
          [HMAC_SIGNATURE_HEADER]: 't=1000000000,v1=abcdef123456',
        },
      } as unknown as RawBodyRequest<Request>;

      await expect(
        controller.handleSyncWebhook(req, response),
      ).rejects.toThrow(ExecutiveSearchException);

      expect(
        serverVariableService.getWebhookSecret,
      ).not.toHaveBeenCalled();
      expect(inboundEventLedgerService.recordReceipt).not.toHaveBeenCalled();
      expect(syncQueue.add).not.toHaveBeenCalled();
    });
  });
});
