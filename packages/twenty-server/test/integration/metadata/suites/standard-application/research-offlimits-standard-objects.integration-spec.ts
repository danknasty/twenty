import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import { findManyObjectMetadataWithIndexes } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata-with-indexes.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

const RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR = [
  'researchStrategy',
  'marketMap',
  'targetCompany',
  'researchCandidate',
  'relationshipEdge',
  'offLimitsRestriction',
  'conflictCheck',
  'confidentialityRecord',
] as const;

// Map object name singular to its expected field names (custom fields only, no system fields)
const EXPECTED_FIELDS: Record<
  string,
  { name: string; type: FieldMetadataType }[]
> = {
  researchStrategy: [
    { name: 'searchAssignmentId', type: FieldMetadataType.UUID },
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'priority', type: FieldMetadataType.SELECT },
    { name: 'objectives', type: FieldMetadataType.RICH_TEXT },
    { name: 'targetSegments', type: FieldMetadataType.TEXT },
    { name: 'sourcingChannels', type: FieldMetadataType.MULTI_SELECT },
    { name: 'targetCandidateCount', type: FieldMetadataType.NUMBER },
    { name: 'startDate', type: FieldMetadataType.DATE },
    { name: 'targetCompletionDate', type: FieldMetadataType.DATE },
    { name: 'completedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'owner', type: FieldMetadataType.RELATION },
    { name: 'marketMaps', type: FieldMetadataType.RELATION },
    { name: 'researchCandidates', type: FieldMetadataType.RELATION },
  ],
  marketMap: [
    { name: 'researchStrategy', type: FieldMetadataType.RELATION },
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'mapType', type: FieldMetadataType.SELECT },
    { name: 'segment', type: FieldMetadataType.TEXT },
    { name: 'geography', type: FieldMetadataType.TEXT },
    { name: 'description', type: FieldMetadataType.RICH_TEXT },
    { name: 'targetCompanies', type: FieldMetadataType.RELATION },
  ],
  targetCompany: [
    { name: 'marketMap', type: FieldMetadataType.RELATION },
    { name: 'company', type: FieldMetadataType.RELATION },
    { name: 'companyName', type: FieldMetadataType.TEXT },
    { name: 'domain', type: FieldMetadataType.TEXT },
    { name: 'industry', type: FieldMetadataType.TEXT },
    { name: 'sizeBand', type: FieldMetadataType.SELECT },
    { name: 'tier', type: FieldMetadataType.SELECT },
    { name: 'attractiveness', type: FieldMetadataType.SELECT },
    { name: 'headquartersLocation', type: FieldMetadataType.TEXT },
    { name: 'rationale', type: FieldMetadataType.TEXT },
    { name: 'researchCandidates', type: FieldMetadataType.RELATION },
  ],
  researchCandidate: [
    { name: 'researchStrategy', type: FieldMetadataType.RELATION },
    { name: 'targetCompany', type: FieldMetadataType.RELATION },
    { name: 'executiveProfile', type: FieldMetadataType.RELATION },
    { name: 'person', type: FieldMetadataType.RELATION },
    { name: 'searchAssignmentId', type: FieldMetadataType.UUID },
    { name: 'currentTitle', type: FieldMetadataType.TEXT },
    { name: 'currentCompany', type: FieldMetadataType.TEXT },
    { name: 'fitScore', type: FieldMetadataType.NUMBER },
    { name: 'tier', type: FieldMetadataType.SELECT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'source', type: FieldMetadataType.SELECT },
    { name: 'rationale', type: FieldMetadataType.TEXT },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'lastContactedAt', type: FieldMetadataType.DATE_TIME },
  ],
  relationshipEdge: [
    { name: 'sourcePerson', type: FieldMetadataType.RELATION },
    { name: 'targetPerson', type: FieldMetadataType.RELATION },
    { name: 'sourceCompany', type: FieldMetadataType.RELATION },
    { name: 'targetCompany', type: FieldMetadataType.RELATION },
    { name: 'summary', type: FieldMetadataType.TEXT },
    { name: 'relationshipType', type: FieldMetadataType.SELECT },
    { name: 'strength', type: FieldMetadataType.SELECT },
    { name: 'source', type: FieldMetadataType.SELECT },
    { name: 'confidenceLevel', type: FieldMetadataType.SELECT },
    { name: 'context', type: FieldMetadataType.TEXT },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'observedAt', type: FieldMetadataType.DATE },
  ],
  offLimitsRestriction: [
    { name: 'company', type: FieldMetadataType.RELATION },
    { name: 'person', type: FieldMetadataType.RELATION },
    { name: 'clientCompany', type: FieldMetadataType.RELATION },
    { name: 'summary', type: FieldMetadataType.TEXT },
    { name: 'restrictionScope', type: FieldMetadataType.SELECT },
    { name: 'restrictionType', type: FieldMetadataType.SELECT },
    { name: 'basis', type: FieldMetadataType.SELECT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'clientName', type: FieldMetadataType.TEXT },
    { name: 'startDate', type: FieldMetadataType.DATE },
    { name: 'endDate', type: FieldMetadataType.DATE },
    { name: 'waiverReason', type: FieldMetadataType.TEXT },
    { name: 'waivedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'reviewReason', type: FieldMetadataType.TEXT },
  ],
  conflictCheck: [
    { name: 'searchAssignmentId', type: FieldMetadataType.UUID },
    { name: 'subjectPerson', type: FieldMetadataType.RELATION },
    { name: 'subjectCompany', type: FieldMetadataType.RELATION },
    { name: 'matchedRestriction', type: FieldMetadataType.RELATION },
    { name: 'summary', type: FieldMetadataType.TEXT },
    { name: 'subjectType', type: FieldMetadataType.SELECT },
    { name: 'checkType', type: FieldMetadataType.SELECT },
    { name: 'outcome', type: FieldMetadataType.SELECT },
    { name: 'outcomeReason', type: FieldMetadataType.TEXT },
    { name: 'checkedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'expiresAt', type: FieldMetadataType.DATE_TIME },
    { name: 'waiverReference', type: FieldMetadataType.TEXT },
    { name: 'reviewNotes', type: FieldMetadataType.RICH_TEXT },
  ],
  confidentialityRecord: [
    { name: 'searchAssignmentId', type: FieldMetadataType.UUID },
    { name: 'company', type: FieldMetadataType.RELATION },
    { name: 'person', type: FieldMetadataType.RELATION },
    { name: 'summary', type: FieldMetadataType.TEXT },
    { name: 'recordType', type: FieldMetadataType.SELECT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'counterpartyName', type: FieldMetadataType.TEXT },
    { name: 'signedDate', type: FieldMetadataType.DATE },
    { name: 'expiryDate', type: FieldMetadataType.DATE },
    { name: 'scope', type: FieldMetadataType.RICH_TEXT },
    { name: 'notes', type: FieldMetadataType.RICH_TEXT },
    { name: 'owner', type: FieldMetadataType.RELATION },
  ],
};

describe('Research/offlimits standard objects metadata sync', () => {
  describe('object metadata', () => {
    it('all 8 research/offlimits objects are present with correct names and UIDs', async () => {
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

      // Filter research/offlimits objects
      const researchOfflimitsObjects = objects.filter((obj) =>
        RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR.includes(
          obj.nameSingular as (typeof RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR)[number],
        ),
      );

      expect(researchOfflimitsObjects.length).toBe(
        RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR.length,
      );

      for (const nameSingular of RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR) {
        const obj = researchOfflimitsObjects.find(
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

      for (const nameSingular of RESEARCH_OFFLIMITS_OBJECT_NAMES_SINGULAR) {
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
    it('verifies researchStrategy → marketMap CASCADE relation resolves correctly', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const marketMapObj = objects.find(
        (o) => o.nameSingular === 'marketMap',
      );

      jestExpectToBeDefined(marketMapObj);

      const researchStrategyField = marketMapObj.fieldsList.find(
        (f) => f.name === 'researchStrategy',
      );

      jestExpectToBeDefined(researchStrategyField);
      expect(researchStrategyField.relation).toBeDefined();
      expect(
        researchStrategyField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('researchStrategy');
    });

    it('verifies researchCandidate.executiveProfile → executiveProfile resolution', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const researchCandidateObj = objects.find(
        (o) => o.nameSingular === 'researchCandidate',
      );

      jestExpectToBeDefined(researchCandidateObj);

      const executiveProfileField = researchCandidateObj.fieldsList.find(
        (f) => f.name === 'executiveProfile',
      );

      jestExpectToBeDefined(executiveProfileField);
      expect(executiveProfileField.type).toBe(FieldMetadataType.RELATION);
      expect(executiveProfileField.relation).toBeDefined();
      expect(
        executiveProfileField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('executiveProfile');
    });

    it('verifies conflictCheck.matchedRestriction → offLimitsRestriction resolution', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const conflictCheckObj = objects.find(
        (o) => o.nameSingular === 'conflictCheck',
      );

      jestExpectToBeDefined(conflictCheckObj);

      const matchedRestrictionField = conflictCheckObj.fieldsList.find(
        (f) => f.name === 'matchedRestriction',
      );

      jestExpectToBeDefined(matchedRestrictionField);
      expect(matchedRestrictionField.type).toBe(FieldMetadataType.RELATION);
      expect(matchedRestrictionField.relation).toBeDefined();
      expect(
        matchedRestrictionField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('offLimitsRestriction');
    });

    it('verifies offLimitsRestriction → company SET_NULL relation resolves correctly', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const offLimitsRestrictionObj = objects.find(
        (o) => o.nameSingular === 'offLimitsRestriction',
      );

      jestExpectToBeDefined(offLimitsRestrictionObj);

      const companyField = offLimitsRestrictionObj.fieldsList.find(
        (f) => f.name === 'company',
      );

      jestExpectToBeDefined(companyField);
      expect(companyField.type).toBe(FieldMetadataType.RELATION);
      expect(companyField.relation).toBeDefined();
      expect(
        companyField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('company');
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

      // marketMap.researchStrategy → researchStrategy (CASCADE)
      const marketMapObj = objects.find(
        (o) => o.nameSingular === 'marketMap',
      );
      jestExpectToBeDefined(marketMapObj);

      const researchStrategyField = marketMapObj.fieldsList.find(
        (f) => f.name === 'researchStrategy',
      );
      jestExpectToBeDefined(researchStrategyField);
      expect(researchStrategyField.settings?.onDelete).toBe(
        RelationOnDeleteAction.CASCADE,
      );

      // researchCandidate.researchStrategy → researchStrategy (CASCADE)
      const researchCandidateObj = objects.find(
        (o) => o.nameSingular === 'researchCandidate',
      );
      jestExpectToBeDefined(researchCandidateObj);

      const researchStrategyCandidateField =
        researchCandidateObj.fieldsList.find(
          (f) => f.name === 'researchStrategy',
        );
      jestExpectToBeDefined(researchStrategyCandidateField);
      expect(researchStrategyCandidateField.settings?.onDelete).toBe(
        RelationOnDeleteAction.CASCADE,
      );

      // targetCompany.marketMap → marketMap (CASCADE)
      const targetCompanyObj = objects.find(
        (o) => o.nameSingular === 'targetCompany',
      );
      jestExpectToBeDefined(targetCompanyObj);

      const marketMapField = targetCompanyObj.fieldsList.find(
        (f) => f.name === 'marketMap',
      );
      jestExpectToBeDefined(marketMapField);
      expect(marketMapField.settings?.onDelete).toBe(
        RelationOnDeleteAction.CASCADE,
      );
    });

    it('compliance relations declare RelationOnDeleteAction.SET_NULL', async () => {
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

      // offLimitsRestriction.company → company (SET_NULL)
      const offLimitsRestrictionObj = objects.find(
        (o) => o.nameSingular === 'offLimitsRestriction',
      );
      jestExpectToBeDefined(offLimitsRestrictionObj);

      const companyField = offLimitsRestrictionObj.fieldsList.find(
        (f) => f.name === 'company',
      );
      jestExpectToBeDefined(companyField);
      expect(companyField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );

      // conflictCheck.matchedRestriction → offLimitsRestriction (SET_NULL)
      const conflictCheckObj = objects.find(
        (o) => o.nameSingular === 'conflictCheck',
      );
      jestExpectToBeDefined(conflictCheckObj);

      const matchedRestrictionField = conflictCheckObj.fieldsList.find(
        (f) => f.name === 'matchedRestriction',
      );
      jestExpectToBeDefined(matchedRestrictionField);
      expect(matchedRestrictionField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );

      // researchCandidate.targetCompany → targetCompany (SET_NULL)
      const researchCandidateObj = objects.find(
        (o) => o.nameSingular === 'researchCandidate',
      );
      jestExpectToBeDefined(researchCandidateObj);

      const targetCompanyField = researchCandidateObj.fieldsList.find(
        (f) => f.name === 'targetCompany',
      );
      jestExpectToBeDefined(targetCompanyField);
      expect(targetCompanyField.settings?.onDelete).toBe(
        RelationOnDeleteAction.SET_NULL,
      );
    });
  });
});
