import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, PagedResult, ResponseModel } from '../../core/models/api.models';
import { JobSummary } from '../../core/models/job.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/jobs`;

  list(status: string, type: string, page: number, pageSize: number)
    : Observable<DataResponseModel<PagedResult<JobSummary>>> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    return this.http.get<DataResponseModel<PagedResult<JobSummary>>>(this.baseUrl, { params });
  }

  /** Askıya alınmış işi deneme hakkı sıfırlanmış olarak yeniden kuyruğa alır (Ops.Manage). */
  retry(id: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/retry`, {});
  }

  /** Tüm askıya alınmış işleri yeniden kuyruğa alır (Ops.Manage). */
  retryAllParked(): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/retry-parked`, {});
  }
}

/** İş durumu → rozet tonu ([12 §1]). */
export function jobStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Succeeded': return 'success';
    case 'Running': return 'meta';
    case 'Failed':
    case 'Parked': return 'danger';
    case 'Cancelled': return 'warn';
    default: return 'neutral';
  }
}
