/** Platform config (M41) — matches backend PlatformConfigDto (secrets are masked). */
export interface PlatformConfigItem {
  key: string;
  value?: string | null;
  isSecret: boolean;
  updatedAt: string;
  /** Default in effect when the value is empty (for now only cost.unit.* unit costs). */
  defaultValue?: string | null;
  /** No row in the database — the default applies; a row is created on save. */
  isDefault?: boolean;
}
