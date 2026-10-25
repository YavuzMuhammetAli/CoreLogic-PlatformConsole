import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BillingService, CostByTenant } from './billing.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { MetricCatalogService } from '../../services/metric-catalog.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Cost & AI Usage Analytics (M33/M34) — tenant başına maliyet dökümü (usage × birim). */
@Component({
  selector: 'app-cost',
  standalone: true,
  imports: [DecimalPipe, RouterLink, RouterLinkActive, HelpButtonComponent, TranslatePipe],
  templateUrl: './cost.component.html',
  styleUrl: './billing.component.scss'
})
export class CostComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly language = inject(LanguageService);
  private readonly catalog = inject(MetricCatalogService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<CostByTenant[]>([]);
  readonly expanded = signal<string | null>(null);

  ngOnInit(): void { this.load(); }

  /** Metrik adı katalogdan (plan özelliği ya da yalnız maliyet metriği); tanınmayan ham kalır. */
  metricLabel(key: string): string {
    return this.catalog.label(key);
  }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.costByTenant().subscribe({
      next: r => { this.loading.set(false); if (r.success) this.rows.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  toggle(tenantId: string): void {
    this.expanded.set(this.expanded() === tenantId ? null : tenantId);
  }

  grandTotal(): number {
    return this.rows().reduce((s, r) => s + r.totalCost, 0);
  }
}
