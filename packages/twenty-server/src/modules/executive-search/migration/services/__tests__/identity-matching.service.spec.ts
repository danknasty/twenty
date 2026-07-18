import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { DirectusClientService } from 'src/modules/executive-search/directus/services/directus-client.service';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';
import {
  IdentityMatchingService,
  type DirectusToTwentyPair,
} from 'src/modules/executive-search/migration/services/identity-matching.service';

// The real GlobalWorkspaceOrmManager pulls in a heavy config/ORM chain that
// cannot boot under jest. Stub the module so only our useValue mock is used.
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn(),
  }),
);

const LINK_ENTITY_NAME = 'ExternalEntityLinkWorkspaceEntity';

/**
 * Build a mock GlobalWorkspaceOrmManager whose `getRepository` dispatches by
 * entity name (or by the ExternalEntityLink constructor).  The link repository
 * honors the `where` clause so the authoritative-link HARD RULE path can be
 * exercised realistically.
 */
function buildMockOrmManager(repos: {
  links: Record<string, unknown>[];
  person: Record<string, unknown>[];
  company: Record<string, unknown>[];
  searchAssignment: Record<string, unknown>[];
  searchCandidacy: Record<string, unknown>[];
}) {
  const linkFind = jest.fn(
    async (opts?: { where?: Record<string, unknown> }) => {
      const where = opts?.where ?? {};

      return repos.links.filter((link) => {
        if (
          where.externalSystemName !== undefined &&
          link.externalSystemName !== where.externalSystemName
        ) {
          return false;
        }

        if (
          where.isAuthoritativeLink !== undefined &&
          link.isAuthoritativeLink !== where.isAuthoritativeLink
        ) {
          return false;
        }

        return true;
      });
    },
  );

  const linkRepository = { find: linkFind };

  const entityFind = (records: Record<string, unknown>[]) =>
    jest.fn(async () => records);

  const byName: Record<string, unknown> = {
    person: { find: entityFind(repos.person) },
    company: { find: entityFind(repos.company) },
    searchAssignment: { find: entityFind(repos.searchAssignment) },
    searchCandidacy: { find: entityFind(repos.searchCandidacy) },
    clientAccountProfile: { find: entityFind([]) },
    executiveProfile: { find: entityFind([]) },
    positionSpecification: { find: entityFind([]) },
  };

  return {
    executeInWorkspaceContext: jest
      .fn()
      .mockImplementation(<T>(fn: () => T | Promise<T>) => fn()),
    getRepository: jest.fn(
      async (
        _workspaceId: string,
        entity: string | { name: string },
      ) => {
        const name = typeof entity === 'string' ? entity : entity.name;

        if (name === LINK_ENTITY_NAME) {
          return linkRepository;
        }

        return (
          byName[name] ?? { find: jest.fn(async () => []) }
        );
      },
    ),
  };
}

