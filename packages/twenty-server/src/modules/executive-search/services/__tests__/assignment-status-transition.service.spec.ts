import { AssignmentStatusTransitionService } from '../assignment-status-transition.service';
import { SearchAssignmentStatus } from '../../common/enums/search-assignment-status.enum';
import { ExecutiveSearchExceptionCode } from '../../exceptions/executive-search.exception';

describe('AssignmentStatusTransitionService', () => {
  let service: AssignmentStatusTransitionService;

  beforeEach(() => {
    service = new AssignmentStatusTransitionService();
  });

  describe('valid transitions', () => {
    it('BD_HANDOFF → CONTRACTING', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.BD_HANDOFF,
          SearchAssignmentStatus.CONTRACTING,
        ),
      ).not.toThrow();
    });

    it('CONTRACTING → KICKOFF', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.CONTRACTING,
          SearchAssignmentStatus.KICKOFF,
        ),
      ).not.toThrow();
    });

    it('KICKOFF → ACTIVE', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.KICKOFF,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).not.toThrow();
    });

    it('ACTIVE → ON_HOLD', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.ACTIVE,
          SearchAssignmentStatus.ON_HOLD,
        ),
      ).not.toThrow();
    });

    it('ACTIVE → PLACEMENT_PENDING', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.ACTIVE,
          SearchAssignmentStatus.PLACEMENT_PENDING,
        ),
      ).not.toThrow();
    });

    it('ACTIVE → CANCELLED', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.ACTIVE,
          SearchAssignmentStatus.CANCELLED,
        ),
      ).not.toThrow();
    });

    it('ACTIVE → LOST', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.ACTIVE,
          SearchAssignmentStatus.LOST,
        ),
      ).not.toThrow();
    });

    it('ON_HOLD → ACTIVE', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.ON_HOLD,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).not.toThrow();
    });

    it('PLACEMENT_PENDING → PLACED', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.PLACEMENT_PENDING,
          SearchAssignmentStatus.PLACED,
        ),
      ).not.toThrow();
    });

    it('PLACED → GUARANTEE', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.PLACED,
          SearchAssignmentStatus.GUARANTEE,
        ),
      ).not.toThrow();
    });

    it('GUARANTEE → COMPLETED', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.GUARANTEE,
          SearchAssignmentStatus.COMPLETED,
        ),
      ).not.toThrow();
    });
  });

  describe('invalid transitions', () => {
    it('BD_HANDOFF → ACTIVE throws', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.BD_HANDOFF,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).toThrow(ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION);
    });

    it('PLACED → ACTIVE throws', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.PLACED,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).toThrow(ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION);
    });

    it('COMPLETED → any status throws (COMPLETED → BD_HANDOFF)', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.COMPLETED,
          SearchAssignmentStatus.BD_HANDOFF,
        ),
      ).toThrow(ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION);
    });

    it('CANCELLED → any status throws (CANCELLED → ACTIVE)', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.CANCELLED,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).toThrow(ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION);
    });

    it('LOST → any status throws (LOST → ACTIVE)', () => {
      expect(() =>
        service.assertValidTransition(
          SearchAssignmentStatus.LOST,
          SearchAssignmentStatus.ACTIVE,
        ),
      ).toThrow(ExecutiveSearchExceptionCode.INVALID_STATUS_TRANSITION);
    });
  });
});
