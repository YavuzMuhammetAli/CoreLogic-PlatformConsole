import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { AnnouncementItem, DatabaseServerItem } from '../../core/models/announcement.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Announcements & Status (M26) servisi — /announcements uçları. */
@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/announcements`;

  list(status: string): Observable<ListResponseModel<AnnouncementItem>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ListResponseModel<AnnouncementItem>>(this.base, { params });
  }
  create(dto: { title: string; body?: string; severity: string }): Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(this.base, dto);
  }
  publish(id: number): Observable<ResponseModel> { return this.http.post<ResponseModel>(`${this.base}/${id}/publish`, {}); }
  expire(id: number): Observable<ResponseModel> { return this.http.post<ResponseModel>(`${this.base}/${id}/expire`, {}); }
  servers(): Observable<ListResponseModel<DatabaseServerItem>> {
    return this.http.get<ListResponseModel<DatabaseServerItem>>(`${this.base}/servers`);
  }
}

export function severityTone(sev: string): BadgeTone {
  switch (sev) {
    case 'Incident': return 'danger';
    case 'Maintenance': return 'warn';
    case 'Info': return 'meta';
    default: return 'neutral';
  }
}

export function announcementStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Published': return 'success';
    case 'Draft': return 'meta';
    case 'Expired': return 'neutral';
    default: return 'neutral';
  }
}
