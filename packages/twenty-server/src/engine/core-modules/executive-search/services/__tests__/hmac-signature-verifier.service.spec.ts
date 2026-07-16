/* @license Enterprise */

import { createHmac } from 'crypto';

import { HmacSignatureVerifierService } from 'src/engine/core-modules/executive-search/services/hmac-signature-verifier.service';
import { ExecutiveSearchExceptionCode } from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';

describe('HmacSignatureVerifierService', () => {
  let service: HmacSignatureVerifierService;

  beforeAll(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    service = new HmacSignatureVerifierService();
  });

  const secret = 'test-secret-value';
  const rawBody = Buffer.from(JSON.stringify({ eventId: 'evt-001' }));

  const generateSignature = (timestamp?: number): string => {
    const ts = timestamp ?? Math.floor(Date.now() / 1000);
    const hmacInput = `${ts}.`;
    const hmacInputBuffer = Buffer.concat([
      Buffer.from(hmacInput, 'utf-8'),
      rawBody,
    ]);
    const hex = createHmac('sha256', secret)
      .update(hmacInputBuffer)
      .digest('hex');

    return `t=${ts},v1=${hex}`;
  };

  describe('verify', () => {
    it('should pass verification with a valid signature', () => {
      const signatureHeader = generateSignature();

      expect(() =>
        service.verify(rawBody, signatureHeader, secret),
      ).not.toThrow();
    });

    it('should throw INVALID_SIGNATURE when body has been tampered', () => {
      const signatureHeader = generateSignature();
      const tamperedBody = Buffer.from(
        JSON.stringify({ eventId: 'evt-002' }),
      );

      expect(() =>
        service.verify(tamperedBody, signatureHeader, secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });

    it('should throw STALE_TIMESTAMP when timestamp is older than tolerance', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 600s > 300s tolerance
      const signatureHeader = generateSignature(oldTimestamp);

      expect(() =>
        service.verify(rawBody, signatureHeader, secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.STALE_TIMESTAMP,
        }),
      );
    });

    it('should throw STALE_TIMESTAMP when timestamp is in the future beyond tolerance', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 600; // 600s > 300s tolerance
      const signatureHeader = generateSignature(futureTimestamp);

      expect(() =>
        service.verify(rawBody, signatureHeader, secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.STALE_TIMESTAMP,
        }),
      );
    });

    it('should throw MISSING_SIGNATURE when header is empty', () => {
      expect(() => service.verify(rawBody, '', secret)).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.MISSING_SIGNATURE,
        }),
      );
    });

    it('should throw INVALID_SIGNATURE when header format is invalid', () => {
      expect(() =>
        service.verify(rawBody, 'not-a-valid-header', secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });

    it('should throw INVALID_SIGNATURE when header is missing parts', () => {
      // Missing v1 part
      expect(() =>
        service.verify(rawBody, 't=1234567890', secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });

    it('should throw INVALID_SIGNATURE when header has extra parts', () => {
      expect(() =>
        service.verify(rawBody, 't=1234567890,v1=abc,v2=def', secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });

    it('should throw INVALID_SIGNATURE when v1 is not valid hex', () => {
      expect(() =>
        service.verify(rawBody, 't=1234567890,v1=xyz!!!', secret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });

    it('should throw INVALID_SIGNATURE when wrong secret is used', () => {
      const signatureHeader = generateSignature();
      const wrongSecret = 'wrong-secret-value';

      expect(() =>
        service.verify(rawBody, signatureHeader, wrongSecret),
      ).toThrow(
        expect.objectContaining({
          code: ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
        }),
      );
    });
  });
});
