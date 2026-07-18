import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import { findManyObjectMetadataWithIndexes } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata-with-indexes.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType, RelationOnDeleteAction, RelationType } from 'twenty-shared/types';

const AI_GOVERNANCE_OBJECT_NAMES_SINGULAR = [
  'aiModelRegistry',
  'aiPromptTemplate',
  'aiProviderCallLog',
  'appAgents',
] as const;

// Map object name singular to its expected field names (custom fields +
// distinctive system/relational fields). Field types mirror the per-object
// compute-flat-field-metadata files so this catches accidental type drift.
const EXPECTED_FIELDS: Record<
  string,
  { name: string; type: FieldMetadataType }[]
> = {
  aiModelRegistry: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'modelId', type: FieldMetadataType.TEXT },
    { name: 'providerName', type: FieldMetadataType.TEXT },
    { name: 'modelVersion', type: FieldMetadataType.TEXT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'sdkPackage', type: FieldMetadataType.TEXT },
    { name: 'isCurrent', type: FieldMetadataType.BOOLEAN },
    { name: 'contextWindowTokens', type: FieldMetadataType.NUMBER },
    { name: 'maxOutputTokens', type: FieldMetadataType.NUMBER },
    { name: 'supportsReasoning', type: FieldMetadataType.BOOLEAN },
    { name: 'modelConfiguration', type: FieldMetadataType.RAW_JSON },
    { name: 'capabilities', type: FieldMetadataType.MULTI_SELECT },
    { name: 'guardrailPolicyVersion', type: FieldMetadataType.TEXT },
    { name: 'activatedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'deprecatedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'promptTemplates', type: FieldMetadataType.RELATION },
    { name: 'appAgents', type: FieldMetadataType.RELATION },
  ],
  aiPromptTemplate: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'promptKey', type: FieldMetadataType.TEXT },
    { name: 'version', type: FieldMetadataType.TEXT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'promptBody', type: FieldMetadataType.RICH_TEXT },
    { name: 'systemPrompt', type: FieldMetadataType.RICH_TEXT },
    { name: 'inputContract', type: FieldMetadataType.RAW_JSON },
    { name: 'outputSchema', type: FieldMetadataType.RAW_JSON },
    { name: 'responseFormat', type: FieldMetadataType.RAW_JSON },
    { name: 'modelConfiguration', type: FieldMetadataType.RAW_JSON },
    { name: 'guardrailPolicyVersion', type: FieldMetadataType.TEXT },
    { name: 'publishedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'deprecatedAt', type: FieldMetadataType.DATE_TIME },
    { name: 'targetModelId', type: FieldMetadataType.UUID },
    { name: 'targetModel', type: FieldMetadataType.RELATION },
    { name: 'providerCallLogs', type: FieldMetadataType.RELATION },
    { name: 'appAgents', type: FieldMetadataType.RELATION },
  ],
  aiProviderCallLog: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'requestId', type: FieldMetadataType.TEXT },
    { name: 'providerName', type: FieldMetadataType.TEXT },
    { name: 'modelId', type: FieldMetadataType.TEXT },
    { name: 'capability', type: FieldMetadataType.SELECT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'inputHash', type: FieldMetadataType.TEXT },
    { name: 'responseHash', type: FieldMetadataType.TEXT },
    { name: 'inputRedactionManifest', type: FieldMetadataType.RAW_JSON },
    { name: 'guardrailChecks', type: FieldMetadataType.RAW_JSON },
    { name: 'guardrailPolicyVersion', type: FieldMetadataType.TEXT },
    { name: 'latencyMs', type: FieldMetadataType.NUMBER },
    { name: 'tokenInputCount', type: FieldMetadataType.NUMBER },
    { name: 'tokenOutputCount', type: FieldMetadataType.NUMBER },
    { name: 'errorCode', type: FieldMetadataType.TEXT },
    { name: 'retentionPolicy', type: FieldMetadataType.TEXT },
    { name: 'retentionExpiresAt', type: FieldMetadataType.DATE_TIME },
    { name: 'legalHold', type: FieldMetadataType.BOOLEAN },
    { name: 'subjectType', type: FieldMetadataType.TEXT },
    { name: 'subjectId', type: FieldMetadataType.UUID },
    { name: 'agentTurnRef', type: FieldMetadataType.TEXT },
    { name: 'calledAt', type: FieldMetadataType.DATE_TIME },
    { name: 'promptTemplateId', type: FieldMetadataType.UUID },
    { name: 'promptTemplate', type: FieldMetadataType.RELATION },
  ],
  appAgents: [
    { name: 'name', type: FieldMetadataType.TEXT },
    { name: 'agentKey', type: FieldMetadataType.TEXT },
    { name: 'capability', type: FieldMetadataType.SELECT },
    { name: 'status', type: FieldMetadataType.SELECT },
    { name: 'description', type: FieldMetadataType.TEXT },
    { name: 'prompt', type: FieldMetadataType.TEXT },
    { name: 'killSwitchEnabled', type: FieldMetadataType.BOOLEAN },
    { name: 'approvalRequired', type: FieldMetadataType.BOOLEAN },
    { name: 'humanReviewRequired', type: FieldMetadataType.BOOLEAN },
    { name: 'consentRequired', type: FieldMetadataType.BOOLEAN },
    { name: 'isCustom', type: FieldMetadataType.BOOLEAN },
    { name: 'icon', type: FieldMetadataType.TEXT },
    { name: 'version', type: FieldMetadataType.TEXT },
    { name: 'capabilities', type: FieldMetadataType.RAW_JSON },
    { name: 'targetModelId', type: FieldMetadataType.UUID },
    { name: 'targetModel', type: FieldMetadataType.RELATION },
    { name: 'promptTemplateId', type: FieldMetadataType.UUID },
    { name: 'promptTemplate', type: FieldMetadataType.RELATION },
  ],
};

