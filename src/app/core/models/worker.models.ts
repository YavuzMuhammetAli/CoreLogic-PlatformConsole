/** Worker kontrol düzlemi (migrasyon 025) modelleri — backend Entities.DTOs.Platform ile eşleşir. */

/**
 * Durum SUNUCUDA türetilir (WorkerControlManager.DeriveStatus); istemci yalnız
 * gösterir. Kuralın burada tekrarlanması iki tarafın ıraksamasına yol açardı.
 */
export type WorkerRunState = 'Running' | 'Disabled' | 'Stale' | 'Error';

export interface WorkerStatus {
  name: string;
  enabled: boolean;
  /** Kapatılması platformun tamamını etkiler — onay istenir. */
  isCritical: boolean;
  /** Kapatmanın somut sonucu (onay diyaloğu metni, sunucudan gelir). */
  impact: string;
  /** null = koddaki varsayılan kullanılıyor (operatör override etmemiş). */
  intervalSeconds: number | null;
  defaultIntervalSeconds: number;
  effectiveIntervalSeconds: number;
  status: WorkerRunState;
  /** Döngünün son yaşam sinyali — "ayakta mıyım". */
  lastHeartbeatAt?: string | null;
  /** Son gerçek iş — heartbeat'ten ayrı: 24 saatlik worker gün boyu iş yapmaz. */
  lastRunAt?: string | null;
  lastError?: string | null;
  lastErrorAt?: string | null;
  lastOwner?: string | null;
  restartRequestedAt?: string | null;
}

export interface UpdateWorkerRequest {
  enabled: boolean;
  /** null gönderilirse override kaldırılır ve kod varsayılanına dönülür. */
  intervalSeconds: number | null;
  /** Kritik worker KAPATILIRKEN zorunlu. */
  confirm: boolean;
}
