import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { DirectusClientService } from
  'src/modules/executive-search/directus/services/directus-client.service';
import { CountReconciliationEngine } from
  'src/modules/executive-search/reconciliation/engines/count-reconciliation.engine';
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
  externalEntityName: string;
  twentyEntityName: string;
  externalRecordId: string;
  twentyRecordId: string;
};

type SeedConfig = {
  directus?: Record<string, Array<{ id: string }>>;
  twenty?: Record<string, Array<{ id: string }>>;
  links?: LinkSeed[];
};

const ALL_PAIR_COLLECTIONS = [
  'executives',
  'companies',
  'opportunities',
  'applications',
];

describe('CountReconciliationEngine', () => {
  let engine: CountReconciliationEngine;
  let registry: ReconciliationEngineRegistry;
  let mockManager: { getRepository: jest.Mock };
  let mockDirectusClient: { getItems: jest.Mock };

  beforeEach(async () => {
    mockDirectusClient = { getItems: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReconciliationEngineRegistry,
        CountReconciliationEngine,
        GlobalWorkspaceOrmManager,
        { provide: DirectusClientService, useValue: mockDirectusClient },
      ],
    }).compile();

    engine = module.get(CountReconciliationEngine);
    registry = module.get(ReconciliationEngineRegistry);
    mockManager = module.get(GlobalWorkspaceOrmManager);

    applySeed({});
  });

  const applySeed = (config: SeedConfig) => {
    const directus = config.directus ?? {};
    const twenty = config.twenty ?? {};
    const links = config.links ?? [];

    mockDirectusClient.getItems.mockImplementation((collection: string) => {
      // The engine paginates; returning everything in one page (below the page
      // size) exercises the same code path.
      return Promise.resolve(directus[collection] ?? []);
    });

    const linkFind = jest.fn((options?: { where?: Record<string, unknown> }) => {
      const where = options?.where;

      if (!where) {
        return Promise.resolve(links);
      }

      return Promise.resolve(
        links.filter(
          (link) =>
            (where.externalEntityName === undefined ||
              link.externalEntityName === where.externalEntityName) &&
            (where.twentyEntityName === undefined ||
              link.twentyEntityName === where.twentyEntityName),
        ),
      );
    });

    mockManager.getRepository.mockImplementation(
      (_workspaceId: string, entityOrName: unknown) => {
        const name =
          typeof entityOrName === 'string'
            ? entityOrName
            : (entityOrName as { name: string }).name;

        if (name === 'ExternalEntityLinkWorkspaceEntity') {
          return { find: linkFind };
        }

        const records = twenty[name] ?? [];

        return {
          find: jest.fn(() => Promise.resolve(records)),
        };
      },
    );
  };

  const reconcile = () =>
    engine.reconcile({ workspaceId: 'workspace-1', objectName: 'person' });

  it('self-registers with the registry under its engine name', () => {
    expect(registry.list()).toContain('count-reconciliation');
    expect(registry.get('count-reconciliation')).toBe(engine);
  });

  it('flags only-in-external and only-in-twenty existence findings', async () => {
    applySeed({
      directus: {
        executives: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
      },
      twenty: {
        PersonWorkspaceEntity: [{ id: 'p1' }, { id: 'p2' }],
      },
      links: [
        {
          id: 'l1',
          externalEntityName: 'executives',
          twentyEntityName: 'person',
          externalRecordId: 'e1',
          twentyRecordId: 'p1',
        },
        {
          id: 'l2',
          externalEntityName: 'executives',
          twentyEntityName: 'person',
          externalRecordId: 'e2',
          twentyRecordId: 'p9', // points at a twenty id that does not exist
        },
      ],
    });

    const findings = await reconcile();

    const onlyInExternal = findings.find((f) => f.recordId === 'e3');
    const onlyInTwenty = findings.find((f) => f.recordId === 'p2');

    expect(onlyInExternal).toEqual(
      expect.objectContaining({
        objectName: 'person',
        recordId: 'e3',
        kind: 'EXISTENCE',
        dryRunSafe: true,
      }),
    );
    expect(onlyInExternal?.detail.startsWith('Directus')).toBe(true);

    expect(onlyInTwenty).toEqual(
      expect.objectContaining({
        objectName: 'person',
        recordId: 'p2',
        kind: 'EXISTENCE',
        dryRunSafe: true,
      }),
    );
    expect(onlyInTwenty?.detail.startsWith('Twenty')).toBe(true);

    // e3 (only-in-external) and p2 (only-in-twenty); p9 is a dangling link
    // target and is not surfaced as a twenty-only record.
    expect(findings).toHaveLength(2);
  });

  it('emits no findings when both sides are fully linked', async () => {
    applySeed({
      directus: { executives: [{ id: 'e1' }] },
      twenty: { PersonWorkspaceEntity: [{ id: 'p1' }] },
      links: [
        {
          id: 'l1',
          externalEntityName: 'executives',
          twentyEntityName: 'person',
          externalRecordId: 'e1',
          twentyRecordId: 'p1',
        },
      ],
    });

    const findings = await reconcile();

    expect(findings).toEqual([]);
  });

  it('assigns LOW severity for small discrepancies', async () => {
    applySeed({
      directus: { executives: [{ id: 'e1' }, { id: 'e2' }] },
      twenty: { PersonWorkspaceEntity: [] },
      links: [],
    });

    const findings = await reconcile();

    expect(findings).toHaveLength(2);
    expect(findings.every((f) => f.severity === 'LOW')).toBe(true);
  });

  it('assigns MEDIUM severity when the discrepancy exceeds 10', async () => {
    const ids = Array.from({ length: 15 }, (_, i) => ({ id: `e${i}` }));

    applySeed({
      directus: { executives: ids },
      twenty: { PersonWorkspaceEntity: [] },
      links: [],
    });

    const findings = await reconcile();

    expect(findings).toHaveLength(15);
    expect(findings.every((f) => f.severity === 'MEDIUM')).toBe(true);
  });

  it('assigns HIGH severity when the discrepancy exceeds 100', async () => {
    const ids = Array.from({ length: 101 }, (_, i) => ({ id: `e${i}` }));

    applySeed({
      directus: { executives: ids },
      twenty: { PersonWorkspaceEntity: [] },
      links: [],
    });

    const findings = await reconcile();

    expect(findings).toHaveLength(101);
    expect(findings.every((f) => f.severity === 'HIGH')).toBe(true);
  });

  it('marks every finding as dryRunSafe', async () => {
    applySeed({
      directus: {
        executives: [{ id: 'e1' }],
        companies: [{ id: 'c1' }],
      },
      twenty: {
        PersonWorkspaceEntity: [{ id: 'p1' }],
        CompanyWorkspaceEntity: [{ id: 'c-twenty-1' }],
      },
      links: [],
    });

    const findings = await reconcile();

    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.dryRunSafe === true)).toBe(true);
  });

  it('enumerates all four pairs internally (ignores objectName)', async () => {
    applySeed({});

    // Even though objectName is 'person', all four collections are queried.
    await reconcile();

    for (const collection of ALL_PAIR_COLLECTIONS) {
      expect(mockDirectusClient.getItems).toHaveBeenCalledWith(
        collection,
        expect.objectContaining({ fields: ['id'] }),
      );
    }
  });

  it('skips a pair when the Directus collection is unreachable', async () => {
    mockDirectusClient.getItems.mockImplementation((collection: string) => {
      if (collection === 'executives') {
        return Promise.reject(new Error('network down'));
      }

      return Promise.resolve([]);
    });

    const findings = await reconcile();

    expect(findings).toEqual([]);
  });
});
