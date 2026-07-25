import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { PlatformAuthService } from '../auth/platform-auth.service';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Hata yönetimi:
 * - 401 (auth uçları hariç): refresh dene → başarılıysa isteği tekrar et,
 *   değilse oturumu temizle ve /login'e yönlendir ([11 §4]).
 * - 403: yetki yetersiz — kullanıcıyı Overview'a al (oturum geçerli).
 * Not: bu interceptor platformAuth'tan ÖNCE kayıtlıdır; retry'da next(req)
 * platformAuth'u yeniden çalıştırıp taze token ekler.
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
              return next(req); // platformAuth taze token ekler
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
