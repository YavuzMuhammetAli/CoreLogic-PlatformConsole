import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Kullanıcının arayüz dilini (TR/EN) Accept-Language header'ı olarak ekler.
 * LanguageService ile aynı localStorage anahtarını ('pc_lang') okur.
 */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') return next(req);
  const lang = localStorage.getItem('pc_lang') === 'en' ? 'en' : 'tr';
  return next(req.clone({ headers: req.headers.set('Accept-Language', lang) }));
};
