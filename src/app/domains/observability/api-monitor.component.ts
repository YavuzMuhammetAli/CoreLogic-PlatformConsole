import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TelemetryService, statusTone, errorRateTone } from './telemetry.service';
import { RequestTrace, RouteMetric } from '../../core/models/telemetry.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

type Tab = 'metrics' | 'live';

/** API Monitoring (M27) — metrikler (rollup) + son istek izleri (5 sn canlı akış). */
@Component({
  selector: 'app-api-monitor',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './api-monitor.component.html',
  styleUrl: './api-monitor.component.scss'
})
export class ApiMonitorComponent implements OnInit, OnDestroy {
  private readonly service = inject(TelemetryService);

  readonly tab = signal<Tab>('metrics');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly items = signal<RequestTrace[]>([]);
  readonly metrics = signal<RouteMetric[]>([]);

  readonly tone = statusTone;
  readonly errTone = errorRateTone;

  auto = false;
  take = 100;
  hours = 24;
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void { this.loadMetrics(); }

  ngOnDestroy(): void { this.stopAuto(); }

  selectTab(t: Tab): void {
    this.tab.set(t);
    this.stopAuto(); this.auto = false;
    if (t === 'metrics') this.loadMetrics();
    else this.load();
  }

  loadMetrics(): void {
    this.loading.set(true); this.error.set(null);
    this.service.routeMetrics(this.hours).subscribe({
      next: res => { this.loading.set(false); res.success ? this.metrics.set(res.data ?? []) : this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.recentRequests(this.take).subscribe({
      next: res => { this.loading.set(false); res.success ? this.items.set(res.data ?? []) : this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  toggleAuto(): void { this.auto ? this.startAuto() : this.stopAuto(); }

  private startAuto(): void {
    this.stopAuto();
    this.timer = setInterval(() => {
      if (document.visibilityState === 'visible') this.load();
    }, 5000);
  }

  private stopAuto(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
}
