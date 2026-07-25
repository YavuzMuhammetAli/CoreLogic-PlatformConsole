import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnnouncementService, severityTone, announcementStatusTone } from './announcement.service';
import { AnnouncementItem, DatabaseServerItem, ANNOUNCEMENT_SEVERITIES } from '../../core/models/announcement.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Announcements & Status (M26) + DB sunucu envanteri (multi-region tohumu). */
@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './announcements.component.html',
  styleUrl: './integration.component.scss'
})
export class AnnouncementsComponent implements OnInit {
  private readonly service = inject(AnnouncementService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<AnnouncementItem[]>([]);
  readonly servers = signal<DatabaseServerItem[]>([]);
  readonly busyId = signal<number | null>(null);

  readonly sevTone = severityTone;
  readonly stTone = announcementStatusTone;
  readonly severities = ANNOUNCEMENT_SEVERITIES;

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
