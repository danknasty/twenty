/* @license Enterprise */

import { describe, expect, it } from '@jest/globals';

import { computeContentHash } from 'src/engine/core-modules/executive-search/utils/compute-content-hash.util';

describe('computeContentHash', () => {
  it('should produce the same hash for the same payload', () => {
    const payload: Record<string, unknown> = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };

    const hash1 = computeContentHash(payload);
    const hash2 = computeContentHash(payload);

    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different payloads', () => {
    const payload1: Record<string, unknown> = { name: 'Alice', role: 'admin' };
    const payload2: Record<string, unknown> = { name: 'Bob', role: 'user' };

    const hash1 = computeContentHash(payload1);
    const hash2 = computeContentHash(payload2);

    expect(hash1).not.toBe(hash2);
  });

  it('should produce the same hash regardless of key ordering', () => {
    const payload1: Record<string, unknown> = {
      a: 'alpha',
      b: 'beta',
      c: 'gamma',
    };
    const payload2: Record<string, unknown> = {
      c: 'gamma',
      a: 'alpha',
      b: 'beta',
    };

    const hash1 = computeContentHash(payload1);
    const hash2 = computeContentHash(payload2);

    expect(hash1).toBe(hash2);
  });

  it('should produce a 64-character hex string (SHA-256)', () => {
    const payload: Record<string, unknown> = { test: true };
    const hash = computeContentHash(payload);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should handle empty objects', () => {
    const payload: Record<string, unknown> = {};

    const hash = computeContentHash(payload);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should handle nested objects', () => {
    const payload: Record<string, unknown> = {
      user: { name: 'Jane', address: { city: 'NYC' } },
    };

    const hash = computeContentHash(payload);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should produce the same hash for nested objects regardless of key ordering', () => {
    const payload1: Record<string, unknown> = {
      user: { name: 'Jane', address: { city: 'NYC', zip: '10001' } },
    };
    const payload2: Record<string, unknown> = {
      user: { address: { zip: '10001', city: 'NYC' }, name: 'Jane' },
    };

    const hash1 = computeContentHash(payload1);
    const hash2 = computeContentHash(payload2);

    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different nested values', () => {
    const payload1: Record<string, unknown> = {
      user: { name: 'Jane', address: { city: 'NYC' } },
    };
    const payload2: Record<string, unknown> = {
      user: { name: 'Jane', address: { city: 'Boston' } },
    };

    const hash1 = computeContentHash(payload1);
    const hash2 = computeContentHash(payload2);

    expect(hash1).not.toBe(hash2);
  });
});
