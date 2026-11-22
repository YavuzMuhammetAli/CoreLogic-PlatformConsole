import { Component, OnDestroy, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MigrationService, migrationStatusTone } from './migration.service';
import {
  ACTIVE_RUN_STATUSES, MigrationRunItem, MigrationRunDetail, MigrationSchedule
} from '../../core/models/migration.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import {
  CRON_FREQUENCIES, CronFrequency, CronSpec, HOUR_INTERVALS,
  buildCron, isShortMonthRisk, isValidCron, parseCron
} from '../../core/utils/cron-builder';
import { LanguageService } from '../../services/language.service';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, SelectOption } from '../../shared/ui/select/select.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Refresh interval while there is an active run. */
const POLL_INTERVAL_MS = 5000;

/** The server's default schedule (MigrationOrchestratorManager.GetSchedule): every Sunday 03:00. */
const DEFAULT_CRON = '0 3 * * 0';
const TURKEY_TIME_ZONE = 'Turkey Standard Time';

/** Which fields to show per frequency — the template reads this. */
interface ScheduleFieldVisibility {
  minute: boolean;
  time: boolean;
  hourInterval: boolean;
  dayInterval: boolean;
  dayOfWeek: boolean;
  dayOfMonth: boolean;
  raw: boolean;
}

/**
 * Migration Orchestrator (M10) — starting wave runs, run list/detail and the
 * automatic upgrade schedule.
 *
 * Since a run now executes in the queue rather than in the HTTP request, the page refreshes
 * itself WHILE THERE IS AN ACTIVE RUN; the "start" request now only reports that it was
 * queued (hence `submitting`, not `running`).
 *
 * For scheduling the user doesn't write cron: they pick frequency + time/day and `cron-builder`
 * produces the expression. Raw cron is shown only under the "Özel" (Custom) option.
 */
