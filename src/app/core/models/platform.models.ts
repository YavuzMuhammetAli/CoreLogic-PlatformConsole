/** Platform (control plane) API modelleri — backend Entities.DTOs.Platform ile eşleşir. */

/** /auth/me ve auth sonuçlarındaki kullanıcı özeti. */
export interface PlatformUserInfo {
  id: number;
  email: string;
  name: string;
  roles: string[];
  capabilities: string[];
}

/** POST /auth/login yanıtı — MFA adımına yönlendirir. */
export interface PlatformLoginResult {
  /** 'mfa_required' | 'mfa_enroll'. */
  status: string;
  challengeToken: string;
  /** Yalnızca mfa_enroll. */
  mfaSecret?: string | null;
  otpAuthUri?: string | null;
}

/** Başarılı kimlik doğrulama — access + refresh + kullanıcı. */
export interface PlatformAuthResult {
  accessToken: string;
  accessTokenExpiration: string;
  refreshToken: string;
  user: PlatformUserInfo;
}

/** GET /platform-users öğesi. */
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
 * GET /platform-users/roles öğesi — rol → yetenek eşlemesi.
 * Matris backend'de derlenmiş sabittir (`PlatformCapabilities.RoleMatrix`);
 * konsol onu KOPYALAMAZ, bu uçtan okur — kopya sessizce bayatlardı.
 */
export interface PlatformRoleInfo {
  role: string;
  capabilities: string[];
}

/** GET /audit-logs öğesi (PlatformAuditLog, camelCase). */
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
