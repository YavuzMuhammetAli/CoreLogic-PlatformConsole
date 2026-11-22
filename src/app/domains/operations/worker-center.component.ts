import { Component, OnDestroy, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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

/** Auto-refresh interval — the heartbeat is written every 30 s, so polling more often is pointless. */
const POLL_INTERVAL_MS = 15000;

/**
 * Worker control plane (migration 025) — status of the 11 periodic workers,
 * on/off, interval and loop reset.
 *
 * The status ("Çalışıyor / Duraklatıldı / Yanıt yok / Hata" — Running / Paused / No response / Error)
 * is derived ON THE SERVER; here it is only coloured.
 */
@Component({
    selector: 'app-worker-center',
    imports: [
        DatePipe, FormsModule, RouterLink, RouterLinkActive,
        StatusBadgeComponent, ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe, IconComponent
    ],
    templateUrl: './worker-center.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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

  /** Row awaiting confirmation to stop a critical worker. */
  readonly confirmTarget = signal<WorkerStatus | null>(null);

  readonly tone = workerStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  /** Interval edit drafts — an empty string means "revert to default". */
  edits: Record<string, string> = {};

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.load();
    this.timer = setInterval(() => {
      // A background tab shouldn't send needless requests.
      if (document.visibilityState === 'visible') this.load(true);
    }, POLL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  /** @param silent Don't show a spinner on auto-refresh — so the table doesn't jump. */
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
   * Copies the intervals from the server into the drafts — but does NOT TOUCH the cell the
   * user is editing AT THAT MOMENT: if the 15 s auto-refresh pulled the typed number out from
   * under them, the user wouldn't understand what happened.
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

  /** Pause/resume. If a critical worker is being stopped, a confirmation dialog opens first. */
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

  /** Resets the loop — the process is not restarted (see WorkerService.reset). */
  reset(w: WorkerStatus): void {
    this.busyName.set(w.name);
    this.clearBanners();
    this.service.reset(w.name).subscribe({
      next: r => this.finish(r.success, r.message),
      error: e => this.fail(e, 'pc.actionFailed')
    });
  }

  /** Empty draft = remove the override (revert to the code default). */
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
