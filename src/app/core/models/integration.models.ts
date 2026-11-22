/** Integration Center (M40) models — match backend Entities.DTOs.Platform. */

export interface WebhookItem {
  id: number;
  name: string;
  url: string;
  eventTypes?: string | null;
  enabled: boolean;
  failureCount: number;
  disabledAt?: string | null;
  createdAt: string;
}

export interface WebhookDeliveryItem {
  id: number;
  webhookId: number;
  eventType: string;
  status: string; // Pending | Delivered | Failed
  attemptCount: number;
  responseCode?: number | null;
  error?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
}

export interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  scopes?: string | null;
  enabled: boolean;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}
