import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { HealthService, healthTone } from '../operations/health.service';
import { AlertsService, severityTone } from '../operations/alerts.service';
import { TelemetryService } from '../observability/telemetry.service';
import { HealthTree } from '../../core/models/health.models';
import { AlertItem } from '../../core/models/alert.models';
import { RouteMetric } from '../../core/models/telemetry.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Platform Overview (M01, [07 §6]) — golden signals + sağlık ağacı özeti + açık uyarılar.
 * Panolar API'den beslenir (depoya bağlanmaz): mevcut /health/tree, /alerts, /telemetry/metrics
 * uçları bir araya getirilir. Bir kaynak düşerse diğerleri gösterilmeye devam eder.
 */
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  private readonly store = inject(PlatformSessionStore);
  private readonly health = inject(HealthService);
  private readonly alerts = inject(AlertsService);
  private readonly telemetry = inject(TelemetryService);

  readonly user = this.store.user;
  readonly loading = signal(true);
  readonly tree = signal<HealthTree | null>(null);
  readonly openAlerts = signal<AlertItem[]>([]);
  readonly metrics = signal<RouteMetric[]>([]);

  readonly hTone = healthTone;
  readonly sevTone = severityTone;

  /** Golden signals — son 24 saat rollup'ından türetilir ([07 §4]). */
  readonly totalRequests = computed(() => this.metrics().reduce((s, m) => s + m.count, 0));
  readonly totalErrors = computed(() => this.metrics().reduce((s, m) => s + m.errorCount, 0));
  readonly errorRate = computed(() => {
    const t = this.totalRequests();
    return t === 0 ? 0 : (100 * this.totalErrors() / t);
  });
  readonly worstP95 = computed(() =>
    this.metrics().reduce((mx, m) => Math.max(mx, m.p95DurationMs), 0));

  /** Sağlık bileşenlerinin durum dağılımı. */
  readonly healthCounts = computed(() => {
    const comps = this.tree()?.components ?? [];
    const by = (s: string) => comps.filter(c => c.status === s).length;
    return { total: comps.length, degraded: by('Degraded'), unhealthy: by('Unhealthy') };
  });

  ngOnInit(): void {
    forkJoin({
      tree: this.health.tree(),
      alerts: this.alerts.list('open', 1, 5),
      metrics: this.telemetry.routeMetrics(24)
    }).subscribe({
      next: ({ tree, alerts, metrics }) => {
        this.loading.set(false);
        if (tree.success) this.tree.set(tree.data);
        if (alerts.success) this.openAlerts.set(alerts.data.items);
        if (metrics.success) this.metrics.set(metrics.data ?? []);
      },
      error: () => this.loading.set(false)
    });
  }
}
