/** Tenant Directory (M02) models — match backend Entities.DTOs.Platform. */

export type { PagedResult } from './api.models';

export interface TenantSummary {
  code: string;
  name: string;
  /** Provisioning | Active | Failed | Suspended */
  status: string;
  isProvisioned: boolean;
  databaseName?: string | null;
  databaseVersion?: number | null;
  /** Last known health status (Healthy/Degraded/Unhealthy/Unknown) — denormalized ([07 §2]). */
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

/** CompanyStatus values — filter dropdown. */
export const TENANT_STATUSES = ['Provisioning', 'Active', 'Failed', 'Suspended'] as const;

/**
 * Model tree node. The list comes from the backend ORDERED depth-first
 * (root → children → grandchildren), so the client does no recursion —
 * indentation is read from `depth`, the ancestor chain from `path`.
 */
export interface TenantModelNode {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  parentName?: string | null;
  /** 1 = root model. */
  depth: number;
  /** Chain from the root to itself, e.g. ["Siparis", "SiparisSatir"]. */
  path: string[];
  columnCount: number;
  version: number;
  /** Draft | Published | Archived | null */
  status?: string | null;
  lastPublishedAt?: string | null;
  createdOn?: string | null;
}

/** Model tree response — list + summary counters. */
export interface TenantModelTree {
  items: TenantModelNode[];
  totalCount: number;
  rootCount: number;
  maxDepth: number;
}

/** Table classification — matches backend Entities.DTOs.Platform.TenantTableKind. */
export type TenantTableKind = 'Published' | 'DeletedModel' | 'System' | 'Unknown';

/** Physical table + size + classification. */
export interface TenantTable {
  name: string;
  rowCount: number;
  /** Total reserved space (bytes) — data + index. */
  totalBytes: number;
  usedBytes: number;
  kind: TenantTableKind;
  /** Model depth for published/deleted model tables. */
  depth?: number | null;
}

/** Table inventory response. */
export interface TenantTables {
  items: TenantTable[];
  databaseName: string;
  totalBytes: number;
  publishedCount: number;
  deletedCount: number;
  systemCount: number;
  unknownCount: number;
}
