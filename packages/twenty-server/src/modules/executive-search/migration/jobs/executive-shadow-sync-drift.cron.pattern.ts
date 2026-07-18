/**
 * Cron schedule for the shadow-sync drift sweep.
 *
 * Mirrors `executive-sync-outbox-redrive.cron.pattern.ts`.  Runs every minute
 * so the no-writes drift comparison stays current with shadow-sync inbox
 * traffic.
 */
export const EXECUTIVE_SHADOW_SYNC_DRIFT_CRON_PATTERN = '* * * * *';
