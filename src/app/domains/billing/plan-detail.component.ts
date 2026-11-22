import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BillingService, formatQuota, planStatusTone } from './billing.service';
import { ResponseModel } from '../../core/models/api.models';
import { PlanItem, PlanFeatureItem } from '../../core/models/commerce.models';
import { MetricCatalogService } from '../../services/metric-catalog.service';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Plan detail — identity editing + feature/quota editor + status transition + deletion.
 *
 * Until now the plan list was read-only (it only had status transitions); the backend had no
 * update/delete endpoint either. Code and Version are NOT edited here: per the UQ_Plan_Code_Version
 * versioning contract the identity is fixed, a price/limit change is opened as a new version
 * row (grandfathering).
 */
@Component({
    selector: 'app-plan-detail',
    imports: [
        FormsModule, RouterLink, StatusBadgeComponent, SelectComponent,
        ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe, IconComponent
    ],
    templateUrl: './plan-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './billing.component.scss'
})
export class PlanDetailComponent implements OnInit {
  private readonly service = inject(BillingService);
  private readonly store = inject(PlatformSessionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);
  private readonly catalog = inject(MetricCatalogService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly plan = signal<PlanItem | null>(null);
  readonly busy = signal(false);
  readonly confirmDelete = signal(false);

  readonly tone = planStatusTone;
  readonly canWrite = this.store.has(Cap.BillingWrite);
  /** Closed catalog (from the server) — value is the key, label is in the request's language. The backend rejects other keys. */
  readonly featureKeys = computed(() =>
    this.catalog.planFeatures().map(m => ({ value: m.key, label: m.label })));

  private planId = 0;

  /** Identity form — filled when the plan loads. */
  form = { name: '', description: '', isPublic: true, trialDays: 14 };
  /** Feature add/edit row. */
  featureForm = { featureKey: '', limitValue: null as number | null, unit: '' };

  /** The default plan cannot leave Active — the backend rejects it and the button is hidden too. */
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
      this.featureForm = { featureKey: '', limitValue: null, unit: '' };
    });
  }

  /** Loads the row into the form — since it is an upsert, saving with the same key updates it. */
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

  /** Permanent delete — the backend accepts it only for a Draft with no subscribers. */
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
    return this.catalog.label(key);
  }

  limitLabel(f: PlanFeatureItem): string {
    return formatQuota(this.language, this.catalog, f) ?? this.language.t('pc.billing.unlimited');
  }

  unitLabel(unit: string | null | undefined): string {
    return unit ? this.catalog.unitLabel(unit) : '—';
  }

  /** All mutations share the same result/refresh pattern. */
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
