import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PageHelpComponent } from './page-help.component';
import { PageHelpId } from './page-help.data';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';

/**
 * "Nasıl çalışır?" tetikleyicisi — butonu ve diyaloğu birlikte taşır, böylece
 * her sayfaya tek satır düşer ve 25 ekranda `open` sinyali tekrarlanmaz:
 *
 *   <app-help-button topic="plans" />
 */
@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [PageHelpComponent, TranslatePipe, IconComponent],
  template: `
    <button
      class="btn btn-ghost btn-sm help-btn"
      type="button"
      (click)="open.set(true)"
      [attr.aria-label]="'pc.help.howItWorks' | t">
      <app-icon name="info" size="14" />
      {{ 'pc.help.howItWorks' | t }}
    </button>

    <app-page-help [open]="open()" [topic]="topic()" (closed)="open.set(false)" />
  `,
  styles: [`
    :host { display: inline-flex; }
    .help-btn { white-space: nowrap; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpButtonComponent {
  topic = input.required<PageHelpId>();
  readonly open = signal(false);
}
