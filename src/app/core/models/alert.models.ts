/** Alert Center (M23) models — match backend Entities.DTOs.Platform.AlertDto/AlertRuleDto. */

/** A fired alert — enriched with rule information. */
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
  /** Context at the moment of firing — null for non-api.* rules. */
  details?: AlertDetails | null;
}

/** Alert context: "what happened" — which endpoints failed, which status codes were returned. */
export interface AlertDetails {
  windowStart: string;
  windowEnd: string;
  /** Window actually used (min) — not the rule's nominal value; the rollup rounds to the hour. */
  windowMinutes: number;
  totalRequests: number;
  errorRequests: number;
  routes: AlertRouteStat[];
  statusCodes: AlertStatusStat[];
  sampleCorrelationIds: string[];
  /** false if raw traces were pruned — status/method breakdown comes empty, the route table is still filled. */
  traceDataAvailable: boolean;
}

/** Per-endpoint request/error summary. */
export interface AlertRouteStat {
  route: string;
  method?: string | null;
  count: number;
  errorCount: number;
  errorRatePct: number;
  p95DurationMs: number;
}

/** HTTP status code counter. */
export interface AlertStatusStat {
  statusCode: number;
  count: number;
}

/** Alert rule definition. */
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

/** Alert list status filter — 'open' = Firing + Acknowledged. */
export const ALERT_STATUS_FILTERS = ['open', 'Firing', 'Acknowledged', 'Resolved'] as const;
