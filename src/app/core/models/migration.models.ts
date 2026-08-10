/** Migration Orchestrator (M10) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface MigrationRunItem {
  id: number;
  /** Queued (kuyrukta) | Running | Completed | Stopped | Failed */
  status: string;
  startedAt: string;
  completedAt?: string | null;
  totalTenants: number;
  succeededCount: number;
  failedCount: number;
  /** Sürümü zaten güncel olduğu için dokunulmayan tenant sayısı. */
  skippedCount: number;
  takePreBackup: boolean;
  stopOnFailure: boolean;
  stoppedReason?: string | null;
  /** Manual | Scheduled — otomatik koşuda kullanıcı bilgisi olmadığı için tek ayırt edici. */
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
 * Otomatik (cron) yükseltme ayarı — platform geneli tek ScheduledTask satırı.
 *
 * `nextOccurrences` SUNUCUDAN gelir: konsolda ikinci bir cron ayrıştırıcı
 * tutulmaz, önizlemeyi gerçekten zamanlayacak olan aynı CronSchedule hesaplar.
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

/** Koşunun hâlâ sürdüğü durumlar — polling bunlara bakar. */
export const ACTIVE_RUN_STATUSES = ['Queued', 'Running'];
