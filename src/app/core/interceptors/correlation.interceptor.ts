import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Adds a W3C 'traceparent' header to every request ([04 §3]). The backend CorrelationMiddleware
 * uses the trace-id as correlationId; audit/log/telemetry are chained by this ID.
 * Format: 00-<32 hex trace-id>-<16 hex span-id>-01
 */
export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const traceparent = `00-${randomHex(32)}-${randomHex(16)}-01`;
  return next(req.clone({ headers: req.headers.set('traceparent', traceparent) }));
};

function randomHex(length: number): string {
  const bytes = new Uint8Array(length / 2);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
