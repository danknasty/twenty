import {
  getFieldUniversalIdentifier,
  TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

const RESEARCH_OFFLIMITS_OBJECT_NAMES = [
  'researchStrategy',
  'marketMap',
  'targetCompany',
  'researchCandidate',
  'relationshipEdge',
  'offLimitsRestriction',
  'conflictCheck',
  'confidentialityRecord',
] as const;

const SYSTEM_FIELD_NAMES = [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'createdBy',
  'updatedBy',
  'position',
  'searchVector',
] as const;

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Research/offlimits object identifiers determinism', () => {
  describe('object universal identifiers', () => {
    it('each of the 8 objects has a valid UUID v4 universalIdentifier', () => {
      for (const name of RESEARCH_OFFLIMITS_OBJECT_NAMES) {
        const obj = STANDARD_OBJECTS[name];
        expect(obj).toBeDefined();
        expect(obj.universalIdentifier).toMatch(UUID_V4_REGEX);
      }
    });

    it('all 8 object universal identifiers are unique (no collisions)', () => {
      const uids = RESEARCH_OFFLIMITS_OBJECT_NAMES.map(
        (name) => STANDARD_OBJECTS[name].universalIdentifier,
      );
      const uniqueUids = new Set(uids);

      expect(uniqueUids.size).toBe(RESEARCH_OFFLIMITS_OBJECT_NAMES.length);
    });
  });

  describe('field universal identifiers', () => {
    it('for each object, all custom-field UIDs are unique within the object', () => {
      for (const name of RESEARCH_OFFLIMITS_OBJECT_NAMES) {
        const obj = STANDARD_OBJECTS[name];
        const fieldUids = Object.values(obj.fields).map(
          (field: { universalIdentifier: string }) => field.universalIdentifier,
        );
        const uniqueFieldUids = new Set(fieldUids);

        expect(uniqueFieldUids.size).toBe(fieldUids.length);
      }
    });

    it('no custom-field UID collisions across objects', () => {
      const allFieldUids: string[] = [];

      for (const name of RESEARCH_OFFLIMITS_OBJECT_NAMES) {
        const obj = STANDARD_OBJECTS[name];
        const fieldUids = Object.values(obj.fields).map(
          (field: { universalIdentifier: string }) => field.universalIdentifier,
        );

        allFieldUids.push(...fieldUids);
      }

      const uniqueFieldUids = new Set(allFieldUids);

      expect(uniqueFieldUids.size).toBe(allFieldUids.length);
    });

    it('system-field UIDs match UUID-v5 derivation', () => {
      for (const name of RESEARCH_OFFLIMITS_OBJECT_NAMES) {
        const obj = STANDARD_OBJECTS[name];

        for (const fieldName of SYSTEM_FIELD_NAMES) {
          const expectedUid = getFieldUniversalIdentifier({
            applicationUniversalIdentifier:
              TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            objectUniversalIdentifier: obj.universalIdentifier,
            name: fieldName,
          });

          expect(obj.fields[fieldName]).toBeDefined();
          expect(obj.fields[fieldName].universalIdentifier).toBe(expectedUid);
        }
      }
    });
  });

  describe('researchStrategy specific assertions', () => {
    it('the owner relation exists on researchStrategy', () => {
      const researchStrategy = STANDARD_OBJECTS.researchStrategy;

      expect(researchStrategy.fields.owner).toBeDefined();
      expect(researchStrategy.fields.owner.universalIdentifier).toMatch(
        UUID_V4_REGEX,
      );
    });

    it('researchStrategy has marketMaps and researchCandidates relations', () => {
      const researchStrategy = STANDARD_OBJECTS.researchStrategy;

      expect(researchStrategy.fields.marketMaps).toBeDefined();
      expect(researchStrategy.fields.researchCandidates).toBeDefined();
    });
  });

  describe('researchCandidate specific assertions', () => {
    it('the executiveProfile and person relations exist on researchCandidate', () => {
      const researchCandidate = STANDARD_OBJECTS.researchCandidate;

      expect(researchCandidate.fields.executiveProfile).toBeDefined();
      expect(researchCandidate.fields.executiveProfile.universalIdentifier).toMatch(
        UUID_V4_REGEX,
      );
      expect(researchCandidate.fields.person).toBeDefined();
      expect(researchCandidate.fields.person.universalIdentifier).toMatch(
        UUID_V4_REGEX,
      );
    });
  });

  describe('conflictCheck specific assertions', () => {
    it('the matchedRestriction relation exists on conflictCheck', () => {
      const conflictCheck = STANDARD_OBJECTS.conflictCheck;

      expect(conflictCheck.fields.matchedRestrictionId).toBeDefined();
      expect(
        conflictCheck.fields.matchedRestrictionId.universalIdentifier,
      ).toMatch(UUID_V4_REGEX);
    });
  });
});
