/** Tek bir çeviri anahtarının TR/EN metin çifti. */
export interface TranslationEntry {
  tr: string;
  en: string;
}

/** Anahtar → TR/EN metin çifti sözlüğü. */
export type Translations = Record<string, TranslationEntry>;
