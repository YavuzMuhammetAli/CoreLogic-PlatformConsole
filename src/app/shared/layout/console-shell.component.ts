import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { PlatformAuthService } from '../../core/auth/platform-auth.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Cap } from '../../core/models/capabilities';

interface NavItem {
  labelKey: string;
  route: string;
  icon: string;
  /** Boş → herkese görünür; dolu → hasAny gerekir. */
  caps: string[];
}

/**
 * Konsol kabuğu ([11 §3], [12 §2]): topbar (arama yeri + dil + tema + kullanıcı)
 * + 8-domain sol menü (yetkiye göre filtreli — kör kapı yok). CSS Grid layout.
 */
@Component({
  selector: 'app-console-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './console-shell.component.html',
  styleUrl: './console-shell.component.scss'
})
export class ConsoleShellComponent {
  private readonly store = inject(PlatformSessionStore);
  private readonly auth = inject(PlatformAuthService);
  private readonly router = inject(Router);
  readonly language = inject(LanguageService);
  readonly theme = inject(ThemeService);

  readonly user = this.store.user;

  readonly initials = computed(() => {
    const name = this.user()?.name?.trim() || this.user()?.email || '';
    const parts = name.split(' ').filter(Boolean);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  });

  private readonly allNav: NavItem[] = [
    { labelKey: 'pc.nav.overview', route: '/overview', caps: [], icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { labelKey: 'pc.nav.tenants', route: '/tenants', caps: [Cap.TenantsRead], icon: 'M3 21h18M6 21V7l6-4 6 4v14M10 9h4M10 13h4M10 17h4' },
    { labelKey: 'pc.nav.access', route: '/access', caps: [Cap.IamManage, Cap.UsersRead], icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8' },
    { labelKey: 'pc.nav.security', route: '/security', caps: [Cap.SecurityRead], icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { labelKey: 'pc.nav.operations', route: '/operations', caps: [Cap.OpsRead], icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { labelKey: 'pc.nav.observability', route: '/observability', caps: [Cap.OpsRead], icon: 'M12 20V10M18 20V4M6 20v-4' },
    { labelKey: 'pc.nav.billing', route: '/billing', caps: [Cap.BillingRead], icon: 'M1 4h22v16H1zM1 10h22' },
    { labelKey: 'pc.nav.settings', route: '/settings', caps: [Cap.ConfigManage], icon: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6' }
  ];

  readonly nav = computed(() =>
    this.allNav.filter(i => i.caps.length === 0 || this.store.hasAny(i.caps)));

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
