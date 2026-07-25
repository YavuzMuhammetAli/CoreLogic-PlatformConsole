import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel } from '../../core/models/api.models';
import { PlatformUserListItem } from '../../core/models/platform.models';

@Injectable({ providedIn: 'root' })
export class PlatformUsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/platform-users`;

  getAll(): Observable<ListResponseModel<PlatformUserListItem>> {
    return this.http.get<ListResponseModel<PlatformUserListItem>>(this.baseUrl);
  }
}
