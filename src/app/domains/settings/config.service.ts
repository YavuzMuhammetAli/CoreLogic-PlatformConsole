import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { PlatformConfigItem } from '../../core/models/config.models';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/config`;

  getAll(): Observable<ListResponseModel<PlatformConfigItem>> {
    return this.http.get<ListResponseModel<PlatformConfigItem>>(this.baseUrl);
  }

  /**
   * Writes a single setting.
   *
   * `isSecret` is NOT sent: the server decides whether a key is secret
   * (PlatformConfigKeys.Secret). Sending an empty value for a secret key
   * means "don't change" — the existing secret is kept.
   */
  set(key: string, value: string): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.baseUrl}/${encodeURIComponent(key)}`, { value });
  }
}
