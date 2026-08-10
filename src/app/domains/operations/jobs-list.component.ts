import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JobsService, jobStatusTone } from './jobs.service';
import { JobSummary, JOB_STATUSES } from '../../core/models/job.models';
import { PagedResult } from '../../core/models/api.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Jobs & Queue (M21) — durable iş kuyruğu listesi (salt-okur). Müdahaleler sonraki adım. */
@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.scss'
})
export class JobsListComponent implements OnInit {
  private readonly service = inject(JobsService);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly result = signal<PagedResult<JobSummary> | null>(null);

  readonly statuses = JOB_STATUSES;
  readonly tone = jobStatusTone;
  /** Dil değişince etiket de değişsin diye computed. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.jobs.allStatuses'), this.statuses));

  status = '';
  page = 1;
  pageSize = 25;

  ngOnInit(): void {
    this.load();
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
        this.error.set(err?.error?.message ?? 'Yüklenemedi');
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
}
