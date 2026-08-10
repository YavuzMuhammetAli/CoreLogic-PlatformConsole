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
  /** Yeni tenant provision edilirken otomatik atanan plan (aynı anda tek olabilir). */
  isDefaultForNewTenants: boolean;
  /** Otomatik/elle atamada Trial penceresinin gün sayısı. */
  trialDays: number;
  features: PlanFeatureItem[];
}

/**
 * Kapalı özellik kataloğu — backend `Entities.Concrete.Master.FeatureKeys` ile birebir.
 * PlanManager katalog dışı anahtarı reddeder, bu yüzden UI serbest metin sunmaz.
 */
export const FEATURE_KEYS = [
  'max_users', 'max_models', 'max_storage_gb', 'api_requests_per_day',
  'ai_tokens_per_month', 'feature_reports', 'feature_api_access'
] as const;

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
  /** featureKey → limit (null = bool özellik açık). */
  features: Record<string, number | null>;
}

export const SUBSCRIPTION_STATUSES =
  ['Trial', 'Active', 'PastDue', 'Suspended', 'Cancelled', 'Expired'] as const;
