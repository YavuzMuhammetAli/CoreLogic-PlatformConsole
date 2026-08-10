import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

/** Abonelikler (M36) — liste/filtre + tenant'a plan atama + yaşam döngüsü eylemleri. */
@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './subscriptions.component.html',
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

  /** Dil değişince "Tümü" etiketi de değişsin diye computed. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.billing.allStatuses'), this.statuses));

  /** app-select değerleri string; planId sayı olduğu için iki uçta da çevrilir. */
  readonly planOptions = computed(() => [
    { value: '0', label: this.language.t('pc.billing.selectPlan') },
    ...this.plans().map(p => ({ value: String(p.id), label: `${p.name} (${p.code})` }))
  ]);

  /** Şablonda `String(...)` çağrılabilsin diye. */
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
