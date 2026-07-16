import { FirewallContext } from 'src/modules/executive-search-firewall/constants/firewall-contexts.constant';
import {
  assertNoProhibitedSelectorsOrThrow,
  scanObjectForProhibitedFields,
  FirewallLeakageException,
} from 'src/modules/executive-search-firewall/guards/firewall-leakage.guard';

describe('firewall-leakage.guard', () => {
  describe('assertNoProhibitedSelectorsOrThrow', () => {
    it('throws when payload contains subscriptionTier in CLIENT_REPORT context', () => {
      const payload = { subscriptionTier: 'premium', name: 'John' };

      expect(() =>
        assertNoProhibitedSelectorsOrThrow(
          payload,
          FirewallContext.CLIENT_REPORT,
        ),
      ).toThrow(FirewallLeakageException);
    });

    it('throws with the correct prohibited field names in the exception', () => {
      const payload = { subscriptionTier: 'premium', isPremium: true };

      try {
        assertNoProhibitedSelectorsOrThrow(
          payload,
          FirewallContext.CLIENT_REPORT,
        );
        fail('Expected FirewallLeakageException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(FirewallLeakageException);
        if (error instanceof FirewallLeakageException) {
          expect(error.prohibitedFields).toContain('subscriptionTier');
          expect(error.prohibitedFields).toContain('isPremium');
        }
      }
    });

    it('returns void for clean payload with no prohibited selectors', () => {
      const payload = { name: 'John', email: 'john@example.com' };

      expect(() =>
        assertNoProhibitedSelectorsOrThrow(
          payload,
          FirewallContext.CLIENT_REPORT,
        ),
      ).not.toThrow();
    });

    it('throws for multiple prohibited fields in SEARCH_FILTER context', () => {
      const payload = {
        subscription_tier: 'enterprise',
        plan_level: 'premium',
        is_premium: true,
        name: 'Acme Corp',
      };

      expect(() =>
        assertNoProhibitedSelectorsOrThrow(
          payload,
          FirewallContext.SEARCH_FILTER,
        ),
      ).toThrow(FirewallLeakageException);
    });
  });

  describe('scanObjectForProhibitedFields', () => {
    it('returns empty array when no field names are prohibited', () => {
      const result = scanObjectForProhibitedFields(
        ['name', 'email', 'domainName'],
        FirewallContext.SEARCH_FILTER,
      );

      expect(result).toEqual([]);
    });

    it('returns prohibited field names for matching fields', () => {
      const result = scanObjectForProhibitedFields(
        ['name', 'subscriptionTier', 'birthdate', 'email'],
        FirewallContext.AI_CONTEXT,
      );

      expect(result).toEqual(['subscriptionTier', 'birthdate']);
    });

    it('returns empty array for empty field array', () => {
      const result = scanObjectForProhibitedFields(
        [],
        FirewallContext.SEARCH_FILTER,
      );

      expect(result).toEqual([]);
    });
  });
});
