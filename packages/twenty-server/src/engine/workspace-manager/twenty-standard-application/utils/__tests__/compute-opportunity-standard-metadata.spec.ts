import {
  STANDARD_OBJECTS,
} from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

describe('Opportunity standard metadata build - BD fields', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('builds the opportunity object', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    expect(
      byUniversalIdentifier[STANDARD_OBJECTS.opportunity.universalIdentifier],
    ).toBeDefined();
  });

  it('has searchType as SELECT with 4 options', () => {
    const searchTypeField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.searchType.universalIdentifier
      ];

    expect(searchTypeField).toBeDefined();
    expect(searchTypeField?.type).toBe(FieldMetadataType.SELECT);
    expect(searchTypeField?.options).toHaveLength(4);

    const optionValues = searchTypeField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual([
      'RETAINED',
      'CONTINGENCY',
      'EXCLUSIVE_CONTRACT',
      'RPO',
    ]);
  });

  it('has expectedFeeFloor as CURRENCY and nullable', () => {
    const expectedFeeFloorField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.expectedFeeFloor
          .universalIdentifier
      ];

    expect(expectedFeeFloorField).toBeDefined();
    expect(expectedFeeFloorField?.type).toBe(FieldMetadataType.CURRENCY);
    expect(expectedFeeFloorField?.isNullable).toBe(true);
  });

  it('has expectedFeeCeiling as CURRENCY and nullable', () => {
    const expectedFeeCeilingField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.expectedFeeCeiling
          .universalIdentifier
      ];

    expect(expectedFeeCeilingField).toBeDefined();
    expect(expectedFeeCeilingField?.type).toBe(FieldMetadataType.CURRENCY);
    expect(expectedFeeCeilingField?.isNullable).toBe(true);
  });

  it('has expectedTimeline as SELECT with 5 options', () => {
    const expectedTimelineField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.expectedTimeline
          .universalIdentifier
      ];

    expect(expectedTimelineField).toBeDefined();
    expect(expectedTimelineField?.type).toBe(FieldMetadataType.SELECT);
    expect(expectedTimelineField?.options).toHaveLength(5);

    const optionValues = expectedTimelineField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual([
      'IMMEDIATE',
      'ZERO_TO_3_MONTHS',
      'THREE_TO_6_MONTHS',
      'SIX_TO_12_MONTHS',
      'OVER_12_MONTHS',
    ]);
  });

  it('has decisionDate as DATE_TIME and nullable', () => {
    const decisionDateField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.decisionDate.universalIdentifier
      ];

    expect(decisionDateField).toBeDefined();
    expect(decisionDateField?.type).toBe(FieldMetadataType.DATE_TIME);
    expect(decisionDateField?.isNullable).toBe(true);
  });

  it('has decisionCriteria as TEXT with long text settings and nullable', () => {
    const decisionCriteriaField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.opportunity.fields.decisionCriteria
          .universalIdentifier
      ];

    expect(decisionCriteriaField).toBeDefined();
    expect(decisionCriteriaField?.type).toBe(FieldMetadataType.TEXT);
    expect(decisionCriteriaField?.isNullable).toBe(true);
    expect(decisionCriteriaField?.settings).toMatchObject({
      displayedMaxRows: 99,
    });
  });

  it('has all 6 new BD field keys present in the builder output', () => {
    const bdFieldUniversalIdentifiers = [
      STANDARD_OBJECTS.opportunity.fields.searchType.universalIdentifier,
      STANDARD_OBJECTS.opportunity.fields.expectedFeeFloor.universalIdentifier,
      STANDARD_OBJECTS.opportunity.fields.expectedFeeCeiling
        .universalIdentifier,
      STANDARD_OBJECTS.opportunity.fields.expectedTimeline.universalIdentifier,
      STANDARD_OBJECTS.opportunity.fields.decisionDate.universalIdentifier,
      STANDARD_OBJECTS.opportunity.fields.decisionCriteria
        .universalIdentifier,
    ];

    for (const uid of bdFieldUniversalIdentifiers) {
      expect(
        isDefined(
          allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid],
        ),
      ).toBe(true);
    }
  });
});
