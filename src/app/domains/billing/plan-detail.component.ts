import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BillingService, formatQuota, planStatusTone } from './billing.service';
import { ResponseModel } from '../../core/models/api.models';
import { PlanItem, PlanFeatureItem, FEATURE_KEYS } from '../../core/models/commerce.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

/**
 * Plan detayı — kimlik düzenleme + özellik/kota editörü + durum geçişi + silme.
 *
 * Plan listesi bugüne kadar salt-okurdu (yalnız durum geçişi vardı); backend'de de
 * güncelleme/silme ucu yoktu. Code ve Version burada DÜZENLENMEZ: UQ_Plan_Code_Version
 * sürümleme sözleşmesi gereği kimlik sabittir, fiyat/limit değişimi yeni bir sürüm
 * satırı olarak açılır (grandfathering).
 */
@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [
    FormsModule, RouterLink, StatusBadgeComponent, SelectComponent,
    ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe
  ],
  templateUrl: './plan-detail.component.html',
  styleUrl: './billing.component.scss'
})
export class PlanDetailComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly store = inject(PlatformSessionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly plan = signal<PlanItem | null>(null);
  readonly busy = signal(false);
  readonly confirmDelete = signal(false);

  readonly tone = planStatusTone;
  readonly canWrite = this.store.has(Cap.BillingWrite);
  /** Kapalı katalog — değer anahtar, etiket çeviri (dil değişince güncellensin diye computed). */
  readonly featureKeys = computed(() =>
    FEATURE_KEYS.map(k => ({ value: k, label: this.language.featureLabel(k) })));

  private planId = 0;

  /** Kimlik formu — plan yüklendiğinde doldurulur. */
  form = { name: '', description: '', isPublic: true, trialDays: 14 };
  /** Özellik ekleme/düzenleme satırı. */
  featureForm = { featureKey: FEATURE_KEYS[0] as string, limitValue: null as number | null, unit: '' };

  /** Varsayılan plan Active dışına çıkamaz — backend de reddeder, buton da gizlenir. */
  readonly canLeaveActive = computed(() => !this.plan()?.isDefaultForNewTenants);

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getPlan(this.planId).subscribe({
      next: res => {
        this.loading.set(false);
        if (!res.success) { this.error.set(res.message); return; }
        this.plan.set(res.data);
        this.form = {
          name: res.data.name,
          description: res.data.description ?? '',
          isPublic: res.data.isPublic,
          trialDays: res.data.trialDays
        };
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.loadFailed'));
      }
    });
  }

  save(): void {
    if (!this.form.name.trim()) return;
    this.run(this.service.updatePlan(this.planId, {
      name: this.form.name.trim(),
      description: this.form.description || undefined,
      isPublic: this.form.isPublic,
      trialDays: this.form.trialDays
    }));
  }

  setStatus(status: string): void {
    this.run(this.service.setPlanStatus(this.planId, status));
  }

  setDefault(): void {
    this.run(this.service.setDefaultPlan(this.planId));
  }

  saveFeature(): void {
    if (!this.featureForm.featureKey) return;
    this.run(this.service.upsertFeature(this.planId, {
      featureKey: this.featureForm.featureKey,
      limitValue: this.featureForm.limitValue,
      unit: this.featureForm.unit || null
    }), () => {
      this.featureForm = { featureKey: FEATURE_KEYS[0], limitValue: null, unit: '' };
    });
  }

  /** Satırı forma alır — upsert olduğu için aynı anahtarla kaydetmek günceller. */
  editFeature(f: PlanFeatureItem): void {
    this.featureForm = {
      featureKey: f.featureKey,
      limitValue: f.limitValue ?? null,
      unit: f.unit ?? ''
    };
  }

  removeFeature(f: PlanFeatureItem): void {
    this.run(this.service.removeFeature(this.planId, f.featureKey));
  }

  /** Kalıcı silme — backend yalnız abonesi olmayan Draft için kabul eder. */
  deletePlan(): void {
    this.confirmDelete.set(false);
    this.busy.set(true);
    this.service.deletePlan(this.planId).subscribe({
      next: res => {
        this.busy.set(false);
        if (res.success) this.router.navigate(['/billing/plans']);
        else this.error.set(res.message);
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }

  featureName(key: string): string {
    return this.language.featureLabel(key);
  }

  limitLabel(f: PlanFeatureItem): string {
    return formatQuota(this.language, f) ?? this.language.t('pc.billing.unlimited');
  }

  unitLabel(unit: string | null | undefined): string {
    return unit ? this.language.unitLabel(unit) : '—';
  }

  /** Tüm mutasyonlar aynı sonuç/yenileme kalıbını paylaşır. */
  private run(obs: Observable<ResponseModel>, onSuccess?: () => void): void {
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    obs.subscribe({
      next: res => {
        this.busy.set(false);
        if (res.success) {
          this.notice.set(res.message);
          onSuccess?.();
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }
}
