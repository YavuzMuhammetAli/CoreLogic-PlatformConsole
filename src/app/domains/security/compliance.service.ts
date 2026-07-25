import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { ComplianceRequestItem } from '../../core/models/compliance.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Compliance & Data (M42) servisi — /compliance uçları. */
@Injectable({ providedIn: 'root' })
export class ComplianceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/compliance`;

  list(status: string, type: string): Observable<ListResponseModel<ComplianceRequestItem>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    return this.http.get<ListResponseModel<ComplianceRequestItem>>(this.base, { params });
  }
  create(dto: { type: string; tenantId: string; subjectRef?: string; reason?: string })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(this.base, dto);
  }
  advance(id: number, dto: { status: string; notes?: string }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/${id}/advance`, dto);
  }
}

export function complianceStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Completed': return 'success';
    case 'InProgress': return 'warn';
    case 'Open': return 'meta';
    case 'Rejected': return 'danger';
    default: return 'neutral';
  }
}
