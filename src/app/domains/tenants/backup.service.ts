import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { TenantBackupItem } from '../../core/models/backup.models';

/** Backup/Restore (M09) service — /backups endpoints. */
@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/backups`;

  list(tenantCode: string): Observable<ListResponseModel<TenantBackupItem>> {
    const params = new HttpParams().set('tenantCode', tenantCode);
    return this.http.get<ListResponseModel<TenantBackupItem>>(this.base, { params });
  }
  create(tenantCode: string, type = 'Manual'): Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(this.base, { tenantCode, type });
  }
  verify(id: number): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/${id}/verify`, {});
  }
}
