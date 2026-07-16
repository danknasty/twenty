import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WorkspaceEventOutboxWorkspaceEntity } from 'src/modules/executive-search/standard-objects/workspace-event-outbox.workspace-entity';
import {
  TransactionalOutboxService,
  type OutboxAppendArgs,
} from 'src/engine/core-modules/transactional-outbox/services/transactional-outbox.service';
import { OutboxStatus } from 'src/engine/core-modules/transactional-outbox/enums/outbox-status.enum';

type MockRepository = {
  create: jest.Mock;
  save: jest.Mock;
};

describe('TransactionalOutboxService', () => {
  let service: TransactionalOutboxService;
  let mockRepository: MockRepository;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionalOutboxService,
        {
          provide: getRepositoryToken(
            WorkspaceEventOutboxWorkspaceEntity,
            'workspace',
          ),
          useValue: mockRepository,
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

      await service.append(args);

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

      await service.append(args);

      expect(mockRepository.create).toHaveBeenCalledWith({
        eventName: 'company.updated',
        eventPayload: { id: '456' },
        idempotencyKey: 'key-001',
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntry);
    });

    it('should use queryRunner if provided', async () => {
      const mockQueryRunner = {
        manager: {
          getRepository: jest.fn().mockReturnValue(mockRepository),
        },
      };

      const args: OutboxAppendArgs = {
        eventName: 'opportunity.deleted',
        eventPayload: { id: '789' },
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

      await service.append(args, mockQueryRunner as any);

      expect(
        mockQueryRunner.manager.getRepository,
      ).toHaveBeenCalledWith(WorkspaceEventOutboxWorkspaceEntity);
      expect(mockRepository.create).toHaveBeenCalledWith({
        eventName: 'opportunity.deleted',
        eventPayload: { id: '789' },
        idempotencyKey: null,
        status: OutboxStatus.PENDING,
        attemptCount: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntry);
    });
  });
});