const findField = (
  objects: Awaited<ReturnType<typeof findManyObjectMetadataWithIndexes>>,
  objectName: string,
  fieldName: string,
) => {
  const obj = objects.find((o) => o.nameSingular === objectName);

  jestExpectToBeDefined(obj);

  const field = obj.fieldsList.find((f) => f.name === fieldName);

  jestExpectToBeDefined(field);

  return field;
};

describe('AI Governance Registry standard objects metadata sync', () => {
  describe('object metadata', () => {
    it('all 4 AI governance objects are present with correct names and UIDs', async () => {
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

      // Filter AI governance objects
      const aiGovernanceObjects = objects.filter((obj) =>
        AI_GOVERNANCE_OBJECT_NAMES_SINGULAR.includes(
          obj.nameSingular as (typeof AI_GOVERNANCE_OBJECT_NAMES_SINGULAR)[number],
        ),
      );

      expect(aiGovernanceObjects.length).toBe(
        AI_GOVERNANCE_OBJECT_NAMES_SINGULAR.length,
      );

      for (const nameSingular of AI_GOVERNANCE_OBJECT_NAMES_SINGULAR) {
        const obj = aiGovernanceObjects.find(
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
    it('each object has the expected key fields with correct types', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      for (const nameSingular of AI_GOVERNANCE_OBJECT_NAMES_SINGULAR) {
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
    it('aiPromptTemplate.targetModel -> aiModelRegistry is MANY_TO_ONE', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const targetModelField = findField(objects, 'aiPromptTemplate', 'targetModel');

      expect(targetModelField.type).toBe(FieldMetadataType.RELATION);
      expect(targetModelField.relation).toBeDefined();
      expect(targetModelField.relation?.type).toBe(RelationType.MANY_TO_ONE);
      expect(
        targetModelField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiModelRegistry');
    });

    it('aiProviderCallLog.promptTemplate -> aiPromptTemplate is MANY_TO_ONE', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const promptTemplateField = findField(
        objects,
        'aiProviderCallLog',
        'promptTemplate',
      );

      expect(promptTemplateField.type).toBe(FieldMetadataType.RELATION);
      expect(promptTemplateField.relation).toBeDefined();
      expect(promptTemplateField.relation?.type).toBe(RelationType.MANY_TO_ONE);
      expect(
        promptTemplateField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiPromptTemplate');
    });

    it('appAgents.targetModel -> aiModelRegistry is MANY_TO_ONE', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const targetModelField = findField(objects, 'appAgents', 'targetModel');

      expect(targetModelField.type).toBe(FieldMetadataType.RELATION);
      expect(targetModelField.relation).toBeDefined();
      expect(targetModelField.relation?.type).toBe(RelationType.MANY_TO_ONE);
      expect(
        targetModelField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiModelRegistry');
    });

    it('appAgents.promptTemplate -> aiPromptTemplate is MANY_TO_ONE', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const promptTemplateField = findField(objects, 'appAgents', 'promptTemplate');

      expect(promptTemplateField.type).toBe(FieldMetadataType.RELATION);
      expect(promptTemplateField.relation).toBeDefined();
      expect(promptTemplateField.relation?.type).toBe(RelationType.MANY_TO_ONE);
      expect(
        promptTemplateField.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiPromptTemplate');
    });

    it('reverse relation fields resolve correctly (ONE_TO_MANY)', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      // aiModelRegistry.promptTemplates -> aiPromptTemplate
      const registryPromptTemplates = findField(
        objects,
        'aiModelRegistry',
        'promptTemplates',
      );
      expect(registryPromptTemplates.relation?.type).toBe(
        RelationType.ONE_TO_MANY,
      );
      expect(
        registryPromptTemplates.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiPromptTemplate');

      // aiModelRegistry.appAgents -> appAgents
      const registryAppAgents = findField(objects, 'aiModelRegistry', 'appAgents');
      expect(registryAppAgents.relation?.type).toBe(RelationType.ONE_TO_MANY);
      expect(
        registryAppAgents.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('appAgents');

      // aiPromptTemplate.providerCallLogs -> aiProviderCallLog
      const templateCallLogs = findField(
        objects,
        'aiPromptTemplate',
        'providerCallLogs',
      );
      expect(templateCallLogs.relation?.type).toBe(RelationType.ONE_TO_MANY);
      expect(
        templateCallLogs.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('aiProviderCallLog');

      // aiPromptTemplate.appAgents -> appAgents
      const templateAppAgents = findField(objects, 'aiPromptTemplate', 'appAgents');
      expect(templateAppAgents.relation?.type).toBe(RelationType.ONE_TO_MANY);
      expect(
        templateAppAgents.relation?.targetObjectMetadata?.nameSingular,
      ).toBe('appAgents');
    });
  });

  describe('SELECT option counts', () => {
    it('each SELECT field has the expected number of options', async () => {
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
            options
          }
        `,
      });

      type ExpectedOption = { object: string; field: string; count: number };
      const expected: ExpectedOption[] = [
        { object: 'aiModelRegistry', field: 'status', count: 4 },
        { object: 'aiPromptTemplate', field: 'status', count: 4 },
        { object: 'aiProviderCallLog', field: 'capability', count: 11 },
        { object: 'aiProviderCallLog', field: 'status', count: 5 },
        { object: 'appAgents', field: 'capability', count: 11 },
        { object: 'appAgents', field: 'status', count: 3 },
      ];

      for (const { object, field, count } of expected) {
        const obj = objects.find((o) => o.nameSingular === object);

        jestExpectToBeDefined(obj);

        const fieldMetadata = obj.fieldsList.find((f) => f.name === field);

        jestExpectToBeDefined(fieldMetadata);
        expect(fieldMetadata.type).toBe(FieldMetadataType.SELECT);
        expect(Array.isArray(fieldMetadata.options)).toBe(true);
        expect(fieldMetadata.options.length).toBe(count);
      }
    });
  });

  describe('onDelete metadata', () => {
    it('aiProviderCallLog.promptTemplate declares onDelete RESTRICT', async () => {
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

      const callLogObj = objects.find(
        (o) => o.nameSingular === 'aiProviderCallLog',
      );
      jestExpectToBeDefined(callLogObj);

      const promptTemplateField = callLogObj.fieldsList.find(
        (f) => f.name === 'promptTemplate',
      );
      jestExpectToBeDefined(promptTemplateField);
      expect(promptTemplateField.settings?.onDelete).toBe(
        RelationOnDeleteAction.RESTRICT,
      );
    });
  });

  describe('plain reference fields', () => {
    it('aiProviderCallLog.agentTurnRef is a plain TEXT field (not a relation)', async () => {
      const objects = await findManyObjectMetadataWithIndexes({
        expectToFail: false,
      });

      const agentTurnRefField = findField(
        objects,
        'aiProviderCallLog',
        'agentTurnRef',
      );

      expect(agentTurnRefField.type).toBe(FieldMetadataType.TEXT);
      // A plain field carries no relation metadata.
      expect(agentTurnRefField.relation).toBeNull();
    });
  });
});
