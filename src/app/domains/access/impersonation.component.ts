import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImpersonationService, grantStatusTone } from './impersonation.service';
import { ImpersonationGrantItem } from '../../core/models/impersonation.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Support & Impersonation (M17) — talep/onay/basım/iptal iş akışı (görev ayrılığı). */
@Component({
    selector: 'app-impersonation',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './impersonation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './impersonation.component.scss'
})
export class ImpersonationComponent implements OnInit {
  private readonly service = inject(ImpersonationService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly grants = signal<ImpersonationGrantItem[]>([]);
  readonly busyId = signal<string | null>(null);
  readonly issuedToken = signal<string | null>(null);

  readonly tone = grantStatusTone;
  readonly canRequest = this.store.has(Cap.ImpersonationRequest);
  readonly canApprove = this.store.has(Cap.ImpersonationApprove);
  /** Talep FSM durumları — dil değişince "Tümü" etiketi de değişsin diye computed. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.imp.allStatuses'),
      ['Requested', 'Approved', 'ActiveUse', 'Expired', 'Revoked', 'Denied'],
      v => this.language.enumLabel(v)));

  status = '';
  form = { tenantId: '', targetUserId: null as number | null, reason: '', hours: 1 };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.list(this.status).subscribe({
      next: r => { this.loading.set(false); if (r.success) this.grants.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  request(): void {
    if (!this.form.tenantId || !this.form.reason) return;
    this.busyId.set('__new__');
    this.service.request({ ...this.form }).subscribe({
      next: r => {
        this.busyId.set(null);
        if (r.success) { this.form = { tenantId: '', targetUserId: null, reason: '', hours: 1 }; this.load(); }
        else this.error.set(r.message);
      },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  act(g: ImpersonationGrantItem, action: 'approve' | 'deny' | 'revoke'): void {
    this.busyId.set(g.id);
    const obs = action === 'approve' ? this.service.approve(g.id)
      : action === 'deny' ? this.service.deny(g.id) : this.service.revoke(g.id);
    obs.subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  issue(g: ImpersonationGrantItem): void {
    this.busyId.set(g.id);
    this.issuedToken.set(null);
    this.service.issue(g.id).subscribe({
      next: r => { this.busyId.set(null); if (r.success) this.issuedToken.set(r.data.token); this.load(); },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Basılamadı'); }
    });
  }
}
