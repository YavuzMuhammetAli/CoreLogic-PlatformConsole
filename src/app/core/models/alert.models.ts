/** Alert Center (M23) modelleri — backend Entities.DTOs.Platform.AlertDto/AlertRuleDto ile eşleşir. */

/** Tetiklenmiş uyarı — kural bilgisiyle zenginleştirilmiş. */
export interface AlertItem {
  id: number;
  ruleId: number;
  ruleName: string;
  metricKey: string;
  /** Info | Warning | Critical */
  severity: string;
  runbookUrl?: string | null;
  firedAt: string;
  value: number;
  threshold: number;
  tenantId?: string | null;
  target?: string | null;
  /** Firing | Acknowledged | Resolved */
  status: string;
  ackedBy?: number | null;
  ackedAt?: string | null;
  resolvedAt?: string | null;
  correlationId?: string | null;
}

/** Uyarı kuralı tanımı. */
export interface AlertRuleItem {
  id: number;
  name: string;
  metricKey: string;
  scope: string;
  condition: string;
  threshold: number;
  windowMinutes: number;
  severity: string;
  cooldownMinutes: number;
  runbookUrl?: string | null;
  enabled: boolean;
  createdAt: string;
}

/** Uyarı listesi durum filtresi — 'open' = Firing + Acknowledged. */
export const ALERT_STATUS_FILTERS = ['open', 'Firing', 'Acknowledged', 'Resolved'] as const;
