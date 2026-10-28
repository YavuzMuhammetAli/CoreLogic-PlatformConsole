import { Component, OnInit, inject, signal } from '@angular/core';
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

/** Platform Kullanıcıları (M13) — liste; yazma işlemleri detay ekranında. */
@Component({
  selector: 'app-platform-users',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
  templateUrl: './platform-users.component.html',
  styleUrl: './platform-users.component.scss'
})
export class PlatformUsersComponent implements OnInit {
  private readonly service = inject(PlatformUsersService);
  private readonly store = inject(PlatformSessionStore);

  /** Route Cap.UsersRead ile de girilebiliyor — yazma bağlantıları yalnız IamManage'e görünür. */
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
