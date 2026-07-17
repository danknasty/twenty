/* @license Enterprise */

import { createHash } from 'crypto';

/**
 * Recursively sort keys in an object for deterministic JSON serialization.
 * Ensures {a: {c:1, b:2}} and {a: {b:2, c:1}} produce identical output.
 */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value !== null && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce(
        (acc, key) => {
          (acc as Record<string, unknown>)[key] = sortKeys(
            (value as Record<string, unknown>)[key],
          );
          return acc;
        },
        {} as Record<string, unknown>,
      );
  }
  return value;
}

export function computeContentHash(payload: Record<string, unknown>): string {
  const deterministic = JSON.stringify(sortKeys(payload));
  return createHash('sha256').update(deterministic).digest('hex');
}
