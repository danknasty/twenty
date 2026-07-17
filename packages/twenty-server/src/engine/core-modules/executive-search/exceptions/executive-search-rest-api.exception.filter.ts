/* @license Enterprise */

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';

import { type Response } from 'express';

import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';
import { HttpExceptionHandlerService } from 'src/engine/core-modules/exception-handler/http-exception-handler.service';

@Catch(ExecutiveSearchException)
export class ExecutiveSearchRestApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpExceptionHandlerService: HttpExceptionHandlerService,
  ) {}

  catch(exception: ExecutiveSearchException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case ExecutiveSearchExceptionCode.MISSING_SIGNATURE:
      case ExecutiveSearchExceptionCode.INVALID_SIGNATURE:
      case ExecutiveSearchExceptionCode.STALE_TIMESTAMP:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          401,
        );
      case ExecutiveSearchExceptionCode.INVALID_ENVELOPE:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          422,
        );
      case ExecutiveSearchExceptionCode.DUPLICATE_EVENT:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          409,
        );
      case ExecutiveSearchExceptionCode.LEDGER_ERROR:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          500,
        );
      case ExecutiveSearchExceptionCode.WORKSPACE_NOT_FOUND:
      case ExecutiveSearchExceptionCode.WORKSPACE_KEY_UNRESOLVED:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          404,
        );
      default:
        return this.httpExceptionHandlerService.handleError(
          exception,
          response,
          400,
        );
    }
  }
}
