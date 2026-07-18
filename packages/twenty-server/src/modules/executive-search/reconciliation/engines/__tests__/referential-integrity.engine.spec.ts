import { In } from 'typeorm';
import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ReferentialIntegrityEngine } from
  'src/modules/executive-search/reconciliation/engines/referential-integrity.engine';
import { ReconciliationEngineRegistry } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.registry';

// The real GlobalWorkspaceOrmManager pulls in the twenty-config graph, which
// fails to load under jest. Mock the manager so it (and its transitive imports)
// never loads, mirroring the existing executive-search service specs. jest
// hoists this call above the imports above.
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => {
    const mockExecuteInWorkspaceContext = jest
      .fn()
      .mockImplementation((fn: () => unknown) => fn());
    const mockGetRepository = jest.fn();

    return {
      GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
        executeInWorkspaceContext: mockExecuteInWorkspaceContext,
        getRepository: mockGetRepository,
      })),
    };
  },
);

type LinkSeed = {
  id: string;
  twentyEntityName: string;
  twentyRecordId: string;
  externalEntityName: string;
  externalRecordId: string;
};

type RecordSeed = { id: string; personId?: string | null; searchAssignmentId?: string | null };

type SeedConfig = {
  persons?: RecordSeed[];
  companies?: RecordSeed[];
  assignments?: RecordSeed[];
  candidacies?: RecordSeed[];
  links?: LinkSeed[];
};

/**
 * Builds a mocked `find` that honours `where: { id: In([...]) }` by reading the
 * FindOperator's public `value` getter, matching the real repository behaviour.
 */
const findFilteringById = (records: RecordSeed[]) =>
  jest.fn((options?: { where?: { id?: unknown } }) => {
    const idFilter = options?.where?.id;

    if (idFilter === undefined) {
      return Promise.resolve(records);
    }

    let ids: string[] | null = null;

    if (Array.isArray(idFilter)) {
      ids = idFilter;
    } else if (
      idFilter &&
      typeof idFilter === 'object' &&
      'value' in (idFilter as Record<string, unknown>)
    ) {
      const value = (idFilter as { value: unknown }).value;

      ids = Array.isArray(value) ? (value as string[]) : null;
    }

    if (ids === null) {
      const single = String(idFilter);

      return Promise.resolve(records.filter((record) => record.id === single));
    }

    const set = new Set(ids);

    return Promise.resolve(records.filter((record) => set.has(record.id)));
  });

