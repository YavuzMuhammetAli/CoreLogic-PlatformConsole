import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataResponseModel } from '../core/models/api.models';
import { MetricCatalog, MetricCatalogItem } from '../core/models/commerce.models';
import { LanguageService } from './language.service';

/**
 * Plan feature / usage metric catalog — `GET metric-catalog`.
 *
 * The key list, its order and display names live in ONE place, the backend `MetricCatalog`;
 * the label is chosen on the server in the request's language (Accept-Language). Previously the
 * console kept its own `FEATURE_KEYS` list and `pc.feature.*` translations, and the tenant UI a separate
 * list — the three had drifted apart. The catalog is re-requested when the language changes.
 *
 * Since the label functions read signals, templates refresh by themselves when the catalog
 * arrives; until then (or for an unrecognized key) the raw key is shown.
 */
@Injectable({ providedIn: 'root' })
export class MetricCatalogService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  private readonly metrics = signal<MetricCatalogItem[]>([]);
  private readonly units = signal<ReadonlyMap<string, string>>(new Map());
  private readonly byKey = computed(() => new Map(this.metrics().map(m => [m.key, m])));

  /** Keys that can be written to a plan, in catalog order (the selector on the plan detail). */
  readonly planFeatures = computed(() => this.metrics().filter(m => m.isPlanFeature));

  constructor() {
    effect(() => {
      this.language.lang();
      untracked(() => this.load());
    });
  }

  /** Display name; the key itself if the catalog has not arrived yet or the key is unrecognized. */
  label(key: string): string {
    return this.byKey().get(key)?.label ?? key;
  }

  /** Display name of the unit (e.g. tokens → token); an unrecognized unit is returned as is. */
  unitLabel(unit: string): string {
    return this.units().get(unit) ?? unit;
  }

  private load(): void {
    this.http.get<DataResponseModel<MetricCatalog>>(`${environment.platformApiBaseUrl}/metric-catalog`)
      .subscribe({
        next: res => {
          if (!res.success || !res.data) return;
          this.metrics.set([...res.data.metrics].sort((a, b) => a.order - b.order));
          this.units.set(new Map(res.data.units.map(u => [u.unit, u.label])));
        },
        // Labels are auxiliary data: if they cannot be fetched, the screen keeps working with raw keys.
        error: () => {}
      });
  }
}
