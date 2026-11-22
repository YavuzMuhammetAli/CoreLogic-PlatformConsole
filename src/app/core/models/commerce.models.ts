/** Commercial layer (M35/M36/M12) models — match backend Entities.DTOs.Platform. */

export interface PlanFeatureItem {
  featureKey: string;
  /** null = bool feature (enabled); set = numeric quota. */
  limitValue?: number | null;
  unit?: string | null;
}

export interface PlanItem {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: string; // Draft | Active | Retired
  version: number;
  isPublic: boolean;
  /** Plan assigned automatically when a new tenant is provisioned (only one at a time). */
  isDefaultForNewTenants: boolean;
  /** Length of the Trial window in days for automatic/manual assignment. */
  trialDays: number;
  features: PlanFeatureItem[];
}

/**
 * Metric catalog row — `GET metric-catalog` (backend `MetricCatalog`). The key, order and display
 * name of plan features and usage/cost metrics are kept only there; the console keeps
 * no list or translations (see `MetricCatalogService`).
 */
export interface MetricCatalogItem {
  key: string;
  order: number;
  kind: 'flag' | 'quota' | 'metric';
  isPlanFeature: boolean;
  defaultUnit?: string | null;
  /** Display name in the request's language. */
  label: string;
}

export interface MetricCatalog {
  metrics: MetricCatalogItem[];
  units: { unit: string; label: string }[];
}

export const PLAN_STATUSES = ['Draft', 'Active', 'Retired'] as const;

export interface SubscriptionItem {
  id: number;
  companyId: number;
  companyCode: string;
  companyName: string;
  planCode: string;
  status: string; // Trial | Active | PastDue | Suspended | Cancelled | Expired
  seats: number;
  startsAt: string;
  endsAt?: string | null;
  trialEndsAt?: string | null;
  graceUntil?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
}

export interface EntitlementSnapshot {
  tenantId: string;
  planCode?: string | null;
  subscriptionStatus: string;
  seats: number;
  entitled: boolean;
  /** featureKey → limit (null = bool feature enabled). */
  features: Record<string, number | null>;
}

export const SUBSCRIPTION_STATUSES =
  ['Trial', 'Active', 'PastDue', 'Suspended', 'Cancelled', 'Expired'] as const;
