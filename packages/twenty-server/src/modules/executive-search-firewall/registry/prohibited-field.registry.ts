import { camelToSnakeCase } from 'src/utils/camel-to-snake-case';

import {
  FIREWALL_DENYLIST_PATTERNS,
  type DenylistPattern,
} from '../constants/firewall-denylist-patterns.constant';
import { FIREWALL_PROHIBITED_SELECTORS } from '../constants/firewall-prohibited-selectors.constant';
import { FirewallContext } from '../constants/firewall-contexts.constant';

export const getProhibitedSelectorsForContext = (
  context: FirewallContext,
): string[] => {
  return FIREWALL_PROHIBITED_SELECTORS[context].map(
    (entry) => entry.selector,
  );
};

export const isProhibitedSelector = (
  selector: string,
  context: FirewallContext,
): boolean => {
  const normalisedSelector = camelToSnakeCase(selector);
  return getProhibitedSelectorsForContext(context).includes(
    normalisedSelector,
  );
};

export const getDenylistPatternsForObject = (
  objectName: string,
): DenylistPattern[] => {
  const prefix = `${objectName}.`;
  return FIREWALL_DENYLIST_PATTERNS.filter((pattern) =>
    pattern.fieldOrPattern.startsWith(prefix),
  );
};

export const isOnDenylist = (fieldOrPattern: string): boolean => {
  return FIREWALL_DENYLIST_PATTERNS.some(
    (entry) => entry.fieldOrPattern === fieldOrPattern,
  );
};
