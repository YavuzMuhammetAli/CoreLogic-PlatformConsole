import { Injectable, computed, signal } from '@angular/core';
import { PlatformAuthResult, PlatformUserInfo } from '../models/platform.models';

/**
 * Platform oturum durumu (signal store) — [11 §4].
 *
 * Access token BELLEKTE tutulur (localStorage'a yazılmaz): XSS'te sızmasın.
 * Refresh token HttpOnly çerezdedir, JavaScript onu görmez. Sayfa yenilemesinde
 * access bellekten silinir; APP_INITIALIZER refresh ile yeni access + kullanıcı yükler.
 */
@Injectable({ providedIn: 'root' })
export class PlatformSessionStore {
  readonly accessToken = signal<string | null>(null);
  readonly user = signal<PlatformUserInfo | null>(null);

  readonly capabilities = computed(() => new Set(this.user()?.capabilities ?? []));
  readonly isAuthenticated = computed(() => !!this.accessToken() && !!this.user());

  constructor() {
    // Çerez öncesi sürümün refresh token'ı: artık okunmuyor, tarayıcıda kalmasın.
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
