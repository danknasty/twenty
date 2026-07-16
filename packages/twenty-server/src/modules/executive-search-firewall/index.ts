export { FirewallContext } from './constants/firewall-contexts.constant';
export type { ProhibitedSelector } from './constants/firewall-prohibited-selectors.constant';
export { FIREWALL_PROHIBITED_SELECTORS } from './constants/firewall-prohibited-selectors.constant';
export { DenylistRule } from './constants/firewall-denylist-patterns.constant';
export type { DenylistPattern } from './constants/firewall-denylist-patterns.constant';
export { FIREWALL_DENYLIST_PATTERNS } from './constants/firewall-denylist-patterns.constant';
export {
  getProhibitedSelectorsForContext,
  isProhibitedSelector,
  getDenylistPatternsForObject,
  isOnDenylist,
} from './registry/prohibited-field.registry';
export {
  FirewallLeakageException,
  assertNoProhibitedSelectorsOrThrow,
  scanObjectForProhibitedFields,
} from './guards/firewall-leakage.guard';
export { assertObjectSearchFieldsContainNoProhibitedSelector } from './search/search-index-exclusion.guard';
