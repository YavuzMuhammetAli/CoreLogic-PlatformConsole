import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PlatformUsersService } from './platform-users.service';
import { ResponseModel } from '../../core/models/api.models';
import { PlatformRoleInfo, PlatformUserListItem } from '../../core/models/platform.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { ConfirmDangerDialogComponent } from '../../shared/ui/confirm-danger-dialog.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

type PendingAction = 'deactivate' | 'reset-mfa' | 'reset-password' | null;

/**
 * Platform kullanıcısı oluşturma/düzenleme (M13).
 *
 * Yetki ROL üzerinden verilir; rol→yetenek matrisi backend'de derlenmiş tek
 * doğruluk kaynağıdır (`PlatformCapabilities.RoleMatrix`) ve buraya
 * GET /platform-users/roles ile gelir — istemcide kopyalanmaz. Form seçime göre
 * "bu kullanıcı şunları yapabilir" önizlemesini bu veriden hesaplar.
 *
 * Yeni kullanıcı için TOTP/QR adımı YOKTUR: kullanıcı ilk girişinde
 * PlatformAuthManager'ın lazy enrollment yoluna düşer (`mfa_enroll`).
 */
@Component({
  selector: 'app-platform-user-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusBadgeComponent, ConfirmDangerDialogComponent, HelpButtonComponent, TranslatePipe],
  templateUrl: './platform-user-detail.component.html',
  styleUrl: './platform-users.component.scss'
})
export class PlatformUserDetailComponent implements OnInit {
  private readonly service = inject(PlatformUsersService);
  private readonly store = inject(PlatformSessionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);

  readonly isNew = signal(false);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly busy = signal(false);
  readonly user = signal<PlatformUserListItem | null>(null);
  readonly roleCatalog = signal<PlatformRoleInfo[]>([]);
  readonly pending = signal<PendingAction>(null);

  private userId = 0;

  form = { email: '', name: '', surname: '', password: '' };
  /** Oluşturma ekranında seçilen roller (rol adı → seçili). */
  selectedRoles = signal<Set<string>>(new Set<string>());
  newPassword = '';

  /** Kendi hesabını düzenliyor mu? Pasifleme/rol alma korumaları buna bakar. */
  readonly isSelf = computed(() => !this.isNew() && this.user()?.id === this.store.user()?.id);

  /**
   * Seçili rollerin verdiği yeteneklerin birleşimi — sıralı ve tekilleştirilmiş.
   * Yeni kullanıcıda form seçiminden, mevcut kullanıcıda atanmış rollerden hesaplanır.
   */
  readonly effectiveCapabilities = computed(() => {
    const roles = this.isNew() ? this.selectedRoles() : new Set(this.user()?.roles ?? []);
    const caps = new Set<string>();
    for (const info of this.roleCatalog()) {
      if (roles.has(info.role)) info.capabilities.forEach(c => caps.add(c));
    }
    return [...caps].sort();
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isNew.set(idParam === null);
    this.userId = Number(idParam ?? 0);

    this.service.roles().subscribe({
      next: res => { if (res.success) this.roleCatalog.set(res.data ?? []); }
    });

    if (this.isNew()) this.loading.set(false);
    else this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getById(this.userId).subscribe({
      next: res => {
        this.loading.set(false);
        if (!res.success) { this.error.set(res.message); return; }
        this.user.set(res.data);
        this.form = {
          email: res.data.email,
          name: res.data.name ?? '',
          surname: res.data.surname ?? '',
          password: ''
        };
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.loadFailed'));
      }
    });
  }

  toggleRole(role: string): void {
    const next = new Set(this.selectedRoles());
    next.has(role) ? next.delete(role) : next.add(role);
    this.selectedRoles.set(next);
  }

  hasRole(role: string): boolean {
    return this.isNew()
      ? this.selectedRoles().has(role)
      : (this.user()?.roles ?? []).includes(role);
  }

  // ─── Oluşturma ──────────────────────────────────────────────────────────────

  create(): void {
    if (!this.form.email.trim() || !this.form.password) return;
    this.busy.set(true);
    this.error.set(null);
    this.service.create({
      email: this.form.email.trim(),
      name: this.form.name || undefined,
      surname: this.form.surname || undefined,
      password: this.form.password,
      roles: [...this.selectedRoles()]
    }).subscribe({
      next: res => {
        this.busy.set(false);
        if (res.success) this.router.navigate(['/access/platform-users', res.data]);
        else this.error.set(res.message);
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.createFailed'));
      }
    });
  }

  // ─── Düzenleme / eylemler ───────────────────────────────────────────────────

  save(): void {
    if (!this.form.email.trim()) return;
    this.run(this.service.update(this.userId, {
      email: this.form.email.trim(),
      name: this.form.name || undefined,
      surname: this.form.surname || undefined
    }));
  }

  grantRole(role: string): void { this.run(this.service.assignRole(this.userId, role)); }
  revokeRole(role: string): void { this.run(this.service.removeRole(this.userId, role)); }
  activate(): void { this.run(this.service.activate(this.userId)); }

  confirmPending(): void {
    const action = this.pending();
    this.pending.set(null);
    if (action === 'deactivate') this.run(this.service.deactivate(this.userId));
    else if (action === 'reset-mfa') this.run(this.service.resetMfa(this.userId));
    else if (action === 'reset-password') {
      if (!this.newPassword) return;
      this.run(this.service.resetPassword(this.userId, this.newPassword), () => { this.newPassword = ''; });
    }
  }

  /** Tüm mutasyonlar aynı sonuç/yenileme kalıbını paylaşır. */
  private run(obs: Observable<ResponseModel>, onSuccess?: () => void): void {
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    obs.subscribe({
      next: res => {
        this.busy.set(false);
        if (res.success) { this.notice.set(res.message); onSuccess?.(); this.load(); }
        else this.error.set(res.message);
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? this.language.t('pc.actionFailed'));
      }
    });
  }
}
