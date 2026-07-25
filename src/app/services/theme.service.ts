import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'pc_theme';

/**
 * Açık/koyu tema tercihi (localStorage). data-theme kök öğeye basılır; ilk değer
 * index.html'deki erken script tarafından zaten uygulanır (flash önleme).
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
