import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PageHelpComponent } from './page-help.component';
import { PageHelpId } from './page-help.data';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';

/**
 * "Nasıl çalışır?" (How does it work?) trigger — carries both the button and the dialog, so
 * each page needs a single line and the `open` signal isn't repeated across 25 screens:
 *
 *   <app-help-button topic="plans" />
 */
@Component({
    selector: 'app-help-button',
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
