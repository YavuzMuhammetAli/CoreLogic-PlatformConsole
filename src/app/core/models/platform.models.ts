/** Platform (control plane) API models — match backend Entities.DTOs.Platform. */

/** User summary in /auth/me and auth results. */
export interface PlatformUserInfo {
  id: number;
  email: string;
  name: string;
  roles: string[];
  capabilities: string[];
}

/** POST /auth/login response — directs to the MFA step. */
export interface PlatformLoginResult {
  /** 'mfa_required' | 'mfa_enroll'. */
  status: string;
  challengeToken: string;
  /** Only for mfa_enroll. */
  mfaSecret?: string | null;
  otpAuthUri?: string | null;
}

/** Successful authentication — access token + user. The refresh token is in an HttpOnly cookie. */
export interface PlatformAuthResult {
  accessToken: string;
  accessTokenExpiration: string;
  user: PlatformUserInfo;
}

/** GET /platform-users item. */
export interface PlatformUserListItem {
  id: number;
  email: string;
  name?: string | null;
  surname?: string | null;
  active: boolean;
  mfaEnrolled: boolean;
  lastLoginAt?: string | null;
  roles: string[];
}

/**
 * GET /platform-users/roles item — role → capability mapping.
 * The matrix is a compiled constant in the backend (`PlatformCapabilities.RoleMatrix`);
 * the console does NOT COPY it but reads it from this endpoint — a copy would silently go stale.
 */
export interface PlatformRoleInfo {
  role: string;
  capabilities: string[];
}

/** GET /audit-logs item (PlatformAuditLog, camelCase). */
export interface PlatformAuditLogItem {
  id: number;
  occurredAt: string;
  actorType: string;
  actorId?: number | null;
  actorName?: string | null;
  actorIp?: string | null;
  category: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  tenantId?: string | null;
  correlationId?: string | null;
  detailsJson?: string | null;
  result: string;
  severity: string;
}

export const LOGIN_STATUS_MFA_REQUIRED = 'mfa_required';
export const LOGIN_STATUS_MFA_ENROLL = 'mfa_enroll';
