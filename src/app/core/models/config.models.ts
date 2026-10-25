/** Platform config (M41) — backend PlatformConfigDto ile eşleşir (secret'lar maskeli). */
export interface PlatformConfigItem {
  key: string;
  value?: string | null;
  isSecret: boolean;
  updatedAt: string;
  /** Değer boşken geçerli varsayılan (şimdilik yalnız cost.unit.* birim maliyetleri). */
  defaultValue?: string | null;
  /** Veritabanında satırı yok — varsayılan geçiyor; kaydedilince satır açılır. */
  isDefault?: boolean;
}
