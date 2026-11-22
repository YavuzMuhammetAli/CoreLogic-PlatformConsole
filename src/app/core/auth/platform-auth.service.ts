import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, finalize, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataResponseModel } from '../models/api.models';
import { PlatformAuthResult, PlatformLoginResult, PlatformUserInfo } from '../models/platform.models';
import { PlatformSessionStore } from './platform-session.store';

/**
 * Platform authentication service ([05 §4]). Login → MFA challenge/enroll →
 * session; refresh rotation; logout; /me. Completely separate from the tenant AuthService.
 */
@Injectable({ providedIn: 'root' })
export class PlatformAuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(PlatformSessionStore);
  private readonly baseUrl = `${environment.platformApiBaseUrl}/auth`;

  /** Multiple simultaneous 401s share a single refresh request (single-flight). */
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

  /**
   * Obtain a new session with the refresh token in the cookie; success=true. The cookie is invisible to
   * JavaScript, so whether a session exists can only be learned by asking the server. The flight is shared:
   * the refresh token rotates on every use, so a second parallel request would be rejected with the old token and drop the session.
   */
  refresh(): Observable<boolean> {
    if (this.refreshInFlight) return this.refreshInFlight;

    this.refreshInFlight = this.http
      .post<DataResponseModel<PlatformAuthResult>>(`${this.baseUrl}/refresh`, {})
      .pipe(
        map(res => {
          if (res.success && res.data) {
            this.store.setSession(res.data);
            return true;
          }
          return false;
        }),
        catchError(() => of(false)),
        finalize(() => { this.refreshInFlight = null; }),
        shareReplay(1)
      );

    return this.refreshInFlight;
  }

  /** APP_INITIALIZER: on page load, restores the session if a valid cookie exists. */
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
