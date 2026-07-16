import {
  STANDARD_OBJECTS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { WidgetConfigurationType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

describe('ExecutiveProfile standard metadata build', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('builds the executiveProfile object', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    expect(
      byUniversalIdentifier[
        STANDARD_OBJECTS.executiveProfile.universalIdentifier
      ],
    ).toBeDefined();
  });

  it('marks the executiveProfile object as system', () => {
    const executiveProfile =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.executiveProfile.universalIdentifier
      ];

    expect(executiveProfile?.isSystem).toBe(true);
  });

  it('builds the person relation field', () => {
    const personField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.executiveProfile.fields.person.universalIdentifier
      ];

    expect(personField).toBeDefined();
  });

  it('builds the currentCompany relation field', () => {
    const currentCompanyField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.executiveProfile.fields.currentCompany
          .universalIdentifier
      ];

    expect(currentCompanyField).toBeDefined();
  });

  it('builds all domain fields', () => {
    const domainFieldNames = [
      'headline',
      'summary',
      'location',
      'yearsOfExperience',
      'availabilityStatus',
      'profileVisibility',
      'isBoardReady',
      'sourceSystem',
      'sourceRecordId',
      'sourceUpdatedAt',
      'sourceHash',
    ] as const;

    for (const fieldName of domainFieldNames) {
      expect(
        allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
          STANDARD_OBJECTS.executiveProfile.fields[fieldName]
            .universalIdentifier
        ],
      ).toBeDefined();
    }
  });

  it('indexes the personId foreign key with unique constraint', () => {
    const personIdIndex =
      allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.executiveProfile.indexes.personIdIndex
          .universalIdentifier
      ];

    expect(personIdIndex).toBeDefined();
    expect(personIdIndex?.isUnique).toBe(true);
  });

  it('builds executiveProfile system fields', () => {
    const systemFieldNames = [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
      'position',
    ] as const;

    for (const fieldName of systemFieldNames) {
      expect(
        allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
          STANDARD_OBJECTS.executiveProfile.fields[fieldName]
            .universalIdentifier
        ],
      ).toBeDefined();
    }
  });

  it('keeps the executiveProfile table view focused on person, headline, location, yearsOfExperience and availabilityStatus', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.executiveProfile.views.allExecutiveProfiles
            .universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers).toHaveLength(5);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.executiveProfile.fields.person.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.headline.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.location.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.yearsOfExperience
          .universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.availabilityStatus
          .universalIdentifier,
      ]),
    );
  });

  it('uses the important executiveProfile detail fields on the record page', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.executiveProfile.views
            .executiveProfileRecordPageFields.universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers).toHaveLength(13);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.executiveProfile.fields.person.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.headline.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.summary.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.currentCompany
          .universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.location.universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.yearsOfExperience
          .universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.availabilityStatus
          .universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.profileVisibility
          .universalIdentifier,
        STANDARD_OBJECTS.executiveProfile.fields.isBoardReady
          .universalIdentifier,
      ]),
    );
    expect(viewFieldFieldUniversalIdentifiers).not.toContain(
      STANDARD_OBJECTS.executiveProfile.fields.createdAt.universalIdentifier,
    );
    expect(viewFieldFieldUniversalIdentifiers).not.toContain(
      STANDARD_OBJECTS.executiveProfile.fields.createdBy.universalIdentifier,
    );
  });

  it('links the executiveProfile fields widget to its record-page fields view', () => {
    const fieldsWidget =
      allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[
        STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.executiveProfileRecordPage
          .tabs.home.widgets.fields.universalIdentifier
      ];

    expect(fieldsWidget?.universalConfiguration).toMatchObject({
      configurationType: WidgetConfigurationType.FIELDS,
      viewUniversalIdentifier:
        STANDARD_OBJECTS.executiveProfile.views
          .executiveProfileRecordPageFields.universalIdentifier,
    });
  });
});
