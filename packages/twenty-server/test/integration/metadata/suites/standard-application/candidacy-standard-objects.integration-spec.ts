import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import { findManyObjectMetadataWithIndexes } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata-with-indexes.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

const CANDIDACY_OBJECT_NAMES_SINGULAR = [
  'searchCandidacy',
  'candidacyStageEvent',
] as const;

// Map object name singular to its expected field names (custom fields only, no system fields)
const EXPECTED_FIELDS: Record<
  string,
  { name: string; type: FieldMetadataType }[]
> = {
  searchCandidacy: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'currentStage', type: FieldMetadataType.TEXT },
    { name: 'assignedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'lastStageChangedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'closedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'candidateConsentDate', type: FieldMetadataType.DATE_TIME },
    { name: 'searchAssignment', type: FieldMetadataType.RELATION },
    { name: 'searchAssignmentId', type: FieldMetadataType.UUID },
    { name: 'person', type: FieldMetadataType.RELATION },
    { name: 'personId', type: FieldMetadataType.UUID },
    { name: 'researchCandidate', type: FieldMetadataType.RELATION },
    { name: 'researchCandidateId', type: FieldMetadataType.UUID },
    { name: 'executiveProfile', type: FieldMetadataType.RELATION },
    { name: 'executiveProfileId', type: FieldMetadataType.UUID },
    { name: 'stageEvents', type: FieldMetadataType.RELATION },
  ],
  candidacyStageEvent: [
    { name: 'stage', type: FieldMetadataType.TEXT },
    { name: 'stageFrom', type: FieldMetadataType.TEXT },
    { name: 'stageTo', type: FieldMetadataType.TEXT },
    { name: 'transitionedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'transitionedById', type: FieldMetadataType.UUID },
    { name: 'actorKind', type: FieldMetadataType.TEXT },
    { name: 'reason', type: FieldMetadataType.TEXT },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'isCandidateVisible', type: FieldMetadataType.BOOLEAN },
    { name: 'candidacy', type: FieldMetadataType.RELATION },
    { name: 'candidacyId', type: FieldMetadataType.UUID },
  ],
};

