import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

import {
  InternalServerError,
  NotFoundError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

@Catch(ExecutiveSearchException)
export class ExecutiveSearchGraphqlApiExceptionFilter
  implements GqlExceptionFilter
{
  catch(exception: ExecutiveSearchException, _host: ArgumentsHost) {
    switch (exception.code) {
      case ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_WON:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.CLIENT_COMPANY_REQUIRED:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.NO_APPROVED_ENGAGEMENT_TERMS:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.OFF_LIMITS_BLOCKED:
        throw new InternalServerError(exception.message);
      case ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION:
        throw new InternalServerError(exception.message);
      default:
        throw new InternalServerError(exception.message);
    }
  }
}
