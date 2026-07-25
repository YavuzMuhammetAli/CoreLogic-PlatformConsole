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
