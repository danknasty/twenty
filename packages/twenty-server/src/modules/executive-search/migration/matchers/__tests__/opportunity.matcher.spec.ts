import { opportunityMatcher } from 'src/modules/executive-search/migration/matchers/opportunity.matcher';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

describe('opportunityMatcher', () => {
  const buildAssignment = (overrides: Record<string, unknown> = {}) => ({
    id: 'assignment-1',
    name: 'Chief Executive Officer — Acme',
    clientCompanyId: 'company-1',
    ...overrides,
  });

  it('returns EXACT on ats_uuid link match', () => {
    const item = { id: 'opp-1', ats_uuid: 'ATS-OPP', title: 'CEO' };
    const candidates = [
      buildAssignment({
        externalLinks: [
          {
            twentyEntityName: 'searchAssignment',
            twentyRecordId: 'assignment-1',
            externalRecordId: 'ATS-OPP',
          },
        ],
      }),
    ];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyEntityName).toBe('searchAssignment');
    expect(result.externalEntityName).toBe('opportunities');
    expect(
      result.reasons.some((r) => r.includes('positionSpecification')),
    ).toBe(true);
  });

  it('returns MEDIUM on external id match', () => {
    const item = { id: 'opp-2', title: 'CEO', external_id: 'EXT-1' };
    const candidates = [
      buildAssignment({
        externalLinks: [
          {
            twentyEntityName: 'searchAssignment',
            twentyRecordId: 'assignment-1',
            externalRecordId: 'EXT-1',
          },
        ],
      }),
    ];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
  });

  it('returns MEDIUM on strong title similarity', () => {
    const item = { id: 'opp-3', title: 'Chief Executive Officer — Acme' };
    const candidates = [buildAssignment()];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
  });

  it('promotes to MEDIUM when a weak title is corroborated by company domain', () => {
    const item = {
      id: 'opp-4',
      title: 'Chief Executive Officer Acme', // very close → STRONG anyway
      company_name: 'Acme Corp',
      website: 'acme.com',
    };
    const candidates = [
      buildAssignment({
        _companyName: 'Acme Corp',
        _companyDomains: ['acme.com'],
      }),
    ];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
    expect(
      result.reasons.some((r) => r.includes('domain corroborates')),
    ).toBe(true);
  });

  it('returns NONE when nothing matches', () => {
    const item = { id: 'opp-5', title: 'Head of Underwater Basket Weaving' };
    const candidates = [buildAssignment()];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
  });

  it('ats_uuid precedence beats external id', () => {
    const item = {
      id: 'opp-6',
      ats_uuid: 'ATS-X',
      title: 'CEO',
      external_id: 'EXT-1',
    };
    const candidates = [
      // assignment-1 matches external_id only
      buildAssignment({
        externalLinks: [
          {
            twentyEntityName: 'searchAssignment',
            twentyRecordId: 'assignment-1',
            externalRecordId: 'EXT-1',
          },
        ],
      }),
      // assignment-2 matches ats_uuid only
      buildAssignment({
        id: 'assignment-2',
        name: 'Other Role',
        externalLinks: [
          {
            twentyEntityName: 'searchAssignment',
            twentyRecordId: 'assignment-2',
            externalRecordId: 'ATS-X',
          },
        ],
      }),
    ];

    const result = opportunityMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyRecordId).toBe('assignment-2');
  });
});
