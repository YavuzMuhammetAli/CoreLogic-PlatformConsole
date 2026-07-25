/** Health Center (M24) — backend health/tree yanıtı. */
export interface HealthComponent {
  name: string;
  category: string;
  status: string; // Healthy | Degraded | Unhealthy | Unknown
  latencyMs: number;
  error?: string | null;
  checkedAt: string;
}

export interface HealthTree {
  overall: string;
  components: HealthComponent[];
}
