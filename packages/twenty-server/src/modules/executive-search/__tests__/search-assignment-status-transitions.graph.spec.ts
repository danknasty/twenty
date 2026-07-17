import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';
import { SEARCH_ASSIGNMENT_STATUS_TRANSITIONS } from 'src/modules/executive-search/constants/search-assignment-status-transitions.constant';

describe('SEARCH_ASSIGNMENT_STATUS_TRANSITIONS', () => {
  it('has an entry for every SearchAssignmentStatus value', () => {
    const statusValues = Object.values(SearchAssignmentStatus);
    const transitionKeys = Object.keys(SEARCH_ASSIGNMENT_STATUS_TRANSITIONS);

    expect(transitionKeys.sort()).toEqual(statusValues.sort());
  });

  it('BD_HANDOFF can only transition to CONTRACTING', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.BD_HANDOFF],
    ).toEqual([SearchAssignmentStatus.CONTRACTING]);
  });

  it('CONTRACTING can only transition to KICKOFF', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.CONTRACTING],
    ).toEqual([SearchAssignmentStatus.KICKOFF]);
  });

  it('KICKOFF can only transition to ACTIVE', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.KICKOFF],
    ).toEqual([SearchAssignmentStatus.ACTIVE]);
  });

  it('ACTIVE can transition to ON_HOLD, PLACEMENT_PENDING, CANCELLED, LOST', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.ACTIVE].sort(),
    ).toEqual(
      [
        SearchAssignmentStatus.ON_HOLD,
        SearchAssignmentStatus.PLACEMENT_PENDING,
        SearchAssignmentStatus.CANCELLED,
        SearchAssignmentStatus.LOST,
      ].sort(),
    );
  });

  it('ON_HOLD can only transition back to ACTIVE', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.ON_HOLD],
    ).toEqual([SearchAssignmentStatus.ACTIVE]);
  });

  it('PLACEMENT_PENDING can only transition to PLACED', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[
        SearchAssignmentStatus.PLACEMENT_PENDING
      ],
    ).toEqual([SearchAssignmentStatus.PLACED]);
  });

  it('PLACED can only transition to GUARANTEE', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.PLACED],
    ).toEqual([SearchAssignmentStatus.GUARANTEE]);
  });

  it('GUARANTEE can only transition to COMPLETED', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.GUARANTEE],
    ).toEqual([SearchAssignmentStatus.COMPLETED]);
  });

  it('COMPLETED is a terminal state (no outgoing transitions)', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.COMPLETED],
    ).toEqual([]);
  });

  it('CANCELLED is a terminal state (no outgoing transitions)', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.CANCELLED],
    ).toEqual([]);
  });

  it('LOST is a terminal state (no outgoing transitions)', () => {
    expect(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[SearchAssignmentStatus.LOST],
    ).toEqual([]);
  });

  it('every value is a valid SearchAssignmentStatus', () => {
    const statusValues = Object.values(SearchAssignmentStatus);

    for (const fromStatus of Object.keys(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS,
    ) as SearchAssignmentStatus[]) {
      for (const toStatus of SEARCH_ASSIGNMENT_STATUS_TRANSITIONS[
        fromStatus
      ]) {
        expect(statusValues).toContain(toStatus);
      }
    }
  });

  it('no extra edges exist — every status matches expected outgoing count', () => {
    // Expected outgoing edge counts per status
    const expectedOutgoingCounts: Record<SearchAssignmentStatus, number> = {
      [SearchAssignmentStatus.BD_HANDOFF]: 1,
      [SearchAssignmentStatus.CONTRACTING]: 1,
      [SearchAssignmentStatus.KICKOFF]: 1,
      [SearchAssignmentStatus.ACTIVE]: 4,
      [SearchAssignmentStatus.ON_HOLD]: 1,
      [SearchAssignmentStatus.PLACEMENT_PENDING]: 1,
      [SearchAssignmentStatus.PLACED]: 1,
      [SearchAssignmentStatus.GUARANTEE]: 1,
      [SearchAssignmentStatus.COMPLETED]: 0,
      [SearchAssignmentStatus.CANCELLED]: 0,
      [SearchAssignmentStatus.LOST]: 0,
    };

    for (const [status, transitions] of Object.entries(
      SEARCH_ASSIGNMENT_STATUS_TRANSITIONS,
    )) {
      expect(transitions).toHaveLength(
        expectedOutgoingCounts[status as SearchAssignmentStatus],
      );
    }
  });
});
