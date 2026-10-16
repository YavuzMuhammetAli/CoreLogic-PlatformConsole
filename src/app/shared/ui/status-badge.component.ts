import { Component, Input, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'meta' | 'neutral';

/**
 * Durum rozeti — tek renk sözlüğü ([12 §1]). Durum adları (tenant/job/alert/audit)
 * bir "tone"a eşlenip buraya verilir; renk = anlam tutarlılığı tek yerde.
 *
 * Etiket `pc.enum.*` sözlüğünden geçer: sunucunun ham değeri ('Active', 'Parked')
 * doğrudan verilebilir, rozet onu aktif dile çevirir. Zaten çevrilmiş bir etiket
 * sözlükte anahtar olmadığı için olduğu gibi kalır.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span
    class="badge"
    [class.badge-success]="tone === 'success'"
    [class.badge-warn]="tone === 'warn'"
    [class.badge-danger]="tone === 'danger'"
    [class.badge-meta]="tone === 'meta'"
  >{{ text() }}</span>`
})
export class StatusBadgeComponent {
  private readonly language = inject(LanguageService);

  @Input() label = '';
  @Input() tone: BadgeTone = 'neutral';

  text(): string {
    return this.label ? this.language.enumLabel(this.label) : '';
  }
}