describe('ReferentialIntegrityEngine', () => {
  let engine: ReferentialIntegrityEngine;
  let registry: ReconciliationEngineRegistry;
  let mockManager: { getRepository: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReconciliationEngineRegistry,
        ReferentialIntegrityEngine,
        GlobalWorkspaceOrmManager,
      ],
    }).compile();

    engine = module.get(ReferentialIntegrityEngine);
    registry = module.get(ReconciliationEngineRegistry);
    mockManager = module.get(GlobalWorkspaceOrmManager);

    applySeed({});
  });

  const applySeed = (config: SeedConfig) => {
    const persons = config.persons ?? [];
    const companies = config.companies ?? [];
    const assignments = config.assignments ?? [];
    const candidacies = config.candidacies ?? [];
    const links = config.links ?? [];

    mockManager.getRepository.mockImplementation(
      (_workspaceId: string, entityOrName: unknown) => {
        const name =
          typeof entityOrName === 'string'
            ? entityOrName
            : (entityOrName as { name: string }).name;

        switch (name) {
          case 'ExternalEntityLinkWorkspaceEntity':
            return { find: jest.fn(() => Promise.resolve(links)) };
          case 'PersonWorkspaceEntity':
            return { find: findFilteringById(persons) };
          case 'CompanyWorkspaceEntity':
            return { find: findFilteringById(companies) };
          case 'SearchAssignmentWorkspaceEntity':
            return { find: findFilteringById(assignments) };
          case 'SearchCandidacyWorkspaceEntity':
            return { find: findFilteringById(candidacies) };
          default:
            return { find: jest.fn(() => Promise.resolve([])) };
        }
      },
    );
  };

  const reconcile = () =>
    engine.reconcile({ workspaceId: 'workspace-1', objectName: 'person' });

  it('self-registers with the registry under its engine name', () => {
    expect(registry.list()).toContain('referential-integrity');
    expect(registry.get('referential-integrity')).toBe(engine);
  });

  it('flags orphan links and stale candidacy references', async () => {
    applySeed({
      persons: [{ id: 'p-exists' }],
      companies: [{ id: 'c1' }],
      assignments: [{ id: 'a1' }],
      candidacies: [
        {
          id: 'cand1',
          personId: 'p-broken',
          searchAssignmentId: 'a1',
        },
        {
          id: 'cand2',
          personId: 'p-exists',
          searchAssignmentId: 'a-broken',
        },
      ],
      links: [
        {
          id: 'l1',
          twentyEntityName: 'person',
          twentyRecordId: 'p-missing',
          externalEntityName: 'executives',
          externalRecordId: 'e1',
        },
        {
          id: 'l2',
          twentyEntityName: 'company',
          twentyRecordId: 'c1',
          externalEntityName: 'companies',
          externalRecordId: 'ec1',
        },
        {
          id: 'l3',
          twentyEntityName: 'searchCandidacy',
          twentyRecordId: 'cand1',
          externalEntityName: 'applications',
          externalRecordId: 'ea1',
        },
        {
          id: 'l4',
          twentyEntityName: 'searchCandidacy',
          twentyRecordId: 'cand2',
          externalEntityName: 'applications',
          externalRecordId: 'ea2',
        },
        {
          id: 'l5',
          twentyEntityName: 'searchCandidacy',
          twentyRecordId: 'cand-missing',
          externalEntityName: 'applications',
          externalRecordId: 'ea3',
        },
      ],
    });

    const findings = await reconcile();

    const orphanLinks = findings.filter((f) => f.kind === 'ORPHAN_LINK');
    const stale = findings.filter((f) => f.kind === 'STALE');

    // l1 (person p-missing) and l5 (candidacy cand-missing)
    expect(orphanLinks).toHaveLength(2);
    expect(orphanLinks.map((f) => f.recordId).sort()).toEqual(
      ['cand-missing', 'p-missing'],
    );
    expect(orphanLinks.every((f) => f.severity === 'HIGH')).toBe(true);

    // l3 references missing person, l4 references missing assignment
    expect(stale).toHaveLength(2);
    expect(
      stale.some(
        (f) => f.recordId === 'cand1' && f.detail.includes('person'),
      ),
    ).toBe(true);
    expect(
      stale.some(
        (f) =>
          f.recordId === 'cand2' && f.detail.includes('searchAssignment'),
      ),
    ).toBe(true);
    expect(stale.every((f) => f.severity === 'MEDIUM')).toBe(true);

    expect(findings).toHaveLength(4);
  });

  it('emits no findings when every link resolves', async () => {
    applySeed({
      persons: [{ id: 'p1' }],
      candidacies: [
        { id: 'cand1', personId: 'p1', searchAssignmentId: 'a1' },
      ],
      assignments: [{ id: 'a1' }],
      links: [
        {
          id: 'l1',
          twentyEntityName: 'person',
          twentyRecordId: 'p1',
          externalEntityName: 'executives',
          externalRecordId: 'e1',
        },
        {
          id: 'l2',
          twentyEntityName: 'searchCandidacy',
          twentyRecordId: 'cand1',
          externalEntityName: 'applications',
          externalRecordId: 'ea1',
        },
      ],
    });

    const findings = await reconcile();

    expect(findings).toEqual([]);
  });

  it('returns no findings when there are no external entity links', async () => {
    applySeed({ links: [] });

    const findings = await reconcile();

    expect(findings).toEqual([]);
  });

  it('marks every finding as dryRunSafe', async () => {
    applySeed({
      persons: [],
      candidacies: [
        { id: 'cand1', personId: 'p-broken', searchAssignmentId: null },
      ],
      links: [
        {
          id: 'l1',
          twentyEntityName: 'person',
          twentyRecordId: 'p-missing',
          externalEntityName: 'executives',
          externalRecordId: 'e1',
        },
        {
          id: 'l2',
          twentyEntityName: 'searchCandidacy',
          twentyRecordId: 'cand1',
          externalEntityName: 'applications',
          externalRecordId: 'ea1',
        },
      ],
    });

    const findings = await reconcile();

    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.dryRunSafe === true)).toBe(true);
  });

  it('reads the In() FindOperator value when resolving ids', async () => {
    // Sanity: the `In` import from typeorm is the same operator the engine
    // uses, and our mock reads its `.value`.
    const operator = In(['a', 'b']);

    expect((operator as unknown as { value: unknown }).value).toEqual([
      'a',
      'b',
    ]);
  });
});
