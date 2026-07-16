/* @license Enterprise */

import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { assertUnreachable } from 'twenty-shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum ExecutiveSearchExceptionCode {
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  STALE_TIMESTAMP = 'STALE_TIMESTAMP',
  MISSING_SIGNATURE = 'MISSING_SIGNATURE',
  INVALID_ENVELOPE = 'INVALID_ENVELOPE',
  DUPLICATE_EVENT = 'DUPLICATE_EVENT',
  LEDGER_ERROR = 'LEDGER_ERROR',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  WORKSPACE_KEY_UNRESOLVED = 'WORKSPACE_KEY_UNRESOLVED',
}

const getExecutiveSearchExceptionUserFriendlyMessage = (
  code: ExecutiveSearchExceptionCode,
) => {
  switch (code) {
    case ExecutiveSearchExceptionCode.INVALID_SIGNATURE:
      return msg`Invalid HMAC signature.`;
    case ExecutiveSearchExceptionCode.STALE_TIMESTAMP:
      return msg`Timestamp is outside the allowed tolerance window.`;
    case ExecutiveSearchExceptionCode.MISSING_SIGNATURE:
      return msg`Missing HMAC signature header.`;
    case ExecutiveSearchExceptionCode.INVALID_ENVELOPE:
      return msg`Invalid event envelope.`;
    case ExecutiveSearchExceptionCode.DUPLICATE_EVENT:
      return msg`Duplicate event detected.`;
    case ExecutiveSearchExceptionCode.LEDGER_ERROR:
      return msg`A ledger error occurred.`;
    case ExecutiveSearchExceptionCode.WORKSPACE_NOT_FOUND:
      return msg`Workspace not found.`;
    case ExecutiveSearchExceptionCode.WORKSPACE_KEY_UNRESOLVED:
      return msg`Workspace key could not be resolved.`;
    default:
      assertUnreachable(code);
  }
};

export class ExecutiveSearchException extends CustomException<ExecutiveSearchExceptionCode> {
  constructor(
    message: string,
    code: ExecutiveSearchExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getExecutiveSearchExceptionUserFriendlyMessage(code),
    });
  }
}
