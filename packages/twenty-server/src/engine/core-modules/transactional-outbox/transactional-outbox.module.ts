import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DrainOutboxCronJob } from 'src/engine/core-modules/transactional-outbox/crons/jobs/drain-outbox.cron.job';
import { DrainOutboxJob } from 'src/engine/core-modules/transactional-outbox/jobs/drain-outbox.job';
import { TransactionalOutboxService } from 'src/engine/core-modules/transactional-outbox/services/transactional-outbox.service';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity]),
    WorkspaceEventEmitterModule,
  ],
  providers: [
    TransactionalOutboxService,
    DrainOutboxJob,
    DrainOutboxCronJob,
  ],
  exports: [
    TransactionalOutboxService,
  ],
})
export class TransactionalOutboxModule {}
