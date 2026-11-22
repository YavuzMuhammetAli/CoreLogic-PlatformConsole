import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, PagedResult, ResponseModel } from '../../core/models/api.models';
import { PlanItem, PlanFeatureItem, SubscriptionItem, EntitlementSnapshot } from '../../core/models/commerce.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';
import { LanguageService } from '../../services/language.service';
import { MetricCatalogService } from '../../services/metric-catalog.service';

/**
 * Human-readable form of the quota limit, e.g. "1.000.000 token". Null when the limit is empty
 * (bool feature / unlimited) — the caller supplies text suited to its own context.
 */
export function formatQuota(language: LanguageService, catalog: MetricCatalogService, f: PlanFeatureItem): string | null {
  if (f.limitValue == null) return null;
  const amount = f.limitValue.toLocaleString(language.lang() === 'en' ? 'en-US' : 'tr-TR');
  return f.unit ? `${amount} ${catalog.unitLabel(f.unit)}` : amount;
}

/** Billing (M35/M36/M12) service — /plans + /subscriptions endpoints. */
@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.platformApiBaseUrl;

  // ── Plans (M35) ──
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
  /** Code and Version never change — the identity is fixed per the versioning contract. */
  updatePlan(id: number, dto: { name: string; description?: string; isPublic: boolean; trialDays: number })
    : Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.base}/plans/${id}`, dto);
  }
  /** Succeeds only for Draft plans that have no subscribers. */
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

  // ── Subscriptions (M36) ──
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

/** Subscription status → badge tone ([12 §1]). */
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

/** Plan status → badge tone. */
export function planStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Active': return 'success';
    case 'Draft': return 'meta';
    case 'Retired': return 'neutral';
    default: return 'neutral';
  }
}
