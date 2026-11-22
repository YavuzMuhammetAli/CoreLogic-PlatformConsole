import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformUsersService } from './platform-users.service';
import { PlatformUserListItem } from '../../core/models/platform.models';
import { PlatformSessionStore } from '../../core/auth/platform-session.store';
import { Cap } from '../../core/models/capabilities';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Platform Users (M13) — list; write operations are on the detail screen. */
@Component({
    selector: 'app-platform-users',
    imports: [DatePipe, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './platform-users.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './platform-users.component.scss'
})
export class PlatformUsersComponent implements OnInit {
  private readonly service = inject(PlatformUsersService);
  private readonly store = inject(PlatformSessionStore);

  /** The route can also be entered with Cap.UsersRead — write links are visible only to IamManage. */
  readonly canManage = this.store.has(Cap.IamManage);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly users = signal<PlatformUserListItem[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) this.users.set(res.data ?? []);
        else this.error.set(res.message);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Yüklenemedi');
      }
    });
  }
}
