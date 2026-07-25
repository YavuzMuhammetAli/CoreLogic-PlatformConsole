import { Injectable, computed, signal } from '@angular/core';
import { PlatformAuthResult, PlatformUserInfo } from '../models/platform.models';

/**
 * Platform oturum durumu (signal store) — [11 §4].
 *
 * Access token BELLEKTE tutulur (localStorage'a yazılmaz): XSS'te sızmasın.
 * Refresh token güvenli storage'da (skeleton'da localStorage; ileri fazda
 * httpOnly cookie hedeflenir). Sayfa yenilemesinde access bellekten silinir;
 * APP_INITIALIZER refresh ile yeni access + kullanıcı yükler.
 */
@Injectable({ providedIn: 'root' })
export class PlatformSessionStore {
  private static readonly REFRESH_KEY = 'pc_refresh';

  readonly accessToken = signal<string | null>(null);
  readonly user = signal<PlatformUserInfo | null>(null);

  readonly capabilities = computed(() => new Set(this.user()?.capabilities ?? []));
  readonly isAuthenticated = computed(() => !!this.accessToken() && !!this.user());

  setSession(auth: PlatformAuthResult): void {
    this.accessToken.set(auth.accessToken);
    this.user.set(auth.user);
    this.writeRefreshToken(auth.refreshToken);
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

  getRefreshToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(PlatformSessionStore.REFRESH_KEY);
  }

  private writeRefreshToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PlatformSessionStore.REFRESH_KEY, token);
    }
  }

  clear(): void {
    this.accessToken.set(null);
    this.user.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(PlatformSessionStore.REFRESH_KEY);
    }
  }
}
