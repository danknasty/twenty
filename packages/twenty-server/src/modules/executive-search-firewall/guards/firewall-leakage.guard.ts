import {
  getProhibitedSelectorsForContext,
  isProhibitedSelector,
} from '../registry/prohibited-field.registry';
import { FirewallContext } from '../constants/firewall-contexts.constant';

export class FirewallLeakageException extends Error {
  constructor(
    public readonly prohibitedFields: string[],
    context: FirewallContext,
  ) {
    const message = `Prohibited fields detected in ${context}: ${prohibitedFields.join(', ')}`;
    super(message);
    this.name = 'FirewallLeakageException';
  }
}

export const assertNoProhibitedSelectorsOrThrow = (
  payload: Record<string, unknown>,
  context: FirewallContext,
): void => {
  const prohibitedFields = Object.keys(payload).filter((key) =>
    isProhibitedSelector(key, context),
  );

  if (prohibitedFields.length > 0) {
    throw new FirewallLeakageException(prohibitedFields, context);
  }
};

export const scanObjectForProhibitedFields = (
  fieldNames: string[],
  context: FirewallContext,
): string[] => {
  return fieldNames.filter((fieldName) =>
    isProhibitedSelector(fieldName, context),
  );
};
