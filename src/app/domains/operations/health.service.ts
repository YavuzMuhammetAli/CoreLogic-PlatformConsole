import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel } from '../../core/models/api.models';
import { HealthTree } from '../../core/models/health.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/health`;

  tree(): Observable<DataResponseModel<HealthTree>> {
    return this.http.get<DataResponseModel<HealthTree>>(`${this.baseUrl}/tree`);
  }
}

/** Health status → badge tone. */
export function healthTone(status: string): BadgeTone {
  switch (status) {
    case 'Healthy': return 'success';
    case 'Degraded': return 'warn';
    case 'Unhealthy': return 'danger';
    case 'NotConfigured': return 'neutral'; // no target to monitor — not a problem
    default: return 'neutral';
  }
}
