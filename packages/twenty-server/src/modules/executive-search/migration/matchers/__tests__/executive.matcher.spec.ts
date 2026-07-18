import { executiveMatcher } from 'src/modules/executive-search/migration/matchers/executive.matcher';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

describe('executiveMatcher', () => {
  const buildPerson = (overrides: Record<string, unknown> = {}) => ({
    id: 'person-1',
    name: { firstName: 'Jane', lastName: 'Doe' },
    emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
    phones: { primaryPhoneNumber: '+1 555-0100', additionalPhones: null },
    ...overrides,
  });

  it('returns EXACT when ats_uuid matches an attached link', () => {
    const item = {
      id: 'exec-1',
      ats_uuid: 'ATS-123',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
    };
    const candidates = [
      buildPerson({
        externalLinks: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-1',
            externalRecordId: 'ATS-123',
            isAuthoritativeLink: false,
          },
        ],
      }),
    ];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyEntityName).toBe('person');
    expect(result.matchedTwentyRecordId).toBe('person-1');
    expect(result.externalRecordId).toBe('ATS-123');
    expect(result.externalEntityName).toBe('executives');
    expect(
      result.reasons.some((r) => r.includes('executiveProfile.personId')),
    ).toBe(true);
  });

  it('returns HIGH on email match against person.emails', () => {
    const item = {
      id: 'exec-2',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'JANE.DOE@example.com',
    };
    const candidates = [buildPerson()];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.matchedTwentyRecordId).toBe('person-1');
    expect(result.reasons.some((r) => r.includes('person.emails'))).toBe(true);
  });

  it('returns MEDIUM on phone match when email does not match', () => {
    const item = {
      id: 'exec-3',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'other@example.com',
      phone: '+1 555 0100',
    };
    const candidates = [buildPerson()];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
    expect(result.matchedTwentyRecordId).toBe('person-1');
  });

  it('returns MEDIUM on external/source id match', () => {
    const item = {
      id: 'exec-4',
      first_name: 'Jane',
      last_name: 'Doe',
      freshsales_id: 'FS-9',
    };
    const candidates = [
      buildPerson({
        externalLinks: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-1',
            externalRecordId: 'FS-9',
            isAuthoritativeLink: false,
          },
        ],
      }),
    ];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
    expect(result.matchedTwentyRecordId).toBe('person-1');
  });

  it('returns MEDIUM on strong name similarity (>=0.92)', () => {
    const item = {
      id: 'exec-5',
      first_name: 'Jane',
      last_name: 'Doe',
    };
    const candidates = [buildPerson()];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
    expect(result.reasons.some((r) => r.includes('person.name'))).toBe(true);
  });

  it('returns NONE when no candidates clear any threshold', () => {
    const item = {
      id: 'exec-6',
      first_name: 'Completely',
      last_name: 'Different',
      email: 'nobody@example.com',
    };
    const candidates = [buildPerson()];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
    expect(result.matchedTwentyRecordId).toBeUndefined();
  });

  it('returns NONE when there are no candidates', () => {
    const item = { id: 'exec-7', first_name: 'Jane', last_name: 'Doe' };

    const result = executiveMatcher.match(item, []);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
  });

  it('flags multiple candidates when several clear the same key', () => {
    const item = {
      id: 'exec-8',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
    };
    const candidates = [
      buildPerson({ id: 'person-1' }),
      buildPerson({ id: 'person-2' }),
    ];

    const result = executiveMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.candidates).toBeDefined();
    expect(result.candidates?.length).toBe(2);
    expect(
      result.reasons.some((r) => r.includes('Ambiguous')),
    ).toBe(true);
  });

  it('respects precedence: ats_uuid beats email', () => {
    const item = {
      id: 'exec-9',
      ats_uuid: 'ATS-X',
      email: 'jane.doe@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
    };
    // person-1 matches email but NOT ats_uuid; person-2 matches ats_uuid only.
    const candidates = [
      buildPerson({ id: 'person-1' }),
      buildPerson({
        id: 'person-2',
        emails: { primaryEmail: 'other@example.com', additionalEmails: null },
        externalLinks: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-2',
            externalRecordId: 'ATS-X',
            isAuthoritativeLink: false,
          },
        ],
      }),
    ];

    const result = executiveMatcher.match(item, candidates);

    // ats_uuid precedence should select person-2 (EXACT) over person-1 (HIGH).
    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyRecordId).toBe('person-2');
  });
});
