import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MigrationService, migrationStatusTone } from './migration.service';
import { MigrationRunItem, MigrationRunDetail } from '../../core/models/migration.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Migration Orchestrator (M10) — dalga koşusu başlatma + koşu listesi + koşu detayı. */
@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './migration.component.html',
  styleUrl: './alert-center.component.scss'
})
export class MigrationComponent implements OnInit {
  private readonly service = inject(MigrationService);
  private readonly store = inject(PlatformSessionStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly runs = signal<MigrationRunItem[]>([]);
  readonly detail = signal<MigrationRunDetail | null>(null);
  readonly running = signal(false);

  readonly tone = migrationStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  form = { takePreBackup: false, stopOnFailure: true };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.listRuns().subscribe({
      next: r => { this.loading.set(false); if (r.success) this.runs.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  open(run: MigrationRunItem): void {
    this.service.getRun(run.id).subscribe({
      next: r => { if (r.success) this.detail.set(r.data); },
      error: () => {}
    });
  }

  closeDetail(): void { this.detail.set(null); }

  start(): void {
    this.running.set(true);
    this.error.set(null);
    this.service.startRun({ ...this.form }).subscribe({
      next: r => {
        this.running.set(false);
        if (r.success) this.load();
        else this.error.set(r.message);
      },
      error: e => { this.running.set(false); this.error.set(e?.error?.message ?? 'Koşu başlatılamadı'); }
    });
  }
}
