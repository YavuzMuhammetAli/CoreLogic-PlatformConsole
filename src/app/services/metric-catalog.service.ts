import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataResponseModel } from '../core/models/api.models';
import { MetricCatalog, MetricCatalogItem } from '../core/models/commerce.models';
import { LanguageService } from './language.service';

/**
 * Plan özelliği / kullanım metriği kataloğu — `GET metric-catalog`.
 *
 * Anahtar listesi, sırası ve görünen adları backend `MetricCatalog`'da TEK yerde durur;
 * etiket isteğin dilinde (Accept-Language) sunucuda seçilir. Önceden konsol kendi
 * `FEATURE_KEYS` listesini ve `pc.feature.*` çevirilerini tutuyordu, tenant arayüzü de ayrı
 * bir liste — üçü kaymıştı. Dil değişince katalog yeniden istenir.
 *
 * Etiket fonksiyonları sinyal okuduğundan katalog geldiğinde şablonlar kendiliğinden
 * yenilenir; o ana dek (ya da tanınmayan anahtarda) ham anahtar görünür.
 */
@Injectable({ providedIn: 'root' })
export class MetricCatalogService {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  private readonly metrics = signal<MetricCatalogItem[]>([]);
  private readonly units = signal<ReadonlyMap<string, string>>(new Map());
  private readonly byKey = computed(() => new Map(this.metrics().map(m => [m.key, m])));

  /** Plana yazılabilen anahtarlar, katalog sırasıyla (plan detayındaki seçici). */
  readonly planFeatures = computed(() => this.metrics().filter(m => m.isPlanFeature));

  constructor() {
    effect(() => {
      this.language.lang();
      untracked(() => this.load());
    });
  }

  /** Görünen ad; katalog henüz gelmediyse ya da anahtar tanınmıyorsa anahtarın kendisi. */
  label(key: string): string {
    return this.byKey().get(key)?.label ?? key;
  }

  /** Birimin görünen adı (ör. tokens → token); tanınmayan birim aynen döner. */
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
        // Etiketler yardımcı veridir: alınamazsa ekran ham anahtarla çalışmaya devam eder.
        error: () => {}
      });
  }
}
