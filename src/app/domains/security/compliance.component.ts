import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ComplianceService, complianceStatusTone } from './compliance.service';
import { ComplianceRequestItem, COMPLIANCE_TYPES } from '../../core/models/compliance.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Compliance & Data (M42) — DSAR/erasure/offboarding talep FSM (KVKK/GDPR). */
@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './compliance.component.html',
  styleUrl: './security-center.component.scss'
})
export class ComplianceComponent implements OnInit {
  private readonly service = inject(ComplianceService);
  private readonly store = inject(PlatformSessionStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<ComplianceRequestItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly tone = complianceStatusTone;
  readonly types = COMPLIANCE_TYPES;
  readonly canManage = this.store.has(Cap.SecurityManage);

  status = '';
  form = { type: 'DSAR', tenantId: '', subjectRef: '', reason: '' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.list(this.status, '').subscribe({
      next: r => { this.loading.set(false); if (r.success) this.rows.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  create(): void {
    if (!this.form.tenantId) return;
    this.busyId.set(-1);
    this.service.create({ ...this.form }).subscribe({
      next: r => {
        this.busyId.set(null);
        if (r.success) { this.form = { type: 'DSAR', tenantId: '', subjectRef: '', reason: '' }; this.load(); }
        else this.error.set(r.message);
      },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  advance(r: ComplianceRequestItem, status: string): void {
    this.busyId.set(r.id);
    this.service.advance(r.id, { status }).subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
