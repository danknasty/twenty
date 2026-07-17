import {
  STANDARD_OBJECTS,
} from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';
import { FieldMetadataType } from 'twenty-shared/types';

import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

describe('Search Assignment standard metadata build', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('builds the searchAssignment object', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    expect(
      byUniversalIdentifier[
        STANDARD_OBJECTS.searchAssignment.universalIdentifier
      ],
    ).toBeDefined();
  });

  it('marks the searchAssignment object as system', () => {
    const obj =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.searchAssignment.universalIdentifier
      ];

    expect(obj?.isSystem).toBe(true);
  });

  it('resolves all searchAssignment field names as UIDs', () => {
    const fieldUids = Object.values(
      STANDARD_OBJECTS.searchAssignment.fields,
    ).map((f) => f.universalIdentifier);

    for (const uid of fieldUids) {
      const field =
        allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
      expect(field).toBeDefined();
    }
  });

  it('declares relationType on all searchAssignment relation fields', () => {
    const assignFields = Object.values(
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (f) =>
          f.objectMetadataUniversalIdentifier ===
          STANDARD_OBJECTS.searchAssignment.universalIdentifier,
      );

    for (const field of assignFields) {
      if (field.type === FieldMetadataType.RELATION) {
        expect(
          (field.settings as Record<string, unknown>)?.relationType,
        ).toBeDefined();
      }
    }
  });

  it('indexes the searchAssignment foreign keys', () => {
    const indexUids = Object.values(
      STANDARD_OBJECTS.searchAssignment.indexes,
    ).map((idx) => idx.universalIdentifier);

    for (const uid of indexUids) {
      const index =
        allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[uid];
      expect(index).toBeDefined();
    }
  });

  it('includes all 6 new object names in STANDARD_OBJECTS', () => {
    const expectedNames = [
      'searchEngagementTerms',
      'searchAssignment',
      'assignmentTeamMember',
      'searchMilestone',
      'positionSpecification',
      'searchCriterion',
    ];
    for (const name of expectedNames) {
      expect(STANDARD_OBJECTS[name as keyof typeof STANDARD_OBJECTS])
        .toBeDefined();
    }
  });
});

describe('Company inverse fields for search objects', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('has searchEngagementTerms inverse field on company', () => {
    const uid =
      STANDARD_OBJECTS.company.fields.searchEngagementTerms.universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });

  it('has searchAssignments inverse field on company', () => {
    const uid =
      STANDARD_OBJECTS.company.fields.searchAssignments.universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });
});

describe('Opportunity inverse fields for search objects', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('has searchEngagementTerms inverse field on opportunity', () => {
    const uid =
      STANDARD_OBJECTS.opportunity.fields.searchEngagementTerms
        .universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });

  it('has searchAssignments inverse field on opportunity', () => {
    const uid =
      STANDARD_OBJECTS.opportunity.fields.searchAssignments.universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });
});

describe('WorkspaceMember inverse fields for search objects', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('has approvedSearchEngagementTerms inverse field', () => {
    const uid =
      STANDARD_OBJECTS.workspaceMember.fields.approvedSearchEngagementTerms
        .universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });

  it('has assignmentTeamMemberships inverse field', () => {
    const uid =
      STANDARD_OBJECTS.workspaceMember.fields.assignmentTeamMemberships
        .universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });

  it('has approvedPositionSpecifications inverse field', () => {
    const uid =
      STANDARD_OBJECTS.workspaceMember.fields.approvedPositionSpecifications
        .universalIdentifier;
    const field =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid];
    expect(field).toBeDefined();
    expect(
      (field?.settings as Record<string, unknown>)?.relationType,
    ).toBe('ONE_TO_MANY');
  });
});
