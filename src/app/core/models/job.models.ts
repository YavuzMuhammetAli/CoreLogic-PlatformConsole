/** Jobs & Queue (M21) models — match backend Entities.DTOs.Platform.JobSummaryDto. */

export interface JobSummary {
  id: string;
  type: string;
  /** Pending | Running | Succeeded | Failed | Parked | Cancelled */
  status: string;
  priority: number;
  attemptCount: number;
  maxAttempts: number;
  lastError?: string | null;
  tenantId?: string | null;
  correlationId?: string | null;
  runAfter: string;
  createdDate: string;
  completedAt?: string | null;
}

export const JOB_STATUSES = ['Pending', 'Running', 'Succeeded', 'Failed', 'Parked', 'Cancelled'] as const;
