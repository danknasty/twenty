import { applicationMatcher } from 'src/modules/executive-search/migration/matchers/application.matcher';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

describe('applicationMatcher', () => {
  const buildCandidacy = (overrides: Record<string, unknown> = {}) => ({
    id: 'candidacy-1',
    personId: 'person-1',
    searchAssignmentId: 'assignment-1',
    ...overrides,
  });

  it('returns EXACT on ats_uuid link match on searchCandidacy', () => {
    const item = { id: 'app-1', ats_uuid: 'ATS-APP' };
    const candidates = [
      buildCandidacy({
        externalLinks: [
          {
            twentyEntityName: 'searchCandidacy',
            twentyRecordId: 'candidacy-1',
            externalRecordId: 'ATS-APP',
          },
        ],
      }),
    ];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.EXACT);
    expect(result.matchedTwentyEntityName).toBe('searchCandidacy');
    expect(result.externalEntityName).toBe('applications');
  });

  it('returns HIGH when both executive and opportunity external ids match', () => {
    const item = {
      id: 'app-2',
      executive_external_id: 'EXEC-EXT-1',
      opportunity_external_id: 'OPP-EXT-1',
    };
    const candidates = [
      buildCandidacy({
        _personExternalIds: ['EXEC-EXT-1'],
        _assignmentExternalIds: ['OPP-EXT-1'],
      }),
    ];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.reasons.some((r) => r.includes('person'))).toBe(true);
    expect(result.reasons.some((r) => r.includes('searchAssignment'))).toBe(
      true,
    );
  });

  it('returns MEDIUM when only one composite leg matches', () => {
    const item = {
      id: 'app-3',
      executive_external_id: 'EXEC-EXT-1',
      opportunity_external_id: 'OPP-EXT-1',
    };
    const candidates = [
      buildCandidacy({
        _personExternalIds: ['EXEC-EXT-1'],
        _assignmentExternalIds: ['OTHER'],
      }),
    ];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.MEDIUM);
  });

  it('returns NONE when neither leg matches', () => {
    const item = {
      id: 'app-4',
      executive_external_id: 'NOPE',
      opportunity_external_id: 'NOPE2',
    };
    const candidates = [
      buildCandidacy({
        _personExternalIds: ['EXEC-EXT-1'],
        _assignmentExternalIds: ['OPP-EXT-1'],
      }),
    ];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
  });

  it('returns NONE when no external ids are present on the item', () => {
    const item = { id: 'app-5' };
    const candidates = [buildCandidacy()];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.NONE);
  });

  it('flags multiple matching candidacies', () => {
    const item = {
      id: 'app-6',
      executive_external_id: 'EXEC-EXT-1',
      opportunity_external_id: 'OPP-EXT-1',
    };
    const candidates = [
      buildCandidacy({
        id: 'candidacy-1',
        _personExternalIds: ['EXEC-EXT-1'],
        _assignmentExternalIds: ['OPP-EXT-1'],
      }),
      buildCandidacy({
        id: 'candidacy-2',
        _personExternalIds: ['EXEC-EXT-1'],
        _assignmentExternalIds: ['OPP-EXT-1'],
      }),
    ];

    const result = applicationMatcher.match(item, candidates);

    expect(result.confidence).toBe(IdentityMatchConfidence.HIGH);
    expect(result.candidates?.length).toBe(2);
    expect(result.reasons.some((r) => r.includes('Ambiguous'))).toBe(true);
  });
});
