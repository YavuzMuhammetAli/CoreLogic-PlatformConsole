import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, finalize, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel } from '../models/api.models';
import { PlatformAuthResult, PlatformLoginResult, PlatformUserInfo } from '../models/platform.models';
import { PlatformSessionStore } from './platform-session.store';

/**
 * Platform kimlik doğrulama servisi ([05 §4]). Login → MFA challenge/enroll →
 * oturum; refresh rotasyonu; logout; /me. Tenant AuthService'ten tamamen ayrı.
 */
@Injectable({ providedIn: 'root' })
export class PlatformAuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(PlatformSessionStore);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/auth`;

  /** Aynı anda birden fazla 401 tek refresh isteğini paylaşsın (single-flight). */
  private refreshInFlight: Observable<boolean> | null = null;

  login(email: string, password: string): Observable<DataResponseModel<PlatformLoginResult>> {
    return this.http.post<DataResponseModel<PlatformLoginResult>>(`${this.baseUrl}/login`, { email, password });
  }

  completeMfa(challengeToken: string, code: string): Observable<DataResponseModel<PlatformAuthResult>> {
    return this.http
      .post<DataResponseModel<PlatformAuthResult>>(`${this.baseUrl}/mfa`, { challengeToken, code })
      .pipe(tap(res => this.storeIfSuccess(res)));
  }

  enrollMfa(challengeToken: string, code: string): Observable<DataResponseModel<PlatformAuthResult>> {
    return this.http
      .post<DataResponseModel<PlatformAuthResult>>(`${this.baseUrl}/mfa/enroll`, { challengeToken, code })
      .pipe(tap(res => this.storeIfSuccess(res)));
  }

  /** Refresh token ile yeni oturum al. Single-flight; başarı=true. */
  refresh(): Observable<boolean> {
    const refreshToken = this.store.getRefreshToken();
    if (!refreshToken) return of(false);

    if (this.refreshInFlight) return this.refreshInFlight;

    this.refreshInFlight = this.http
      .post<DataResponseModel<PlatformAuthResult>>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(
        map(res => {
          if (res.success && res.data) {
            this.store.setSession(res.data);
            return true;
          }
          return false;
        }),
        catchError(() => of(false)),
        finalize(() => { this.refreshInFlight = null; })
      );

    return this.refreshInFlight;
  }

  /** APP_INITIALIZER: sayfa yüklenince refresh token varsa oturumu geri yükler. */
  loadSession(): Observable<boolean> {
    return this.refresh();
  }

  me(): Observable<DataResponseModel<PlatformUserInfo>> {
    return this.http.get<DataResponseModel<PlatformUserInfo>>(`${this.baseUrl}/me`);
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      catchError(() => of(null)),
      finalize(() => this.store.clear())
    );
  }

  private storeIfSuccess(res: DataResponseModel<PlatformAuthResult>): void {
    if (res.success && res.data) {
      this.store.setSession(res.data);
    }
  }
}
