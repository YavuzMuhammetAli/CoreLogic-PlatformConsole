import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'pc_theme';

/**
 * Light/dark theme preference (localStorage). data-theme is set on the root element; the initial value
 * is already applied by the early script in index.html (prevents a flash).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly theme = signal<Theme>(this.resolveInitial());

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  private resolveInitial(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    const stored = this.storage?.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.storage?.setItem(THEME_KEY, next);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', next);
    }
  }
}
