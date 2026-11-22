/**
 * Platform capability constants — strings identical to backend
 * Core.Utilities.Security.Platform.PlatformCapabilities ([05 §3]). Guards and menu visibility use them.
 */
export const Cap = {
  TenantsRead: 'Platform.Tenants.Read',
  TenantsWrite: 'Platform.Tenants.Write',
  TenantsPurge: 'Platform.Tenants.Purge',
  UsersRead: 'Platform.Users.Read',
  ImpersonationRequest: 'Platform.Impersonation.Request',
  ImpersonationApprove: 'Platform.Impersonation.Approve',
  IamManage: 'Platform.Iam.Manage',
  BillingRead: 'Platform.Billing.Read',
  BillingWrite: 'Platform.Billing.Write',
  SecurityRead: 'Platform.Security.Read',
  SecurityManage: 'Platform.Security.Manage',
  OpsRead: 'Platform.Ops.Read',
  OpsManage: 'Platform.Ops.Manage',
  ConfigManage: 'Platform.Config.Manage'
} as const;

export type Capability = typeof Cap[keyof typeof Cap];
