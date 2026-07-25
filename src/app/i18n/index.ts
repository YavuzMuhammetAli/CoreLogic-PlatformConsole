import { Translations } from './translations.model';
import { PLATFORM_I18N } from './platform.i18n';

/**
 * Tüm çeviri sözlüklerinin birleşimi. Yeni bir alan çevrildiğinde burada bir
 * `*.i18n.ts` import'u eklenip spread edilir; anahtarlar 'pc.*' ön ekiyle benzersiz olur.
 */
export const TRANSLATIONS: Translations = {
  ...PLATFORM_I18N
};

export type { TranslationEntry, Translations } from './translations.model';
