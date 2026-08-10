import { Routes } from '@angular/router';
import { platformAuthGuard } from './core/guards/platform-auth.guard';
import { capabilityGuard } from './core/guards/capability.guard';
import { Cap } from './core/models/capabilities';

export const routes: Routes = [
  // Giriş (public)
  {
    path: 'login',
    loadComponent: () =>
      import('./domains/auth/login.component').then(m => m.LoginComponent)
  },

  // Korumalı konsol kabuğu
  {
    path: '',
    canActivate: [platformAuthGuard],
    loadComponent: () =>
      import('./shared/layout/console-shell.component').then(m => m.ConsoleShellComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./domains/overview/overview.component').then(m => m.OverviewComponent)
      },

      // Users & Access
      { path: 'access', redirectTo: 'access/platform-users', pathMatch: 'full' },
      {
        path: 'access/platform-users',
        canActivate: [capabilityGuard(Cap.IamManage, Cap.UsersRead)],
        loadComponent: () =>
          import('./domains/access/platform-users.component').then(m => m.PlatformUsersComponent)
      },
      // Sabit 'new' segmenti ':id'den ÖNCE — aksi hâlde Angular 'new'i parametre yakalar.
      {
        path: 'access/platform-users/new',
        canActivate: [capabilityGuard(Cap.IamManage)],
        loadComponent: () =>
          import('./domains/access/platform-user-detail.component').then(m => m.PlatformUserDetailComponent)
      },
      {
        path: 'access/platform-users/:id',
        canActivate: [capabilityGuard(Cap.IamManage)],
        loadComponent: () =>
          import('./domains/access/platform-user-detail.component').then(m => m.PlatformUserDetailComponent)
      },
      {
        path: 'access/impersonation',
        canActivate: [capabilityGuard(Cap.ImpersonationRequest, Cap.ImpersonationApprove)],
        loadComponent: () =>
          import('./domains/access/impersonation.component').then(m => m.ImpersonationComponent)
      },

      // Security
      { path: 'security', redirectTo: 'security/audit-logs', pathMatch: 'full' },
      {
        path: 'security/audit-logs',
        canActivate: [capabilityGuard(Cap.SecurityRead)],
        loadComponent: () =>
          import('./domains/security/audit-explorer.component').then(m => m.AuditExplorerComponent)
      },
      {
        path: 'security/center',
        canActivate: [capabilityGuard(Cap.SecurityRead)],
        loadComponent: () =>
          import('./domains/security/security-center.component').then(m => m.SecurityCenterComponent)
      },
      {
        path: 'security/compliance',
        canActivate: [capabilityGuard(Cap.SecurityRead)],
        loadComponent: () =>
          import('./domains/security/compliance.component').then(m => m.ComplianceComponent)
      },

      // Tenants (M02) — salt-okur dizin (P1.2)
      {
        path: 'tenants',
        canActivate: [capabilityGuard(Cap.TenantsRead)],
        loadComponent: () =>
          import('./domains/tenants/tenant-list.component').then(m => m.TenantListComponent)
      },
      {
        path: 'tenants/:code',
        canActivate: [capabilityGuard(Cap.TenantsRead)],
        loadComponent: () =>
          import('./domains/tenants/tenant-detail.component').then(m => m.TenantDetailComponent)
      },

      // Henüz uygulanmamış domain'ler (sonraki fazlar) — yer tutucu
      // Operations (P1.3) — Jobs & Queue
      { path: 'operations', redirectTo: 'operations/jobs', pathMatch: 'full' },
      {
        path: 'operations/jobs',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/jobs-list.component').then(m => m.JobsListComponent)
      },
      {
        // Worker kontrol düzlemi (migrasyon 025) — aç/kapa, aralık, döngü yenileme.
        path: 'operations/workers',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/worker-center.component').then(m => m.WorkerCenterComponent)
      },
      {
        path: 'operations/health',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/health-center.component').then(m => m.HealthCenterComponent)
      },
      {
        path: 'operations/alerts',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/alert-center.component').then(m => m.AlertCenterComponent)
      },
      {
        path: 'operations/notifications',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/notification-center.component').then(m => m.NotificationCenterComponent)
      },
      {
        path: 'operations/registry',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/model-registry.component').then(m => m.ModelRegistryComponent)
      },
      {
        path: 'operations/migrations',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/operations/migration.component').then(m => m.MigrationComponent)
      },
      // Observability (P2.1) — API Monitoring
      { path: 'observability', redirectTo: 'observability/api', pathMatch: 'full' },
      {
        path: 'observability/api',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/observability/api-monitor.component').then(m => m.ApiMonitorComponent)
      },
      {
        path: 'observability/performance',
        canActivate: [capabilityGuard(Cap.OpsRead)],
        loadComponent: () =>
          import('./domains/observability/performance.component').then(m => m.PerformanceComponent)
      },
      // Billing (P3.1) — Plan kataloğu + abonelikler
      { path: 'billing', redirectTo: 'billing/plans', pathMatch: 'full' },
      {
        path: 'billing/plans',
        canActivate: [capabilityGuard(Cap.BillingRead)],
        loadComponent: () =>
          import('./domains/billing/plans.component').then(m => m.PlansComponent)
      },
      {
        path: 'billing/plans/:id',
        canActivate: [capabilityGuard(Cap.BillingRead)],
        loadComponent: () =>
          import('./domains/billing/plan-detail.component').then(m => m.PlanDetailComponent)
      },
      {
        path: 'billing/subscriptions',
        canActivate: [capabilityGuard(Cap.BillingRead)],
        loadComponent: () =>
          import('./domains/billing/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'billing/usage',
        canActivate: [capabilityGuard(Cap.BillingRead)],
        loadComponent: () =>
          import('./domains/billing/usage.component').then(m => m.UsageComponent)
      },
      {
        path: 'billing/cost',
        canActivate: [capabilityGuard(Cap.BillingRead)],
        loadComponent: () =>
          import('./domains/billing/cost.component').then(m => m.CostComponent)
      },
      // Settings (P1.5) — Platform Config (salt-okur)
      { path: 'settings', redirectTo: 'settings/config', pathMatch: 'full' },
      {
        path: 'settings/config',
        canActivate: [capabilityGuard(Cap.ConfigManage)],
        loadComponent: () =>
          import('./domains/settings/config-list.component').then(m => m.ConfigListComponent)
      },
      {
        path: 'settings/flags',
        canActivate: [capabilityGuard(Cap.ConfigManage)],
        loadComponent: () =>
          import('./domains/settings/feature-flags.component').then(m => m.FeatureFlagsComponent)
      },
      {
        path: 'settings/integration',
        canActivate: [capabilityGuard(Cap.ConfigManage)],
        loadComponent: () =>
          import('./domains/settings/integration.component').then(m => m.IntegrationComponent)
      },
      {
        path: 'settings/announcements',
        canActivate: [capabilityGuard(Cap.ConfigManage)],
        loadComponent: () =>
          import('./domains/settings/announcements.component').then(m => m.AnnouncementsComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
