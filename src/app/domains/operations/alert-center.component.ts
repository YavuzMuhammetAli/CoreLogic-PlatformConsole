import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AlertsService, severityTone, alertStatusTone } from './alerts.service';
import { AlertItem, AlertRuleItem, ALERT_STATUS_FILTERS } from '../../core/models/alert.models';
import { PagedResult } from '../../core/models/api.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

type Tab = 'alerts' | 'rules';

/** Alert Center (M23, [07 §5]) — uyarı listesi (ack/resolve) + kural yönetimi (toggle). */
@Component({
  selector: 'app-alert-center',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './alert-center.component.html',
  styleUrl: './alert-center.component.scss'
})
export class AlertCenterComponent implements OnInit {
  private readonly service = inject(AlertsService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly tab = signal<Tab>('alerts');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly result = signal<PagedResult<AlertItem> | null>(null);
  readonly rules = signal<AlertRuleItem[]>([]);
  readonly busyId = signal<number | null>(null);
  /** Detay satırı açık olan uyarının id'si — aynı anda tek satır açılır. */
  readonly expandedId = signal<number | null>(null);

  readonly sevTone = severityTone;
  readonly stTone = alertStatusTone;
  readonly statusFilters = ALERT_STATUS_FILTERS;
  readonly canManage = this.store.has(Cap.OpsManage);
  /** Etiketler çeviriden gelir ("open" sentetik filtresi dahil); dil değişince güncellenir. */
  readonly statusOptions = computed(() =>
    this.statusFilters.map(s => ({ value: s, label: this.language.t(`pc.alerts.filter.${s}`) })));

  status = 'open';
  page = 1;
  pageSize = 25;

  ngOnInit(): void { this.load(); }

  selectTab(t: Tab): void {
    this.tab.set(t);
    if (t === 'alerts') this.load();
    else this.loadRules();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.expandedId.set(null); // liste tazelenince açık detay bayatlamasın
    this.service.list(this.status, this.page, this.pageSize).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.result.set(res.data);
        else this.error.set(res.message);
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadRules(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.rules().subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.rules.set(res.data ?? []);
        else this.error.set(res.message);
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  applyFilter(): void { this.page = 1; this.load(); }

  /** Uyarının bağlam panelini açar/kapatır. */
  toggleDetails(a: AlertItem): void {
    this.expandedId.set(this.expandedId() === a.id ? null : a.id);
  }

  /** Detay tablosunun kolon sayısı — genişletilmiş satırın colspan'i. */
  readonly columnCount = 6;

  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.result()?.hasMore) { this.page++; this.load(); } }

  acknowledge(a: AlertItem): void {
    this.busyId.set(a.id);
    this.service.acknowledge(a.id).subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  resolve(a: AlertItem): void {
    this.busyId.set(a.id);
    this.service.resolve(a.id).subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  toggleRule(r: AlertRuleItem): void {
    this.busyId.set(r.id);
    this.service.toggleRule(r.id, !r.enabled).subscribe({
      next: () => { this.busyId.set(null); this.loadRules(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
