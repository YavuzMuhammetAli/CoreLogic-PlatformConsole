import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BillingService, formatQuota, planStatusTone } from './billing.service';
import { PlanFeatureItem, PlanItem } from '../../core/models/commerce.models';
import { LanguageService } from '../../services/language.service';
import { MetricCatalogService } from '../../services/metric-catalog.service';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Plan catalog (M35) — list + feature/quota + status transition + new plan draft. */
@Component({
    selector: 'app-plans',
    imports: [FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './plans.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './billing.component.scss'
})
export class PlansComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);
  private readonly catalog = inject(MetricCatalogService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly plans = signal<PlanItem[]>([]);
  readonly busyId = signal<number | null>(null);
  readonly creating = signal(false);

  readonly tone = planStatusTone;
  readonly canWrite = this.store.has(Cap.BillingWrite);

  form = { code: '', name: '', description: '', isPublic: true, trialDays: 14 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.plans().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.plans.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  /** Badge text, e.g. "Aylık AI token: 1.000.000 token"; only the name for an unlimited feature. */
  featureLabel(f: PlanFeatureItem): string {
    const name = this.catalog.label(f.featureKey);
    const quota = formatQuota(this.language, this.catalog, f);
    return quota ? `${name}: ${quota}` : name;
  }

  create(): void {
    if (!this.form.code || !this.form.name) return;
    this.creating.set(true);
    this.service.createPlan({ ...this.form }).subscribe({
      next: () => { this.creating.set(false); this.form = { code: '', name: '', description: '', isPublic: true, trialDays: 14 }; this.load(); },
      error: err => { this.creating.set(false); this.error.set(err?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  setStatus(p: PlanItem, status: string): void {
    this.busyId.set(p.id);
    this.service.setPlanStatus(p.id, status).subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
