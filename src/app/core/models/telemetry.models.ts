/** API Monitoring (M27) — backend RequestTraceDto ile eşleşir. */
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

/** API Monitoring metrik özeti (rollup) — backend RouteMetricDto. */
export interface RouteMetric {
  route: string;
  count: number;
  errorCount: number;
  errorRatePct: number;
  p95DurationMs: number;
}
