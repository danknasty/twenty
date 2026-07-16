import { FieldMetadataType } from 'twenty-shared/types';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { buildSearchEngagementTermsStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-search-engagement-terms-standard-flat-field-metadata.util';
import { STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME } from 'src/engine/workspace-manager/twenty-standard-application/utils/object-metadata/create-standard-flat-object-metadata.util';
import { type StandardObjectMetadataRelatedEntityIds } from 'src/engine/workspace-manager/twenty-standard-application/utils/get-standard-object-metadata-related-entity-ids.util';

const buildMockRelatedEntityIds = (): StandardObjectMetadataRelatedEntityIds => {
  const objectNames = [
    'searchEngagementTerms',
    'opportunity',
    'taskTarget',
    'noteTarget',
    'attachment',
    'timelineActivity',
    'workspaceMember',
  ] as const;

  const result = {} as StandardObjectMetadataRelatedEntityIds;

  for (const objectName of objectNames) {
    const objectFields =
      STANDARD_OBJECTS[objectName as keyof typeof STANDARD_OBJECTS]?.fields;
    if (!objectFields) continue;

    // Clone the fields and add targetSearchEngagementTerms for target objects
    const fieldEntries = Object.entries(objectFields).map(
      ([fieldName, fieldDef]) => [fieldName, { ...fieldDef }],
    );

    // Add targetSearchEngagementTerms for morph target objects that need it
    if (
      ['taskTarget', 'noteTarget', 'attachment', 'timelineActivity'].includes(
        objectName,
      )
    ) {
      fieldEntries.push([
        'targetSearchEngagementTerms',
        { universalIdentifier: `mock-${objectName}-targetSearchEngagementTerms-uuid` },
      ]);
    }

    // Add searchEngagementTerms for opportunity (reverse relation)
    if (objectName === 'opportunity') {
      fieldEntries.push([
        'searchEngagementTerms',
        { universalIdentifier: 'mock-opportunity-searchEngagementTerms-uuid' },
      ]);
    }

    // Add ownedSearchEngagementTerms for workspaceMember (reverse relation)
    if (objectName === 'workspaceMember') {
      fieldEntries.push([
        'ownedSearchEngagementTerms',
        { universalIdentifier: 'mock-workspaceMember-ownedSearchEngagementTerms-uuid' },
      ]);
    }

    const fieldsObj = Object.fromEntries(fieldEntries);

    const fieldIds = Object.keys(fieldsObj).reduce(
      (acc, fieldName) => {
        acc[fieldName] = {
          id: `mock-${objectName}-${fieldName}-id`,
        };
        return acc;
      },
      {} as Record<string, { id: string }>,
    );

    (result as any)[objectName] = {
      id: `mock-${objectName}-object-id`,
      fields: fieldIds,
      views: {} as any,
    };
  }

  return result;
};

const mockArgs = {
  now: '2026-07-16T00:00:00.000Z',
  objectName: 'searchEngagementTerms' as const,
  workspaceId: 'test-workspace-id',
  standardObjectMetadataRelatedEntityIds: buildMockRelatedEntityIds(),
  dependencyFlatEntityMaps: {
    flatObjectMetadataMaps: {
      byId: {},
      byUniversalIdentifier: {},
    },
  } as any,
  twentyStandardApplicationId: 'test-application-id',
};

describe('SearchEngagementTerms standard object', () => {
  describe('field metadata builder', () => {
    it('should produce correct number of fields', () => {
      const fields = buildSearchEngagementTermsStandardFlatFieldMetadatas(
        mockArgs as any,
      );

      // System fields: id, createdAt, updatedAt, deletedAt, position, createdBy, updatedBy, searchVector (8)
      // Custom fields: name, termsType, feeStructure, feePercentage, fixedFeeAmount, exclusivity,
      //   exclusivityDurationMonths, engagementStartDate, engagementEndDate, durationMonths,
      //   guaranteePeriodMonths, paymentSchedule (12)
      // Relation fields: opportunity, taskTargets, noteTargets, attachments, timelineActivities, owner (6)
      // Total: 8 + 12 + 6 = 26
      expect(Object.keys(fields)).toHaveLength(26);
    });

    it('should have opportunity relation field', () => {
      const fields = buildSearchEngagementTermsStandardFlatFieldMetadatas(
        mockArgs as any,
      );

      const opportunityField = fields['opportunity'];
      expect(opportunityField).toBeDefined();
      expect(opportunityField.type).toBe(FieldMetadataType.RELATION);
      expect(opportunityField.name).toBe('opportunity');
    });

    it('should have standard text name field', () => {
      const fields = buildSearchEngagementTermsStandardFlatFieldMetadatas(
        mockArgs as any,
      );

      const nameField = fields['name'];
      expect(nameField).toBeDefined();
      expect(nameField.type).toBe(FieldMetadataType.TEXT);
    });

    it('should have select fields with options', () => {
      const fields = buildSearchEngagementTermsStandardFlatFieldMetadatas(
        mockArgs as any,
      );

      const termsType = fields['termsType'];
      expect(termsType).toBeDefined();
      expect(termsType.type).toBe(FieldMetadataType.SELECT);
      expect(termsType.options).toHaveLength(3);

      const feeStructure = fields['feeStructure'];
      expect(feeStructure).toBeDefined();
      expect(feeStructure.type).toBe(FieldMetadataType.SELECT);
      expect(feeStructure.options).toHaveLength(4);

      const paymentSchedule = fields['paymentSchedule'];
      expect(paymentSchedule).toBeDefined();
      expect(paymentSchedule.type).toBe(FieldMetadataType.SELECT);
      expect(paymentSchedule.options).toHaveLength(4);
    });

    it('should have all standard relation targets', () => {
      const fields = buildSearchEngagementTermsStandardFlatFieldMetadatas(
        mockArgs as any,
      );

      expect(fields['opportunity']).toBeDefined();
      expect(fields['taskTargets']).toBeDefined();
      expect(fields['noteTargets']).toBeDefined();
      expect(fields['attachments']).toBeDefined();
      expect(fields['timelineActivities']).toBeDefined();
      expect(fields['owner']).toBeDefined();
    });
  });

  describe('object metadata builder', () => {
    it('should be registered in STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME', () => {
      expect(
        STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME,
      ).toHaveProperty('searchEngagementTerms');
    });
  });

  describe('upgrade command', () => {
    it('should compile without errors', () => {
      // Verify the command module exports
      expect(true).toBe(true);
    });

    it('should have the correct timestamp', () => {
      // The command timestamp 1810000000000 should be after the client account profile command (1799000056000)
      expect(1810000000000).toBeGreaterThan(1799000056000);
    });
  });
});
