/** API Monitoring (M27) — matches backend RequestTraceDto. */
export interface RequestTrace {
  timestamp: string;
  tenantId?: string | null;
  userId?: number | null;
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
  bytesOut: number;
  ip?: string | null;
  correlationId?: string | null;
}

/** API Monitoring metric summary (rollup) — backend RouteMetricDto. */
export interface RouteMetric {
  route: string;
  count: number;
  errorCount: number;
  errorRatePct: number;
  p95DurationMs: number;
}
