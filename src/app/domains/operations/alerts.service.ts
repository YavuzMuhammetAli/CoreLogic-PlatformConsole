import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, PagedResult, ResponseModel } from '../../core/models/api.models';
import { AlertItem, AlertRuleItem } from '../../core/models/alert.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Alert Center (M23) servisi — /alerts uçları. */
@Injectable({ providedIn: 'root' })
export class AlertsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/alerts`;

  list(status: string, page: number, pageSize: number): Observable<DataResponseModel<PagedResult<AlertItem>>> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    if (status) params = params.set('status', status);
    return this.http.get<DataResponseModel<PagedResult<AlertItem>>>(this.baseUrl, { params });
  }

  rules(): Observable<ListResponseModel<AlertRuleItem>> {
    return this.http.get<ListResponseModel<AlertRuleItem>>(`${this.baseUrl}/rules`);
  }

  acknowledge(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/ack`, {});
  }

  resolve(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/resolve`, {});
  }

  toggleRule(id: number, enabled: boolean): Observable<ResponseModel> {
    const params = new HttpParams().set('enabled', String(enabled));
    return this.http.post<ResponseModel>(`${this.baseUrl}/rules/${id}/toggle`, {}, { params });
  }
}

/** Önem derecesi → rozet tonu ([12 §1]). */
export function severityTone(severity: string): BadgeTone {
  switch (severity) {
    case 'Critical': return 'danger';
    case 'Warning': return 'warn';
    case 'Info': return 'meta';
    default: return 'neutral';
  }
}

/** Uyarı durumu → rozet tonu. */
export function alertStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Firing': return 'danger';
    case 'Acknowledged': return 'warn';
    case 'Resolved': return 'success';
    default: return 'neutral';
  }
}
