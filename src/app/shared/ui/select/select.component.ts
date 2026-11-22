import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy,
  computed, inject, input, model, signal, viewChild
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Option — if a plain string is given, value=label is assumed. */
export interface SelectOption {
  value: string;
  label: string;
}
export type SelectOptionInput = SelectOption | string;

/** A page may contain several selects; ARIA ids must not collide. */
let nextSelectId = 0;

/**
 * Prepends an empty-valued "Tümü" (All) option to filter selects — a pattern repeated
 * in seven separate lists in the console. `label` is translated by the caller, so
 * it must be used inside `computed()` to be recomputed when the language changes.
 * If `labelOf` is given, the values' display names come from it (e.g. `language.enumLabel`).
 */
export function withAllOption(
  label: string,
  values: readonly string[],
  labelOf: (value: string) => string = v => v
): SelectOption[] {
  return [{ value: '', label }, ...values.map(v => ({ value: v, label: labelOf(v) }))];
}

/**
 * SelectComponent — the console's only dropdown component.
 *
 * Why not a native `<select>`:
 *   1. The global `.input { width: 100% }` also caught the native select; inside `.cluster`
 *      it took up the whole row and pushed the other fields onto the next line.
 *   2. On pages that set `appearance: none` the arrow was never drawn
 *      (`--select-chevron-icon` was defined but unused).
 *   3. The native select's styling could not be made consistent with the theme tokens
 *      (especially the opened list in dark theme).
 *
 * POSITIONING: The list is `position: fixed` and its coordinates are computed here. The reason
 * is that the containers the select sits in clip it:
 *   - `.panel { overflow: hidden }` (global)
 *   - `.table-scroll { overflow-x: auto }` — per CSS, once one axis is not `visible`
 *     the other becomes `auto` too, i.e. it clips VERTICALLY as well.
 *   - `.content { overflow-y: auto }` (the shell's scroll container)
 * `z-index` doesn't fix this — clipping is independent of paint order. `position: fixed`, however,
 * escapes clipping ancestors because they don't form a containing block. In the console only
 * `.overlay`s can form the containing block; all of them are `position: fixed; inset: 0` and
 * borderless, so their padding box equals the viewport and `getBoundingClientRect()`
 * coordinates can be used directly.
 *
 * Usage:
 *   <app-select [options]="severities" [(value)]="form.severity" [ariaLabel]="'...' | t" />
 */
@Component({
    selector: 'app-select',
    imports: [IconComponent],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Options — `SelectOption[]` or `string[]`. */
  options = input.required<readonly SelectOptionInput[]>();
  /** The selected value, two-way bound. */
  value = model<string>('');
  /** Text shown while the value is empty. */
  placeholder = input<string>('');
  disabled = input(false);
  /** For screen readers where there is no visual label. */
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

  /** Normalizes to a single shape so plain string lists are accepted too. */
  readonly normalized = computed<SelectOption[]>(() =>
    this.options().map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  );

  readonly selected = computed<SelectOption | undefined>(() =>
    this.normalized().find(o => o.value === this.value())
  );

  optionId(index: number): string {
    return `${this.uid}-opt-${index}`;
  }

  // ─── Open / close ───────────────────────────────────────────────────────────

  toggle(): void {
    this.open() ? this.close() : this.openList();
  }

  openList(): void {
    if (this.disabled() || this.normalized().length === 0) return;

    this.position();
    // Keyboard continues from the selected option; with no selection, start from the top.
    this.activeIndex.set(Math.max(0, this.normalized().findIndex(o => o.value === this.value())));
    this.open.set(true);
    this.bindDismissListeners();
    // The list is not in the DOM yet at this point — scrolling is deferred to the next tick.
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

  // ─── Positioning ────────────────────────────────────────────────────────────

  private readonly GAP = 4;
  private readonly MARGIN = 8;
  private readonly OPTION_H = 36;
  private readonly LIST_PAD = 8;
  private readonly MAX_H = 280;

  /**
   * Fits the list into the viewport. The height is estimated BEFORE opening (option count ×
   * row height) — so there is no "render, measure, reposition" round and the visual
   * jump it causes. If the remaining space is less than the estimate, the list scrolls internally,
   * so it is ALWAYS fully visible.
   */
  private position(): void {
    const anchor = this.triggerEl().nativeElement.getBoundingClientRect();
    const estimated = Math.min(this.MAX_H, this.normalized().length * this.OPTION_H + this.LIST_PAD);

    const spaceBelow = window.innerHeight - anchor.bottom - this.GAP - this.MARGIN;
    const spaceAbove = anchor.top - this.GAP - this.MARGIN;
    // Below if it fits; otherwise whichever side has more room.
    const below = spaceBelow >= estimated || spaceBelow >= spaceAbove;

    const height = Math.max(this.OPTION_H, Math.min(estimated, below ? spaceBelow : spaceAbove));
    this.maxHeight.set(height);
    this.top.set(below ? anchor.bottom + this.GAP : anchor.top - this.GAP - height);

    const width = Math.max(anchor.width, 160);
    this.width.set(width);
    // Clamp horizontally — lists of selects near the right edge must not overflow off-screen.
    const maxLeft = Math.max(this.MARGIN, window.innerWidth - width - this.MARGIN);
    this.left.set(Math.min(Math.max(anchor.left, this.MARGIN), maxLeft));
  }

  // ─── Keyboard ───────────────────────────────────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    const count = this.normalized().length;
    if (!count || this.disabled()) return;

    if (!this.open()) {
      // While closed: only the opening keys matter.
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
        // Inside a dialog, ESC should close the list first, not the dialog.
        event.preventDefault();
        event.stopPropagation();
        this.closeAndFocus();
        break;
      case 'Tab':
        // Focus is leaving anyway — don't leave the list open.
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

  /** Jumps to the first option matching the typed letters; the buffer resets after 700 ms of silence. */
  private typeahead(char: string): void {
    clearTimeout(this.bufferTimer);
    this.buffer += char.toLowerCase();
    this.bufferTimer = setTimeout(() => (this.buffer = ''), 700);

    const index = this.normalized().findIndex(o => o.label.toLowerCase().startsWith(this.buffer));
    if (index < 0) return;

    if (this.open()) this.moveActive(index);
    else this.value.set(this.normalized()[index].value);
  }

  // ─── Outside click / scroll ─────────────────────────────────────────────────

  private readonly onDocumentClick = (event: Event) => {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  };

  /**
   * The position is computed at open time; scrolling/resizing makes it stale.
   * Closing instead of recomputing is enough and is the expected behaviour.
   *
   * The `scroll` event DOES NOT BUBBLE: scrolling of a panel or the shell content container
   * never reaches `document`. So the listener is attached in the CAPTURE phase and stays
   * attached only while the list is open.
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
