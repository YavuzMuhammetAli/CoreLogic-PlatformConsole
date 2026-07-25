import {
  ApplicationConfig,
  APP_INITIALIZER,
  PLATFORM_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { correlationInterceptor } from './core/interceptors/correlation.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { platformAuthInterceptor } from './core/interceptors/platform-auth.interceptor';
import { PlatformAuthService } from './core/auth/platform-auth.service';
import { PlatformSessionStore } from './core/auth/platform-session.store';

/**
 * Router etkinleşmeden önce oturumu geri yükler ([11 §4]): access token bellekte
 * olduğundan sayfa yenilemesinde silinir; refresh token varsa refresh ile yeni
 * access + kullanıcı yüklenir, böylece guard'lar (platformAuthGuard/capabilityGuard)
 * senkron store'u dolu okur — yarış durumu yok.
 */
function sessionInitializerFactory(
  auth: PlatformAuthService,
  store: PlatformSessionStore,
  platformId: Object
): () => Promise<void> {
  return () => {
    if (!isPlatformBrowser(platformId)) return Promise.resolve();
    if (!store.getRefreshToken()) return Promise.resolve();
    return firstValueFrom(auth.loadSession()).then(() => {}).catch(() => {});
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    // Interceptor sırası: correlation + language header'ları ekler, sonra error
    // (401'de refresh+retry) platformAuth'u sarar — retry'da taze token eklenir.
    provideHttpClient(withFetch(), withInterceptors([
      correlationInterceptor,
      languageInterceptor,
      errorInterceptor,
      platformAuthInterceptor
    ])),
    {
      provide: APP_INITIALIZER,
      useFactory: sessionInitializerFactory,
      deps: [PlatformAuthService, PlatformSessionStore, PLATFORM_ID],
      multi: true
    }
  ]
};
