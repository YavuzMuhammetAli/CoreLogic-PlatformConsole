import { Component, Input } from '@angular/core';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'meta' | 'neutral';

/**
 * Durum rozeti — tek renk sözlüğü ([12 §1]). Durum adları (tenant/job/alert/audit)
 * bir "tone"a eşlenip buraya verilir; renk = anlam tutarlılığı tek yerde.
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
  >{{ label }}</span>`
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() tone: BadgeTone = 'neutral';
}
