import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel } from '../../core/models/api.models';
import { RequestTrace, RouteMetric } from '../../core/models/telemetry.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/telemetry`;

  recentRequests(take: number): Observable<ListResponseModel<RequestTrace>> {
    const params = new HttpParams().set('take', String(take));
    return this.http.get<ListResponseModel<RequestTrace>>(`${this.baseUrl}/requests`, { params });
  }

  routeMetrics(hours: number): Observable<ListResponseModel<RouteMetric>> {
    const params = new HttpParams().set('hours', String(hours));
    return this.http.get<ListResponseModel<RouteMetric>>(`${this.baseUrl}/metrics`, { params });
  }
}

/** Hata oranı → rozet tonu. */
export function errorRateTone(pct: number): BadgeTone {
  if (pct >= 5) return 'danger';
  if (pct >= 1) return 'warn';
  return 'success';
}

/** HTTP durum kodu → rozet tonu. */
export function statusTone(code: number): BadgeTone {
  if (code >= 500) return 'danger';
  if (code >= 400) return 'warn';
  if (code >= 300) return 'meta';
  if (code >= 200) return 'success';
  return 'neutral';
}
