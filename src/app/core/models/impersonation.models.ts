/** Support & Impersonation (M17) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface ImpersonationGrantItem {
  id: string;
  platformUserId: number;
  tenantId: string;
  targetUserId?: number | null;
  reason: string;
  requestedAt: string;
  approvedBy?: number | null;
  approvedAt?: string | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  status: string; // Requested | Approved | ActiveUse | Expired | Revoked | Denied
}

export interface ImpersonationToken {
  token: string;
  expiration: string;
  tenantId: string;
  targetUserId?: number | null;
}
