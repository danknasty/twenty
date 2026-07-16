import { FirewallContext } from 'src/modules/executive-search-firewall/constants/firewall-contexts.constant';
import { assertObjectSearchFieldsContainNoProhibitedSelector } from 'src/modules/executive-search-firewall/search/search-index-exclusion.guard';
import { FirewallLeakageException } from 'src/modules/executive-search-firewall/guards/firewall-leakage.guard';

describe('search-index-exclusion.guard', () => {
  describe('assertObjectSearchFieldsContainNoProhibitedSelector', () => {
    it('throws when searchable fields contain subscriptionTier in SEARCH_FILTER context', () => {
      expect(() =>
        assertObjectSearchFieldsContainNoProhibitedSelector(
          ['subscriptionTier', 'name'],
          FirewallContext.SEARCH_FILTER,
        ),
      ).toThrow(FirewallLeakageException);
    });

    it('passes when searchable fields contain only safe fields', () => {
      expect(() =>
        assertObjectSearchFieldsContainNoProhibitedSelector(
          ['name', 'domainName'],
          FirewallContext.SEARCH_FILTER,
        ),
      ).not.toThrow();
    });

    it('throws for multiple prohibited selectors', () => {
      expect(() =>
        assertObjectSearchFieldsContainNoProhibitedSelector(
          ['subscriptionTier', 'planLevel', 'isPremium', 'name'],
          FirewallContext.SEARCH_FILTER,
        ),
      ).toThrow(FirewallLeakageException);
    });

    it('passes for empty field list', () => {
      expect(() =>
        assertObjectSearchFieldsContainNoProhibitedSelector(
          [],
          FirewallContext.SEARCH_FILTER,
        ),
      ).not.toThrow();
    });

    it('throws for birthdate in AI_CONTEXT', () => {
      expect(() =>
        assertObjectSearchFieldsContainNoProhibitedSelector(
          ['birthdate', 'summary'],
          FirewallContext.AI_CONTEXT,
        ),
      ).toThrow(FirewallLeakageException);
    });
  });
});
