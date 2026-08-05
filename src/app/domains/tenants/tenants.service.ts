import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import {
  PagedResult, TenantDetail, TenantModelTree, TenantStateHistory, TenantSummary, TenantTables
} from '../../core/models/tenant.models';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/tenants`;

  list(search: string, status: string, page: number, pageSize: number)
    : Observable<DataResponseModel<PagedResult<TenantSummary>>> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<DataResponseModel<PagedResult<TenantSummary>>>(this.baseUrl, { params });
  }

  get(code: string): Observable<DataResponseModel<TenantDetail>> {
    return this.http.get<DataResponseModel<TenantDetail>>(`${this.baseUrl}/${encodeURIComponent(code)}`);
  }

  stateHistory(code: string): Observable<ListResponseModel<TenantStateHistory>> {
    return this.http.get<ListResponseModel<TenantStateHistory>>(`${this.action(code, 'state-history')}`);
  }

  /** Ana + alt modeller (tenant DB'sinden canlı; registry read-model'i parent/depth taşımıyor). */
  models(code: string): Observable<DataResponseModel<TenantModelTree>> {
    return this.http.get<DataResponseModel<TenantModelTree>>(this.action(code, 'models'));
  }

  /** Fiziksel tablolar: boyut + yayınlanmış/sistem sınıflandırması. */
  tables(code: string): Observable<DataResponseModel<TenantTables>> {
    return this.http.get<DataResponseModel<TenantTables>>(this.action(code, 'tables'));
  }

  // ── Yaşam döngüsü geçişleri (M04) ──
  suspend(code: string, reason: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'suspend'), { reason });
  }
  resume(code: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'resume'), {});
  }
  archive(code: string, reason: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'archive'), { reason });
  }
  unarchive(code: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'unarchive'), {});
  }
  schedulePurge(code: string, reason: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'schedule-purge'), { reason });
  }
  cancelPurge(code: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.action(code, 'cancel-purge'), {});
  }

  private action(code: string, path: string): string {
    return `${this.baseUrl}/${encodeURIComponent(code)}/${path}`;
  }
}

/** Tenant/kurulum durumu → rozet tonu ([12 §1]). */
export function tenantStatusTone(status: string): 'success' | 'warn' | 'danger' | 'meta' | 'neutral' {
  switch (status) {
    case 'Active':
    case 'Completed': return 'success';
    case 'Provisioning':
    case 'Running': return 'meta';
    case 'Suspended': return 'warn';
    case 'Failed':
    case 'RolledBack': return 'danger';
    default: return 'neutral';
  }
}

/** Sağlık durumu → rozet tonu ([07 §1]). */
export function healthTone(status: string): 'success' | 'warn' | 'danger' | 'meta' | 'neutral' {
  switch (status) {
    case 'Healthy': return 'success';
    case 'Degraded': return 'warn';
    case 'Unhealthy': return 'danger';
    default: return 'neutral'; // Unknown
  }
}
