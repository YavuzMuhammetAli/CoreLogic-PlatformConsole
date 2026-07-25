/** Notification Center (M25) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

export interface NotificationItem {
  id: number;
  ruleId?: number | null;
  severity: string;
  title: string;
  body?: string | null;
  channel: string;
  deliveryStatus: string;
  createdAt: string;
  readAt?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export interface NotificationRuleItem {
  id: number;
  name: string;
  triggerType: string;   // Alert | Event
  triggerFilter?: string | null;
  channelType: string;   // InApp | Email | Webhook
  targets?: string | null;
  throttleMinutes: number;
  enabled: boolean;
}
