import { companyMatcher } from 'src/modules/executive-search/migration/matchers/company.matcher';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

describe('companyMatcher', () => {
  const buildCompany = (overrides: Record<string, unknown> = {}) => ({
    id: 'company-1',
    name: 'Acme Corp',
    domainName: { primaryLinkUrl: 'https://acme.com', secondaryLinks: null },
    ...overrides,
  });

  it('returns EXACT on ats_uuid link match', () => {
    const item = { id: 'co-1', ats_uuid: 'ATS-CO', name: 'Acme Corp' };
    const candidates = [
      buildCompany({
        externalLinks: [
          {
            twentyEntityName: 'company',
            twentyRecordId: 'company-1',
            externalRecordId: 'ATS-CO',
          },
        ],
      }),
    ];

    const result = companyMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyEntityName).toBe('company');
    expect(result.externalEntityName).toBe('companies');
    expect(
      result.reasons.some((r) => r.includes('clientAccountProfile')),
    ).toBe(true);
  });

  it('returns HIGH on domain match (corroborated by name)', () => {
    const item = { id: 'co-2', name: 'Acme Corp', website: 'acme.com' };
    const candidates = [buildCompany()];

    const result = companyMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.reasons.some((r) => r.includes('Domain'))).toBe(true);
  });

  it('returns MEDIUM on Freshsales/source id match (reference only)', () => {
    const item = { id: 'co-3', name: 'Acme Corp', freshsales_id: 'FS-CO-1' };
    const candidates = [
      buildCompany({
        externalLinks: [
          {
            twentyEntityName: 'company',
            twentyRecordId: 'company-1',
            externalRecordId: 'FS-CO-1',
          },
        ],
      }),
    ];

    const result = companyMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
    expect(
      result.reasons.some((r) => r.includes('REFERENCE_ONLY')),
    ).toBe(true);
  });

  it('returns MEDIUM/LOW on name similarity alone', () => {
    const item = { id: 'co-4', name: 'Acme Corporation' };
    const candidates = [buildCompany()];

    const result = companyMatcher.match(item, candidates);

    expect([
      IdentityMatchConfidence.MEDIUM,
      IdentityMatchConfidence.LOW,
    ]).toContain(result.confidence);
  });

  it('returns NONE when nothing matches', () => {
    const item = { id: 'co-5', name: 'Totally Unrelated Inc' };
    const candidates = [buildCompany()];

    const result = companyMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
  });

  it('domain key takes precedence over source id key', () => {
    const item = {
      id: 'co-6',
      name: 'Acme Corp',
      website: 'acme.com',
      freshsales_id: 'FS-CO-1',
    };
    // company-2 has the source id; company-1 has the domain. Domain wins.
    const candidates = [
      buildCompany(),
      buildCompany({
        id: 'company-2',
        name: 'Other Inc',
        domainName: { primaryLinkUrl: 'other.com', secondaryLinks: null },
        externalLinks: [
          {
            twentyEntityName: 'company',
            twentyRecordId: 'company-2',
            externalRecordId: 'FS-CO-1',
          },
        ],
      }),
    ];

    const result = companyMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.matchedTwentyRecordId).toBe('company-1');
  });
});
