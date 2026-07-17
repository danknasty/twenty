export const EXECUTIVE_SEARCH_SYNC_WEBHOOK_PATH = 'webhooks/executive-search/sync';
export const HMAC_SIGNATURE_HEADER = 'x-directus-signature';
export const HMAC_TIMESTAMP_TOLERANCE_SECONDS = 300;
export const RECONCILIATION_CRON_PATTERN = '0 */6 * * *';

// job names
export const SYNC_EVENT_CONSUMER_JOB_NAME = 'SyncEventConsumerJob';
export const OUTBOX_RELAY_JOB_NAME = 'OutboxRelayJob';
export const RECONCILIATION_CRON_JOB_NAME = 'ReconciliationCronJob';
export const RECONCILIATION_RUNNER_JOB_NAME = 'ReconciliationRunnerJob';
