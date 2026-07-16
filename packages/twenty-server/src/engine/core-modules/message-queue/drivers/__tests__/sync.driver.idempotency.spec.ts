import { type QueueJobOptions } from 'src/engine/core-modules/message-queue/drivers/interfaces/job-options.interface';
import { SyncDriver } from 'src/engine/core-modules/message-queue/drivers/sync.driver';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';

describe('SyncDriver idempotency', () => {
  let driver: SyncDriver;
  let handler: jest.Mock;

  beforeEach(() => {
    driver = new SyncDriver();
    handler = jest.fn();
    driver.work(MessageQueue.taskAssignedQueue, handler);
  });

  it('should process job when no idempotencyKey is set', async () => {
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'test-job',
      { value: 1 },
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      id: '',
      name: 'test-job',
      data: { value: 1 },
    });
  });

  it('should process only the first call with a given idempotencyKey', async () => {
    const options: QueueJobOptions = { idempotencyKey: 'dup-key' };

    await driver.add(
      MessageQueue.taskAssignedQueue,
      'test-job',
      { value: 1 },
      options,
    );
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'test-job',
      { value: 2 },
      options,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      id: '',
      name: 'test-job',
      data: { value: 1 },
    });
  });

  it('should process jobs with different idempotencyKeys independently', async () => {
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'job-a',
      { value: 'a' },
      { idempotencyKey: 'key-a' },
    );
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'job-b',
      { value: 'b' },
      { idempotencyKey: 'key-b' },
    );
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'job-a-again',
      { value: 'a-again' },
      { idempotencyKey: 'key-a' },
    );

    // key-a processed once, key-b processed once
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(1, {
      id: '',
      name: 'job-a',
      data: { value: 'a' },
    });
    expect(handler).toHaveBeenNthCalledWith(2, {
      id: '',
      name: 'job-b',
      data: { value: 'b' },
    });
  });

  it('should process jobs without idempotencyKey even after a job with idempotencyKey', async () => {
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'idempotent-job',
      {},
      { idempotencyKey: 'some-key' },
    );
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'normal-job',
      { value: 'no-key' },
    );

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should treat different idempotencyKeys as separate even across different job names', async () => {
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'job-x',
      {},
      { idempotencyKey: 'shared-key' },
    );
    await driver.add(
      MessageQueue.taskAssignedQueue,
      'job-y',
      {},
      { idempotencyKey: 'shared-key' },
    );

    // Only first call goes through
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'job-x' }),
    );
  });
});
