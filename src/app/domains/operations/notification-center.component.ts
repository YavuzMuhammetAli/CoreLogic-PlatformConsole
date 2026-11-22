import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationsService } from './notifications.service';
import { severityTone } from './alerts.service';
import { NotificationItem, NotificationRuleItem } from '../../core/models/notification.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

type Tab = 'inbox' | 'rules';

/** Notification Center (M25) — InApp inbox (mark read) + rule management. */
@Component({
    selector: 'app-notification-center',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './notification-center.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './alert-center.component.scss'
})
export class NotificationCenterComponent implements OnInit {
  private readonly service = inject(NotificationsService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly tab = signal<Tab>('inbox');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<NotificationItem[]>([]);
  readonly rules = signal<NotificationRuleItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly sevTone = severityTone;
  readonly canManage = this.store.has(Cap.OpsManage);
  readonly channelTypes = computed(() =>
    ['InApp', 'Email'].map(v => ({ value: v, label: this.enumLabel(v) })));

  /** For table cells — trigger and channel type come raw from the server. */
  enumLabel(value: string): string {
    return this.language.enumLabel(value);
  }

  unreadOnly = false;
  ruleForm = { name: '', triggerType: 'Alert', triggerFilter: '["Critical"]', channelType: 'InApp', targets: '', throttleMinutes: 0 };

  ngOnInit(): void { this.load(); }

  selectTab(t: Tab): void { this.tab.set(t); t === 'inbox' ? this.load() : this.loadRules(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.list(this.unreadOnly).subscribe({
      next: res => { this.loading.set(false); if (res.success) this.items.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadRules(): void {
    this.loading.set(true); this.error.set(null);
    this.service.rules().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.rules.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  markRead(n: NotificationItem): void {
    this.busyId.set(n.id);
    this.service.markRead(n.id).subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: () => { this.busyId.set(null); }
    });
  }

  markAllRead(): void {
    this.service.markAllRead().subscribe({ next: () => this.load(), error: () => {} });
  }

  createRule(): void {
    if (!this.ruleForm.name) return;
    this.busyId.set(-1);
    this.service.createRule({ ...this.ruleForm, throttleMinutes: Number(this.ruleForm.throttleMinutes) }).subscribe({
      next: res => {
        this.busyId.set(null);
        if (res.success) { this.ruleForm = { name: '', triggerType: 'Alert', triggerFilter: '["Critical"]', channelType: 'InApp', targets: '', throttleMinutes: 0 }; this.loadRules(); }
        else this.error.set(res.message);
      },
      error: err => { this.busyId.set(null); this.error.set(err?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  toggleRule(r: NotificationRuleItem): void {
    this.busyId.set(r.id);
    this.service.toggleRule(r.id, !r.enabled).subscribe({
      next: () => { this.busyId.set(null); this.loadRules(); },
      error: () => { this.busyId.set(null); }
    });
  }
}
