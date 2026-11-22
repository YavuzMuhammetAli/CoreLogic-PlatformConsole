import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { JobsService, jobStatusTone } from './jobs.service';
import { JobSummary, JOB_STATUSES } from '../../core/models/job.models';
import { PagedResult, ResponseModel } from '../../core/models/api.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Jobs & Queue (M21) — durable job queue list + retrying parked (Parked)
 * jobs. Retrying requires Platform.Ops.Manage and is written to the audit log.
 */
@Component({
    selector: 'app-jobs-list',
    imports: [
        DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent,
        ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe, IconComponent
    ],
    templateUrl: './jobs-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './jobs-list.component.scss'
})
export class JobsListComponent implements OnInit {
  private readonly service = inject(JobsService);
  private readonly language = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(PlatformSessionStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly result = signal<PagedResult<JobSummary> | null>(null);
  /** Id of the job being retried; 'all' for the bulk operation. */
  readonly busyId = signal<string | null>(null);
  readonly confirmRetryAll = signal(false);

  readonly statuses = JOB_STATUSES;
  readonly tone = jobStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);
  /** Computed so the label also changes when the language changes. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.jobs.allStatuses'), this.statuses, v => this.language.enumLabel(v)));

  status = '';
  page = 1;
  pageSize = 25;

  ngOnInit(): void {
    // The Alert Center's "Askıya alınmış işleri gör" (View parked jobs) link arrives with ?status=Parked.
    const requested = this.route.snapshot.queryParamMap.get('status') ?? '';
    if ((this.statuses as readonly string[]).includes(requested)) this.status = requested;
    this.load();
  }

  /** Readable name of the job type; an unknown type is shown as-is. */
  typeLabel(type: string): string {
    return this.language.tOr(`pc.jobType.${type}`, type);
  }

  /** Bulk retry is offered only under the "Askıya alındı" (Parked) filter and when there are records. */
  canRetryAll(): boolean {
    return this.canManage && this.status === 'Parked' && (this.result()?.total ?? 0) > 0;
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list(this.status, '', this.page, this.pageSize).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.result.set(res.data);
        else this.error.set(res.message);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.loadFailed'));
      }
    });
  }

  applyFilter(): void {
    this.page = 1;
    this.load();
  }

  prev(): void {
    if (this.page > 1) { this.page--; this.load(); }
  }

  next(): void {
    if (this.result()?.hasMore) { this.page++; this.load(); }
  }

  retry(job: JobSummary): void {
    this.run(job.id, this.service.retry(job.id));
  }

  retryAll(): void {
    this.run('all', this.service.retryAllParked(), () => this.confirmRetryAll.set(false));
  }

  private run(busyKey: string, request: Observable<ResponseModel>, done?: () => void): void {
    this.busyId.set(busyKey);
    this.error.set(null);
    this.notice.set(null);
    request.subscribe({
      next: res => {
        this.busyId.set(null);
        done?.();
        if (res.success) this.notice.set(res.message);
        else this.error.set(res.message);
        this.load();
      },
      error: err => {
        this.busyId.set(null);
        done?.();
        this.error.set(err?.error?.message ?? this.language.t('pc.actionFailed'));
        this.load(); // the status may have been changed by someone else
      }
    });
  }
}
