/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { createHmac, timingSafeEqual } from 'crypto';

import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';
import { HMAC_TIMESTAMP_TOLERANCE_SECONDS } from 'src/engine/core-modules/executive-search/executive-search.constants';

@Injectable()
export class HmacSignatureVerifierService {
  verify(rawBody: Buffer, signatureHeader: string, secret: string): void {
    if (!signatureHeader) {
      throw new ExecutiveSearchException(
        'Missing HMAC signature header',
        ExecutiveSearchExceptionCode.MISSING_SIGNATURE,
      );
    }

    // Parse signature header: "t=<unix>,v1=<hex>"
    const match = signatureHeader.match(/^t=(\d+),v1=([a-f0-9]+)$/i);

    if (!match) {
      throw new ExecutiveSearchException(
        'Invalid HMAC signature header format',
        ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
      );
    }

    const timestamp = match[1];
    const receivedSignatureHex = match[2];

    // Validate timestamp is within tolerance
    const nowSeconds = Math.floor(Date.now() / 1000);
    const timestampSeconds = parseInt(timestamp, 10);

    if (isNaN(timestampSeconds)) {
      throw new ExecutiveSearchException(
        'Invalid timestamp in HMAC signature header',
        ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
      );
    }

    if (nowSeconds - timestampSeconds > HMAC_TIMESTAMP_TOLERANCE_SECONDS) {
      throw new ExecutiveSearchException(
        'Timestamp is outside the allowed tolerance window',
        ExecutiveSearchExceptionCode.STALE_TIMESTAMP,
      );
    }

    if (timestampSeconds > nowSeconds + HMAC_TIMESTAMP_TOLERANCE_SECONDS) {
      throw new ExecutiveSearchException(
        'Timestamp is in the future beyond the allowed tolerance window',
        ExecutiveSearchExceptionCode.STALE_TIMESTAMP,
      );
    }

    // Recompute: HMAC-SHA256(secret, `${t}.${rawBody}`)
    const hmacInput = `${timestamp}.`;
    const hmacInputBuffer = Buffer.concat([
      Buffer.from(hmacInput, 'utf-8'),
      rawBody,
    ]);

    const expectedSignature = createHmac('sha256', secret)
      .update(hmacInputBuffer)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedBuffer = Buffer.from(receivedSignatureHex, 'hex');

    if (expectedBuffer.length !== receivedBuffer.length) {
      throw new ExecutiveSearchException(
        'HMAC signature mismatch',
        ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
      );
    }

    if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
      throw new ExecutiveSearchException(
        'HMAC signature mismatch',
        ExecutiveSearchExceptionCode.INVALID_SIGNATURE,
      );
    }
  }
}
