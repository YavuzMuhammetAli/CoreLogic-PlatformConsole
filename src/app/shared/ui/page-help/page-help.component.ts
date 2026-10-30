import { ChangeDetectionStrategy, Component, HostListener, computed, input, output } from '@angular/core';
import { PageHelpId, PageHelpTopic, resolvePageHelp } from './page-help.data';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { IconComponent } from '../icon/icon.component';

/**
 * Sayfa bilgilendirme diyaloğu — "bu ekranda ne var, ne anlama geliyor, nasıl elde ediliyor".
 *
 * CoreLogicUI'daki `datatype-help` deseninin konsol karşılığı: içerik bir veri
 * tablosundan (`page-help.data.ts`) okunur, metinlerin tamamı i18n anahtarıdır,
 * eşleşmeyen konu `FALLBACK_TOPIC`'e düşer (boş ekran olmaz).
 *
 * Kullanım (her sayfanın `.page-head`'inde):
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

  /** Yalnızca arka plana tıklanınca kapat — panelin içi tıklanabilir kalsın. */
  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  /**
   * Yardım her zaman diğer diyalogların ÜSTÜNDE açılır (onay diyaloğu vb.).
   * Her iki ESC dinleyicisi de `document` üzerinde olduğu için `stopPropagation`
   * yetmez — `stopImmediatePropagation` olmadan tek ESC ikisini birden kapatır.
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open()) return;
    event.stopImmediatePropagation();
    this.close();
  }
}
