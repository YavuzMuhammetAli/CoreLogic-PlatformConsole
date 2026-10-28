import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { PlatformAuthService } from '../../core/auth/platform-auth.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Cap } from '../../core/models/capabilities';
import { IconComponent } from '../ui/icon/icon.component';
import type { IconName } from '../ui/icon/icons.generated';

interface NavItem {
  labelKey: string;
  route: string;
  icon: IconName;
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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, IconComponent],
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
    { labelKey: 'pc.nav.overview', route: '/overview', caps: [], icon: 'dashboard' },
    { labelKey: 'pc.nav.tenants', route: '/tenants', caps: [Cap.TenantsRead], icon: 'domain' },
    { labelKey: 'pc.nav.access', route: '/access', caps: [Cap.IamManage, Cap.UsersRead], icon: 'group' },
    { labelKey: 'pc.nav.security', route: '/security', caps: [Cap.SecurityRead], icon: 'shield' },
    { labelKey: 'pc.nav.operations', route: '/operations', caps: [Cap.OpsRead], icon: 'monitor_heart' },
    { labelKey: 'pc.nav.observability', route: '/observability', caps: [Cap.OpsRead], icon: 'monitoring' },
    { labelKey: 'pc.nav.billing', route: '/billing', caps: [Cap.BillingRead], icon: 'credit_card' },
    { labelKey: 'pc.nav.settings', route: '/settings', caps: [Cap.ConfigManage], icon: 'tune' }
  ];

  readonly nav = computed(() =>
    this.allNav.filter(i => i.caps.length === 0 || this.store.hasAny(i.caps)));

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
