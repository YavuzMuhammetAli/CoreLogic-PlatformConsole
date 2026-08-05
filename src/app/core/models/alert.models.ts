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
  /** Tetiklenme anındaki bağlam — api.* dışı kurallarda null. */
  details?: AlertDetails | null;
}

/** Uyarı bağlamı: "ne oldu" — hangi endpoint'ler hata verdi, hangi status kodları döndü. */
export interface AlertDetails {
  windowStart: string;
  windowEnd: string;
  /** Fiilen kullanılan pencere (dk) — kuralın nominal değeri değil, rollup saat başına yuvarlar. */
  windowMinutes: number;
  totalRequests: number;
  errorRequests: number;
  routes: AlertRouteStat[];
  statusCodes: AlertStatusStat[];
  sampleCorrelationIds: string[];
  /** Ham izler budanmışsa false — status/method kırılımı boş gelir, route tablosu yine dolu. */
  traceDataAvailable: boolean;
}

/** Endpoint bazlı istek/hata özeti. */
export interface AlertRouteStat {
  route: string;
  method?: string | null;
  count: number;
  errorCount: number;
  errorRatePct: number;
  p95DurationMs: number;
}

/** HTTP durum kodu sayacı. */
export interface AlertStatusStat {
  statusCode: number;
  count: number;
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
