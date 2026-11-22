/** Security Center (M18/M19) models — match backend Entities.DTOs.Platform. */

export interface LoginAttemptItem {
  id: number;
  scope: string;
  email?: string | null;
  tenantId?: string | null;
  success: boolean;
  failureReason?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  occurredAt: string;
}

export interface SecurityEventItem {
  id: number;
  type: string;
  severity: string;
  tenantId?: string | null;
  subjectType?: string | null;
  subjectId?: string | null;
  detailsJson?: string | null;
  occurredAt: string;
  status: string;
  reviewedAt?: string | null;
}

export interface IpAccessRuleItem {
  id: number;
  scope: string;
  tenantId?: string | null;
  cidr: string;
  action: string;
  reason?: string | null;
  expiresAt?: string | null;
  createdDate: string;
}
