import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WorkerService, workerStatusTone } from './worker.service';
import { UpdateWorkerRequest, WorkerStatus } from '../../core/models/worker.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { LanguageService } from '../../services/language.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Otomatik yenileme aralığı — heartbeat 30 sn'de bir yazıldığı için daha sık sormanın anlamı yok. */
const POLL_INTERVAL_MS = 15000;

/**
 * Worker kontrol düzlemi (migrasyon 025) — 11 periyodik worker'ın durumu,
 * aç/kapa, aralık ve döngü yenileme.
 *
 * Durum ("Çalışıyor / Duraklatıldı / Yanıt yok / Hata") SUNUCUDA türetilir;
 * burada yalnız renklendirilir.
 */
@Component({
  selector: 'app-worker-center',
  standalone: true,
  imports: [
    DatePipe, FormsModule, RouterLink, RouterLinkActive,
    StatusBadgeComponent, ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe, IconComponent
  ],
  templateUrl: './worker-center.component.html',
  styleUrl: './worker-center.component.scss'
})
export class WorkerCenterComponent implements OnInit, OnDestroy {
  private readonly service = inject(WorkerService);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly workers = signal<WorkerStatus[]>([]);
  readonly busyName = signal<string | null>(null);

  /** Kritik worker kapatma onayı bekleyen satır. */
  readonly confirmTarget = signal<WorkerStatus | null>(null);

  readonly tone = workerStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  /** Aralık düzenleme taslakları — boş string "varsayılana dön" demek. */
  edits: Record<string, string> = {};

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.load();
    this.timer = setInterval(() => {
      // Arka plandaki sekme boşuna istek atmasın.
      if (document.visibilityState === 'visible') this.load(true);
    }, POLL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  /** @param silent Otomatik yenilemede spinner gösterme — tablo zıplamasın. */
  load(silent = false): void {
    if (!silent) this.loading.set(true);
    this.service.list().subscribe({
      next: r => {
        this.loading.set(false);
        if (!r.success) { this.error.set(r.message); return; }
        const items = r.data ?? [];
        this.workers.set(items);
        this.syncEdits(items);
        this.error.set(null);
      },
      error: e => {
        this.loading.set(false);
        this.error.set(e?.error?.message ?? this.language.t('pc.loadFailed'));
      }
    });
  }

  /**
   * Sunucudan gelen aralıkları taslaklara yansıtır — ama kullanıcının O AN
   * düzenlediği hücreye DOKUNMAZ: 15 sn'lik otomatik yenileme yazdığı sayıyı
   * altından çekerse kullanıcı ne olduğunu anlamaz.
   */
  private syncEdits(items: WorkerStatus[]): void {
    for (const w of items) {
      if (this.busyName() === w.name) continue;
      if (this.edits[w.name] === undefined) {
        this.edits[w.name] = w.intervalSeconds?.toString() ?? '';
      }
    }
  }

  intervalDraft(name: string): string {
    return this.edits[name] ?? '';
  }

  onIntervalChange(name: string, value: string): void {
    this.edits[name] = value;
  }

  /** Duraklat/sürdür. Kritik bir worker kapatılıyorsa önce onay diyaloğu açılır. */
  toggleEnabled(w: WorkerStatus): void {
    const turningOff = w.enabled;
    if (turningOff && w.isCritical) { this.confirmTarget.set(w); return; }
    this.apply(w, { enabled: !w.enabled, intervalSeconds: this.parseInterval(w), confirm: false });
  }

  confirmDisable(): void {
    const w = this.confirmTarget();
    if (!w) return;
    this.confirmTarget.set(null);
    this.apply(w, { enabled: false, intervalSeconds: this.parseInterval(w), confirm: true });
  }

  cancelConfirm(): void { this.confirmTarget.set(null); }

  saveInterval(w: WorkerStatus): void {
    this.apply(w, { enabled: w.enabled, intervalSeconds: this.parseInterval(w), confirm: false });
  }

  /** Döngüyü yeniler — proses yeniden başlatılmaz (bkz. WorkerService.reset). */
  reset(w: WorkerStatus): void {
    this.busyName.set(w.name);
    this.clearBanners();
    this.service.reset(w.name).subscribe({
      next: r => this.finish(r.success, r.message),
      error: e => this.fail(e, 'pc.actionFailed')
    });
  }

  /** Boş taslak = override kaldır (kod varsayılanına dön). */
  private parseInterval(w: WorkerStatus): number | null {
    const raw = (this.edits[w.name] ?? '').trim();
    if (raw === '') return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : w.intervalSeconds;
  }

  private apply(w: WorkerStatus, dto: UpdateWorkerRequest): void {
    this.busyName.set(w.name);
    this.clearBanners();
    this.service.update(w.name, dto).subscribe({
      next: r => this.finish(r.success, r.message),
      error: e => this.fail(e, 'pc.actionFailed')
    });
  }

  private finish(ok: boolean, message: string): void {
    this.busyName.set(null);
    if (ok) { this.success.set(message); this.load(true); }
    else this.error.set(message);
  }

  private fail(e: unknown, fallbackKey: string): void {
    this.busyName.set(null);
    const err = e as { error?: { message?: string } };
    this.error.set(err?.error?.message ?? this.language.t(fallbackKey));
  }

  private clearBanners(): void {
    this.error.set(null);
    this.success.set(null);
  }
}
