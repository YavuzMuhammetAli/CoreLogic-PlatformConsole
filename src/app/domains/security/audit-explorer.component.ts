import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuditService } from './audit.service';
import { PlatformAuditLogItem } from '../../core/models/platform.models';
import { StatusBadgeComponent, BadgeTone } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Denetim kayıtları görüntüleyici (M20) — temel filtre + liste ([06 §6]). */
@Component({
  selector: 'app-audit-explorer',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './audit-explorer.component.html',
  styleUrl: './audit-explorer.component.scss'
})
export class AuditExplorerComponent implements OnInit {
  private readonly service = inject(AuditService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<PlatformAuditLogItem[]>([]);
  /** Aktif correlation zinciri filtresi (null = normal liste). */
  readonly chain = signal<string | null>(null);

  category: string = '';
  take = 100;

  readonly categories = [
    'Identity', 'Iam', 'TenantLifecycle', 'Configuration',
    'Commercial', 'Security', 'Operations', 'Support', 'Data'
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.query(this.category || null, this.take, this.chain()).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.items.set(res.data ?? []);
        else this.error.set(res.message);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Yüklenemedi');
      }
    });
  }

  /** Bir kaydın correlationId'sine tıklayınca o iş akışının tüm izini (zincir) yükler. */
  openChain(correlationId: string | null | undefined): void {
    if (!correlationId) return;
    this.chain.set(correlationId);
    this.load();
  }

  /** Zincir görünümünden normal listeye döner. */
  clearChain(): void {
    this.chain.set(null);
    this.load();
  }

  /** Görüntülenen kayıtları CSV olarak indirir (istemci tarafı export, [06 §6]). */
  exportCsv(): void {
    const rows = this.items();
    if (rows.length === 0) return;
    const headers = ['occurredAt', 'actorType', 'actorName', 'category', 'action',
      'targetType', 'targetId', 'tenantId', 'result', 'severity', 'correlationId'];
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(',')];
    for (const r of rows) {
      lines.push(headers.map(h => escape((r as unknown as Record<string, unknown>)[h])).join(','));
    }
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  resultTone(result: string): BadgeTone {
    switch (result) {
      case 'Success': return 'success';
      case 'Denied': return 'warn';
      case 'Failed': return 'danger';
      default: return 'neutral';
    }
  }

  severityTone(severity: string): BadgeTone {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'Notice': return 'meta';
      default: return 'neutral';
    }
  }
}
