import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { FeatureFlagItem } from '../../core/models/flag.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Feature Flags (M39) service — /feature-flags endpoints. */
@Injectable({ providedIn: 'root' })
export class FlagsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/feature-flags`;

  list(): Observable<ListResponseModel<FeatureFlagItem>> {
    return this.http.get<ListResponseModel<FeatureFlagItem>>(this.base);
  }
  create(dto: { key: string; description?: string; defaultState: string; percentage: number })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(this.base, dto);
  }
  setState(key: string, dto: { defaultState: string; percentage: number; removeBy?: string | null })
    : Observable<ResponseModel> {
    return this.http.patch<ResponseModel>(`${this.base}/${encodeURIComponent(key)}`, dto);
  }
  setOverride(key: string, tenantId: string, dto: { state: string; reason?: string; expiresAt?: string | null })
    : Observable<ResponseModel> {
    return this.http.put<ResponseModel>(
      `${this.base}/${encodeURIComponent(key)}/overrides/${encodeURIComponent(tenantId)}`, dto);
  }
  removeOverride(key: string, tenantId: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(
      `${this.base}/${encodeURIComponent(key)}/overrides/${encodeURIComponent(tenantId)}`);
  }
}

/** Flag state → badge tone. */
export function flagStateTone(state: string): BadgeTone {
  switch (state) {
    case 'On': return 'success';
    case 'Off': return 'neutral';
    case 'Percentage': return 'meta';
    default: return 'neutral';
  }
}
