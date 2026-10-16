import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HealthService, healthTone } from './health.service';
import { HealthComponent, HealthTree } from '../../core/models/health.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Health Center (M24) — bileşen sağlık ağacı (platform prob'ları). */
@Component({
  selector: 'app-health-center',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './health-center.component.html',
  styleUrl: './health-center.component.scss'
})
export class HealthCenterComponent implements OnInit {
  private readonly service = inject(HealthService);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly tree = signal<HealthTree | null>(null);
  readonly tone = healthTone;

  ngOnInit(): void { this.load(); }

  // Prob adları sunucudan sabit İngilizce gelir (durumları StatusBadge çevirir).
  // Çevirisi olmayan (sonradan eklenmiş) bir prob ham adıyla görünür.

  componentLabel(name: string): string {
    return this.language.tOr(`pc.health.comp.${name}`, name);
  }

  componentDescription(name: string): string {
    return this.language.tOr(`pc.health.comp.${name}.desc`, '');
  }

  /** Yapılandırılmamış kontrolde sunucunun teknik notu yerine ne yapılacağını anlatan metin. */
  detail(c: HealthComponent): string {
    if (c.status === 'NotConfigured') {
      return this.language.tOr(`pc.health.comp.${c.name}.notConfigured`, c.error || '—');
    }
    return c.error || '—';
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.tree().subscribe({
      next: res => { this.loading.set(false); res.success ? this.tree.set(res.data) : this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }
}
