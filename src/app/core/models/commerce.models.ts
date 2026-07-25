/** Ticari katman (M35/M36/M12) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface PlanFeatureItem {
  featureKey: string;
  /** null = bool özellik (açık); dolu = sayısal kota. */
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
  features: PlanFeatureItem[];
}

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
  /** featureKey → limit (null = bool özellik açık). */
  features: Record<string, number | null>;
}

export const SUBSCRIPTION_STATUSES =
  ['Trial', 'Active', 'PastDue', 'Suspended', 'Cancelled', 'Expired'] as const;
