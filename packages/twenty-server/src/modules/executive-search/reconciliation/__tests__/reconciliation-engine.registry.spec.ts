import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { DirectusClientService } from
  'src/modules/executive-search/directus/services/directus-client.service';
import { NoopReconciliationEngine } from
  'src/modules/executive-search/reconciliation/noop-reconciliation-engine';
import { CountReconciliationEngine } from
  'src/modules/executive-search/reconciliation/engines/count-reconciliation.engine';
import { ReferentialIntegrityEngine } from
  'src/modules/executive-search/reconciliation/engines/referential-integrity.engine';
import { ReconciliationEngineRegistry } from
  'src/modules/executive-search/reconciliation/reconciliation-engine.registry';

// The real GlobalWorkspaceOrmManager pulls in the twenty-config graph, which
// fails to load under jest. Mock it so the engines' import graph never touches
// it. jest hoists this call above the imports above.
jest.mock(
  'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager',
  () => ({
    GlobalWorkspaceOrmManager: jest.fn().mockImplementation(() => ({
      executeInWorkspaceContext: jest.fn((fn: () => unknown) => fn()),
      getRepository: jest.fn(),
    })),
  }),
);

describe('ReconciliationEngineRegistry', () => {
  let registry: ReconciliationEngineRegistry;
  let noopEngine: NoopReconciliationEngine;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReconciliationEngineRegistry, NoopReconciliationEngine],
    }).compile();

    registry = module.get<ReconciliationEngineRegistry>(
      ReconciliationEngineRegistry,
    );
    noopEngine = module.get<NoopReconciliationEngine>(
      NoopReconciliationEngine,
    );
  });

  it('registers an engine and retrieves it by name', () => {
    registry.register(noopEngine);

    const retrieved = registry.get('noop');

    expect(retrieved).toBe(noopEngine);
    expect(retrieved.name).toBe('noop');
  });

  it('returns the list of registered engine names', () => {
    registry.register(noopEngine);

    expect(registry.list()).toEqual(['noop']);
  });

  it('throws when retrieving an unregistered engine', () => {
    expect(() => registry.get('nonexistent')).toThrow();
  });

  describe('registered noop engine', () => {
    it('reconcile returns an empty array', async () => {
      registry.register(noopEngine);

      const findings = await noopEngine.reconcile({
        workspaceId: 'workspace-1',
        objectName: 'person',
      });

      expect(findings).toEqual([]);
    });

    it('reconcile accepts optional recordIds', async () => {
      registry.register(noopEngine);

      const findings = await noopEngine.reconcile({
        workspaceId: 'workspace-1',
        objectName: 'person',
        recordIds: ['record-1', 'record-2'],
      });

      expect(findings).toEqual([]);
    });
  });
});

describe('ReconciliationEngineRegistry (executive-search engines)', () => {
  let registry: ReconciliationEngineRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReconciliationEngineRegistry,
        CountReconciliationEngine,
        ReferentialIntegrityEngine,
        GlobalWorkspaceOrmManager,
        {
          provide: DirectusClientService,
          useValue: { getItems: jest.fn() },
        },
      ],
    }).compile();

    registry = module.get<ReconciliationEngineRegistry>(
      ReconciliationEngineRegistry,
    );
  });

  it('resolves both reconciliation engines by name', () => {
    const names = registry.list();

    expect(names).toContain('count-reconciliation');
    expect(names).toContain('referential-integrity');

    expect(
      registry.get('count-reconciliation'),
    ).toBeInstanceOf(CountReconciliationEngine);
    expect(
      registry.get('referential-integrity'),
    ).toBeInstanceOf(ReferentialIntegrityEngine);
  });
});
