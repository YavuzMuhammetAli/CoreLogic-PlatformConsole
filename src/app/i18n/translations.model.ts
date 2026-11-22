/** The TR/EN text pair of a single translation key. */
export interface TranslationEntry {
  tr: string;
  en: string;
}

/** Dictionary of key → TR/EN text pair. */
export type Translations = Record<string, TranslationEntry>;
