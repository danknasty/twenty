import { describe, expect, it } from 'vitest';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/application-universal-identifier';
import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/default-role-universal-identifier';
import { APP_DISPLAY_NAME } from 'src/constants/app-display-name';
import {
  DIRECTUS_API_KEY_ENV_VAR_NAME,
  DIRECTUS_URL_ENV_VAR_NAME,
  DIRECTUS_WEBHOOK_SECRET_ENV_VAR_NAME,
} from 'src/constants/server-variable-names';

describe('executive-search app constants', () => {
  it('has stable application universal identifier', () => {
    expect(APPLICATION_UNIVERSAL_IDENTIFIER).toBe('b64e7e15-e7bf-468e-8bfb-83a4d92ea966');
  });

  it('has stable default role universal identifier', () => {
    expect(DEFAULT_ROLE_UNIVERSAL_IDENTIFIER).toBe(
      'd908b08c-fd00-40be-9824-0e47ddf066fe',
    );
  });

  it('has display name', () => {
    expect(APP_DISPLAY_NAME).toBe('Executive Search');
  });

  it('server variable names are defined', () => {
    expect(DIRECTUS_URL_ENV_VAR_NAME).toBe('DIRECTUS_URL');
    expect(DIRECTUS_API_KEY_ENV_VAR_NAME).toBe('DIRECTUS_API_KEY');
    expect(DIRECTUS_WEBHOOK_SECRET_ENV_VAR_NAME).toBe('DIRECTUS_WEBHOOK_SECRET');
  });
});

describe('application-config validation', () => {
  it('app definition validates without errors', async () => {
    const mod = await import('src/application-config');
    const result = mod.default;
    expect(result.success, result.errors.join('; ')).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.config.universalIdentifier).toBe('b64e7e15-e7bf-468e-8bfb-83a4d92ea966');

    const serverVars = result.config.serverVariables;
    expect(serverVars[DIRECTUS_WEBHOOK_SECRET_ENV_VAR_NAME]).toBeDefined();
    expect(serverVars[DIRECTUS_WEBHOOK_SECRET_ENV_VAR_NAME].isSecret).toBe(true);
    expect(serverVars[DIRECTUS_WEBHOOK_SECRET_ENV_VAR_NAME].type).toBe('TEXT');
  });

  it('default role validates without errors', async () => {
    const mod = await import('src/default-role');
    const result = mod.default;
    expect(result.success, result.errors.join('; ')).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.config.universalIdentifier).toBe(
      'd908b08c-fd00-40be-9824-0e47ddf066fe',
    );
    expect(result.config.canReadAllObjectRecords).toBe(false);
const perms = result.config.objectPermissions!;
    expect(perms.length).toBe(1);
    expect(perms[0].canReadObjectRecords).toBe(true);
    expect(perms[0].canUpdateObjectRecords).toBe(true);
    expect(perms[0].canSoftDeleteObjectRecords).toBe(false);
    expect(perms[0].canDestroyObjectRecords).toBe(false);
  });
});

import { UUID_V4_REGEX } from 'src/__tests__/test-helpers';

describe('role universal identifiers', () => {
  it('all role UIDs are valid UUID v4', async () => {
    const {
      RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER,
      PARTNER_ROLE_UNIVERSAL_IDENTIFIER,
      FINANCE_ROLE_UNIVERSAL_IDENTIFIER,
      COMPLIANCE_ROLE_UNIVERSAL_IDENTIFIER,
    } = await import('src/constants/role-universal-identifiers');

    expect(RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER).toMatch(UUID_V4_REGEX);
    expect(PARTNER_ROLE_UNIVERSAL_IDENTIFIER).toMatch(UUID_V4_REGEX);
    expect(FINANCE_ROLE_UNIVERSAL_IDENTIFIER).toMatch(UUID_V4_REGEX);
    expect(COMPLIANCE_ROLE_UNIVERSAL_IDENTIFIER).toMatch(UUID_V4_REGEX);
  });

  it('all role UIDs are unique', async () => {
    const {
      RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER,
      PARTNER_ROLE_UNIVERSAL_IDENTIFIER,
      FINANCE_ROLE_UNIVERSAL_IDENTIFIER,
      COMPLIANCE_ROLE_UNIVERSAL_IDENTIFIER,
    } = await import('src/constants/role-universal-identifiers');

    const uids = [
      RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER,
      PARTNER_ROLE_UNIVERSAL_IDENTIFIER,
      FINANCE_ROLE_UNIVERSAL_IDENTIFIER,
      COMPLIANCE_ROLE_UNIVERSAL_IDENTIFIER,
    ];
    const uniqueUids = new Set(uids);
    expect(uniqueUids.size).toBe(uids.length);
  });

  it('role UIDs do not collide with permission flag UIDs', async () => {
    const roleIds = await import('src/constants/role-universal-identifiers');
    const flagIds = await import(
      'src/constants/permission-flag-universal-identifiers'
    );

    const roleUids = Object.values(roleIds);
    const flagUids = Object.values(flagIds);
    const allUids = [...roleUids, ...flagUids];
    const uniqueUids = new Set(allUids);
    expect(uniqueUids.size).toBe(allUids.length);
  });

  it('role UIDs do not collide with existing slugs', async () => {
    const roleIds = await import('src/constants/role-universal-identifiers');
    const roleUids = Object.values(roleIds);

    const existingAppAndRoleUids = [
      APPLICATION_UNIVERSAL_IDENTIFIER,
      DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
    ];

    for (const uid of roleUids) {
      expect(existingAppAndRoleUids).not.toContain(uid);
    }
  });
});

