import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

describe('ClientStakeholderRole standard metadata build', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('builds the clientStakeholderRole object', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    expect(
      byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier
      ],
    ).toBeDefined();
  });

  it('does not mark the clientStakeholderRole object as system', () => {
    const clientStakeholderRole =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier
      ];

    expect(clientStakeholderRole?.isSystem).toBe(false);
  });

  it('has nameIdentifier field on the object', () => {
    const clientStakeholderRole =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier
      ];

    expect(
      clientStakeholderRole?.labelIdentifierFieldMetadataUniversalIdentifier,
    ).toBe(
      STANDARD_OBJECTS.clientStakeholderRole.fields.name.universalIdentifier,
    );
  });

  it('has all expected fields defined in the builder output', () => {
    const fieldUniversalIdentifiers = Object.values(
      STANDARD_OBJECTS.clientStakeholderRole.fields,
    ).map((field) => field.universalIdentifier);

    for (const uid of fieldUniversalIdentifiers) {
      expect(
        isDefined(
          allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[uid],
        ),
      ).toBe(true);
    }
  });

  it('has roleType as SELECT with 5 options', () => {
    const roleTypeField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.roleType
          .universalIdentifier
      ];

    expect(roleTypeField).toBeDefined();
    expect(roleTypeField?.type).toBe(FieldMetadataType.SELECT);
    expect(roleTypeField?.options).toHaveLength(5);

    const optionValues = roleTypeField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual([
      'DECISION_MAKER',
      'ECONOMIC_BUYER',
      'INFLUENCER',
      'CHAMPION',
      'GATEKEEPER',
    ]);
  });

  it('has influenceLevel as SELECT with 3 options', () => {
    const influenceLevelField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.influenceLevel
          .universalIdentifier
      ];

    expect(influenceLevelField).toBeDefined();
    expect(influenceLevelField?.type).toBe(FieldMetadataType.SELECT);
    expect(influenceLevelField?.options).toHaveLength(3);

    const optionValues = influenceLevelField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual(['HIGH', 'MEDIUM', 'LOW']);
  });

  it('has relationshipStrength as SELECT with 4 options', () => {
    const relationshipStrengthField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.relationshipStrength
          .universalIdentifier
      ];

    expect(relationshipStrengthField).toBeDefined();
    expect(relationshipStrengthField?.type).toBe(FieldMetadataType.SELECT);
    expect(relationshipStrengthField?.options).toHaveLength(4);

    const optionValues = relationshipStrengthField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual(['STRONG', 'MODERATE', 'WEAK', 'NONE']);
  });

  it('has contactPreference as SELECT with 4 options', () => {
    const contactPreferenceField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.contactPreference
          .universalIdentifier
      ];

    expect(contactPreferenceField).toBeDefined();
    expect(contactPreferenceField?.type).toBe(FieldMetadataType.SELECT);
    expect(contactPreferenceField?.options).toHaveLength(4);

    const optionValues = contactPreferenceField?.options?.map(
      (opt) => (opt as { value: string }).value,
    );

    expect(optionValues).toEqual([
      'EMAIL',
      'PHONE',
      'IN_PERSON',
      'NO_CONTACT',
    ]);
  });

  it('has isPrimary as BOOLEAN with default false', () => {
    const isPrimaryField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.isPrimary
          .universalIdentifier
      ];

    expect(isPrimaryField).toBeDefined();
    expect(isPrimaryField?.type).toBe(FieldMetadataType.BOOLEAN);
    expect(isPrimaryField?.defaultValue).toBe(false);
  });

  it('has contactNotes as TEXT and nullable', () => {
    const contactNotesField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.contactNotes
          .universalIdentifier
      ];

    expect(contactNotesField).toBeDefined();
    expect(contactNotesField?.type).toBe(FieldMetadataType.TEXT);
    expect(contactNotesField?.isNullable).toBe(true);
  });

  it('has stakeholder relation to person', () => {
    const stakeholderField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.stakeholder
          .universalIdentifier
      ];

    expect(stakeholderField).toBeDefined();
    expect(stakeholderField?.type).toBe(FieldMetadataType.RELATION);
    expect(
      stakeholderField?.relationTargetObjectMetadataUniversalIdentifier,
    ).toBe(
      STANDARD_OBJECTS.person.universalIdentifier,
    );
  });

  it('has company relation to company', () => {
    const companyField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientStakeholderRole.fields.company
          .universalIdentifier
      ];

    expect(companyField).toBeDefined();
    expect(companyField?.type).toBe(FieldMetadataType.RELATION);
    expect(
      companyField?.relationTargetObjectMetadataUniversalIdentifier,
    ).toBe(
      STANDARD_OBJECTS.company.universalIdentifier,
    );
  });

  it('has all 3 indexes defined', () => {
    const indexUniversalIdentifiers = Object.values(
      STANDARD_OBJECTS.clientStakeholderRole.indexes,
    ).map((index) => index.universalIdentifier);

    for (const uid of indexUniversalIdentifiers) {
      expect(
        isDefined(
          allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[uid],
        ),
      ).toBe(true);
    }
  });

  it('has the allClientStakeholderRoles list view with 5 view fields', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.clientStakeholderRole.views
            .allClientStakeholderRoles.universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers).toHaveLength(5);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.clientStakeholderRole.fields.name
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.stakeholder
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.company
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.roleType
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.influenceLevel
          .universalIdentifier,
      ]),
    );
  });

  it('has the clientStakeholderRoleRecordPageFields with view field groups', () => {
    const viewFieldGroupUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewFieldGroup) =>
          viewFieldGroup.viewUniversalIdentifier ===
          STANDARD_OBJECTS.clientStakeholderRole.views
            .clientStakeholderRoleRecordPageFields.universalIdentifier,
      )
      .map((viewFieldGroup) => viewFieldGroup.universalIdentifier);

    expect(viewFieldGroupUniversalIdentifiers).toHaveLength(2);
  });

  it('has the clientStakeholderRoleRecordPageFields with detail view fields', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.clientStakeholderRole.views
            .clientStakeholderRoleRecordPageFields.universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers.length).toBeGreaterThan(5);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.clientStakeholderRole.fields.name
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.roleType
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.stakeholder
          .universalIdentifier,
        STANDARD_OBJECTS.clientStakeholderRole.fields.company
          .universalIdentifier,
      ]),
    );
  });
});
