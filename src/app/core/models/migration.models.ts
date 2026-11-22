/** Migration Orchestrator (M10) models — match backend Entities.DTOs.Platform. */

export interface MigrationRunItem {
  id: number;
  /** Queued (in the queue) | Running | Completed | Stopped | Failed */
  status: string;
  startedAt: string;
  completedAt?: string | null;
  totalTenants: number;
  succeededCount: number;
  failedCount: number;
  /** Number of tenants left untouched because their version was already current. */
  skippedCount: number;
  takePreBackup: boolean;
  stopOnFailure: boolean;
  stoppedReason?: string | null;
  /** Manual | Scheduled — the only distinguishing mark, since an automatic run has no user info. */
  trigger: string;
}

export interface MigrationRunItemRow {
  tenantId: string;
  wave: number;
  fromVersion: number;
  toVersion: number;
  status: string; // Succeeded | Failed | Skipped
  error?: string | null;
  backupId?: number | null;
  processedAt: string;
}

export interface MigrationRunDetail extends MigrationRunItem {
  items: MigrationRunItemRow[];
}

/**
 * Automatic (cron) upgrade setting — a single platform-wide ScheduledTask row.
 *
 * Form ↔ cron conversion happens in the console (`core/utils/cron-builder.ts`), but
 * `nextOccurrences` comes FROM THE SERVER: the next-run preview is computed by the same
 * CronSchedule that will actually execute the schedule (time zone included).
 */
export interface MigrationSchedule {
  enabled: boolean;
  cronExpression: string;
  timeZoneId?: string | null;
  takePreBackup: boolean;
  stopOnFailure: boolean;
  nextOccurrences: string[];
  lastRunAt?: string | null;
  nextDueAt?: string | null;
}

/** States in which a run is still in progress — polling checks these. */
export const ACTIVE_RUN_STATUSES = ['Queued', 'Running'];
