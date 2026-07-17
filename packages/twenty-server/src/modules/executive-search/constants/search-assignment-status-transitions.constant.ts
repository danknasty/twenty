import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';

export const SEARCH_ASSIGNMENT_STATUS_TRANSITIONS: Record<
  SearchAssignmentStatus,
  SearchAssignmentStatus[]
> = {
  [SearchAssignmentStatus.BD_HANDOFF]: [SearchAssignmentStatus.CONTRACTING],
  [SearchAssignmentStatus.CONTRACTING]: [SearchAssignmentStatus.KICKOFF],
  [SearchAssignmentStatus.KICKOFF]: [SearchAssignmentStatus.ACTIVE],
  [SearchAssignmentStatus.ACTIVE]: [
    SearchAssignmentStatus.ON_HOLD,
    SearchAssignmentStatus.PLACEMENT_PENDING,
    SearchAssignmentStatus.CANCELLED,
    SearchAssignmentStatus.LOST,
  ],
  [SearchAssignmentStatus.ON_HOLD]: [SearchAssignmentStatus.ACTIVE],
  [SearchAssignmentStatus.PLACEMENT_PENDING]: [SearchAssignmentStatus.PLACED],
  [SearchAssignmentStatus.PLACED]: [SearchAssignmentStatus.GUARANTEE],
  [SearchAssignmentStatus.GUARANTEE]: [SearchAssignmentStatus.COMPLETED],
  [SearchAssignmentStatus.COMPLETED]: [],
  [SearchAssignmentStatus.CANCELLED]: [],
  [SearchAssignmentStatus.LOST]: [],
};
