/** Model/Şema Registry (M11) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface TenantModelSummaryItem {
  tenantId: string;
  modelName: string;
  activeVersion: number;
  columnCount: number;
  lastPublishedAt?: string | null;
  assemblyVersion?: string | null;
  assemblyError?: string | null;
  syncedAt: string;
}

export interface TenantDriftItem {
  tenantId: string;
  databaseVersion: number;
  latestVersion: number;
  isBehind: boolean;
  modelCount: number;
  assemblyErrorCount: number;
}
