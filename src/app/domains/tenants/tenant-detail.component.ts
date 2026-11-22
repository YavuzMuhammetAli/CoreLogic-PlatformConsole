import { Component, DestroyRef, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantsService, tenantStatusTone, healthTone } from './tenants.service';
import { BillingService, subStatusTone } from '../billing/billing.service';
import { BackupService } from './backup.service';
import { TenantDetail, TenantModelTree, TenantStateHistory, TenantTables } from '../../core/models/tenant.models';
import { EntitlementSnapshot } from '../../core/models/commerce.models';
import { TenantBackupItem } from '../../core/models/backup.models';
import { ResponseModel } from '../../core/models/api.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { MetricCatalogService } from '../../services/metric-catalog.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

type Tab = 'summary' | 'provisioning' | 'history' | 'licensing' | 'backups' | 'models' | 'tables';

interface TenantAction {
  key: string;
  labelKey: string;
  danger: boolean;
  cap: 'write' | 'purge';
}

interface PendingAction {
  action: string;
  titleKey: string;
  messageKey: string;
  requireReason: boolean;
  confirmCode: string | null;
  danger: boolean;
}

/** Tenant detail (M02/M04) — summary/provisioning/history + lifecycle actions. */
@Component({
    selector: 'app-tenant-detail',
    imports: [DatePipe, DecimalPipe, RouterLink, StatusBadgeComponent, ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './tenant-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent implements OnInit {
  private readonly service = inject(TenantsService);
  private readonly billing = inject(BillingService);
  private readonly backupSvc = inject(BackupService);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(PlatformSessionStore);
  private readonly language = inject(LanguageService);
  private readonly catalog = inject(MetricCatalogService);
  private backupPoll: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => { if (this.backupPoll !== null) clearTimeout(this.backupPoll); });
  }

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly detail = signal<TenantDetail | null>(null);
  readonly tab = signal<Tab>('summary');
  readonly history = signal<TenantStateHistory[]>([]);
  readonly historyLoaded = signal(false);
  readonly pending = signal<PendingAction | null>(null);
  readonly busy = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly entitlement = signal<EntitlementSnapshot | null>(null);
  readonly entitlementLoaded = signal(false);
  readonly backups = signal<TenantBackupItem[]>([]);
  readonly backupsLoaded = signal(false);
  readonly backupBusy = signal<number | null>(null);

  readonly models = signal<TenantModelTree | null>(null);
  readonly modelsLoaded = signal(false);
  readonly modelsError = signal<string | null>(null);

  readonly tables = signal<TenantTables | null>(null);
  readonly tablesLoaded = signal(false);
  readonly tablesError = signal<string | null>(null);

  readonly tone = tenantStatusTone;
  readonly hTone = healthTone;
  readonly subTone = subStatusTone;
  readonly canWrite = this.store.has(Cap.TenantsWrite);
  readonly canOps = this.store.has(Cap.OpsManage);
  readonly canPurge = this.store.has(Cap.TenantsPurge);

  private code = '';

  private readonly A = {
    suspend: { key: 'suspend', labelKey: 'pc.lc.suspend', danger: false, cap: 'write' as const },
    resume: { key: 'resume', labelKey: 'pc.lc.resume', danger: false, cap: 'write' as const },
    archive: { key: 'archive', labelKey: 'pc.lc.archive', danger: false, cap: 'write' as const },
    unarchive: { key: 'unarchive', labelKey: 'pc.lc.unarchive', danger: false, cap: 'write' as const },
    purge: { key: 'schedule-purge', labelKey: 'pc.lc.schedulePurge', danger: true, cap: 'purge' as const },
    cancelPurge: { key: 'cancel-purge', labelKey: 'pc.lc.cancelPurge', danger: false, cap: 'purge' as const }
  };

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (!code) { this.error.set('Kod yok'); this.loading.set(false); return; }
    this.code = code;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.get(this.code).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.detail.set(res.data);
        else this.error.set(res.message);
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  selectTab(t: Tab): void {
    this.tab.set(t);
    if (t === 'history' && !this.historyLoaded()) this.loadHistory();
    if (t === 'licensing' && !this.entitlementLoaded()) this.loadEntitlement();
    if (t === 'backups' && !this.backupsLoaded()) this.loadBackups();
    if (t === 'models' && !this.modelsLoaded()) this.loadModels();
    if (t === 'tables' && !this.tablesLoaded()) this.loadTables();
  }

  /**
   * Model tree — goes live to the tenant DB. Unlike the other tabs its error is
   * not swallowed: for a tenant that isn't fully provisioned/reachable, a message
   * stating the reason is shown instead of an empty list.
   */
  private loadModels(): void {
    const code = this.detail()?.code;
    if (!code) return;
    this.modelsError.set(null);
    this.service.models(code).subscribe({
      next: res => {
        if (res.success) this.models.set(res.data);
        else this.modelsError.set(res.message);
        this.modelsLoaded.set(true);
      },
      error: err => {
        this.modelsError.set(err?.error?.message ?? 'Modeller yüklenemedi');
        this.modelsLoaded.set(true);
      }
    });
  }

  /** Table inventory — same error approach as the model tree. */
  private loadTables(): void {
    const code = this.detail()?.code;
    if (!code) return;
    this.tablesError.set(null);
    this.service.tables(code).subscribe({
      next: res => {
        if (res.success) this.tables.set(res.data);
        else this.tablesError.set(res.message);
        this.tablesLoaded.set(true);
      },
      error: err => {
        this.tablesError.set(err?.error?.message ?? 'Tablolar yüklenemedi');
        this.tablesLoaded.set(true);
      }
    });
  }

  /** Table kind → badge tone. Orphan tables (deleted model) stand out with a warning tone. */
  tableKindTone(kind: string): 'success' | 'warn' | 'danger' | 'meta' | 'neutral' {
    switch (kind) {
      case 'Published': return 'success';
      case 'DeletedModel': return 'warn';
      case 'System': return 'meta';
      default: return 'neutral';
    }
  }

  private loadBackups(): void {
    const code = this.detail()?.code;
    if (!code) return;
    this.backupSvc.list(code).subscribe({
      next: res => {
        if (res.success) this.backups.set(res.data ?? []);
        this.backupsLoaded.set(true);
        this.scheduleBackupPoll();
      },
      error: () => { this.backupsLoaded.set(true); }
    });
  }

  /** Is there a queued/running backup — backups now run in the background and the list is polled. */
  hasActiveBackup(): boolean {
    return this.backups().some(b => b.status === 'Queued' || b.status === 'Running');
  }

  /** Re-reads the list every few seconds while a backup is queued/running. */
  private scheduleBackupPoll(): void {
    if (this.backupPoll !== null) clearTimeout(this.backupPoll);
    this.backupPoll = null;
    if (!this.hasActiveBackup()) return;
    this.backupPoll = setTimeout(() => { this.backupPoll = null; this.loadBackups(); }, 3000);
  }

  runBackup(): void {
    const code = this.detail()?.code;
    if (!code) return;
    this.backupBusy.set(-1);
    // The server queues the backup and returns immediately; progress is tracked by polling the list.
    this.backupSvc.create(code).subscribe({
      next: res => {
        this.backupBusy.set(null);
        if (!res.success) this.actionError.set(res.message);
        this.loadBackups();
      },
      error: e => { this.backupBusy.set(null); this.actionError.set(e?.error?.message ?? 'Yedek alınamadı'); }
    });
  }

  verifyBackup(b: TenantBackupItem): void {
    this.backupBusy.set(b.id);
    this.backupSvc.verify(b.id).subscribe({
      next: () => { this.backupBusy.set(null); this.loadBackups(); },
      error: e => { this.backupBusy.set(null); this.actionError.set(e?.error?.message ?? 'Doğrulanamadı'); }
    });
  }

  private loadEntitlement(): void {
    const code = this.detail()?.code;
    if (!code) return;
    this.billing.entitlements(code).subscribe({
      next: res => { if (res.success) this.entitlement.set(res.data); this.entitlementLoaded.set(true); },
      error: () => { this.entitlementLoaded.set(true); }
    });
  }

  /** Converts the entitlement snapshot's feature dict into an array suitable for the template. */
  entitlementFeatures(): { key: string; limit: number | null }[] {
    const f = this.entitlement()?.features ?? {};
    return Object.keys(f).sort().map(key => ({ key, limit: f[key] }));
  }

  /** The feature/quota key and backup type come raw from the server. */
  featureLabel(key: string): string {
    return this.catalog.label(key);
  }

  enumLabel(value: string): string {
    return this.language.enumLabel(value);
  }

  private loadHistory(): void {
    this.service.stateHistory(this.code).subscribe({
      next: res => { if (res.success) { this.history.set(res.data ?? []); this.historyLoaded.set(true); } },
      error: () => {}
    });
  }

  availableActions(): TenantAction[] {
    const d = this.detail();
    if (!d) return [];
    const byStatus: Record<string, TenantAction[]> = {
      Active: [this.A.suspend, this.A.archive, this.A.purge],
      Suspended: [this.A.resume, this.A.archive, this.A.purge],
      Archived: [this.A.unarchive, this.A.purge],
      PendingPurge: [this.A.cancelPurge]
    };
    const list = byStatus[d.status] ?? [];
    return list.filter(a => a.cap === 'purge' ? this.canPurge : this.canWrite);
  }

  openAction(a: TenantAction): void {
    this.actionError.set(null);
    const isPurge = a.key === 'schedule-purge';
    const reasonActions = new Set(['suspend', 'archive', 'schedule-purge']);
    this.pending.set({
      action: a.key,
      titleKey: a.labelKey,
      messageKey: this.messageKeyFor(a.key),
      requireReason: reasonActions.has(a.key),
      confirmCode: isPurge ? this.code : null,
      danger: a.danger
    });
  }

  onConfirm(reason: string): void {
    const p = this.pending();
    if (!p) return;
    this.busy.set(true);
    this.call(p.action, reason).subscribe({
      next: res => {
        this.busy.set(false);
        this.pending.set(null);
        if (res.success) {
          this.historyLoaded.set(false);
          this.load();
        } else {
          this.actionError.set(res.message);
        }
      },
      error: err => {
        this.busy.set(false);
        this.pending.set(null);
        this.actionError.set(err?.error?.message ?? 'İşlem başarısız');
      }
    });
  }

  private call(action: string, reason: string): Observable<ResponseModel> {
    switch (action) {
      case 'suspend': return this.service.suspend(this.code, reason);
      case 'resume': return this.service.resume(this.code);
      case 'archive': return this.service.archive(this.code, reason);
      case 'unarchive': return this.service.unarchive(this.code);
      case 'schedule-purge': return this.service.schedulePurge(this.code, reason);
      default: return this.service.cancelPurge(this.code);
    }
  }

  private messageKeyFor(action: string): string {
    switch (action) {
      case 'suspend': return 'pc.lc.suspendMsg';
      case 'archive': return 'pc.lc.archiveMsg';
      case 'schedule-purge': return 'pc.lc.purgeMsg';
      default: return 'pc.lc.genericMsg';
    }
  }
}
