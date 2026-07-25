import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { LoginAttemptItem, SecurityEventItem, IpAccessRuleItem } from '../../core/models/security.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Security Center (M18/M19) servisi — /security uçları. */
@Injectable({ providedIn: 'root' })
export class SecurityCenterService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/security`;

  loginAttempts(email: string, ip: string, take = 100): Observable<ListResponseModel<LoginAttemptItem>> {
    let params = new HttpParams().set('take', String(take));
    if (email) params = params.set('email', email);
    if (ip) params = params.set('ip', ip);
    return this.http.get<ListResponseModel<LoginAttemptItem>>(`${this.base}/login-attempts`, { params });
  }
  events(status: string, take = 100): Observable<ListResponseModel<SecurityEventItem>> {
    let params = new HttpParams().set('take', String(take));
    if (status) params = params.set('status', status);
    return this.http.get<ListResponseModel<SecurityEventItem>>(`${this.base}/events`, { params });
  }
  reviewEvent(id: number, status: string): Observable<ResponseModel> {
    const params = new HttpParams().set('status', status);
    return this.http.post<ResponseModel>(`${this.base}/events/${id}/review`, {}, { params });
  }
  ipRules(): Observable<ListResponseModel<IpAccessRuleItem>> {
    return this.http.get<ListResponseModel<IpAccessRuleItem>>(`${this.base}/ip-rules`);
  }
  addIpRule(dto: { cidr: string; action: string; reason?: string }): Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(`${this.base}/ip-rules`, dto);
  }
  removeIpRule(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.base}/ip-rules/${id}`);
  }
}

export function eventStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Open': return 'danger';
    case 'Escalated': return 'warn';
    case 'Reviewed': return 'success';
    case 'Dismissed': return 'neutral';
    default: return 'neutral';
  }
}
