import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { UpdateWorkerRequest, WorkerStatus } from '../../core/models/worker.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Worker kontrol düzlemi (migrasyon 025) servisi — /workers uçları. */
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
   * Döngüyü yeniler — proses YENİDEN BAŞLATILMAZ. Uç adı bu yüzden /restart
   * değil /reset: worker bir sonraki turda kapanış+başlangıç adımlarını
   * yeniden koşar, uygulama süreci ayakta kalır.
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
