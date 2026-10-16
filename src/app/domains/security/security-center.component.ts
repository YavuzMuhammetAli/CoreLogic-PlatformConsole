import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SecurityCenterService, eventStatusTone } from './security-center.service';
import { LoginAttemptItem, SecurityEventItem, IpAccessRuleItem } from '../../core/models/security.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

type Tab = 'attempts' | 'events' | 'iprules';

/** Security Center (M18/M19) — giriş denemeleri + tehdit olayları + IP kuralları. */
@Component({
  selector: 'app-security-center',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './security-center.component.html',
  styleUrl: './security-center.component.scss'
})
export class SecurityCenterComponent implements OnInit {
  private readonly service = inject(SecurityCenterService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly tab = signal<Tab>('events');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly attempts = signal<LoginAttemptItem[]>([]);
  readonly events = signal<SecurityEventItem[]>([]);
  readonly ipRules = signal<IpAccessRuleItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly evtTone = eventStatusTone;
  readonly canManage = this.store.has(Cap.SecurityManage);
  /** Tehdit olayı durumları — dil değişince "Tümü" etiketi de değişsin diye computed. */
  readonly eventStatusOptions = computed(() =>
    withAllOption(this.language.t('pc.sec.allStatuses'),
      ['Open', 'Reviewed', 'Dismissed', 'Escalated'],
      v => this.language.enumLabel(v)));
  readonly ipActionOptions = computed(() =>
    ['Deny', 'Allow'].map(v => ({ value: v, label: this.language.enumLabel(v) })));

  /** Tablo hücreleri için — olay tipi ve IP eylemi sunucudan ham gelir. */
  enumLabel(value: string): string {
    return this.language.enumLabel(value);
  }

  attemptEmail = '';
  attemptIp = '';
  eventStatus = 'Open';
  ipForm = { cidr: '', action: 'Deny', reason: '' };

  ngOnInit(): void { this.loadEvents(); }

  selectTab(t: Tab): void {
    this.tab.set(t);
    if (t === 'attempts') this.loadAttempts();
    else if (t === 'events') this.loadEvents();
    else this.loadIpRules();
  }

  loadAttempts(): void {
    this.loading.set(true); this.error.set(null);
    this.service.loginAttempts(this.attemptEmail.trim(), this.attemptIp.trim()).subscribe({
      next: r => { this.loading.set(false); if (r.success) this.attempts.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadEvents(): void {
    this.loading.set(true); this.error.set(null);
    this.service.events(this.eventStatus).subscribe({
      next: r => { this.loading.set(false); if (r.success) this.events.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadIpRules(): void {
    this.loading.set(true); this.error.set(null);
    this.service.ipRules().subscribe({
      next: r => { this.loading.set(false); if (r.success) this.ipRules.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  review(e: SecurityEventItem, status: string): void {
    this.busyId.set(e.id);
    this.service.reviewEvent(e.id, status).subscribe({
      next: () => { this.busyId.set(null); this.loadEvents(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  addIpRule(): void {
    if (!this.ipForm.cidr) return;
    this.busyId.set(-1);
    this.service.addIpRule({ ...this.ipForm }).subscribe({
      next: () => { this.busyId.set(null); this.ipForm = { cidr: '', action: 'Deny', reason: '' }; this.loadIpRules(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'Eklenemedi'); }
    });
  }

  removeIpRule(r: IpAccessRuleItem): void {
    this.busyId.set(r.id);
    this.service.removeIpRule(r.id).subscribe({
      next: () => { this.busyId.set(null); this.loadIpRules(); },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
