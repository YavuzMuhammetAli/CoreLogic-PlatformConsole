import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { PlatformAuthService } from '../auth/platform-auth.service';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Error handling:
 * - 401 (except auth endpoints): try refresh → if it succeeds, retry the request,
 *   otherwise clear the session and redirect to /login ([11 §4]).
 * - 403: insufficient permission — send the user to Overview (session is still valid).
 * Note: this interceptor is registered BEFORE platformAuth; on retry next(req)
 * runs platformAuth again, which attaches the fresh token.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(PlatformAuthService);
  const store = inject(PlatformSessionStore);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/auth/');

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isAuthEndpoint) {
        return auth.refresh().pipe(
          switchMap(ok => {
            if (ok) {
              return next(req); // platformAuth attaches the fresh token
            }
            store.clear();
            router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
            return throwError(() => err);
          })
        );
      }

      if (err.status === 403) {
        router.navigate(['/overview']);
      }

      return throwError(() => err);
    })
  );
};
