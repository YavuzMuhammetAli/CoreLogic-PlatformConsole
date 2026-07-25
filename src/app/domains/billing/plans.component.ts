import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BillingService, planStatusTone } from './billing.service';
import { PlanItem } from '../../core/models/commerce.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Plan kataloğu (M35) — liste + özellik/kota + durum geçişi + yeni plan taslağı. */
@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './plans.component.html',
  styleUrl: './billing.component.scss'
})
export class PlansComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly store = inject(PlatformSessionStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly plans = signal<PlanItem[]>([]);
  readonly busyId = signal<number | null>(null);
  readonly creating = signal(false);

  readonly tone = planStatusTone;
  readonly canWrite = this.store.has(Cap.BillingWrite);

  form = { code: '', name: '', description: '', isPublic: true };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.plans().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.plans.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  featureLabel(f: { featureKey: string; limitValue?: number | null; unit?: string | null }): string {
    return f.limitValue == null ? f.featureKey : `${f.featureKey}: ${f.limitValue}${f.unit ? ' ' + f.unit : ''}`;
  }

  create(): void {
    if (!this.form.code || !this.form.name) return;
    this.creating.set(true);
    this.service.createPlan({ ...this.form }).subscribe({
      next: () => { this.creating.set(false); this.form = { code: '', name: '', description: '', isPublic: true }; this.load(); },
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
