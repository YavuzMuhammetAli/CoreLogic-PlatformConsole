import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Oturum açık mı? APP_INITIALIZER refresh'i router etkinleşmeden önce
 * çalıştığından, buraya gelindiğinde store dolu ya da boştur (yarış yok).
 * Boşsa /login'e yönlendirir.
 */
export const platformAuthGuard: CanActivateFn = () => {
  const store = inject(PlatformSessionStore);
  const router = inject(Router);
  return store.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
