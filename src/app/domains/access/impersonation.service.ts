import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { ImpersonationGrantItem, ImpersonationToken } from '../../core/models/impersonation.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Support & Impersonation (M17) service — /impersonation endpoints. */
@Injectable({ providedIn: 'root' })
export class ImpersonationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/impersonation`;

  list(status: string): Observable<ListResponseModel<ImpersonationGrantItem>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ListResponseModel<ImpersonationGrantItem>>(this.base, { params });
  }
  request(dto: { tenantId: string; targetUserId?: number | null; reason: string; hours: number })
    : Observable<DataResponseModel<string>> {
    return this.http.post<DataResponseModel<string>>(`${this.base}/request`, dto);
  }
  approve(id: string): Observable<ResponseModel> { return this.http.post<ResponseModel>(`${this.base}/${id}/approve`, {}); }
  deny(id: string): Observable<ResponseModel> { return this.http.post<ResponseModel>(`${this.base}/${id}/deny`, {}); }
  issue(id: string): Observable<DataResponseModel<ImpersonationToken>> {
    return this.http.post<DataResponseModel<ImpersonationToken>>(`${this.base}/${id}/issue`, {});
  }
  revoke(id: string): Observable<ResponseModel> { return this.http.post<ResponseModel>(`${this.base}/${id}/revoke`, {}); }
}

export function grantStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Approved': return 'success';
    case 'ActiveUse': return 'warn';
    case 'Requested': return 'meta';
    case 'Denied':
    case 'Revoked':
    case 'Expired': return 'danger';
    default: return 'neutral';
  }
}
