import {
  ApplicationConfig,
  APP_INITIALIZER,
  LOCALE_ID,
  PLATFORM_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
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
 *
 * Bu garanti router'ın varsayılan (non-blocking) ilk navigasyonuna dayanır: o modda
 * navigasyon tüm APP_INITIALIZER'lar bittikten sonra bootstrap listener'da başlar.
 * withEnabledBlockingInitialNavigation() EKLEME — navigasyonu kendi APP_INITIALIZER'ında
 * bununla paralel başlatır, guard refresh dönmeden koşar ve her F5 /login'e düşer.
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

// DatePipe'ın TR biçimi (27.07.2026 12:14) kullanabilmesi için locale verisi kaydedilir;
// Angular varsayılanı en-US'tir (7/27/26, 12:14 PM). Konsol arayüzü Türkçe.
registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'tr' },
    provideRouter(routes),
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
