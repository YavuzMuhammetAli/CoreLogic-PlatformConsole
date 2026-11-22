/** Health Center (M24) — backend health/tree response. */
export interface HealthComponent {
  name: string;
  category: string;
  /** Healthy | Degraded | Unhealthy | Unknown | NotConfigured (no target — does not affect the overall status) */
  status: string;
  latencyMs: number;
  error?: string | null;
  checkedAt: string;
}

export interface HealthTree {
  overall: string;
  components: HealthComponent[];
}
