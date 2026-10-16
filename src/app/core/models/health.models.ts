/** Health Center (M24) — backend health/tree yanıtı. */
export interface HealthComponent {
  name: string;
  category: string;
  /** Healthy | Degraded | Unhealthy | Unknown | NotConfigured (hedef yok — genel durumu etkilemez) */
  status: string;
  latencyMs: number;
  error?: string | null;
  checkedAt: string;
}

export interface HealthTree {
  overall: string;
  components: HealthComponent[];
}
