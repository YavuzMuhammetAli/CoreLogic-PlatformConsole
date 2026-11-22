import { Injectable, computed, signal } from '@angular/core';
import { PlatformAuthResult, PlatformUserInfo } from '../models/platform.models';

/**
 * Platform session state (signal store) — [11 §4].
 *
 * The access token is kept IN MEMORY (never written to localStorage) so it cannot leak via XSS.
 * The refresh token lives in an HttpOnly cookie that JavaScript cannot see. On page reload
 * the access token is wiped from memory; APP_INITIALIZER loads a new access token + user via refresh.
 */
@Injectable({ providedIn: 'root' })
export class PlatformSessionStore {
  readonly accessToken = signal<string | null>(null);
  readonly user = signal<PlatformUserInfo | null>(null);

  readonly capabilities = computed(() => new Set(this.user()?.capabilities ?? []));
  readonly isAuthenticated = computed(() => !!this.accessToken() && !!this.user());

  constructor() {
    // Refresh token from the pre-cookie version: no longer read, so don't leave it in the browser.
    if (typeof localStorage !== 'undefined') localStorage.removeItem('pc_refresh');
  }

  setSession(auth: PlatformAuthResult): void {
    this.accessToken.set(auth.accessToken);
    this.user.set(auth.user);
  }

  setUser(user: PlatformUserInfo | null): void {
    this.user.set(user);
  }

  has(capability: string): boolean {
    return this.capabilities().has(capability);
  }

  hasAny(capabilities: string[]): boolean {
    const set = this.capabilities();
    return capabilities.some(c => set.has(c));
  }

  clear(): void {
    this.accessToken.set(null);
    this.user.set(null);
  }
}
