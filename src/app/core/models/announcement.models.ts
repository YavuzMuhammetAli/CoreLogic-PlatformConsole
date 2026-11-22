/** Announcements & Status (M26) + DB server (multi-region seed) models. */

export interface AnnouncementItem {
  id: number;
  title: string;
  body?: string | null;
  severity: string;   // Info | Maintenance | Incident
  audienceScope?: string | null;
  publishAt?: string | null;
  expiresAt?: string | null;
  status: string;     // Draft | Published | Expired
  createdAt: string;
}

export interface DatabaseServerItem {
  id: number;
  name: string;
  hostName: string;
  region: string;
  status: string;
  maxTenants: number;
  currentTenants: number;
}

export const ANNOUNCEMENT_SEVERITIES = ['Info', 'Maintenance', 'Incident'] as const;
