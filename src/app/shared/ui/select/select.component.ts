import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy,
  computed, inject, input, model, signal, viewChild
} from '@angular/core';

/** Seçenek — düz string verilirse value=label kabul edilir. */
export interface SelectOption {
  value: string;
  label: string;
}
export type SelectOptionInput = SelectOption | string;

/** Aynı sayfada birden çok select olabilir; ARIA id'leri çakışmasın. */
let nextSelectId = 0;

/**
 * Filtre select'lerinin başına boş değerli "Tümü" seçeneğini ekler — konsolda
 * yedi ayrı listede tekrarlanan kalıp. `label` çağıran tarafta çevrilir, bu yüzden
 * dil değişiminde yeniden hesaplanması için `computed()` içinde kullanılmalıdır.
 */
export function withAllOption(label: string, values: readonly string[]): SelectOption[] {
  return [{ value: '', label }, ...values.map(v => ({ value: v, label: v }))];
}

/**
 * SelectComponent — konsolun tek açılır liste bileşeni.
 *
 * Neden native `<select>` değil:
 *   1. Global `.input { width: 100% }` native select'i de yakalıyordu; `.cluster` içinde
 *      satırın tamamını kaplayıp diğer alanları alt satıra itiyordu.
 *   2. `appearance: none` koyan sayfalarda ok işareti hiç çizilmiyordu
 *      (`--select-chevron-icon` tanımlıydı ama kullanılmıyordu).
 *   3. Native select'in stili tema token'larıyla (özellikle karanlık temada açılan liste)
 *      tutarlı hale getirilemiyordu.
 *
 * KONUMLANDIRMA: Liste `position: fixed` ve koordinatları burada hesaplanır. Sebebi,
 * select'in içinde durduğu kapsayıcıların onu kırpması:
 *   - `.panel { overflow: hidden }` (global)
 *   - `.table-scroll { overflow-x: auto }` — CSS gereği bir eksen `visible` dışına çıkınca
 *     diğeri de `auto`'ya döner, yani DİKEYDE de kırpar.
 *   - `.content { overflow-y: auto }` (shell'in kaydırma kabı)
 * `z-index` bunu çözmez — kırpma boyama sırasından bağımsızdır. `position: fixed` ise
 * kırpan atalar containing block oluşturmadığı için onlardan kaçar. Konsolda containing
 * block'u yalnızca `.overlay`'ler oluşturabilir; hepsi `position: fixed; inset: 0` ve
 * kenarlıksız olduğundan padding box'ları viewport'a eşittir ve `getBoundingClientRect()`
 * koordinatları doğrudan kullanılabilir.
 *
 * Kullanım:
 *   <app-select [options]="severities" [(value)]="form.severity" [ariaLabel]="'...' | t" />
 */
