import {
  isComparableField,
  parseFieldOwnershipCsv,
  projectIdentityLink,
  type FieldOwnershipRule,
} from 'src/modules/executive-search/reconciliation/engines/identity-link-projection.dry-projecter';

const buildLink = () => ({
  twentyEntityName: 'executiveProfile',
  twentyRecordId: 'twenty-rec-1',
  externalSystemName: 'directus',
  externalEntityName: 'executives',
  externalRecordId: 'ext-1',
});

describe('identity-link-projection.dry-projecter', () => {
  describe('isComparableField', () => {
    it('compares Twenty-authoritative fields', () => {
      expect(
        isComparableField({
          authority: 'TWENTY_AUTHORITATIVE',
          syncDirection: 'None_outbound',
        }),
      ).toBe(true);
    });

    it('compares inbound fields', () => {
      expect(
        isComparableField({
          authority: 'DIRECTUS_AUTHORITATIVE',
          syncDirection: 'Inbound',
        }),
      ).toBe(true);
    });

    it('does not compare not-allowed-to-sync fields', () => {
      expect(
        isComparableField({
          authority: 'DIRECTUS_AUTHORITATIVE',
          syncDirection: 'NOT_ALLOWED_TO_SYNC',
        }),
      ).toBe(false);
    });

    it('does not compare outbound-only external fields', () => {
      expect(
        isComparableField({
          authority: 'DIRECTUS_AUTHORITATIVE',
          syncDirection: 'None_outbound',
        }),
      ).toBe(false);
    });
  });

  describe('projectIdentityLink', () => {
    const fieldOwnership: Record<string, FieldOwnershipRule> = {
      name: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
      email: { authority: 'DIRECTUS_AUTHORITATIVE', syncDirection: 'Inbound' },
      ats_uuid: {
        authority: 'TWENTY_AUTHORITATIVE',
        syncDirection: 'Outbound_verified',
      },
      internal_notes: {
        authority: 'TWENTY_AUTHORITATIVE',
        syncDirection: 'None_outbound',
      },
      password: {
        authority: 'DIRECTUS_AUTHORITATIVE',
        syncDirection: 'NOT_ALLOWED_TO_SYNC',
      },
    };

    it('computes the expected diff for an UPDATE', () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane.new@example.com',
        // ats_uuid intentionally absent from external payload
        internal_notes: 'external tries to overwrite',
        password: 'should-be-ignored',
      };
      const currentRecord = {
        name: 'Jane Smith',
        email: 'jane.new@example.com',
        ats_uuid: 'twenty-rec-1',
        internal_notes: 'private twenty note',
        password: 'twenty-secret',
      };

      const diffs = projectIdentityLink({
        payload,
        link: buildLink(),
        currentRecord,
        fieldOwnership,
      });

      // email matches -> excluded. password is not allowed to sync -> excluded.
      // name differs (inbound) -> included.
      // internal_notes differs (twenty-authoritative) -> included.
      // ats_uuid: payload has none (undefined) vs current has a value -> drift.
      const fieldNames = diffs.map((d) => d.fieldName).sort();

      expect(fieldNames).toEqual(['ats_uuid', 'internal_notes', 'name']);

      const nameDiff = diffs.find((d) => d.fieldName === 'name');

      expect(nameDiff).toEqual({
        fieldName: 'name',
        currentValue: 'Jane Smith',
        projectedValue: 'Jane Doe',
        authority: 'DIRECTUS_AUTHORITATIVE',
      });

      const atsDiff = diffs.find((d) => d.fieldName === 'ats_uuid');

      expect(atsDiff?.authority).toBe('TWENTY_AUTHORITATIVE');
      expect(atsDiff?.projectedValue).toBeUndefined();
      expect(atsDiff?.currentValue).toBe('twenty-rec-1');
    });

    it('returns no diff when the projected values all match', () => {
      const payload = { name: 'Jane Doe', email: 'jane@example.com' };
      const currentRecord = { name: 'Jane Doe', email: 'jane@example.com' };

      const diffs = projectIdentityLink({
        payload,
        link: buildLink(),
        currentRecord,
        fieldOwnership,
      });

      expect(diffs).toEqual([]);
    });

    it('treats null and undefined as equivalent (no spurious drift)', () => {
      const payload = { name: null };
      const currentRecord = { name: undefined };

      const diffs = projectIdentityLink({
        payload,
        link: buildLink(),
        currentRecord,
        fieldOwnership,
      });

      expect(diffs).toEqual([]);
    });

    it('handles a missing current record (pure insert projection)', () => {
      const payload = { name: 'Jane Doe' };

      const diffs = projectIdentityLink({
        payload,
        link: buildLink(),
        currentRecord: null,
        fieldOwnership,
      });

      expect(diffs.map((d) => d.fieldName)).toEqual(['name']);
      expect(diffs[0].currentValue).toBeUndefined();
      expect(diffs[0].projectedValue).toBe('Jane Doe');
    });

    it('ignores payload fields that are not in the ownership map', () => {
      const payload = {
        name: 'Jane Doe',
        mystery_field: 'unknown authority',
      };
      const currentRecord = { name: 'Someone Else' };

      const diffs = projectIdentityLink({
        payload,
        link: buildLink(),
        currentRecord,
        fieldOwnership,
      });

      expect(diffs.map((d) => d.fieldName)).toEqual(['name']);
    });
  });

  describe('parseFieldOwnershipCsv', () => {
    it('parses quoted field groups into a normalized field map', () => {
      const csv = [
        'collection,field_group,canonical_authority,sync_direction,twenty_behavior,data_classification,source_citation',
        'executives,"Name, email, phone",DIRECTUS_AUTHORITATIVE,Inbound,Project into person,Candidate data,cite',
        'executives,internal_notes,TWENTY_AUTHORITATIVE,None_outbound,Internal only,Confidential,cite',
        'executives,password,DIRECTUS_AUTHORITATIVE,NOT_ALLOWED_TO_SYNC,Never copy,Secret,cite',
      ].join('\n');

      const map = parseFieldOwnershipCsv(csv);

      expect(map['name']).toEqual({
        authority: 'DIRECTUS_AUTHORITATIVE',
        syncDirection: 'Inbound',
      });
      expect(map['email']).toEqual({
        authority: 'DIRECTUS_AUTHORITATIVE',
        syncDirection: 'Inbound',
      });
      expect(map['phone']).toEqual({
        authority: 'DIRECTUS_AUTHORITATIVE',
        syncDirection: 'Inbound',
      });
      expect(map['internal_notes']).toEqual({
        authority: 'TWENTY_AUTHORITATIVE',
        syncDirection: 'None_outbound',
      });
      expect(map['password']).toEqual({
        authority: 'DIRECTUS_AUTHORITATIVE',
        syncDirection: 'NOT_ALLOWED_TO_SYNC',
      });
    });

    it('skips blank lines and malformed rows', () => {
      const csv = [
        'collection,field_group,canonical_authority,sync_direction',
        '',
        'executives,only-one-column',
        'executives,name,DIRECTUS_AUTHORITATIVE,Inbound',
      ].join('\n');

      const map = parseFieldOwnershipCsv(csv);

      expect(Object.keys(map)).toEqual(['name']);
    });
  });
});
