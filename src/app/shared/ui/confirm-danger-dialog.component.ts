import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';

/**
 * Yıkıcı/dikkatli eylem onay diyaloğu ([12 §1, §10]). Opsiyonel sebep girişi ve
 * "kodu yazarak doğrula" (purge gibi geri-dönüşsüz işlemler için). "Bu işlem
 * audit'lenir" notunu gösterir — kullanıcı izlendiğini eylemden önce bilir.
 */
@Component({
    selector: 'app-confirm-danger-dialog',
    imports: [FormsModule, TranslatePipe],
    template: `
    <div class="overlay" (click)="cancelled.emit()">
      <div class="dialog panel" (click)="$event.stopPropagation()">
        <div class="panel-body stack">
          <h2>{{ title }}</h2>
          <p class="muted">{{ message }}</p>

          @if (requireReason) {
            <div class="field">
              <label>{{ 'pc.dialog.reason' | t }}</label>
              <input class="input" type="text" [(ngModel)]="reason"
                     [placeholder]="'pc.dialog.reasonHint' | t" />
            </div>
          }

          @if (confirmCode) {
            <div class="field">
              <label>{{ 'pc.dialog.typeToConfirm' | t:{ code: confirmCode } }}</label>
              <input class="input mono" type="text" [(ngModel)]="typed" autocomplete="off" />
            </div>
          }

          <p class="audit-note">{{ 'pc.dialog.audited' | t }}</p>

          <div class="cluster actions">
            <button class="btn btn-ghost" type="button" (click)="cancelled.emit()">
              {{ 'pc.cancel' | t }}
            </button>
            <button class="btn" [class.btn-danger]="danger" [class.btn-primary]="!danger"
                    type="button" [disabled]="!canConfirm" (click)="onConfirm()">
              @if (busy) { <span class="spinner"></span> } @else { {{ confirmLabel }} }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(15, 23, 42, 0.55);
      display: grid; place-items: center;
      padding: var(--space-4);
    }
    .dialog { width: 100%; max-width: 440px; }
    h2 { font-size: var(--text-lg); }
    .audit-note { font-size: var(--text-xs); color: var(--muted); }
    .actions { justify-content: flex-end; }
  `]
})
export class ConfirmDangerDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel = '';
  @Input() requireReason = false;
  /** Dolu ise: kullanıcı bu değeri yazmadan onay etkinleşmez (geri-dönüşsüz işlemler). */
  @Input() confirmCode: string | null = null;
  @Input() danger = false;
  @Input() busy = false;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  reason = '';
  typed = '';

  get canConfirm(): boolean {
    if (this.busy) return false;
    if (this.confirmCode && this.typed.trim() !== this.confirmCode) return false;
    if (this.requireReason && !this.reason.trim()) return false;
    return true;
  }

  onConfirm(): void {
    if (this.canConfirm) this.confirmed.emit(this.reason.trim());
  }
}
