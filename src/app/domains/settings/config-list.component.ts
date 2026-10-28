import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from './config.service';
import { PlatformConfigItem } from '../../core/models/config.models';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Platform Config (M41) — listeleme + satır içi düzenleme.
 *
 * Gizli değerler sunucudan maskeli (`••••••`) gelir ve maske ASLA geri
 * gönderilmez: gizli satırların girdisi boş başlar, boş bırakmak "değiştirme"
 * demektir. Aksi halde kullanıcı alana dokunmadan kaydettiğinde gerçek anahtar
 * maske metniyle ezilirdi.
 */
@Component({
  selector: 'app-config-list',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, HelpButtonComponent, TranslatePipe, IconComponent],
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.scss'
})
export class ConfigListComponent implements OnInit {
  private readonly service = inject(ConfigService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly items = signal<PlatformConfigItem[]>([]);

  /** Anahtar → düzenlenmekte olan değer. */
  readonly drafts = signal<Record<string, string>>({});

  /** O an kaydedilen anahtar; satırın butonunu kilitler. */
  readonly savingKey = signal<string | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: res => {
        this.loading.set(false);
        if (!res.success) { this.error.set(res.message); return; }

        const items = res.data ?? [];
        this.items.set(items);

        // Gizli satırlar BOŞ başlar — maskeyi taslağa koymak, kullanıcı hiç
        // dokunmasa bile onu geri göndermek anlamına gelirdi.
        const drafts: Record<string, string> = {};
        for (const item of items) {
          drafts[item.key] = item.isSecret ? '' : (item.value ?? '');
        }
        this.drafts.set(drafts);
      },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  draftFor(key: string): string {
    return this.drafts()[key] ?? '';
  }

  onDraftChange(key: string, value: string): void {
    this.drafts.update(current => ({ ...current, [key]: value }));
  }

  save(item: PlatformConfigItem): void {
    if (this.savingKey()) return;

    this.savingKey.set(item.key);
    this.error.set(null);
    this.success.set(null);

    this.service.set(item.key, this.draftFor(item.key)).subscribe({
      next: res => {
        this.savingKey.set(null);
        if (res.success) {
          this.success.set(res.message);
          // Maskeyi ve UpdatedAt'i sunucudan tazele — tek doğruluk kaynağı orası.
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: err => {
        this.savingKey.set(null);
        this.error.set(err?.error?.message ?? 'Kaydedilemedi');
      }
    });
  }
}
