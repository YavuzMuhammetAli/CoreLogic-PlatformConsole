import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Adds the PlatformBearer access token (from memory) as the Authorization header.
 * If there is no token (anonymous: login/mfa/refresh), no header is added.
 */
export const platformAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(PlatformSessionStore).accessToken();
  if (token) {
    return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
  }
  return next(req);
};
