import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { UpdateWorkerRequest, WorkerStatus } from '../../core/models/worker.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Worker control plane (migration 025) service — /workers endpoints. */
@Injectable({ providedIn: 'root' })
export class WorkerService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/workers`;

  list(): Observable<ListResponseModel<WorkerStatus>> {
    return this.http.get<ListResponseModel<WorkerStatus>>(this.base);
  }

  update(name: string, dto: UpdateWorkerRequest): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.base}/${encodeURIComponent(name)}`, dto);
  }

  /**
   * Resets the loop — the process is NOT RESTARTED. That's why the endpoint is /reset,
   * not /restart: on its next tick the worker re-runs its shutdown+startup steps
   * while the application process stays up.
   */
  reset(name: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.base}/${encodeURIComponent(name)}/reset`, {});
  }
}

export function workerStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Running': return 'success';
    case 'Disabled': return 'neutral';
    case 'Stale': return 'warn';
    case 'Error': return 'danger';
    default: return 'neutral';
  }
}
