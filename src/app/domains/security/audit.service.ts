import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel } from '../../core/models/api.models';
import { PlatformAuditLogItem } from '../../core/models/platform.models';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/audit-logs`;

  query(category: string | null, take: number, correlationId?: string | null)
    : Observable<ListResponseModel<PlatformAuditLogItem>> {
    let params = new HttpParams().set('take', String(take));
    if (category) params = params.set('category', category);
    if (correlationId) params = params.set('correlationId', correlationId);
    return this.http.get<ListResponseModel<PlatformAuditLogItem>>(this.baseUrl, { params });
  }
}
