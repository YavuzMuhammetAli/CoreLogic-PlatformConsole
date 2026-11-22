import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BillingService, subStatusTone } from './billing.service';
import { PlanItem, SubscriptionItem, SUBSCRIPTION_STATUSES } from '../../core/models/commerce.models';
import { PagedResult } from '../../core/models/api.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Subscriptions (M36) — list/filter + assigning a plan to a tenant + lifecycle actions. */
@Component({
    selector: 'app-subscriptions',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './subscriptions.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './billing.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly result = signal<PagedResult<SubscriptionItem> | null>(null);
  readonly plans = signal<PlanItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly tone = subStatusTone;
  readonly statuses = SUBSCRIPTION_STATUSES;
  readonly canWrite = this.store.has(Cap.BillingWrite);

  /** Computed so the "Tümü" (All) label also changes when the language changes. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.billing.allStatuses'), this.statuses, v => this.language.enumLabel(v)));

  /** app-select values are strings; planId is a number, so it is converted at both ends. */
  readonly planOptions = computed(() => [
    { value: '0', label: this.language.t('pc.billing.selectPlan') },
    ...this.plans().map(p => ({ value: String(p.id), label: `${p.name} (${p.code})` }))
  ]);

  /** So that `String(...)` can be called in the template. */
  readonly String = String;

  status = '';
  page = 1;
  pageSize = 25;
  form = { tenantCode: '', planId: 0, seats: 1, trialDays: 14, notes: '' };

  ngOnInit(): void {
    this.load();
    this.service.plans().subscribe({ next: r => { if (r.success) this.plans.set((r.data ?? []).filter(p => p.status === 'Active')); } });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.subscriptions(this.status, this.page, this.pageSize).subscribe({
      next: res => { this.loading.set(false); if (res.success) this.result.set(res.data); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  applyFilter(): void { this.page = 1; this.load(); }
  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.result()?.hasMore) { this.page++; this.load(); } }

  create(): void {
    if (!this.form.tenantCode || !this.form.planId) return;
    this.busyId.set(-1);
    this.service.createSubscription({ ...this.form, planId: Number(this.form.planId) }).subscribe({
      next: res => {
        this.busyId.set(null);
        if (res.success) { this.form = { tenantCode: '', planId: 0, seats: 1, trialDays: 14, notes: '' }; this.load(); }
        else this.error.set(res.message);
      },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  act(s: SubscriptionItem, action: 'pay' | 'cancel' | 'extend'): void {
    this.busyId.set(s.id);
    const obs = action === 'pay' ? this.service.recordPayment(s.id)
      : action === 'cancel' ? this.service.cancel(s.id)
      : this.service.extendTrial(s.id, 14);
    obs.subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
