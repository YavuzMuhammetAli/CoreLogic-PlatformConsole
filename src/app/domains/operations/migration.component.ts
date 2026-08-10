import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MigrationService, migrationStatusTone } from './migration.service';
import {
  ACTIVE_RUN_STATUSES, MigrationRunItem, MigrationRunDetail, MigrationSchedule
} from '../../core/models/migration.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { LanguageService } from '../../services/language.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Aktif koşu varken yenileme aralığı. */
const POLL_INTERVAL_MS = 5000;

/**
 * Migration Orchestrator (M10) — dalga koşusu başlatma, koşu listesi/detayı ve
 * otomatik (cron) yükseltme zamanlaması.
 *
 * Koşu artık HTTP isteğinde değil kuyrukta yürüdüğü için sayfa AKTİF KOŞU
 * VARKEN kendini yeniler; "başlat" isteği artık yalnızca kuyruğa alındığını
 * bildirir (bu yüzden `submitting`, `running` değil).
 */
@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './migration.component.html',
  styleUrl: './alert-center.component.scss'
})
export class MigrationComponent implements OnInit, OnDestroy {
  private readonly service = inject(MigrationService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly runs = signal<MigrationRunItem[]>([]);
  readonly detail = signal<MigrationRunDetail | null>(null);

  /** "Kuyruğa alınıyor" — koşunun bittiği anlamına GELMEZ. */
  readonly submitting = signal(false);

  readonly schedule = signal<MigrationSchedule | null>(null);
  readonly savingSchedule = signal(false);

  readonly tone = migrationStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  form = { takePreBackup: false, stopOnFailure: true };

  /** Zamanlama formu — schedule() yüklenince doldurulur. */
  scheduleForm = {
    enabled: false,
    cronExpression: '0 3 * * 0',
    timeZoneId: 'Turkey Standard Time',
    takePreBackup: true,
    stopOnFailure: true
  };

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.load();
    this.loadSchedule();
  }

  ngOnDestroy(): void { this.stopPolling(); }

  load(): void {
    this.loading.set(true);
    this.service.listRuns().subscribe({
      next: r => {
        this.loading.set(false);
        if (!r.success) { this.error.set(r.message); return; }
        this.runs.set(r.data ?? []);
        this.error.set(null);
        this.syncPolling();
      },
      error: e => {
        this.loading.set(false);
        this.error.set(e?.error?.message ?? this.language.t('pc.loadFailed'));
        this.stopPolling();
      }
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
    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);
    this.service.startRun({ ...this.form }).subscribe({
      next: r => {
        this.submitting.set(false);
        // Başarı = "kuyruğa alındı". İlerleme polling ile gelir.
        if (r.success) { this.success.set(r.message); this.load(); }
        else this.error.set(r.message);
      },
      error: e => {
        this.submitting.set(false);
        this.error.set(e?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }

  // ── Otomatik yükseltme zamanlaması ────────────────────────────────────────

  loadSchedule(): void {
    this.service.getSchedule().subscribe({
      next: r => {
        if (!r.success || !r.data) return;
        this.schedule.set(r.data);
        this.scheduleForm = {
          enabled: r.data.enabled,
          cronExpression: r.data.cronExpression,
          timeZoneId: r.data.timeZoneId ?? '',
          takePreBackup: r.data.takePreBackup,
          stopOnFailure: r.data.stopOnFailure
        };
      },
      error: () => {}
    });
  }

  saveSchedule(): void {
    this.savingSchedule.set(true);
    this.error.set(null);
    this.success.set(null);
    this.service.saveSchedule({ ...this.scheduleForm, nextOccurrences: [] }).subscribe({
      next: r => {
        this.savingSchedule.set(false);
        // Yeniden yükle: sonraki koşu önizlemesini sunucu hesaplıyor.
        if (r.success) { this.success.set(r.message); this.loadSchedule(); }
        else this.error.set(r.message);
      },
      error: e => {
        this.savingSchedule.set(false);
        this.error.set(e?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }

  // ── Polling ───────────────────────────────────────────────────────────────

  /**
   * Yenileme, aktif koşu olup olmadığından İMA EDİLİR — kullanıcıya "otomatik
   * yenile" kutusu sunulmaz. Sürmekte olan bir koşuyu izlemek zaten sayfanın
   * tek amacı; bitince kendiliğinden durur.
   */
  private syncPolling(): void {
    const active = this.runs().some(r => ACTIVE_RUN_STATUSES.includes(r.status));
    if (active && !this.timer) {
      this.timer = setInterval(() => {
        if (document.visibilityState !== 'visible') return;
        this.refreshRuns();
        this.refreshDetail();
      }, POLL_INTERVAL_MS);
    } else if (!active && this.timer) {
      this.stopPolling();
    }
  }

  /** Sessiz yenileme — spinner göstermez, tablo zıplamasın. */
  private refreshRuns(): void {
    this.service.listRuns().subscribe({
      next: r => { if (r.success) { this.runs.set(r.data ?? []); this.syncPolling(); } },
      error: () => {}
    });
  }

  /** Açık detay paneli de tazelenir — tenant bazlı ilerleme orada izleniyor. */
  private refreshDetail(): void {
    const open = this.detail();
    if (!open) return;
    this.service.getRun(open.id).subscribe({
      next: r => { if (r.success) this.detail.set(r.data); },
      error: () => {}
    });
  }

  private stopPolling(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
}
