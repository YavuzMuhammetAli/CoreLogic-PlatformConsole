/** Feature Flags (M39) modelleri — backend Entities.DTOs.Platform.FeatureFlagDto ile eşleşir. */

export interface FeatureFlagOverrideItem {
  tenantId: string;
  state: string; // On | Off
  reason?: string | null;
  expiresAt?: string | null;
}

export interface FeatureFlagItem {
  id: number;
  key: string;
  description?: string | null;
  defaultState: string; // On | Off | Percentage
  percentage: number;
  removeBy?: string | null;
  updatedAt: string;
  /** Kaldırma tarihi geçmiş "geçici" flag — ölü flag disiplini. */
  isStale: boolean;
  overrides: FeatureFlagOverrideItem[];
}

export const FLAG_STATES = ['On', 'Off', 'Percentage'] as const;
