import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Adds the user's UI language (TR/EN) as the Accept-Language header.
 * Reads the same localStorage key ('pc_lang') as LanguageService.
 */
export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') return next(req);
  const lang = localStorage.getItem('pc_lang') === 'en' ? 'en' : 'tr';
  return next(req.clone({ headers: req.headers.set('Accept-Language', lang) }));
};
