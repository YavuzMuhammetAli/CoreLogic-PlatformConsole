import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * PlatformBearer access token'ını (bellekten) Authorization header'ı olarak ekler.
 * Token yoksa (anonim: login/mfa/refresh) header eklenmez.
 */
export const platformAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(PlatformSessionStore).accessToken();
  if (token) {
    return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
  }
  return next(req);
};
