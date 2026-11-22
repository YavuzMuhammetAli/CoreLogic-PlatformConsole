/** Feature Flags (M39) models — match backend Entities.DTOs.Platform.FeatureFlagDto. */

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
  /** A "temporary" flag past its removal date — dead-flag discipline. */
  isStale: boolean;
  overrides: FeatureFlagOverrideItem[];
}

export const FLAG_STATES = ['On', 'Off', 'Percentage'] as const;
