import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Is there an active session? Since the APP_INITIALIZER refresh runs before the
 * router activates, the store is either filled or empty by the time we get here (no race).
 * Redirects to /login if empty.
 */
export const platformAuthGuard: CanActivateFn = () => {
  const store = inject(PlatformSessionStore);
  const router = inject(Router);
  return store.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
