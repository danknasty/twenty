/* @license Enterprise */

import { readFileSync } from 'fs';
import { join } from 'path';

import { validate } from 'src/engine/core-modules/executive-search/contracts/external-sync-event.validator';

const validFixturePath = join(
  __dirname,
  '../../../../../../../../docs/executive-search/fixtures/external-sync-event.valid.json',
);
const invalidFixturePath = join(
  __dirname,
  '../../../../../../../../docs/executive-search/fixtures/external-sync-event.invalid.json',
);

describe('ExternalSyncEventValidator', () => {
  describe('valid fixture', () => {
    it('should pass validation for a well-formed event', () => {
      const raw = JSON.parse(readFileSync(validFixturePath, 'utf-8'));
      const result = validate(raw);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('invalid fixture', () => {
    it('should fail validation for a malformed event', () => {
      const raw = JSON.parse(readFileSync(invalidFixturePath, 'utf-8'));
      const result = validate(raw);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('additionalProperties', () => {
    it('should reject events with extra unknown properties', () => {
      const raw = JSON.parse(readFileSync(validFixturePath, 'utf-8'));
      const polluted = { ...raw, unknownField: 'should-not-be-allowed' };
      const result = validate(polluted);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(
        result.errors!.some((e) =>
          e.toLowerCase().includes('additional'),
        ),
      ).toBe(true);
    });
  });

  describe('field validation', () => {
    it('should reject when required field is missing', () => {
      const raw = JSON.parse(readFileSync(validFixturePath, 'utf-8'));
      const { eventId, ...missingEventId } = raw;
      const result = validate(missingEventId);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(
        result.errors!.some((e) =>
          e.toLowerCase().includes("must have required property 'eventid'"),
        ),
      ).toBe(true);
    });

    it('should reject when sourceSystem is not DIRECTUS or TWENTY', () => {
      const raw = JSON.parse(readFileSync(validFixturePath, 'utf-8'));
      const result = validate({ ...raw, sourceSystem: 'OTHER' });

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject when eventVersion is not an integer', () => {
      const raw = JSON.parse(readFileSync(validFixturePath, 'utf-8'));
      const result = validate({ ...raw, eventVersion: 'not-a-number' });

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});
