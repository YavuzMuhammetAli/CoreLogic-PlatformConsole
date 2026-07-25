/** Compliance & Data (M42) modeli — backend Entities.DTOs.Platform.ComplianceRequestDto ile eşleşir. */
export interface ComplianceRequestItem {
  id: number;
  type: string;      // DSAR | Erasure | Offboarding | RetentionReview
  tenantId: string;
  subjectRef?: string | null;
  reason?: string | null;
  status: string;    // Open | InProgress | Completed | Rejected
  requestedAt: string;
  completedAt?: string | null;
  notes?: string | null;
}

export const COMPLIANCE_TYPES = ['DSAR', 'Erasure', 'Offboarding', 'RetentionReview'] as const;
