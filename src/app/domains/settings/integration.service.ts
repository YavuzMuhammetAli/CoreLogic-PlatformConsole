import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { WebhookItem, WebhookDeliveryItem, ApiKeyItem } from '../../core/models/integration.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Integration Center (M40) servisi — /integration uçları. */
@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/integration`;

  webhooks(): Observable<ListResponseModel<WebhookItem>> {
    return this.http.get<ListResponseModel<WebhookItem>>(`${this.base}/webhooks`);
  }
  createWebhook(dto: { name: string; url: string; eventTypes?: string })
    : Observable<DataResponseModel<{ id: number; secret: string }>> {
    return this.http.post<DataResponseModel<{ id: number; secret: string }>>(`${this.base}/webhooks`, dto);
  }
  toggleWebhook(id: number, enabled: boolean): Observable<ResponseModel> {
    const params = new HttpParams().set('enabled', String(enabled));
    return this.http.post<ResponseModel>(`${this.base}/webhooks/${id}/toggle`, {}, { params });
  }
  deleteWebhook(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.base}/webhooks/${id}`);
  }
  deliveries(webhookId: number): Observable<ListResponseModel<WebhookDeliveryItem>> {
    const params = new HttpParams().set('webhookId', String(webhookId));
    return this.http.get<ListResponseModel<WebhookDeliveryItem>>(`${this.base}/deliveries`, { params });
  }
  apiKeys(): Observable<ListResponseModel<ApiKeyItem>> {
    return this.http.get<ListResponseModel<ApiKeyItem>>(`${this.base}/api-keys`);
  }
  createApiKey(dto: { name: string; scopes?: string }): Observable<DataResponseModel<{ id: number; rawKey: string }>> {
    return this.http.post<DataResponseModel<{ id: number; rawKey: string }>>(`${this.base}/api-keys`, dto);
  }
  revokeApiKey(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/api-keys/${id}/revoke`, {});
  }
}

export function deliveryTone(status: string): BadgeTone {
  switch (status) {
    case 'Delivered': return 'success';
    case 'Pending': return 'meta';
    case 'Failed': return 'danger';
    default: return 'neutral';
  }
}
