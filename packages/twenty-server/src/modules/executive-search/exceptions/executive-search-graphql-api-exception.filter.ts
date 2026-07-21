import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

@Catch(ExecutiveSearchException)
export class ExecutiveSearchGraphqlApiExceptionFilter implements GqlExceptionFilter {
  catch(exception: ExecutiveSearchException, _host: ArgumentsHost) {
    switch (exception.code) {
      // -- 404: Not Found --
      case ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_FOUND:
      case ExecutiveSearchExceptionCode.OPPORTUNITY_NOT_WON:
      case ExecutiveSearchExceptionCode.CLIENT_COMPANY_REQUIRED:
      case ExecutiveSearchExceptionCode.NO_APPROVED_ENGAGEMENT_TERMS:
      case ExecutiveSearchExceptionCode.METRIC_NOT_FOUND:
      case ExecutiveSearchExceptionCode.BOARD_COMPOSITION_PROFILE_NOT_FOUND:
      case ExecutiveSearchExceptionCode.BOARD_MATRIX_CRITERIA_NOT_FOUND:
      case ExecutiveSearchExceptionCode.CANDIDATE_NOT_FOUND:
      case ExecutiveSearchExceptionCode.SEARCH_ASSIGNMENT_NOT_FOUND:
        throw new NotFoundError(exception.message);

      // -- 403: Forbidden / Feature disabled --
      case ExecutiveSearchExceptionCode.FEATURE_FLAG_DISABLED:
      case ExecutiveSearchExceptionCode.OFF_LIMITS_BLOCKED:
      case ExecutiveSearchExceptionCode.AI_CONTEXT_VIOLATION:
        throw new ForbiddenError(exception.message);

      // -- 500: Internal Server Error --
      case ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION:
      case ExecutiveSearchExceptionCode.CUTOVER_STAGE_REGRESSION:
      case ExecutiveSearchExceptionCode.CUTOVER_INVALID_REVERT:
      case ExecutiveSearchExceptionCode.DRAFT_REQUIRES_HUMAN_REVIEW:
      case ExecutiveSearchExceptionCode.CANDIDATE_PRESENTATION_CONSENT_REQUIRED:
      case ExecutiveSearchExceptionCode.SHADOW_ASSESSMENT_NOT_SUBMITTABLE:
      case ExecutiveSearchExceptionCode.BOARD_MATRIX_REQUIRES_HUMAN_REVIEW:
      case ExecutiveSearchExceptionCode.RELATIONSHIP_PATH_NO_AUTO_SEND:
        throw new InternalServerError(exception.message);

      default:
        throw new InternalServerError(exception.message);
    }
  }
}
