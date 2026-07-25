/**
 * Platform yetenek sabitleri — backend Core.Utilities.Security.Platform.PlatformCapabilities
 * ile birebir aynı string'ler ([05 §3]). Guard'lar ve menü görünürlüğü bunları kullanır.
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
