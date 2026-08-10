import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel, ListResponseModel, ResponseModel } from '../../core/models/api.models';
import { MigrationRunItem, MigrationRunDetail, MigrationSchedule } from '../../core/models/migration.models';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Migration Orchestrator (M10) servisi — /migrations uçları. */
@Injectable({ providedIn: 'root' })
export class MigrationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.platformApiBaseUrl}/migrations`;

  listRuns(): Observable<ListResponseModel<MigrationRunItem>> {
    return this.http.get<ListResponseModel<MigrationRunItem>>(`${this.base}/runs`);
  }
  getRun(id: number): Observable<DataResponseModel<MigrationRunDetail>> {
    return this.http.get<DataResponseModel<MigrationRunDetail>>(`${this.base}/runs/${id}`);
  }
  /** Koşuyu KUYRUĞA ALIR ve hemen döner — yürütme JobWorker üzerinde sürer. */
  startRun(dto: { takePreBackup: boolean; stopOnFailure: boolean }): Observable<DataResponseModel<number>> {
    return this.http.post<DataResponseModel<number>>(`${this.base}/runs`, dto);
  }

  getSchedule(): Observable<DataResponseModel<MigrationSchedule>> {
    return this.http.get<DataResponseModel<MigrationSchedule>>(`${this.base}/schedule`);
  }

  saveSchedule(dto: MigrationSchedule): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.base}/schedule`, dto);
  }
}

export function migrationStatusTone(status: string): BadgeTone {
  switch (status) {
    case 'Completed':
    case 'Succeeded': return 'success';
    case 'Running': return 'meta';
    // Kuyrukta bekliyor — henüz bir worker sahiplenmedi.
    case 'Queued': return 'meta';
    case 'Stopped': return 'warn';
    case 'Failed': return 'danger';
    case 'Skipped': return 'neutral';
    default: return 'neutral';
  }
}
