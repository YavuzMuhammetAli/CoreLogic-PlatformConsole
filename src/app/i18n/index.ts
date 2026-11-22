import { Translations } from './translations.model';
import { PLATFORM_I18N } from './platform.i18n';
import { HELP_I18N } from './help.i18n';
import { ENUM_I18N } from './enum.i18n';

/**
 * The union of all translation dictionaries. When a new area is translated, a
 * `*.i18n.ts` import is added here and spread; keys are kept unique with the 'pc.*' prefix.
 */
export const TRANSLATIONS: Translations = {
  ...PLATFORM_I18N,
  ...HELP_I18N,
  ...ENUM_I18N
};

export type { TranslationEntry, Translations } from './translations.model';
