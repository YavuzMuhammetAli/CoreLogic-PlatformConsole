import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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

/** Aktif koşu varken yenileme aralığı. */
const POLL_INTERVAL_MS = 5000;

/** Sunucunun varsayılan zamanlaması (MigrationOrchestratorManager.GetSchedule): her pazar 03:00. */
const DEFAULT_CRON = '0 3 * * 0';
const TURKEY_TIME_ZONE = 'Turkey Standard Time';

/** Sıklığa göre hangi alanların gösterileceği — şablon bunu okur. */
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
 * Migration Orchestrator (M10) — dalga koşusu başlatma, koşu listesi/detayı ve
 * otomatik yükseltme zamanlaması.
 *
 * Koşu artık HTTP isteğinde değil kuyrukta yürüdüğü için sayfa AKTİF KOŞU
 * VARKEN kendini yeniler; "başlat" isteği artık yalnızca kuyruğa alındığını
 * bildirir (bu yüzden `submitting`, `running` değil).
 *
 * Zamanlamada kullanıcı cron yazmaz: sıklık + saat/gün seçer, `cron-builder`
 * ifadeyi üretir. Ham cron yalnız "Özel" seçeneğinde görünür.
 */
@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './migration.component.html',
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

  /** "Kuyruğa alınıyor" — koşunun bittiği anlamına GELMEZ. */
  readonly submitting = signal(false);

  readonly schedule = signal<MigrationSchedule | null>(null);
  readonly savingSchedule = signal(false);

  readonly tone = migrationStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);

  form = { takePreBackup: false, stopOnFailure: true };

  /** Zamanlama formunun onay kutuları — schedule() yüklenince doldurulur. */
  scheduleForm = {
    enabled: false,
    takePreBackup: true,
    stopOnFailure: true
  };

  /** Ne zaman çalışacağı — cron ifadesi bundan üretilir. */
  readonly scheduleSpec = signal<CronSpec>(parseCron(DEFAULT_CRON));
  /** '' = UTC (sunucu boş saat dilimini UTC yorumlar). */
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

  // Seçenek listeleri computed: dil değişince etiketler de değişsin.
  readonly frequencyOptions = computed<SelectOption[]>(() =>
    CRON_FREQUENCIES.map(f => ({ value: f, label: this.language.t(`pc.mig.freq.${f}`) })));

  readonly hourIntervalOptions = computed<SelectOption[]>(() =>
    HOUR_INTERVALS.map(n => ({ value: String(n), label: this.language.t('pc.mig.hourIntervalOption', { n }) })));

  /** Pazartesi'den başlar; değerler cron sırasıyla (0 = Pazar). */
  readonly weekDayOptions = computed<SelectOption[]>(() =>
    [1, 2, 3, 4, 5, 6, 0].map(d => ({ value: String(d), label: this.weekDayLabel(d) })));

  readonly monthDayOptions: SelectOption[] =
    Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

  /** Kayıtlı saat dilimi listede yoksa ham hâliyle eklenir — kaydedince kaybolmasın. */
  readonly timeZoneOptions = computed<SelectOption[]>(() => {
    const options: SelectOption[] = [
      { value: TURKEY_TIME_ZONE, label: this.language.t('pc.mig.tz.turkey') },
      { value: '', label: this.language.t('pc.mig.tz.utc') }
    ];
    const current = this.scheduleTimeZone();
    if (!options.some(o => o.value === current)) options.push({ value: current, label: current });
    return options;
  });

  /** Seçimin okunur karşılığı, ör. "Her Pazar 03:00 · Türkiye saati". Özel ifadede boş. */
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

  /** Form kayıtlı zamanlamadan farklıysa sunucunun "sonraki koşular" listesi henüz eski. */
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
          takePreBackup: r.data.takePreBackup,
          stopOnFailure: r.data.stopOnFailure
        };
        // Tanınmayan ifade "Özel"e düşer ve ham hâliyle korunur.
        this.scheduleSpec.set(parseCron(r.data.cronExpression));
        this.scheduleTimeZone.set(r.data.timeZoneId ?? '');
      },
      error: () => {}
    });
  }

  onFrequencyChange(value: string): void {
    const frequency = value as CronFrequency;
    const current = this.scheduleSpec();
    // "Özel"e geçerken mevcut seçimin cron karşılığı taşınır — sıfırdan yazılmasın.
    const raw = frequency === 'custom' ? buildCron(current) : current.raw;
    this.scheduleSpec.set({ ...current, frequency, raw });
  }

  patchSpec(patch: Partial<CronSpec>): void {
    this.scheduleSpec.set({ ...this.scheduleSpec(), ...patch });
  }

  /** `<input type="time">` değeri ("HH:mm"). */
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

  // ── Görüntüleme yardımcıları ──────────────────────────────────────────────

  /** Haftanın gününü aktif dilde yazar (0 = Pazar) — ayrı çeviri anahtarı gerekmez. */
  private weekDayLabel(day: number): string {
    // 2026-08-02 bir Pazar; gün eklenerek 0 = Pazar sırası korunur.
    const reference = new Date(2026, 7, 2 + day);
    return reference.toLocaleDateString(
      this.language.lang() === 'en' ? 'en-US' : 'tr-TR', { weekday: 'long' });
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
