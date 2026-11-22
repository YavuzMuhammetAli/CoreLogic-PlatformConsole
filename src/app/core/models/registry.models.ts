/** Model/Schema Registry (M11) models — match backend Entities.DTOs.Platform. */

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
