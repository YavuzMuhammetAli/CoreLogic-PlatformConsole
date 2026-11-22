/** Worker control plane (migration 025) models — match backend Entities.DTOs.Platform. */

/**
 * The status is derived ON THE SERVER (WorkerControlManager.DeriveStatus); the client only
 * displays it. Repeating the rule here would let the two sides diverge.
 */
export type WorkerRunState = 'Running' | 'Disabled' | 'Stale' | 'Error';

export interface WorkerStatus {
  name: string;
  enabled: boolean;
  /** Disabling it affects the whole platform — confirmation is required. */
  isCritical: boolean;
  /** Concrete consequence of disabling (confirmation dialog text, comes from the server). */
  impact: string;
  /** null = the default in code is used (the operator has not overridden it). */
  intervalSeconds: number | null;
  defaultIntervalSeconds: number;
  effectiveIntervalSeconds: number;
  status: WorkerRunState;
  /** The loop's last liveness signal — "am I alive". */
  lastHeartbeatAt?: string | null;
  /** Last actual work — separate from the heartbeat: a 24-hour worker does no work most of the day. */
  lastRunAt?: string | null;
  lastError?: string | null;
  lastErrorAt?: string | null;
  lastOwner?: string | null;
  restartRequestedAt?: string | null;
}

export interface UpdateWorkerRequest {
  enabled: boolean;
  /** If null is sent, the override is removed and the code default is restored. */
  intervalSeconds: number | null;
  /** Required when DISABLING a critical worker. */
  confirm: boolean;
}
