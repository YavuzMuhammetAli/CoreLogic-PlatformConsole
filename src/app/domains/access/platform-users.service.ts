import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { PlatformRoleInfo, PlatformUserListItem } from '../../core/models/platform.models';

/**
 * Platform staff (M13). All endpoints require Platform.Iam.Manage and every write
 * operation is audited at Critical level.
 */
@Injectable({ providedIn: 'root' })
export class PlatformUsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/platform-users`;

  getAll(): Observable<ListResponseModel<PlatformUserListItem>> {
    return this.http.get<ListResponseModel<PlatformUserListItem>>(this.baseUrl);
  }

  getById(id: number): Observable<DataResponseModel<PlatformUserListItem>> {
    return this.http.get<DataResponseModel<PlatformUserListItem>>(`${this.baseUrl}/${id}`);
  }

  /** Role catalogue + capabilities — the form preview uses this. */
  roles(): Observable<ListResponseModel<PlatformRoleInfo>> {
    return this.http.get<ListResponseModel<PlatformRoleInfo>>(`${this.baseUrl}/roles`);
  }

  create(dto: { email: string; name?: string; surname?: string; password: string; roles: string[] })
    : Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(this.baseUrl, dto);
  }

  update(id: number, dto: { email: string; name?: string; surname?: string }): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.baseUrl}/${id}`, dto);
  }

  assignRole(id: number, role: string, expiresAt?: string | null): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/roles`, { role, expiresAt: expiresAt ?? null });
  }

  removeRole(id: number, role: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.baseUrl}/${id}/roles/${encodeURIComponent(role)}`);
  }

  deactivate(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  activate(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/activate`, {});
  }

  /** A user who lost their authenticator re-enrolls on their first sign-in. */
  resetMfa(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/reset-mfa`, {});
  }

  resetPassword(id: number, password: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/${id}/reset-password`, { password });
  }
}
