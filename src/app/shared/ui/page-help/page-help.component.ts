import { ChangeDetectionStrategy, Component, HostListener, computed, input, output } from '@angular/core';
import { PageHelpId, PageHelpTopic, resolvePageHelp } from './page-help.data';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';

/**
 * Page info dialog — "what is on this screen, what it means, how it is obtained".
 *
 * The console counterpart of the `datatype-help` pattern in CoreLogicUI: content is read from a
 * data table (`page-help.data.ts`), all texts are i18n keys,
 * an unmatched topic falls back to `FALLBACK_TOPIC` (never an empty screen).
 *
 * Usage (in each page's `.page-head`):
 *   <button (click)="help.set(true)">Nasıl çalışır?</button>
 *   <app-page-help [open]="help()" topic="plans" (closed)="help.set(false)" />
 */
@Component({
    selector: 'app-page-help',
    imports: [TranslatePipe, IconComponent],
    templateUrl: './page-help.component.html',
    styleUrl: './page-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHelpComponent {
  open = input(false);
  topic = input.required<PageHelpId>();
  closed = output<void>();

  readonly content = computed<PageHelpTopic>(() => resolvePageHelp(this.topic()));

  close(): void {
    this.closed.emit();
  }

  /** Close only when the backdrop is clicked — the panel's contents stay clickable. */
  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  /**
   * Help always opens ON TOP of other dialogs (confirm dialog etc.).
   * Since both ESC listeners are on `document`, `stopPropagation` is not
   * enough — without `stopImmediatePropagation` a single ESC closes both.
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open()) return;
    event.stopImmediatePropagation();
    this.close();
  }
}
