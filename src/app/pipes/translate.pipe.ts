import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

/**
 * Translates a translation key into the active language. Impure — re-evaluated when the
 * language toggle signal changes. Usage: {{ 'pc.login.title' | t }}
 */
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);
  transform(key: string, params?: Record<string, string | number>): string {
    return this.languageService.t(key, params);
  }
}
