import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HealthService, healthTone } from './health.service';
import { HealthTree } from '../../core/models/health.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Health Center (M24) — bileşen sağlık ağacı (platform prob'ları). */
@Component({
  selector: 'app-health-center',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, StatusBadgeComponent, TranslatePipe],
  templateUrl: './health-center.component.html',
  styleUrl: './health-center.component.scss'
})
export class HealthCenterComponent implements OnInit {
  private readonly service = inject(HealthService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly tree = signal<HealthTree | null>(null);
  readonly tone = healthTone;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.tree().subscribe({
      next: res => { this.loading.set(false); res.success ? this.tree.set(res.data) : this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }
}
