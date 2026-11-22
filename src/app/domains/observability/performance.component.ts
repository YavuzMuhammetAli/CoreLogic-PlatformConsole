import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
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
 * Performance (M28, [07 §6]) — slowest endpoints (rollup p95) + slowest recent requests.
 * Fed by the existing telemetry endpoints (needs no new backend); storage evolution won't break the screen.
 */
@Component({
    selector: 'app-performance',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './performance.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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

  /** The 20 slowest endpoints — descending by p95. */
  readonly slowRoutes = computed(() =>
    [...this.metrics()].sort((a, b) => b.p95DurationMs - a.p95DurationMs).slice(0, 20));

  /** The 20 slowest recent requests — descending by duration. */
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
