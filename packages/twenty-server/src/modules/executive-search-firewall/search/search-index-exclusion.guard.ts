import { scanObjectForProhibitedFields } from '../guards/firewall-leakage.guard';
import { FirewallLeakageException } from '../guards/firewall-leakage.guard';
import { FirewallContext } from '../constants/firewall-contexts.constant';

export const assertObjectSearchFieldsContainNoProhibitedSelector = (
  searchableFieldNames: string[],
  context: FirewallContext,
): void => {
  const prohibitedFields = scanObjectForProhibitedFields(
    searchableFieldNames,
    context,
  );

  if (prohibitedFields.length > 0) {
    throw new FirewallLeakageException(prohibitedFields, context);
  }
};
