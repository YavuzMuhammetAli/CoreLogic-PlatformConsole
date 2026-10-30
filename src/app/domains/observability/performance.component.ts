import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TelemetryService, statusTone, errorRateTone } from './telemetry.service';
import { RequestTrace, RouteMetric } from '../../core/models/telemetry.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Performance (M28, [07 §6]) — en yavaş uçlar (rollup p95) + en yavaş son istekler.
 * Mevcut telemetri uçlarından beslenir (yeni backend gerektirmez); depo evrimi ekranı kırmaz.
 */
@Component({
    selector: 'app-performance',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './performance.component.html',
    styleUrl: './performance.component.scss'
})
export class PerformanceComponent implements OnInit {
  private readonly service = inject(TelemetryService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly metrics = signal<RouteMetric[]>([]);
  readonly requests = signal<RequestTrace[]>([]);

  readonly tone = statusTone;
  readonly errTone = errorRateTone;

  hours = 24;
  take = 200;

  /** En yavaş 20 uç — p95'e göre azalan. */
  readonly slowRoutes = computed(() =>
    [...this.metrics()].sort((a, b) => b.p95DurationMs - a.p95DurationMs).slice(0, 20));

  /** En yavaş 20 son istek — süreye göre azalan. */
  readonly slowRequests = computed(() =>
    [...this.requests()].sort((a, b) => b.durationMs - a.durationMs).slice(0, 20));

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.routeMetrics(this.hours).subscribe({
      next: res => {
        if (res.success) this.metrics.set(res.data ?? []);
        else this.error.set(res.message);
        this.service.recentRequests(this.take).subscribe({
          next: r => { this.loading.set(false); if (r.success) this.requests.set(r.data ?? []); },
          error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
        });
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }
}
