/** Migration Orchestrator (M10) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface MigrationRunItem {
  id: number;
  status: string; // Running | Completed | Stopped | Failed
  startedAt: string;
  completedAt?: string | null;
  totalTenants: number;
  succeededCount: number;
  failedCount: number;
  takePreBackup: boolean;
  stopOnFailure: boolean;
  stoppedReason?: string | null;
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
