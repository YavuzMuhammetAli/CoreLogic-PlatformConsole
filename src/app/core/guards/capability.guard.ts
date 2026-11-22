import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Capability-based route guard ([05 §3], [11 §8]). Redirects to Overview if the user
 * has none of the given capabilities.
 * The menu is drawn from the same capability list — no dead-end doors. (The backend policy
 * enforces it separately; this is UX only.)
 *
 * Usage: canActivate: [platformAuthGuard, capabilityGuard(Cap.IamManage)]
 */
export function capabilityGuard(...required: string[]): CanActivateFn {
  return () => {
    const store = inject(PlatformSessionStore);
    const router = inject(Router);
    if (!store.isAuthenticated()) return router.createUrlTree(['/login']);
    return store.hasAny(required) ? true : router.createUrlTree(['/overview']);
  };
}
