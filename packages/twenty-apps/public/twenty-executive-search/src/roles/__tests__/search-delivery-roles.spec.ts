import { describe, expect, it } from 'vitest';

import partnerRole from 'src/roles/partner.role';
import researcherRole from 'src/roles/researcher.role';
import coordinatorRole from 'src/roles/coordinator.role';

import {
  PARTNER_ROLE_UNIVERSAL_IDENTIFIER,
  RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER,
  COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/search-delivery-role-universal-identifiers';

describe('search-delivery roles', () => {
  it('partner role validates successfully', () => {
    const result = partnerRole;
    expect(result.success).toBe(true);
    expect(result.config.universalIdentifier).toBe(
      PARTNER_ROLE_UNIVERSAL_IDENTIFIER,
    );
    expect(result.config.canReadAllObjectRecords).toBe(false);
    expect(result.config.canBeAssignedToUsers).toBe(true);
  });

  it('researcher role validates successfully', () => {
    const result = researcherRole;
    expect(result.success).toBe(true);
    expect(result.config.universalIdentifier).toBe(
      RESEARCHER_ROLE_UNIVERSAL_IDENTIFIER,
    );
    expect(result.config.canReadAllObjectRecords).toBe(false);
    expect(result.config.canBeAssignedToUsers).toBe(true);
  });

  it('coordinator role validates successfully', () => {
    const result = coordinatorRole;
    expect(result.success).toBe(true);
    expect(result.config.universalIdentifier).toBe(
      COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
    );
    expect(result.config.canReadAllObjectRecords).toBe(false);
    expect(result.config.canBeAssignedToUsers).toBe(true);
  });

  it('all three roles have unique universal identifiers', () => {
    const identifiers = [
      partnerRole.config.universalIdentifier,
      researcherRole.config.universalIdentifier,
      coordinatorRole.config.universalIdentifier,
    ];
    const uniqueIdentifiers = new Set(identifiers);
    expect(uniqueIdentifiers.size).toBe(3);
  });

  it('uses defineRole (not defineApplicationRole) for all roles', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const url = await import('node:url');

    const rolesDir = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '..',
    );
    const files = ['partner.role.ts', 'researcher.role.ts', 'coordinator.role.ts'];

    for (const file of files) {
      const content = fs.readFileSync(path.join(rolesDir, file), 'utf-8');
      expect(content).toContain('defineRole');
      expect(content).not.toContain('defineApplicationRole');
    }
  });
});
