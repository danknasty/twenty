import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UserInputError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

@Catch(ExecutiveSearchException)
export class ExecutiveSearchGraphqlApiExceptionFilter implements GqlExceptionFilter {
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
      case ExecutiveSearchExceptionCode.NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.INVALID_STATE:
        throw new UserInputError(exception.message);
      case ExecutiveSearchExceptionCode.INTERNAL_ERROR:
        throw new InternalServerError(exception.message);
      case ExecutiveSearchExceptionCode.OPERATION_REQUIRES_FEATURE_FLAG:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.METRIC_NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.CUTOVER_STAGE_REGRESSION:
        throw new InternalServerError(exception.message);
      case ExecutiveSearchExceptionCode.CUTOVER_INVALID_REVERT:
        throw new InternalServerError(exception.message);
      case ExecutiveSearchExceptionCode.AI_CONTEXT_VIOLATION:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.BOARD_MATRIX_AI_DISABLED:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.SEARCH_HEALTH_AI_DISABLED:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.EXECUTIVE_SEARCH_AI_DISABLED:
        throw new ForbiddenError(exception.message);
      case ExecutiveSearchExceptionCode.BOARD_COMPOSITION_PROFILE_NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.BOARD_MATRIX_CRITERIA_NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.CANDIDATE_NOT_FOUND:
        throw new NotFoundError(exception.message);
      case ExecutiveSearchExceptionCode.SEARCH_ASSIGNMENT_NOT_FOUND:
        throw new NotFoundError(exception.message);
      default:
        throw new InternalServerError(exception.message);
    }
  }
}
