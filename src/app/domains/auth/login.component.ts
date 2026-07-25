import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformAuthService } from '../../core/auth/platform-auth.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LOGIN_STATUS_MFA_ENROLL, LOGIN_STATUS_MFA_REQUIRED } from '../../core/models/platform.models';

type Step = 'login' | 'mfa' | 'enroll';

/**
 * Platform giriş ekranı — çok adımlı: parola → MFA doğrulama (mfa_required) veya
 * MFA kurulumu (mfa_enroll). Başarıda oturum store'a yazılır ve /overview'a geçilir.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(PlatformAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly lang = inject(LanguageService);
  readonly language = inject(LanguageService);
  readonly theme = inject(ThemeService);

  readonly step = signal<Step>('login');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sessionExpired = signal(
    this.route.snapshot.queryParamMap.get('reason') === 'session_expired');
  readonly mfaSecret = signal<string | null>(null);

  private challengeToken = '';

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  readonly codeControl = this.fb.control('', [Validators.required, Validators.minLength(6)]);

  get lf() { return this.loginForm.controls; }

  onLogin(): void {
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.sessionExpired.set(false);

    this.auth.login(this.lf.email.value!.trim(), this.lf.password.value!).subscribe({
      next: res => {
        this.loading.set(false);
        if (!res.success || !res.data) {
          this.error.set(res.message || this.lang.t('pc.login.failed'));
          return;
        }
        this.challengeToken = res.data.challengeToken;
        this.codeControl.reset('');
        if (res.data.status === LOGIN_STATUS_MFA_REQUIRED) {
          this.step.set('mfa');
        } else if (res.data.status === LOGIN_STATUS_MFA_ENROLL) {
          this.mfaSecret.set(res.data.mfaSecret ?? null);
          this.step.set('enroll');
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? this.lang.t('pc.serverUnreachable'));
      }
    });
  }

  onVerify(): void {
    this.submitCode(token => this.auth.completeMfa(token, this.codeControl.value!.trim()));
  }

  onEnroll(): void {
    this.submitCode(token => this.auth.enrollMfa(token, this.codeControl.value!.trim()));
  }

  private submitCode(call: (token: string) => ReturnType<PlatformAuthService['completeMfa']>): void {
    if (this.codeControl.invalid || this.loading()) {
      this.codeControl.markAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    call(this.challengeToken).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.router.navigateByUrl('/overview');
        } else {
          this.error.set(res.message || this.lang.t('pc.mfa.invalidCode'));
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? this.lang.t('pc.serverUnreachable'));
      }
    });
  }

  backToLogin(): void {
    this.step.set('login');
    this.error.set(null);
    this.mfaSecret.set(null);
    this.challengeToken = '';
  }
}
