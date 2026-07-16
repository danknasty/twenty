import { Injectable } from '@nestjs/common';
import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';
import { SEARCH_ASSIGNMENT_STATUS_TRANSITIONS } from 'src/modules/executive-search/constants/search-assignment-status-transitions.constant';
import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/modules/executive-search/exceptions/executive-search.exception';

@Injectable()
export class AssignmentStatusTransitionService {
  assertValidTransition(
    from: SearchAssignmentStatus,
    to: SearchAssignmentStatus,
  ): void {
    const allowed = SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[from];

    if (!allowed.includes(to)) {
      throw new ExecutiveSearchException(
        ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION,
        `Invalid status transition from ${from} to ${to}`,
      );
    }
  }
}
