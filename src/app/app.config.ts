import {
  ApplicationConfig,
  LOCALE_ID,
  PLATFORM_ID,
  provideZoneChangeDetection,
  inject,
  provideAppInitializer
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { correlationInterceptor } from './core/interceptors/correlation.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { platformAuthInterceptor } from './core/interceptors/platform-auth.interceptor';
import { PlatformAuthService } from './core/auth/platform-auth.service';

/**
 * Restores the session before the router activates ([11 §4]): since the access token lives in
 * memory it is wiped on page reload; if the refresh cookie is valid a new
 * access token + user are loaded, so the guards (platformAuthGuard/capabilityGuard)
 * read the synchronous store already filled — no race condition.
 *
 * This guarantee relies on the router's default (non-blocking) initial navigation: in that mode
 * navigation starts in the bootstrap listener after all APP_INITIALIZERs have finished.
 * Do NOT ADD withEnabledBlockingInitialNavigation() — it starts navigation in its own APP_INITIALIZER
 * in parallel with this one, the guard runs before refresh returns and every F5 lands on /login.
 */
function restoreSession(auth: PlatformAuthService, platformId: Object): Promise<void> {
  if (!isPlatformBrowser(platformId)) return Promise.resolve();
  return firstValueFrom(auth.loadSession()).then(() => {}).catch(() => {});
}

// Locale data is registered so DatePipe can use the TR format (27.07.2026 12:14);
// Angular's default is en-US (7/27/26, 12:14 PM). The console UI is Turkish.
registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'tr' },
    provideRouter(routes),
    // Interceptor order: correlation + language add headers, then error
    // (refresh+retry on 401) wraps platformAuth — the fresh token is attached on retry.
    provideHttpClient(withInterceptors([
      correlationInterceptor,
      languageInterceptor,
      errorInterceptor,
      platformAuthInterceptor
    ])),
    provideAppInitializer(() => restoreSession(inject(PlatformAuthService), inject(PLATFORM_ID)))
  ]
};