describe('permission flag universal identifiers', () => {
  it('all permission flag UIDs are valid UUID v4', async () => {
    const {
      CAN_BYPASS_COMMERCIAL_FIREWALL_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_VIEW_COMMERCIAL_DATA_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_ACCESS_RESTRICTED_DEMOGRAPHICS_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    } = await import(
      'src/constants/permission-flag-universal-identifiers'
    );

    expect(
      CAN_BYPASS_COMMERCIAL_FIREWALL_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    ).toMatch(UUID_V4_REGEX);
    expect(
      CAN_VIEW_COMMERCIAL_DATA_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    ).toMatch(UUID_V4_REGEX);
    expect(
      CAN_ACCESS_RESTRICTED_DEMOGRAPHICS_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    ).toMatch(UUID_V4_REGEX);
  });

  it('all permission flag UIDs are unique', async () => {
    const {
      CAN_BYPASS_COMMERCIAL_FIREWALL_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_VIEW_COMMERCIAL_DATA_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_ACCESS_RESTRICTED_DEMOGRAPHICS_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    } = await import(
      'src/constants/permission-flag-universal-identifiers'
    );

    const uids = [
      CAN_BYPASS_COMMERCIAL_FIREWALL_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_VIEW_COMMERCIAL_DATA_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
      CAN_ACCESS_RESTRICTED_DEMOGRAPHICS_PERMISSION_FLAG_UNIVERSAL_IDENTIFIER,
    ];
    const uniqueUids = new Set(uids);
    expect(uniqueUids.size).toBe(uids.length);
  });

  it('permission flag UIDs do not collide with existing slugs', async () => {
    const flagIds = await import(
      'src/constants/permission-flag-universal-identifiers'
    );
    const flagUids = Object.values(flagIds);

    const existingAppAndRoleUids = [
      APPLICATION_UNIVERSAL_IDENTIFIER,
      DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
    ];

    for (const uid of flagUids) {
      expect(existingAppAndRoleUids).not.toContain(uid);
    },
expect(result.config.objectPermissions).toBeDefined();
    const permissions = result.config.objectPermissions;
    if (!permissions) throw new Error('objectPermissions missing');
    expect(permissions).toHaveLength(19);
    for (const perm of permissions) {
      expect(perm.canReadObjectRecords).toBe(true);
      expect(perm.canUpdateObjectRecords).toBe(false);
      expect(perm.canSoftDeleteObjectRecords).toBe(false);
      expect(perm.canDestroyObjectRecords).toBe(false);
    }
    expect(
      permissions.some(
        (p) =>
          p.objectUniversalIdentifier === '20202020-e674-48e5-a542-72570eee7213',
      ),
    ).toBe(true);
  });

  it('includes Phase 7 research domain object permissions', async () => {
    const mod = await import('src/default-role');
    const result = mod.default;
    const permissions = result.config.objectPermissions;
    if (!permissions) throw new Error('objectPermissions missing');

    const researchUuids = [
      '526d8232-bccb-42df-b5b6-e3a143dba557', // confidentialityRecord
      '84e9dfc7-cabe-47c9-915b-0c8a21dd0c7f', // conflictCheck
      'e8b87567-1e12-4434-b390-1962c05388d4', // marketMap
      'e111382e-ffdd-4d96-ba02-10df8240fa76', // offLimitsRestriction
      'e10e3d9f-8ee3-469a-af73-fbca7bb12f3c', // relationshipEdge
      '414f051b-9f66-474f-b12f-d4ce8be498d3', // researchCandidate
      '39b454ce-1c6f-4312-a003-43a82f19955a', // researchStrategy
      'e84ba25c-c010-4ed9-858d-c03639d604ad', // targetCompany
    ];
    for (const uuid of researchUuids) {
      expect(
        permissions.some((p) => p.objectUniversalIdentifier === uuid),
      ).toBe(true);
    }
  });
});
