import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';

const NON_SYSTEM_OBJECT_NAMES = [
  'clientAccountProfile',
  'clientStakeholderRole',
  'searchEngagementTerms',
  'opportunity',
] as const;

type NonSystemObjectName = (typeof NON_SYSTEM_OBJECT_NAMES)[number];

const STANDARD_OBJECTS_BY_NAME: Record<NonSystemObjectName, (typeof STANDARD_OBJECTS)[keyof typeof STANDARD_OBJECTS]> =
  {
    clientAccountProfile: STANDARD_OBJECTS.clientAccountProfile,
    clientStakeholderRole: STANDARD_OBJECTS.clientStakeholderRole,
    searchEngagementTerms: STANDARD_OBJECTS.searchEngagementTerms,
    opportunity: STANDARD_OBJECTS.opportunity,
  };

describe('Non-system invariant — ORM field-permission firewall enforcement', () => {
  const { allFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: NOW,
      workspaceId: WORKSPACE_ID,
      twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID,
    });

  it('all four non-system objects exist in the built metadata map', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    for (const objectName of NON_SYSTEM_OBJECT_NAMES) {
      const universalIdentifier =
        STANDARD_OBJECTS_BY_NAME[objectName].universalIdentifier;

      expect(
        byUniversalIdentifier[universalIdentifier],
      ).toBeDefined();
    }
  });

  it('prevents silent ORM firewall bypass — isSystem must be false for all non-system objects', () => {
    const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;

    for (const objectName of NON_SYSTEM_OBJECT_NAMES) {
      const universalIdentifier =
        STANDARD_OBJECTS_BY_NAME[objectName].universalIdentifier;
      const metadata = byUniversalIdentifier[universalIdentifier];

      expect(metadata).toBeDefined();
      // The ORM field-permission firewall silently skips enforcement for
      // isSystem === true objects.  If any of these objects were accidentally
      // marked as system, the firewall would bypass permission checks on
      // their fields, creating a data-exposure vulnerability.
      expect(metadata?.isSystem).toBe(false);
    }
  });
});
