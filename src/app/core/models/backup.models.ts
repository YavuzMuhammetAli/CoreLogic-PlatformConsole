/** Backup/Restore (M09) modeli — backend Entities.DTOs.Platform.TenantBackupDto ile eşleşir. */
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
  /** Saklama sonu; null = süresiz. */
  expiresAt?: string | null;
  /** Yedeğin alındığı şema sürümü; null = bilinmiyor (geri yüklenemez). */
  databaseVersion?: number | null;
}
