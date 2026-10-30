import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TenantsService, tenantStatusTone, healthTone } from './tenants.service';
import { PagedResult, TenantSummary, TENANT_STATUSES } from '../../core/models/tenant.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent, withAllOption } from '../../shared/ui/select/select.component';
import { LanguageService } from '../../services/language.service';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Tenant Directory listesi (M02) — arama/durum filtresi + sayfalama. */
@Component({
    selector: 'app-tenant-list',
    imports: [DatePipe, FormsModule, RouterLink, StatusBadgeComponent, SelectComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './tenant-list.component.html',
    styleUrl: './tenant-list.component.scss'
})
export class TenantListComponent implements OnInit {
  private readonly service = inject(TenantsService);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly result = signal<PagedResult<TenantSummary> | null>(null);

  readonly statuses = TENANT_STATUSES;
  readonly tone = tenantStatusTone;
  readonly hTone = healthTone;
  /** Dil değişince etiket de değişsin diye computed. */
  readonly statusOptions = computed(() =>
    withAllOption(this.language.t('pc.tenants.allStatuses'), this.statuses, v => this.language.enumLabel(v)));

  search = '';
  status = '';
  page = 1;
  pageSize = 25;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list(this.search.trim(), this.status, this.page, this.pageSize).subscribe({
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
