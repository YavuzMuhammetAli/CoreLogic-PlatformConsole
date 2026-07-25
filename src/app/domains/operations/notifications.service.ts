import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { NotificationItem, NotificationRuleItem } from '../../core/models/notification.models';

/** Notification Center (M25) servisi — /notifications uçları. */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/notifications`;

  list(unreadOnly: boolean, take = 50): Observable<ListResponseModel<NotificationItem>> {
    const params = new HttpParams().set('unreadOnly', String(unreadOnly)).set('take', String(take));
    return this.http.get<ListResponseModel<NotificationItem>>(this.base, { params });
  }
  unreadCount(): Observable<DataResponseModel<number>> {
    return this.http.get<DataResponseModel<number>>(`${this.base}/unread-count`);
  }
  markRead(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/${id}/read`, {});
  }
  markAllRead(): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/read-all`, {});
  }
  rules(): Observable<ListResponseModel<NotificationRuleItem>> {
    return this.http.get<ListResponseModel<NotificationRuleItem>>(`${this.base}/rules`);
  }
  createRule(dto: { name: string; triggerType: string; triggerFilter?: string; channelType: string; targets?: string; throttleMinutes: number })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(`${this.base}/rules`, dto);
  }
  toggleRule(id: number, enabled: boolean): Observable<ResponseModel> {
    const params = new HttpParams().set('enabled', String(enabled));
    return this.http.post<ResponseModel>(`${this.base}/rules/${id}/toggle`, {}, { params });
  }
}
