import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformSessionStore } from '../auth/platform-session.store';

/**
 * Yetenek-bazlı route koruması ([05 §3], [11 §8]). Kullanıcı verilen
 * yeteneklerden en az birine sahip değilse Overview'a yönlendirir.
 * Menü de aynı yetenek listesinden çizilir — kör kapı yok. (Backend policy'si
 * ayrıca zorlar; bu yalnızca UX.)
 *
 * Kullanım: canActivate: [platformAuthGuard, capabilityGuard(Cap.IamManage)]
 */
export function capabilityGuard(...required: string[]): CanActivateFn {
  return () => {
    const store = inject(PlatformSessionStore);
    const router = inject(Router);
    if (!store.isAuthenticated()) return router.createUrlTree(['/login']);
    return store.hasAny(required) ? true : router.createUrlTree(['/overview']);
  };
}
