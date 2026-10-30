import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RegistryService } from './registry.service';
import { TenantModelSummaryItem, TenantDriftItem } from '../../core/models/registry.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

type Tab = 'drift' | 'matrix';

/** Model/Şema Registry (M11) — drift panosu + sürüm matrisi (read-model'den). */
@Component({
    selector: 'app-model-registry',
    imports: [DatePipe, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './model-registry.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './alert-center.component.scss'
})
export class ModelRegistryComponent implements OnInit {
  private readonly service = inject(RegistryService);

  readonly tab = signal<Tab>('drift');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly drift = signal<TenantDriftItem[]>([]);
  readonly matrix = signal<TenantModelSummaryItem[]>([]);

  ngOnInit(): void { this.load(); }

  selectTab(t: Tab): void { this.tab.set(t); t === 'drift' ? this.load() : this.loadMatrix(); }

  load(): void {
    this.loading.set(true); this.error.set(null);
    this.service.drift().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.drift.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadMatrix(): void {
    this.loading.set(true); this.error.set(null);
    this.service.models().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.matrix.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }
}
