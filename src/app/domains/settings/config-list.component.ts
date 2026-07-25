import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from './config.service';
import { PlatformConfigItem } from '../../core/models/config.models';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Platform Config (M41) — salt-okur, secret değerler maskeli (P1.5 temel). */
@Component({
  selector: 'app-config-list',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.scss'
})
export class ConfigListComponent implements OnInit {
  private readonly service = inject(ConfigService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<PlatformConfigItem[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.items.set(res.data ?? []);
        else this.error.set(res.message);
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }
}
