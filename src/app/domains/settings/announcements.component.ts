import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnnouncementService, severityTone, announcementStatusTone } from './announcement.service';
import { AnnouncementItem, DatabaseServerItem, ANNOUNCEMENT_SEVERITIES } from '../../core/models/announcement.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Announcements & Status (M26) + DB sunucu envanteri (multi-region tohumu). */
@Component({
    selector: 'app-announcements',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './announcements.component.html',
    styleUrl: './integration.component.scss'
})
export class AnnouncementsComponent implements OnInit {
  private readonly service = inject(AnnouncementService);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<AnnouncementItem[]>([]);
  readonly servers = signal<DatabaseServerItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly sevTone = severityTone;
  readonly stTone = announcementStatusTone;
  /** Değer sunucu sabiti (Info/Maintenance/Incident), etiket çeviriden. */
  readonly severities = computed(() =>
    ANNOUNCEMENT_SEVERITIES.map(v => ({ value: v, label: this.language.enumLabel(v) })));

  form = { title: '', body: '', severity: 'Info' };

  ngOnInit(): void {
    this.load();
    this.service.servers().subscribe({ next: r => { if (r.success) this.servers.set(r.data ?? []); } });
  }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.list('').subscribe({
      next: r => { this.loading.set(false); if (r.success) this.rows.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  create(): void {
    if (!this.form.title) return;
    this.busyId.set(-1);
    this.service.create({ ...this.form }).subscribe({
      next: r => {
        this.busyId.set(null);
        if (r.success) { this.form = { title: '', body: '', severity: 'Info' }; this.load(); }
        else this.error.set(r.message);
      },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  act(a: AnnouncementItem, action: 'publish' | 'expire'): void {
    this.busyId.set(a.id);
    const obs = action === 'publish' ? this.service.publish(a.id) : this.service.expire(a.id);
    obs.subscribe({
      next: () => { this.busyId.set(null); this.load(); },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
