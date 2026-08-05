/** Tenant Directory (M02) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export type { PagedResult } from './api.models';

export interface TenantSummary {
  code: string;
  name: string;
  /** Provisioning | Active | Failed | Suspended */
  status: string;
  isProvisioned: boolean;
  databaseName?: string | null;
  databaseVersion?: number | null;
  /** Son bilinen sağlık durumu (Healthy/Degraded/Unhealthy/Unknown) — denorm ([07 §2]). */
  lastHealthStatus: string;
  lastHealthAt?: string | null;
  createdDate: string;
}

export interface ProvisionStep {
  stepName: string;
  status: string;
  durationMs?: number | null;
  error?: string | null;
}

export interface ProvisionJob {
  id: string;
  status: string;
  error?: string | null;
  adminEmail: string;
  createdDate: string;
  completedDate?: string | null;
  steps: ProvisionStep[];
}

export interface TenantDetail extends TenantSummary {
  companyId: number;
  active: boolean;
  latestProvision?: ProvisionJob | null;
}

export interface TenantStateHistory {
  fromStatus: string;
  toStatus: string;
  reason?: string | null;
  actorType: string;
  actorId?: number | null;
  occurredAt: string;
  correlationId?: string | null;
}

/** CompanyStatus değerleri — filtre açılır listesi. */
export const TENANT_STATUSES = ['Provisioning', 'Active', 'Failed', 'Suspended'] as const;

/**
 * Model ağacı düğümü. Liste backend'den derinlik-öncelikli SIRALI gelir
 * (kök → çocukları → torunları), bu yüzden istemci özyineleme yapmaz —
 * girinti `depth`, ata zinciri `path` alanından okunur.
 */
export interface TenantModelNode {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  parentName?: string | null;
  /** 1 = ana model. */
  depth: number;
  /** Kökten kendine zincir, ör. ["Siparis", "SiparisSatir"]. */
  path: string[];
  columnCount: number;
  version: number;
  /** Draft | Published | Archived | null */
  status?: string | null;
  lastPublishedAt?: string | null;
  createdOn?: string | null;
}

/** Model ağacı yanıtı — liste + özet sayaçlar. */
export interface TenantModelTree {
  items: TenantModelNode[];
  totalCount: number;
  rootCount: number;
  maxDepth: number;
}

/** Tablo sınıflandırması — backend Entities.DTOs.Platform.TenantTableKind ile eşleşir. */
export type TenantTableKind = 'Published' | 'DeletedModel' | 'System' | 'Unknown';

/** Fiziksel tablo + boyut + sınıflandırma. */
export interface TenantTable {
  name: string;
  rowCount: number;
  /** Ayrılmış toplam alan (bayt) — veri + indeks. */
  totalBytes: number;
  usedBytes: number;
  kind: TenantTableKind;
  /** Yayınlanmış/silinmiş model tablolarında model derinliği. */
  depth?: number | null;
}

/** Tablo envanteri yanıtı. */
export interface TenantTables {
  items: TenantTable[];
  databaseName: string;
  totalBytes: number;
  publishedCount: number;
  deletedCount: number;
  systemCount: number;
  unknownCount: number;
}
