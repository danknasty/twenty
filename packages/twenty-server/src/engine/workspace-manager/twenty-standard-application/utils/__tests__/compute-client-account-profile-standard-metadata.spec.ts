import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

describe('ClientAccountProfile standard metadata build', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('builds the clientAccountProfile object', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    expect(
      byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.universalIdentifier
      ],
    ).toBeDefined();
  });

  it('does not mark the clientAccountProfile object as system', () => {
    const clientAccountProfile =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.universalIdentifier
      ];

    expect(clientAccountProfile?.isSystem).toBe(false);
  });

  it('has the correct label identifier field', () => {
    const clientAccountProfile =
      allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.universalIdentifier
      ];

    expect(clientAccountProfile?.labelIdentifierFieldMetadataName).toBe('name');
  });

  it('builds all declared domain fields', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatFieldMetadataMaps;

    const domainFieldNames = [
      'name',
      'accountTier',
      'accountStatus',
      'relationshipOwner',
      'company',
      'lifetimeRevenue',
      'annualRevenue',
      'totalEngagements',
      'lastEngagementDate',
      'contractStatus',
      'satisfactionScore',
      'accountNotes',
    ];

    for (const fieldName of domainFieldNames) {
      const field =
        byUniversalIdentifier[
          STANDARD_OBJECTS.clientAccountProfile.fields[fieldName]
            ?.universalIdentifier
        ];

      expect(field).toBeDefined();
    }
  });

  it('builds all system fields', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatFieldMetadataMaps;

    const systemFieldNames = [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
      'searchVector',
    ];

    for (const fieldName of systemFieldNames) {
      const field =
        byUniversalIdentifier[
          STANDARD_OBJECTS.clientAccountProfile.fields[fieldName]
            ?.universalIdentifier
        ];

      expect(field).toBeDefined();
    }
  });

  it('builds all relation fields', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatFieldMetadataMaps;

    const relationFieldNames = [
      'taskTargets',
      'noteTargets',
      'attachments',
      'timelineActivities',
      'owner',
    ];

    for (const fieldName of relationFieldNames) {
      const field =
        byUniversalIdentifier[
          STANDARD_OBJECTS.clientAccountProfile.fields[fieldName]
            ?.universalIdentifier
        ];

      expect(field).toBeDefined();
    }
  });

  it('company relation has correct target object name', () => {
    const companyField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.fields.company
          .universalIdentifier
      ];

    expect(companyField).toBeDefined();
    expect(companyField?.relationTargetObjectMetadataName).toBe('company');
  });

  it('relationshipOwner relation has correct target object name', () => {
    const relationshipOwnerField =
      allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.fields.relationshipOwner
          .universalIdentifier
      ];

    expect(relationshipOwnerField).toBeDefined();
    expect(relationshipOwnerField?.relationTargetObjectMetadataName).toBe(
      'workspaceMember',
    );
  });

  it('indexes the companyId foreign key', () => {
    const companyIdIndex =
      allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[
        STANDARD_OBJECTS.clientAccountProfile.indexes.companyIdIndex
          .universalIdentifier
      ];

    expect(companyIdIndex).toBeDefined();
  });

  it('keeps the clientAccountProfile table view focused on name, accountTier, accountStatus, and company', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.clientAccountProfile.views
            .allClientAccountProfiles.universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers).toHaveLength(4);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.clientAccountProfile.fields.name
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.accountTier
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.accountStatus
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.company
          .universalIdentifier,
      ]),
    );
  });

  it('uses the important clientAccountProfile detail fields on the record page', () => {
    const viewFieldFieldUniversalIdentifiers = Object.values(
      allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
    )
      .filter(isDefined)
      .filter(
        (viewField) =>
          viewField.viewUniversalIdentifier ===
          STANDARD_OBJECTS.clientAccountProfile.views
            .clientAccountProfileRecordPageFields.universalIdentifier,
      )
      .map((viewField) => viewField.fieldMetadataUniversalIdentifier);

    expect(viewFieldFieldUniversalIdentifiers.length).toBeGreaterThan(10);
    expect(viewFieldFieldUniversalIdentifiers).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.clientAccountProfile.fields.name
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.accountTier
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.accountStatus
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.relationshipOwner
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.company
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.lifetimeRevenue
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.annualRevenue
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.totalEngagements
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.lastEngagementDate
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.contractStatus
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.satisfactionScore
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.accountNotes
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.createdAt
          .universalIdentifier,
        STANDARD_OBJECTS.clientAccountProfile.fields.createdBy
          .universalIdentifier,
      ]),
    );
  });
});