describe('Candidacy pipeline standard objects metadata sync', () => {
  describe('object metadata', () => {
    it('both candidacy objects are present with correct names and UIDs', async () => {
      const { objects } = await findManyObjectMetadata({
        expectToFail: false,
        input: {
          filter: {},
          paging: { first: 100 },
        },
        gqlFields: `
          id
          nameSingular
          namePlural
          universalIdentifier
          labelSingular
          labelPlural
          isSystem
          isCustom
        `,
      });

      // Filter candidacy objects
      const candidacyObjects = objects.filter((obj) =>
        CANDIDACY_OBJECT_NAMES_SINGULAR.includes(
          obj.nameSingular as (typeof CANDIDACY_OBJECT_NAMES_SINGULAR)[number],
        ),
      );

      expect(candidacyObjects.length).toBe(
        CANDIDACY_OBJECT_NAMES_SINGULAR.length,
      );

      for (const nameSingular of CANDIDACY_OBJECT_NAMES_SINGULAR) {
        const obj = candidacyObjects.find(
          (o) => o.nameSingular === nameSingular,
        );

        jestExpectToBeDefined(obj);
        expect(obj.universalIdentifier).toBe(
          STANDARD_OBJECTS[nameSingular].universalIdentifier,
        );
        expect(obj.isSystem).toBe(true);
        expect(obj.isCustom).toBe(false);
      }
    });
  });

  describe('field metadata', () => {
    it('each object has the expected fields with correct types', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      for (const nameSingular of CANDIDACY_OBJECT_NAMES_SINGULAR) {
        const obj = objects.find((o) => o.nameSingular === nameSingular);

        jestExpectToBeDefined(obj);

        const expectedFields = EXPECTED_FIELDS[nameSingular];
        jestExpectToBeDefined(expectedFields);

        for (const expectedField of expectedFields) {
          const actualField = obj.fieldsList.find(
            (f) => f.name === expectedField.name,
          );

          jestExpectToBeDefined(actualField);
          expect(actualField.type).toBe(expectedField.type);
        }
      }
    });
  });

  describe('relation resolution', () => {
    it('verifies candidacyStageEvent.candidacy → searchCandidacy CASCADE relation resolves correctly', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const candidacyStageEventObj = objects.find(
        (o) => o.nameSingular === 'candidacyStageEvent',
      );

      jestExpectToBeDefined(candidacyStageEventObj);

      const candidacyField = candidacyStageEventObj.fieldsList.find(
        (f) => f.name === 'candidacy',
      );

      jestExpectToBeDefined(candidacyField);
      expect(candidacyField.relation).toBeDefined();
      expect(
        candidacyField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('searchCandidacy');
    });

    it('verifies searchCandidacy.searchAssignment → searchAssignment resolution', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const searchCandidacyObj = objects.find(
        (o) => o.nameSingular === 'searchCandidacy',
      );

      jestExpectToBeDefined(searchCandidacyObj);

      const searchAssignmentField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'searchAssignment',
      );

      jestExpectToBeDefined(searchAssignmentField);
      expect(searchAssignmentField.type).toBe(FieldMetadataType.RELATION);
      expect(searchAssignmentField.relation).toBeDefined();
      expect(
        searchAssignmentField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('searchAssignment');
    });

    it('verifies searchCandidacy.person → person resolution', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const searchCandidacyObj = objects.find(
        (o) => o.nameSingular === 'searchCandidacy',
      );

      jestExpectToBeDefined(searchCandidacyObj);

      const personField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'person',
      );

      jestExpectToBeDefined(personField);
      expect(personField.type).toBe(FieldMetadataType.RELATION);
      expect(personField.relation).toBeDefined();
      expect(
        personField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('person');
    });

    it('verifies searchCandidacy.stageEvents → candidacyStageEvent resolution', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const searchCandidacyObj = objects.find(
        (o) => o.nameSingular === 'searchCandidacy',
      );

      jestExpectToBeDefined(searchCandidacyObj);

      const stageEventsField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'stageEvents',
      );

      jestExpectToBeDefined(stageEventsField);
      expect(stageEventsField.type).toBe(FieldMetadataType.RELATION);
      expect(stageEventsField.relation).toBeDefined();
      expect(
        stageEventsField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('candidacyStageEvent');
    });
  });

  describe('onDelete metadata', () => {
    it('CASCADE relations declare RelationOnDeleteAction.CASCADE', async () => {
      const { objects } = await findManyObjectMetadata({
        expectToFail: false,
        input: {
          filter: {},
          paging: { first: 100 },
        },
        gqlFields: `
          id
          nameSingular
          fieldsList {
            id
            type
            name
            settings
          }
        `,
      });

      // candidacyStageEvent.candidacy → searchCandidacy (CASCADE)
      const candidacyStageEventObj = objects.find(
        (o) => o.nameSingular === 'candidacyStageEvent',
      );
      jestExpectToBeDefined(candidacyStageEventObj);

      const candidacyField = candidacyStageEventObj.fieldsList.find(
        (f) => f.name === 'candidacy',
      );
      jestExpectToBeDefined(candidacyField);
      expect(candidacyField.settings?.onDelete).toBe(
        RelationOnDeleteAction.CASCADE,
      );

      // searchCandidacy.searchAssignment → searchAssignment (CASCADE)
      const searchCandidacyObj = objects.find(
        (o) => o.nameSingular === 'searchCandidacy',
      );
      jestExpectToBeDefined(searchCandidacyObj);

      const searchAssignmentField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'searchAssignment',
      );
      jestExpectToBeDefined(searchAssignmentField);
      expect(searchAssignmentField.settings?.onDelete).toBe(
        RelationOnDeleteAction.CASCADE,
      );
    });

    it('SET_NULL relations declare RelationOnDeleteAction.SET_NULL', async () => {
      const { objects } = await findManyObjectMetadata({
        expectToFail: false,
        input: {
          filter: {},
          paging: { first: 100 },
        },
        gqlFields: `
          id
          nameSingular
          fieldsList {
            id
            type
            name
            settings
          }
        `,
      });

      // searchCandidacy.person → person (SET_NULL)
      const searchCandidacyObj = objects.find(
        (o) => o.nameSingular === 'searchCandidacy',
      );
      jestExpectToBeDefined(searchCandidacyObj);

      const personField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'person',
      );
      jestExpectToBeDefined(personField);
      expect(personField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );

      // searchCandidacy.researchCandidate → researchCandidate (SET_NULL)
      const researchCandidateField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'researchCandidate',
      );
      jestExpectToBeDefined(researchCandidateField);
      expect(researchCandidateField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );

      // searchCandidacy.executiveProfile → executiveProfile (SET_NULL)
      const executiveProfileField = searchCandidacyObj.fieldsList.find(
        (f) => f.name === 'executiveProfile',
      );
      jestExpectToBeDefined(executiveProfileField);
      expect(executiveProfileField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );
    });
  });
});
