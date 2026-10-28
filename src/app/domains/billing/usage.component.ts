import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { MetricCatalogService } from '../../services/metric-catalog.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

interface UsageSummary { tenantId: string; metricKey: string; total: number; }

/** Usage Analytics (M32/M34) — dönem özeti (tenant × metrik) + manuel/AI kayıt girişi. */
@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, HelpButtonComponent, TranslatePipe, IconComponent],
  templateUrl: './usage.component.html',
  styleUrl: './billing.component.scss'
})
export class UsageComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);
  private readonly catalog = inject(MetricCatalogService);
  private readonly base = `${environment.platformApiBaseUrl}/usage`;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<UsageSummary[]>([]);
  readonly busy = signal(false);

  readonly canWrite = this.store.has(Cap.BillingWrite);
  form = { tenantCode: '', metricKey: 'ai_tokens_per_month', quantity: 0 };

  ngOnInit(): void { this.load(); }

  /** Metrik adı katalogdan (plan özelliği ya da yalnız maliyet metriği); tanınmayan ham kalır. */
  metricLabel(key: string): string {
    return this.catalog.label(key);
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<ListResponseModel<UsageSummary>>(`${this.base}/summary`).subscribe({
      next: res => { this.loading.set(false); if (res.success) this.rows.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  record(): void {
    if (!this.form.tenantCode || !this.form.metricKey) return;
    this.busy.set(true);
    this.http.post<ResponseModel>(this.base, {
      tenantId: this.form.tenantCode, metricKey: this.form.metricKey, quantity: Number(this.form.quantity)
    }).subscribe({
      next: res => {
        this.busy.set(false);
        if (res.success) { this.form.quantity = 0; this.load(); } else this.error.set(res.message);
      },
      error: err => { this.busy.set(false); this.error.set(err?.error?.message ?? 'Kaydedilemedi'); }
    });
  }
}
