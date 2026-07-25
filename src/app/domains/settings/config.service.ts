import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel } from '../../core/models/api.models';
import { PlatformConfigItem } from '../../core/models/config.models';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/config`;

  getAll(): Observable<ListResponseModel<PlatformConfigItem>> {
    return this.http.get<ListResponseModel<PlatformConfigItem>>(this.baseUrl);
  }
}
