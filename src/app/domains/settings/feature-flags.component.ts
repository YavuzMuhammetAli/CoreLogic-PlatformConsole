import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlagsService, flagStateTone } from './flags.service';
import { FeatureFlagItem, FLAG_STATES } from '../../core/models/flag.models';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Feature Flags (M39) — liste + durum/yüzde + tenant override + ölü flag işareti. */
@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, SelectComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './feature-flags.component.html',
  styleUrl: './feature-flags.component.scss'
})
export class FeatureFlagsComponent implements OnInit {
  private readonly service = inject(FlagsService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly flags = signal<FeatureFlagItem[]>([]);
  readonly busyKey = signal<string | null>(null);

  readonly tone = flagStateTone;
  readonly states = FLAG_STATES;
  /** Tenant override'ı yüzdelik olamaz — yalnız açık/kapalı. */
  readonly overrideStates = ['On', 'Off'];

  createForm = { key: '', description: '', defaultState: 'Off', percentage: 0 };
  ovForm = { key: '', tenantId: '', state: 'On', reason: '' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list().subscribe({
      next: res => { this.loading.set(false); if (res.success) this.flags.set(res.data ?? []); else this.error.set(res.message); },
      error: err => { this.loading.set(false); this.error.set(err?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  setState(f: FeatureFlagItem, state: string): void {
    this.busyKey.set(f.key);
    this.service.setState(f.key, { defaultState: state, percentage: f.percentage, removeBy: f.removeBy }).subscribe({
      next: () => { this.busyKey.set(null); this.load(); },
      error: err => { this.busyKey.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  setPercentage(f: FeatureFlagItem, pct: number): void {
    this.busyKey.set(f.key);
    this.service.setState(f.key, { defaultState: 'Percentage', percentage: Number(pct), removeBy: f.removeBy }).subscribe({
      next: () => { this.busyKey.set(null); this.load(); },
      error: err => { this.busyKey.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  create(): void {
    if (!this.createForm.key) return;
    this.busyKey.set('__new__');
    this.service.create({ ...this.createForm, percentage: Number(this.createForm.percentage) }).subscribe({
      next: res => {
        this.busyKey.set(null);
        if (res.success) { this.createForm = { key: '', description: '', defaultState: 'Off', percentage: 0 }; this.load(); }
        else this.error.set(res.message);
      },
      error: err => { this.busyKey.set(null); this.error.set(err?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  addOverride(): void {
    if (!this.ovForm.key || !this.ovForm.tenantId) return;
    this.busyKey.set(this.ovForm.key);
    this.service.setOverride(this.ovForm.key, this.ovForm.tenantId,
      { state: this.ovForm.state, reason: this.ovForm.reason }).subscribe({
      next: () => { this.busyKey.set(null); this.ovForm = { key: '', tenantId: '', state: 'On', reason: '' }; this.load(); },
      error: err => { this.busyKey.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }

  removeOverride(key: string, tenantId: string): void {
    this.busyKey.set(key);
    this.service.removeOverride(key, tenantId).subscribe({
      next: () => { this.busyKey.set(null); this.load(); },
      error: err => { this.busyKey.set(null); this.error.set(err?.error?.message ?? 'İşlem başarısız'); }
    });
  }
}
