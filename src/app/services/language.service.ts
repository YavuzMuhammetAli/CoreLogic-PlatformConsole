import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TRANSLATIONS } from '../i18n';

export type Lang = 'tr' | 'en';

const LANG_KEY = 'pc_lang';

/**
 * Arayüz dili tercihi (TR/EN) — CoreLogicUI LanguageService deseni. Statik UI
 * metinleri `t()` / `| t` pipe ile TRANSLATIONS'tan çözülür; language.interceptor
 * aynı localStorage anahtarını okuyup Accept-Language header'ı ekler.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly lang = signal<Lang>(this.resolveInitial());

  constructor() {
    this.apply(this.lang());
  }

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  private resolveInitial(): Lang {
    if (!isPlatformBrowser(this.platformId)) return 'tr';
    return this.storage?.getItem(LANG_KEY) === 'en' ? 'en' : 'tr';
  }

  private apply(lang: Lang): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.lang = lang;
  }

  toggle(): void {
    const next: Lang = this.lang() === 'tr' ? 'en' : 'tr';
    this.lang.set(next);
    this.storage?.setItem(LANG_KEY, next);
    this.apply(next);
  }

  t(key: string, params?: Record<string, string | number>): string {
    const entry = TRANSLATIONS[key];
    let text = entry ? entry[this.lang()] : key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replaceAll(`{${k}}`, String(v));
      }
    }
    return text;
  }
}
