import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

/**
 * Jobs & Queue (M21) — durable iş kuyruğu listesi + askıya alınmış (Parked) işleri
 * yeniden deneme. Yeniden deneme Platform.Ops.Manage ister ve denetim kaydına düşer.
 */
@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [
    DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent,
    ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe
  ],
  templateUrl: './jobs-list.component.html',
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
  /** Yeniden denenen işin id'si; toplu işlemde 'all'. */
  readonly busyId = signal<string | null>(null);
  readonly confirmRetryAll = signal(false);

  readonly statuses = JOB_STATUSES;
  readonly tone = jobStatusTone;
  readonly canManage = this.store.has(Cap.OpsManage);
  /** Dil değişince etiket de değişsin diye computed. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.jobs.allStatuses'), this.statuses, v => this.language.enumLabel(v)));

  status = '';
  page = 1;
  pageSize = 25;

  ngOnInit(): void {
    // Uyarı Merkezi "Askıya alınmış işleri gör" bağlantısı ?status=Parked ile gelir.
    const requested = this.route.snapshot.queryParamMap.get('status') ?? '';
    if ((this.statuses as readonly string[]).includes(requested)) this.status = requested;
    this.load();
  }

  /** İş tipinin okunur adı; tanınmayan tip ham hâliyle görünür. */
  typeLabel(type: string): string {
    return this.language.tOr(`pc.jobType.${type}`, type);
  }

  /** Toplu yeniden deneme yalnız "Askıya alındı" filtresinde ve kayıt varken sunulur. */
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
        this.load(); // durum başka biri tarafından değişmiş olabilir
      }
    });
  }
}