describe('IdentityMatchingService', () => {
  const workspaceId = 'workspace-1';

  const buildService = async (ormRepos: Parameters<typeof buildMockOrmManager>[0]) => {
    const mockOrm = buildMockOrmManager(ormRepos);
    const mockDirectusClient = {
      getItems: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityMatchingService,
        { provide: GlobalWorkspaceOrmManager, useValue: mockOrm },
        { provide: DirectusClientService, useValue: mockDirectusClient },
      ],
    }).compile();

    return {
      service: module.get<IdentityMatchingService>(IdentityMatchingService),
      mockOrm,
      mockDirectusClient,
    };
  };

  describe('HARD RULE — existing authoritative link is never overwritten', () => {
    it('emits an EXACT link-only result and skips the matcher when an authoritative link exists', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-linked',
            externalSystemName: 'directus',
            externalRecordId: 'ATS-1',
            isAuthoritativeLink: true,
          },
        ],
        person: [
          {
            id: 'person-other',
            name: { firstName: 'Jane', lastName: 'Doe' },
            emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
          },
        ],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', ats_uuid: 'ATS-1', email: 'jane.doe@example.com' },
      ]);

      const pair: DirectusToTwentyPair = {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      };

      const results = await service.matchWorkspace(workspaceId, pair);

      expect(results).toHaveLength(1);
      expect(results[0].confidence).toBe(IdentityMatchConfidence.EXACT);
      // The result must reference the linked record, NOT the email-matched one.
      expect(results[0].matchedTwentyRecordId).toBe('person-linked');
      expect(results[0].matchedTwentyEntityName).toBe('person');
      expect(results[0].reasons.some((r) => r.includes('HARD RULE'))).toBe(true);
    });

    it('does not treat non-authoritative links as the HARD RULE trigger', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-1',
            externalSystemName: 'directus',
            externalRecordId: 'ATS-2',
            isAuthoritativeLink: false,
          },
        ],
        person: [
          {
            id: 'person-1',
            name: { firstName: 'Jane', lastName: 'Doe' },
            emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
            externalLinks: [
              {
                twentyEntityName: 'person',
                twentyRecordId: 'person-1',
                externalSystemName: 'directus',
                externalRecordId: 'ATS-2',
                isAuthoritativeLink: false,
              },
            ],
          },
        ],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', ats_uuid: 'ATS-2', first_name: 'Jane', last_name: 'Doe' },
      ]);

      const pair: DirectusToTwentyPair = {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      };

      const results = await service.matchWorkspace(workspaceId, pair);

      // Non-authoritative link should still resolve via the matcher (EXACT on
      // ats_uuid), but it is NOT the HARD RULE link-only short-circuit.
      expect(results).toHaveLength(1);
      expect(results[0].confidence).toBe(IdentityMatchConfidence.EXACT);
      expect(results[0].matchedTwentyRecordId).toBe('person-1');
      expect(results[0].reasons.some((r) => r.includes('HARD RULE'))).toBe(false);
    });
  });

  describe('dispatch & confidence', () => {
    it('dispatches to the executive matcher and returns HIGH on email', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [
          {
            id: 'person-1',
            name: { firstName: 'Jane', lastName: 'Doe' },
            emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
          },
        ],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', email: 'jane.doe@example.com', first_name: 'Jane', last_name: 'Doe' },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      expect(results).toHaveLength(1);
      expect(results[0].confidence).toBe(IdentityMatchConfidence.HIGH);
      expect(results[0].matchedTwentyRecordId).toBe('person-1');
    });

    it('returns NONE when no candidates match', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', first_name: 'Ghost', last_name: 'Person' },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      expect(results[0].confidence).toBe(IdentityMatchConfidence.NONE);
    });

    it('flags multiple matching candidates', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [
          {
            id: 'person-1',
            name: { firstName: 'Jane', lastName: 'Doe' },
            emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
          },
          {
            id: 'person-2',
            name: { firstName: 'Jane', lastName: 'Doe' },
            emails: { primaryEmail: 'jane.doe@example.com', additionalEmails: null },
          },
        ],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', email: 'jane.doe@example.com', first_name: 'Jane', last_name: 'Doe' },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      expect(results[0].confidence).toBe(IdentityMatchConfidence.HIGH);
      expect(results[0].candidates?.length).toBe(2);
      expect(results[0].reasons.some((r) => r.includes('Ambiguous'))).toBe(true);
    });

    it('returns an empty array when Directus has no items', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [{ id: 'person-1' }],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      expect(results).toEqual([]);
    });

    it('routes company pairs to the company matcher', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [],
        company: [
          {
            id: 'company-1',
            name: 'Acme Corp',
            domainName: { primaryLinkUrl: 'https://acme.com', secondaryLinks: null },
          },
        ],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'co-1', name: 'Acme Corp', website: 'acme.com' },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'companies',
        twentyEntityName: 'company',
        matcherType: 'company',
      });

      expect(results[0].confidence).toBe(IdentityMatchConfidence.HIGH);
      expect(results[0].matchedTwentyEntityName).toBe('company');
    });

    it('routes opportunity pairs with company enrichment', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [],
        person: [],
        company: [
          {
            id: 'company-1',
            name: 'Acme Corp',
            domainName: { primaryLinkUrl: 'https://acme.com', secondaryLinks: null },
          },
        ],
        searchAssignment: [
          {
            id: 'assignment-1',
            name: 'Chief Executive Officer — Acme',
            clientCompanyId: 'company-1',
          },
        ],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        {
          id: 'opp-1',
          title: 'Chief Executive Officer — Acme',
          company_name: 'Acme Corp',
          website: 'acme.com',
        },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'opportunities',
        twentyEntityName: 'searchAssignment',
        matcherType: 'opportunity',
      });

      expect(results[0].confidence).toBe(IdentityMatchConfidence.MEDIUM);
      expect(results[0].matchedTwentyEntityName).toBe('searchAssignment');
    });

    it('routes application pairs via enriched person + assignment ids', async () => {
      const { service, mockDirectusClient } = await buildService({
        links: [
          {
            twentyEntityName: 'person',
            twentyRecordId: 'person-1',
            externalSystemName: 'directus',
            externalRecordId: 'EXEC-EXT-1',
            isAuthoritativeLink: false,
          },
          {
            twentyEntityName: 'searchAssignment',
            twentyRecordId: 'assignment-1',
            externalSystemName: 'directus',
            externalRecordId: 'OPP-EXT-1',
            isAuthoritativeLink: false,
          },
        ],
        person: [{ id: 'person-1' }],
        company: [],
        searchAssignment: [{ id: 'assignment-1' }],
        searchCandidacy: [
          { id: 'candidacy-1', personId: 'person-1', searchAssignmentId: 'assignment-1' },
        ],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        {
          id: 'app-1',
          executive_external_id: 'EXEC-EXT-1',
          opportunity_external_id: 'OPP-EXT-1',
        },
      ]);

      const results = await service.matchWorkspace(workspaceId, {
        directusCollection: 'applications',
        twentyEntityName: 'searchCandidacy',
        matcherType: 'application',
      });

      expect(results[0].confidence).toBe(IdentityMatchConfidence.HIGH);
      expect(results[0].matchedTwentyRecordId).toBe('candidacy-1');
    });
  });

  describe('DI pattern', () => {
    it('calls executeInWorkspaceContext with a single callback (no authContext)', async () => {
      const { service, mockOrm, mockDirectusClient } = await buildService({
        links: [],
        person: [],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([]);

      await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      expect(mockOrm.executeInWorkspaceContext).toHaveBeenCalledTimes(1);
      // Only the callback is passed — NO authContext second argument.
      expect(mockOrm.executeInWorkspaceContext.mock.calls[0]).toHaveLength(1);
    });

    it('requests repositories with shouldBypassPermissionChecks: true', async () => {
      const { service, mockOrm, mockDirectusClient } = await buildService({
        links: [],
        person: [{ id: 'person-1' }],
        company: [],
        searchAssignment: [],
        searchCandidacy: [],
      });

      mockDirectusClient.getItems.mockResolvedValue([
        { id: 'exec-1', first_name: 'Jane', last_name: 'Doe' },
      ]);

      await service.matchWorkspace(workspaceId, {
        directusCollection: 'executives',
        twentyEntityName: 'person',
        matcherType: 'executive',
      });

      for (const call of mockOrm.getRepository.mock.calls) {
        const options = call[2];

        expect(options).toEqual({ shouldBypassPermissionChecks: true });
      }
    });
  });
});
