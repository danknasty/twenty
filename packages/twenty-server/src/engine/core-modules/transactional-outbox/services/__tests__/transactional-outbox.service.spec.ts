import { Test, type TestingModule } from '@nestjs/testing';

import { WorkspaceEventOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/workspace-event-outbox.workspace-entity';
import {
  TransactionalOutboxService,
  type OutboxAppendArgs,
} from 'src/engine/core-modules/transactional-outbox/services/transactional-outbox.service';
import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

type MockRepository = {
  create: jest.Mock;
  save: jest.Mock;
};

describe('TransactionalOutboxService', () => {
  let service: TransactionalOutboxService;
  let mockRepository: MockRepository;

  const mockGlobalWorkspaceOrmManager = {
    executeInWorkspaceContext: jest
      .fn()
      .mockImplementation(
        (fn: () => Promise<void>, _authContext: any) => fn(),
      ),
    getRepository: jest.fn(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockGlobalWorkspaceOrmManager.getRepository.mockResolvedValue(
      mockRepository,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionalOutboxService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: mockGlobalWorkspaceOrmManager,
        },
      ],
    }).compile();

    service = module.get<TransactionalOutboxService>(
      TransactionalOutboxService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('append', () => {
    it('should create and save an outbox entry with PENDING status', async () => {
      const args: OutboxAppendArgs = {
        eventName: 'person.created',
        eventPayload: { id: '123', name: 'John' },
      };

      const createdEntry = {
        eventName: args.eventName,
        eventPayload: args.eventPayload,
        idempotencyKey: null,
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      };

      mockRepository.create.mockReturnValue(createdEntry);
      mockRepository.save.mockResolvedValue(createdEntry);

      await service.append(args, 'workspace-1');

      expect(
        mockGlobalWorkspaceOrmManager.getRepository,
      ).toHaveBeenCalledWith(
        'workspace-1',
        WorkspaceEventOutboxWorkspaceEntity,
        { shouldBypassPermissionChecks: true },
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        eventName: 'person.created',
        eventPayload: { id: '123', name: 'John' },
        idempotencyKey: null,
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntry);
    });

    it('should accept an optional idempotencyKey', async () => {
      const args: OutboxAppendArgs = {
        eventName: 'company.updated',
        eventPayload: { id: '456' },
        idempotencyKey: 'key-001',
      };

      const createdEntry = {
        eventName: args.eventName,
        eventPayload: args.eventPayload,
        idempotencyKey: 'key-001',
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      };

      mockRepository.create.mockReturnValue(createdEntry);
      mockRepository.save.mockResolvedValue(createdEntry);

      await service.append(args, 'workspace-1');

      expect(mockRepository.create).toHaveBeenCalledWith({
        eventName: 'company.updated',
        eventPayload: { id: '456' },
        idempotencyKey: 'key-001',
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntry);
    });
  });
});
