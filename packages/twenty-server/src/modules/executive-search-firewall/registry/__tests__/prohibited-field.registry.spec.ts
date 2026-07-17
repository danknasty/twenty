import { FirewallContext } from 'src/modules/executive-search-firewall/constants/firewall-contexts.constant';
import {
  getProhibitedSelectorsForContext,
  isProhibitedSelector,
  getDenylistPatternsForObject,
} from 'src/modules/executive-search-firewall/registry/prohibited-field.registry';

describe('prohibited-field.registry', () => {
  describe('getProhibitedSelectorsForContext', () => {
    it('returns subscription_tier, plan_level, is_premium for search_filter context', () => {
      const result = getProhibitedSelectorsForContext(
        FirewallContext.SEARCH_FILTER,
      );

      expect(result).toContain('subscription_tier');
      expect(result).toContain('plan_level');
      expect(result).toContain('is_premium');
    });

    it('returns selectors specific to ai_context', () => {
      const result = getProhibitedSelectorsForContext(
        FirewallContext.AI_CONTEXT,
      );

      expect(result).toContain('subscription_tier');
      expect(result).toContain('plan_level');
      expect(result).toContain('birthdate');
      expect(result).toContain('gender');
      expect(result).toContain('voluntary_demographics');
    });

    it('returns selectors specific to client_report', () => {
      const result = getProhibitedSelectorsForContext(
        FirewallContext.CLIENT_REPORT,
      );

      expect(result).toContain('subscription_tier');
      expect(result).toContain('is_premium');
    });
  });

  describe('isProhibitedSelector', () => {
    it('returns true for subscription_tier in search_filter context', () => {
      expect(
        isProhibitedSelector('subscription_tier', FirewallContext.SEARCH_FILTER),
      ).toBe(true);
    });

    it('returns false for name in search_filter context', () => {
      expect(
        isProhibitedSelector('name', FirewallContext.SEARCH_FILTER),
      ).toBe(false);
    });

    it('returns true for birthdate in ai_context', () => {
      expect(
        isProhibitedSelector('birthdate', FirewallContext.AI_CONTEXT),
      ).toBe(true);
    });

    it('returns false for email in any context', () => {
      expect(
        isProhibitedSelector('email', FirewallContext.SEARCH_FILTER),
      ).toBe(false);
      expect(
        isProhibitedSelector('email', FirewallContext.AI_CONTEXT),
      ).toBe(false);
      expect(
        isProhibitedSelector('email', FirewallContext.CLIENT_REPORT),
      ).toBe(false);
    });
  });

  describe('getDenylistPatternsForObject', () => {
    it('returns patterns with executives. prefix for objectName executives', () => {
      const result = getDenylistPatternsForObject('executives');

      expect(result.length).toBeGreaterThanOrEqual(3);

      const subscriptionTierPattern = result.find(
        (p) => p.fieldOrPattern === 'executives.subscription_tier',
      );
      expect(subscriptionTierPattern).toBeDefined();
      expect(subscriptionTierPattern!.dataClassification).toBe(
        'Commercial/subscription data',
      );
    });

    it('returns empty array for unknown object', () => {
      const result = getDenylistPatternsForObject('nonexistent');

      expect(result).toEqual([]);
    });
  });
});
