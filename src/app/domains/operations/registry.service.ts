import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel } from '../../core/models/api.models';
import { TenantModelSummaryItem, TenantDriftItem } from '../../core/models/registry.models';

/** Model Registry (M11) servisi — /registry uçları. */
@Injectable({ providedIn: 'root' })
export class RegistryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/registry`;

  models(tenantId?: string): Observable<ListResponseModel<TenantModelSummaryItem>> {
    let params = new HttpParams();
    if (tenantId) params = params.set('tenantId', tenantId);
    return this.http.get<ListResponseModel<TenantModelSummaryItem>>(`${this.base}/models`, { params });
  }

  drift(): Observable<ListResponseModel<TenantDriftItem>> {
    return this.http.get<ListResponseModel<TenantDriftItem>>(`${this.base}/drift`);
  }
}
