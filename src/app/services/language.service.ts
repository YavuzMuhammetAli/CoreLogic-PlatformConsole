import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TRANSLATIONS } from '../i18n';

export type Lang = 'tr' | 'en';

const LANG_KEY = 'pc_lang';

/**
 * UI language preference (TR/EN) — CoreLogicUI LanguageService pattern. Static UI
 * texts are resolved from TRANSLATIONS via `t()` / the `| t` pipe; language.interceptor
 * reads the same localStorage key and adds the Accept-Language header.
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

  /** Returns `fallback` if the key is not in the dictionary — so the raw key text never shows on screen. */
  tOr(key: string, fallback: string): string {
    return TRANSLATIONS[key] ? this.t(key) : fallback;
  }

  // Display names of values that come from the server as fixed English constants. An unrecognized
  // (later added) value shows in its raw form; coverage is checked by scripts/check-i18n.js.

  /** Status / severity / result / type constant, e.g. 'Active' → 'Aktif' (`pc.enum.*`). */
  enumLabel(value: string): string {
    return this.tOr(`pc.enum.${value}`, value);
  }

  // Plan feature / metric names and units are NOT here: see MetricCatalogService (from the server).
}
