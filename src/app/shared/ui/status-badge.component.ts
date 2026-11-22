import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../services/language.service';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'meta' | 'neutral';

/**
 * Status badge — a single color vocabulary ([12 §1]). Status names (tenant/job/alert/audit)
 * are mapped to a "tone" and passed here; color = meaning consistency in one place.
 *
 * The label goes through the `pc.enum.*` dictionary: the server's raw value ('Active', 'Parked')
 * can be passed directly and the badge translates it into the active language. An already translated
 * label is not a key in the dictionary, so it stays as is.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
