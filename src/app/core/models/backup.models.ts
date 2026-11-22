/** Backup/Restore (M09) model — matches backend Entities.DTOs.Platform.TenantBackupDto. */
export interface TenantBackupItem {
  id: number;
  tenantId: string;
  type: string;
  location?: string | null;
  sizeBytes: number;
  startedAt: string;
  completedAt?: string | null;
  status: string; // Queued | Running | Completed | Failed
  error?: string | null;
  verifiedAt?: string | null;
  /** End of retention; null = indefinite. */
  expiresAt?: string | null;
  /** Schema version the backup was taken at; null = unknown (cannot be restored). */
  databaseVersion?: number | null;
}
