import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PageHelpComponent } from './page-help.component';
import { PageHelpId } from './page-help.data';
import { TranslatePipe } from '../../../pipes/translate.pipe';

/**
 * "Nasıl çalışır?" tetikleyicisi — butonu ve diyaloğu birlikte taşır, böylece
 * her sayfaya tek satır düşer ve 25 ekranda `open` sinyali tekrarlanmaz:
 *
 *   <app-help-button topic="plans" />
 */
@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [PageHelpComponent, TranslatePipe],
  template: `
    <button
      class="btn btn-ghost btn-sm help-btn"
      type="button"
      (click)="open.set(true)"
      [attr.aria-label]="'pc.help.howItWorks' | t">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      {{ 'pc.help.howItWorks' | t }}
    </button>

    <app-page-help [open]="open()" [topic]="topic()" (closed)="open.set(false)" />
  `,
  styles: [`
    :host { display: inline-flex; }
    .help-btn { white-space: nowrap; }
    .help-btn svg { flex: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpButtonComponent {
  topic = input.required<PageHelpId>();
  readonly open = signal(false);
}
