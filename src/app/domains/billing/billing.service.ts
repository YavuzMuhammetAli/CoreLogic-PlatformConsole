import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, PagedResult, ResponseModel } from '../../core/models/api.models';
import { PlanItem, SubscriptionItem, EntitlementSnapshot } from '../../core/models/commerce.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Billing (M35/M36/M12) servisi — /plans + /subscriptions uçları. */
@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.platformApiBaseUrl;

  // ── Planlar (M35) ──
  plans(): Observable<ListResponseModel<PlanItem>> {
    return this.http.get<ListResponseModel<PlanItem>>(`${this.base}/plans`);
  }
  getPlan(id: number): Observable<DataResponseModel<PlanItem>> {
    return this.http.get<DataResponseModel<PlanItem>>(`${this.base}/plans/${id}`);
  }
  createPlan(dto: { code: string; name: string; description?: string; isPublic: boolean; trialDays: number })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(`${this.base}/plans`, dto);
  }
  /** Code ve Version değişmez — sürümleme sözleşmesi gereği kimlik sabittir. */
  updatePlan(id: number, dto: { name: string; description?: string; isPublic: boolean; trialDays: number })
    : Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.base}/plans/${id}`, dto);
  }
  /** Yalnız abonesi olmayan Draft planlarda başarılı olur. */
  deletePlan(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.base}/plans/${id}`);
  }
  setPlanStatus(id: number, status: string): Observable<ResponseModel> {
    const params = new HttpParams().set('status', status);
    return this.http.post<ResponseModel>(`${this.base}/plans/${id}/status`, {}, { params });
  }
  setDefaultPlan(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/plans/${id}/set-default`, {});
  }
  upsertFeature(planId: number, dto: { featureKey: string; limitValue?: number | null; unit?: string | null })
    : Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/plans/${planId}/features`, dto);
  }
  removeFeature(planId: number, featureKey: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(
      `${this.base}/plans/${planId}/features/${encodeURIComponent(featureKey)}`);
  }

  // ── Abonelikler (M36) ──
  subscriptions(status: string, page: number, pageSize: number)
    : Observable<DataResponseModel<PagedResult<SubscriptionItem>>> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    if (status) params = params.set('status', status);
    return this.http.get<DataResponseModel<PagedResult<SubscriptionItem>>>(`${this.base}/subscriptions`, { params });
  }
  createSubscription(dto: { tenantCode: string; planId: number; seats: number; trialDays: number; notes?: string })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(`${this.base}/subscriptions`, dto);
  }
  recordPayment(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/subscriptions/${id}/record-payment`, {});
  }
  cancel(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/subscriptions/${id}/cancel`, {});
  }
  extendTrial(id: number, days: number): Observable<ResponseModel> {
    const params = new HttpParams().set('days', String(days));
    return this.http.post<ResponseModel>(`${this.base}/subscriptions/${id}/extend-trial`, {}, { params });
  }

  // ── Entitlement (M12) ──
  entitlements(tenantCode: string): Observable<DataResponseModel<EntitlementSnapshot>> {
    return this.http.get<DataResponseModel<EntitlementSnapshot>>(
      `${this.base}/subscriptions/entitlements/${encodeURIComponent(tenantCode)}`);
  }

  // ── Cost & AI Analytics (M33/M34) ──
  costByTenant(): Observable<ListResponseModel<CostByTenant>> {
    return this.http.get<ListResponseModel<CostByTenant>>(`${this.base}/cost/by-tenant`);
  }
}

export interface CostLine { metricKey: string; quantity: number; unitCost: number; cost: number; }
export interface CostByTenant { tenantId: string; totalCost: number; lines: CostLine[]; }

/** Abonelik durumu → rozet tonu ([12 §1]). */
export function subStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Active': return 'success';
    case 'Trial': return 'meta';
    case 'PastDue': return 'warn';
    case 'Suspended':
    case 'Cancelled':
    case 'Expired': return 'danger';
    default: return 'neutral';
  }
}

/** Plan durumu → rozet tonu. */
export function planStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Active': return 'success';
    case 'Draft': return 'meta';
    case 'Retired': return 'neutral';
    default: return 'neutral';
  }
}