@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Seçenekler — `SelectOption[]` ya da `string[]`. */
  options = input.required<readonly SelectOptionInput[]>();
  /** İki yönlü bağlanan seçili değer. */
  value = model<string>('');
  /** Değer boşken gösterilen metin. */
  placeholder = input<string>('');
  disabled = input(false);
  /** Görsel etiketi olmayan yerlerde ekran okuyucu için. */
  ariaLabel = input<string>('');

  private readonly listEl = viewChild<ElementRef<HTMLElement>>('list');
  private readonly triggerEl = viewChild.required<ElementRef<HTMLElement>>('trigger');

  readonly open = signal(false);
  readonly activeIndex = signal(-1);
  readonly top = signal(0);
  readonly left = signal(0);
  readonly width = signal(0);
  readonly maxHeight = signal(0);

  private readonly uid = `pc-select-${nextSelectId++}`;
  readonly listId = `${this.uid}-list`;

  /** Düz string listesi de kabul edilsin diye tek biçime indirger. */
  readonly normalized = computed<SelectOption[]>(() =>
    this.options().map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  );

  readonly selected = computed<SelectOption | undefined>(() =>
    this.normalized().find(o => o.value === this.value())
  );

  optionId(index: number): string {
    return `${this.uid}-opt-${index}`;
  }

  // ─── Açma / kapama ──────────────────────────────────────────────────────────

  toggle(): void {
    this.open() ? this.close() : this.openList();
  }

  openList(): void {
    if (this.disabled() || this.normalized().length === 0) return;

    this.position();
    // Klavye seçili seçenekten devam etsin; hiç seçim yoksa baştan başla.
    this.activeIndex.set(Math.max(0, this.normalized().findIndex(o => o.value === this.value())));
    this.open.set(true);
    this.bindDismissListeners();
    // Liste bu anda henüz DOM'da değil — kaydırma bir sonraki tik'e bırakılır.
    setTimeout(() => this.scrollActiveIntoView(), 0);
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.activeIndex.set(-1);
    this.unbindDismissListeners();
  }

  private closeAndFocus(): void {
    this.close();
    this.triggerEl().nativeElement.focus();
  }

  choose(index: number): void {
    const option = this.normalized()[index];
    if (!option) return;
    this.value.set(option.value);
    this.closeAndFocus();
  }

  // ─── Konumlandırma ──────────────────────────────────────────────────────────

  private readonly GAP = 4;
  private readonly MARGIN = 8;
  private readonly OPTION_H = 36;
  private readonly LIST_PAD = 8;
  private readonly MAX_H = 280;

  /**
   * Listeyi viewport'a sığdırır. Yükseklik açılıştan ÖNCE tahmin edilir (seçenek sayısı ×
   * satır yüksekliği) — böylece "render et, ölç, yeniden konumlandır" turu ve onun
   * getirdiği görsel zıplama olmaz. Kalan boşluk tahminden azsa liste kendi içinde kaydırılır,
   * yani her hâlükârda TAMAMI görünür.
   */
  private position(): void {
    const anchor = this.triggerEl().nativeElement.getBoundingClientRect();
    const estimated = Math.min(this.MAX_H, this.normalized().length * this.OPTION_H + this.LIST_PAD);

    const spaceBelow = window.innerHeight - anchor.bottom - this.GAP - this.MARGIN;
    const spaceAbove = anchor.top - this.GAP - this.MARGIN;
    // Alta sığıyorsa alt; sığmıyorsa hangi taraf genişse o.
    const below = spaceBelow >= estimated || spaceBelow >= spaceAbove;

    const height = Math.max(this.OPTION_H, Math.min(estimated, below ? spaceBelow : spaceAbove));
    this.maxHeight.set(height);
    this.top.set(below ? anchor.bottom + this.GAP : anchor.top - this.GAP - height);

    const width = Math.max(anchor.width, 160);
    this.width.set(width);
    // Yatayda kelepçele — sağ kenardaki select'lerin listesi ekran dışına taşmasın.
    const maxLeft = Math.max(this.MARGIN, window.innerWidth - width - this.MARGIN);
    this.left.set(Math.min(Math.max(anchor.left, this.MARGIN), maxLeft));
  }

  // ─── Klavye ─────────────────────────────────────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    const count = this.normalized().length;
    if (!count || this.disabled()) return;

    if (!this.open()) {
      // Kapalıyken: yalnızca açma tuşları ilgilendirir.
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Spacebar'].includes(event.key)) {
        event.preventDefault();
        this.openList();
      } else if (event.key.length === 1) {
        this.typeahead(event.key);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(Math.min(this.activeIndex() + 1, count - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(Math.max(this.activeIndex() - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        this.moveActive(0);
        break;
      case 'End':
        event.preventDefault();
        this.moveActive(count - 1);
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.choose(this.activeIndex());
        break;
      case 'Escape':
        // Diyalog içindeyken ESC önce listeyi kapatsın, diyaloğu değil.
        event.preventDefault();
        event.stopPropagation();
        this.closeAndFocus();
        break;
      case 'Tab':
        // Odak zaten gidiyor — listeyi bırakma.
        this.close();
        break;
      default:
        if (event.key.length === 1) this.typeahead(event.key);
    }
  }

  private moveActive(index: number): void {
    this.activeIndex.set(index);
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    const list = this.listEl()?.nativeElement;
    const item = list?.children[this.activeIndex()] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }

  // ─── Typeahead ──────────────────────────────────────────────────────────────

  private buffer = '';
  private bufferTimer?: ReturnType<typeof setTimeout>;

  /** Yazılan harflerle eşleşen ilk seçeneğe atlar; 700 ms sessizlikten sonra tampon sıfırlanır. */
  private typeahead(char: string): void {
    clearTimeout(this.bufferTimer);
    this.buffer += char.toLowerCase();
    this.bufferTimer = setTimeout(() => (this.buffer = ''), 700);

    const index = this.normalized().findIndex(o => o.label.toLowerCase().startsWith(this.buffer));
    if (index < 0) return;

    if (this.open()) this.moveActive(index);
    else this.value.set(this.normalized()[index].value);
  }

  // ─── Dışarı tıklama / kaydırma ──────────────────────────────────────────────

  private readonly onDocumentClick = (event: Event) => {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  };

  /**
   * Konum açılış anında hesaplanır; kaydırma/yeniden boyutlandırma onu bayatlatır.
   * Yeniden hesaplamak yerine kapatmak yeterli ve beklenen davranış.
   *
   * `scroll` olayı BUBBLE ETMEZ: panelin ya da shell içerik kabının kendi kaydırması
   * `document`'a ulaşmaz. Bu yüzden dinleyici CAPTURE fazında bağlanır ve yalnızca
   * liste açıkken takılı kalır.
   */
  private readonly onViewportChange = () => this.close();

  private bindDismissListeners(): void {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
  }

  private unbindDismissListeners(): void {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
  }

  ngOnDestroy(): void {
    clearTimeout(this.bufferTimer);
    this.unbindDismissListeners();
  }
}