@Component({
    selector: 'app-migration',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './migration.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./alert-center.component.scss', './migration.component.scss']
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

  /** "Being queued" — does NOT mean the run has finished. */
  readonly submitting = signal(false);

  readonly schedule = signal<MigrationSchedule | null>(null);
  readonly savingSchedule = signal(false);

  readonly tone = migrationStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  form = { takePreBackup: false, stopOnFailure: true };

  /** Checkboxes of the schedule form — filled once schedule() loads. */
  scheduleForm = {
    enabled: false,
    takePreBackup: true,
    stopOnFailure: true
  };

  /** When it runs — the cron expression is produced from this. */
  readonly scheduleSpec = signal<CronSpec>(parseCron(DEFAULT_CRON));
  /** '' = UTC (the server interprets an empty time zone as UTC). */
  readonly scheduleTimeZone = signal(TURKEY_TIME_ZONE);

  readonly cronExpression = computed(() => buildCron(this.scheduleSpec()));
  readonly cronValid = computed(() => isValidCron(this.cronExpression()));
  readonly shortMonthWarning = computed(() => isShortMonthRisk(this.scheduleSpec()));

  readonly fields = computed<ScheduleFieldVisibility>(() => {
    const frequency = this.scheduleSpec().frequency;
    return {
      minute: frequency === 'hourly' || frequency === 'everyNHours',
      time: ['daily', 'everyNDays', 'weekly', 'monthly'].includes(frequency),
      hourInterval: frequency === 'everyNHours',
      dayInterval: frequency === 'everyNDays',
      dayOfWeek: frequency === 'weekly',
      dayOfMonth: frequency === 'monthly',
      raw: frequency === 'custom'
    };
  });

  // Option lists are computed so labels change when the language changes.
  readonly frequencyOptions = computed<SelectOption[]>(() =>
    CRON_FREQUENCIES.map(f => ({ value: f, label: this.language.t(`pc.mig.freq.${f}`) })));

  readonly hourIntervalOptions = computed<SelectOption[]>(() =>
    HOUR_INTERVALS.map(n => ({ value: String(n), label: this.language.t('pc.mig.hourIntervalOption', { n }) })));

  /** Starts on Monday; values follow cron order (0 = Sunday). */
  readonly weekDayOptions = computed<SelectOption[]>(() =>
    [1, 2, 3, 4, 5, 6, 0].map(d => ({ value: String(d), label: this.weekDayLabel(d) })));

  readonly monthDayOptions: SelectOption[] =
    Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

  /** If the saved time zone isn't in the list it is added as-is — so it isn't lost on save. */
  readonly timeZoneOptions = computed<SelectOption[]>(() => {
    const options: SelectOption[] = [
      { value: TURKEY_TIME_ZONE, label: this.language.t('pc.mig.tz.turkey') },
      { value: '', label: this.language.t('pc.mig.tz.utc') }
    ];
    const current = this.scheduleTimeZone();
    if (!options.some(o => o.value === current)) options.push({ value: current, label: current });
    return options;
  });

  /** Readable form of the selection, e.g. "Her Pazar 03:00 · Türkiye saati" (Every Sunday 03:00 · Turkey time). Empty for a custom expression. */
  readonly scheduleSummary = computed(() => {
    const s = this.scheduleSpec();
    if (s.frequency === 'custom' || !this.cronValid()) return '';

    const params = {
      minute: s.minute,
      time: `${this.pad(s.hour)}:${this.pad(s.minute)}`,
      n: s.frequency === 'everyNHours' ? s.hourInterval : s.dayInterval,
      day: s.frequency === 'weekly' ? this.weekDayLabel(s.dayOfWeek) : s.dayOfMonth
    };
    const zone = this.timeZoneOptions().find(o => o.value === this.scheduleTimeZone())?.label ?? '';
    return `${this.language.t(`pc.mig.summary.${s.frequency}`, params)} · ${zone}`;
  });

  /** If the form differs from the saved schedule, the server's "next runs" list is still stale. */
  readonly scheduleDirty = computed(() => {
    const saved = this.schedule();
    if (!saved) return false;
    return this.cronExpression() !== saved.cronExpression.trim()
      || this.scheduleTimeZone() !== (saved.timeZoneId ?? '');
  });

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
        // Success = "queued". Progress arrives via polling.
        if (r.success) { this.success.set(r.message); this.load(); }
        else this.error.set(r.message);
      },
      error: e => {
        this.submitting.set(false);
        this.error.set(e?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }

  // ── Automatic upgrade schedule ────────────────────────────────────────

  loadSchedule(): void {
    this.service.getSchedule().subscribe({
      next: r => {
        if (!r.success || !r.data) return;
        this.schedule.set(r.data);
        this.scheduleForm = {
          enabled: r.data.enabled,
          takePreBackup: r.data.takePreBackup,
          stopOnFailure: r.data.stopOnFailure
        };
        // An unrecognised expression falls back to "Özel" (Custom) and is kept as-is.
        this.scheduleSpec.set(parseCron(r.data.cronExpression));
        this.scheduleTimeZone.set(r.data.timeZoneId ?? '');
      },
      error: () => {}
    });
  }

  onFrequencyChange(value: string): void {
    const frequency = value as CronFrequency;
    const current = this.scheduleSpec();
    // When switching to "Özel" (Custom) the current selection's cron is carried over — so it needn't be written from scratch.
    const raw = frequency === 'custom' ? buildCron(current) : current.raw;
    this.scheduleSpec.set({ ...current, frequency, raw });
  }

  patchSpec(patch: Partial<CronSpec>): void {
    this.scheduleSpec.set({ ...this.scheduleSpec(), ...patch });
  }

  /** `<input type="time">` value ("HH:mm"). */
  timeValue(): string {
    const s = this.scheduleSpec();
    return `${this.pad(s.hour)}:${this.pad(s.minute)}`;
  }

  onTimeChange(value: string): void {
    const [hour, minute] = (value ?? '').split(':').map(Number);
    if (Number.isInteger(hour) && Number.isInteger(minute)) this.patchSpec({ hour, minute });
  }

  saveSchedule(): void {
    if (!this.cronValid()) {
      this.error.set(this.language.t('pc.mig.rawCronInvalid'));
      return;
    }
    this.savingSchedule.set(true);
    this.error.set(null);
    this.success.set(null);
    this.service.saveSchedule({
      ...this.scheduleForm,
      cronExpression: this.cronExpression(),
      timeZoneId: this.scheduleTimeZone() || null,
      nextOccurrences: []
    }).subscribe({
      next: r => {
        this.savingSchedule.set(false);
        // Reload: the server computes the next-run preview.
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
   * Refreshing is IMPLIED by whether there is an active run — the user is not offered an
   * "auto refresh" checkbox. Watching an ongoing run is the page's sole purpose anyway;
   * it stops by itself once the run finishes.
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

  /** Silent refresh — no spinner, so the table doesn't jump. */
  private refreshRuns(): void {
    this.service.listRuns().subscribe({
      next: r => { if (r.success) { this.runs.set(r.data ?? []); this.syncPolling(); } },
      error: () => {}
    });
  }

  /** The open detail panel is refreshed too — per-tenant progress is tracked there. */
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

  // ── Display helpers ──────────────────────────────────────────────

  /** Writes the weekday in the active language (0 = Sunday) — no separate translation key needed. */
  private weekDayLabel(day: number): string {
    // 2026-08-02 is a Sunday; adding days preserves the 0 = Sunday order.
    const reference = new Date(2026, 7, 2 + day);
    return reference.toLocaleDateString(
      this.language.lang() === 'en' ? 'en-US' : 'tr-TR', { weekday: 'long' });
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
