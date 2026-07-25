/** Platform config (M41) — backend PlatformConfigDto ile eşleşir (secret'lar maskeli). */
export interface PlatformConfigItem {
  key: string;
  value?: string | null;
  isSecret: boolean;
  updatedAt: string;
}
