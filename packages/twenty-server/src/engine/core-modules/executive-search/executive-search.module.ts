/* @license Enterprise */

import { Module } from '@nestjs/common';

import { ExecutiveSearchSyncWebhookController } from 'src/engine/core-modules/executive-search/controllers/executive-search-sync-webhook.controller';
import { OutboxRelayJob } from 'src/engine/core-modules/executive-search/jobs/outbox-relay.job';
import { OutboxRelayCronCommand } from 'src/engine/core-modules/executive-search/jobs/outbox-relay.cron.command';
import { ReconciliationCronJob } from 'src/engine/core-modules/executive-search/jobs/reconciliation.cron.job';
import { ReconciliationCronCommand } from 'src/engine/core-modules/executive-search/jobs/reconciliation.cron.command';
import { ReconciliationRunnerJob } from 'src/engine/core-modules/executive-search/jobs/reconciliation-runner.job';
import { SyncEventConsumerJob } from 'src/engine/core-modules/executive-search/jobs/sync-event-consumer.job';
import { DeadLetterService } from 'src/engine/core-modules/executive-search/services/dead-letter.service';
import { HmacSignatureVerifierService } from 'src/engine/core-modules/executive-search/services/hmac-signature-verifier.service';
import { IdempotencyService } from 'src/engine/core-modules/executive-search/services/idempotency.service';
import { InboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/inbound-event-ledger.service';
import { OutboundEventLedgerService } from 'src/engine/core-modules/executive-search/services/outbound-event-ledger.service';
import { OutboxService } from 'src/engine/core-modules/executive-search/services/outbox.service';
import { ReconciliationService } from 'src/engine/core-modules/executive-search/services/reconciliation.service';
import { ServerVariableService } from 'src/engine/core-modules/executive-search/services/server-variable.service';

@Module({
  controllers: [ExecutiveSearchSyncWebhookController],
  providers: [
    // Services
    OutboxService,
    OutboundEventLedgerService,
    InboundEventLedgerService,
    ServerVariableService,
    IdempotencyService,
    DeadLetterService,
    HmacSignatureVerifierService,
    ReconciliationService,

    // Jobs
    OutboxRelayJob,
    OutboxRelayCronCommand,
    SyncEventConsumerJob,
    ReconciliationCronJob,
    ReconciliationRunnerJob,
    ReconciliationCronCommand,
  ],
  exports: [
    OutboxService,
    OutboundEventLedgerService,
    InboundEventLedgerService,
    ServerVariableService,
    IdempotencyService,
    DeadLetterService,
    HmacSignatureVerifierService,
    ReconciliationService,
  ],
})
export class ExecutiveSearchSyncModule {}
