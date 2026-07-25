/** Backup/Restore (M09) modeli — backend Entities.DTOs.Platform.TenantBackupDto ile eşleşir. */
export interface TenantBackupItem {
  id: number;
  tenantId: string;
  type: string;
  location?: string | null;
  sizeBytes: number;
  startedAt: string;
  completedAt?: string | null;
  status: string; // Running | Completed | Failed
  error?: string | null;
  verifiedAt?: string | null;
}
