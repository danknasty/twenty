import { CriterionAssessmentKillSwitchService } from 'src/modules/executive-search/criterion/services/criterion-assessment-kill-switch.service';

describe('CriterionAssessmentKillSwitchService', () => {
  let service: CriterionAssessmentKillSwitchService;

  beforeEach(() => {
    service = new CriterionAssessmentKillSwitchService();
  });

  afterEach(() => {
    service.resetAll();
  });

  describe('isActive', () => {
    it('returns false for a capability that has never been set', () => {
      expect(service.isActive('criterion-assessment')).toBe(false);
    });

    it('returns false for a capability that was deactivated', () => {
      service.activate('criterion-assessment');
      service.deactivate('criterion-assessment');

      expect(service.isActive('criterion-assessment')).toBe(false);
    });

    it('returns true for a capability with an active kill switch', () => {
      service.activate('criterion-assessment');

      expect(service.isActive('criterion-assessment')).toBe(true);
    });
  });

  describe('activate', () => {
    it('activates the kill switch for the named capability', () => {
      service.activate('board-matrix-evaluation');

      expect(service.isActive('board-matrix-evaluation')).toBe(true);
    });

    it('does not affect other capabilities', () => {
      service.activate('criterion-assessment');

      expect(service.isActive('criterion-assessment')).toBe(true);
      expect(service.isActive('board-matrix-evaluation')).toBe(false);
    });
  });

  describe('deactivate', () => {
    it('deactivates an active kill switch', () => {
      service.activate('criterion-assessment');
      service.deactivate('criterion-assessment');

      expect(service.isActive('criterion-assessment')).toBe(false);
    });

    it('is idempotent for already-inactive capabilities', () => {
      service.deactivate('criterion-assessment');

      expect(service.isActive('criterion-assessment')).toBe(false);
    });
  });

  describe('getActiveCapabilities', () => {
    it('returns an empty array when no kill switches are active', () => {
      expect(service.getActiveCapabilities()).toEqual([]);
    });

    it('returns only the capabilities with active kill switches', () => {
      service.activate('criterion-assessment');
      service.activate('board-matrix-evaluation');
      service.activate('search-health-advisory');
      service.deactivate('board-matrix-evaluation');

      const active = service.getActiveCapabilities();

      expect(active).toContain('criterion-assessment');
      expect(active).toContain('search-health-advisory');
      expect(active).not.toContain('board-matrix-evaluation');
    });
  });

  describe('resetAll', () => {
    it('deactivates all kill switches', () => {
      service.activate('criterion-assessment');
      service.activate('board-matrix-evaluation');
      service.resetAll();

      expect(service.isActive('criterion-assessment')).toBe(false);
      expect(service.isActive('board-matrix-evaluation')).toBe(false);
      expect(service.getActiveCapabilities()).toEqual([]);
    });
  });
});
