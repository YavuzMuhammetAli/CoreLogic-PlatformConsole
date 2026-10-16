/**
 * Sayfa yardım içeriğinin ŞEMASI ve kayıt tablosu.
 *
 * Bu dosyada LİTERAL METİN YOKTUR — yalnızca i18n anahtarları. Metinlerin tamamı
 * `src/app/i18n/help.i18n.ts` içinde TR+EN çifti olarak durur (CoreLogicUI'daki
 * datatype-help deseni). Böylece dil değişimi tek yerden çalışır ve eksik çeviri
 * i18n testinde patlar, ekranda ham anahtar olarak görünmez.
 *
 * Anahtarlar konvansiyonla üretilir: bir konu `x` için
 *   pc.help.x.title / .summary
 *   pc.help.x.field.<ad>.label / .desc
 *   pc.help.x.rule.<ad>.label / .desc
 *   pc.help.x.notes
 */

/** Bir kolonun/alanın ne anlama geldiği ve nasıl elde edildiği. */
export interface HelpEntry {
  labelKey: string;
  descKey: string;
}

export interface PageHelpTopic {
  titleKey: string;
  summaryKey: string;
  /** Sayfadaki kolon/alan sözlüğü — "bu ne demek, nereden geliyor". */
  fields: HelpEntry[];
  /** Yaşam döngüsü / iş kuralları — yalnız gerçekten kuralı olan sayfalarda. */
  rules?: HelpEntry[];
  /** Durum zinciri şeridi, ör. ['Draft','Published','Expired']. */
  lifecycle?: string[];
  /** Sarı "Dikkat" kutusu. */
  notesKey?: string;
}

export type PageHelpId = string;

// ── Anahtar üreten yardımcılar (tekrarı önler) ────────────────────────────────
const field = (topic: string, name: string): HelpEntry => ({
  labelKey: `pc.help.${topic}.field.${name}.label`,
  descKey: `pc.help.${topic}.field.${name}.desc`
});
const rule = (topic: string, name: string): HelpEntry => ({
  labelKey: `pc.help.${topic}.rule.${name}.label`,
  descKey: `pc.help.${topic}.rule.${name}.desc`
});

/** Konu tanımını kısaltan fabrika — başlık/özet/not anahtarları konvansiyondan gelir. */
function topic(
  id: string,
  fieldNames: string[],
  options: { rules?: string[]; lifecycle?: string[]; notes?: boolean } = {}
): PageHelpTopic {
  return {
    titleKey: `pc.help.${id}.title`,
    summaryKey: `pc.help.${id}.summary`,
    fields: fieldNames.map(n => field(id, n)),
    rules: options.rules?.map(n => rule(id, n)),
    lifecycle: options.lifecycle,
    notesKey: options.notes ? `pc.help.${id}.notes` : undefined
  };
}

/**
 * Sayfa → yardım konusu. Anahtarlar route yoluna karşılık gelir; her sayfanın
 * `.page-head`'indeki "Nasıl çalışır?" butonu buradaki id'yi geçer.
 */
export const PAGE_HELP: Record<PageHelpId, PageHelpTopic> = {
  // ── Genel bakış ────────────────────────────────────────────────────────────
  overview: topic('overview',
    ['health', 'requests', 'errorRate', 'p95', 'openAlerts', 'roles', 'caps'],
    { notes: true }),

  // ── Tenant ─────────────────────────────────────────────────────────────────
  tenants: topic('tenants',
    ['code', 'name', 'status', 'health', 'database', 'version', 'created']),

  tenantDetail: topic('tenantDetail',
    ['provisioned', 'steps', 'timeline', 'licensing', 'backups', 'models', 'tables'],
    {
      rules: ['suspend', 'archive', 'purge', 'orphanTable', 'subModelDepth'],
      lifecycle: ['Provisioning', 'Active', 'Suspended', 'Archived', 'PendingPurge'],
      notes: true
    }),

  // ── Erişim ─────────────────────────────────────────────────────────────────
  platformUsers: topic('platformUsers',
    ['email', 'roles', 'mfa', 'status', 'lastLogin'],
    { rules: ['roleModel', 'mfaLazyEnroll', 'lockout', 'deactivateVsDelete'], notes: true }),

  impersonation: topic('impersonation',
    ['tenant', 'target', 'reason', 'status', 'expires', 'token'],
    {
      rules: ['separationOfDuties', 'maxHours', 'tokenMinting', 'revoke'],
      lifecycle: ['Requested', 'Approved', 'ActiveUse', 'Expired'],
      notes: true
    }),

  // ── Güvenlik ───────────────────────────────────────────────────────────────
  auditLogs: topic('auditLogs',
    ['occurredAt', 'actor', 'action', 'category', 'result', 'severity', 'correlation'],
    { rules: ['correlationChain', 'severityLevels', 'retention'], notes: true }),

  securityCenter: topic('securityCenter',
    ['threatEvents', 'loginAttempts', 'ipRules'],
    {
      rules: ['eventTriage', 'ipRuleOrder'],
      lifecycle: ['Open', 'Reviewed', 'Dismissed', 'Escalated']
    }),

  compliance: topic('compliance',
    ['type', 'tenant', 'subject', 'status', 'requested'],
    {
      rules: ['dsar', 'erasure', 'offboarding', 'legalClock'],
      lifecycle: ['Open', 'InProgress', 'Completed'],
      notes: true
    }),

  // ── Operasyon ──────────────────────────────────────────────────────────────
  jobs: topic('jobs',
    ['type', 'status', 'attempts', 'tenant', 'created', 'error'],
    { rules: ['retryBackoff', 'poison'] }),

  health: topic('health',
    ['component', 'status', 'latency', 'detail', 'checkedAt'],
    { rules: ['overall', 'canary'] }),

  alerts: topic('alerts',
    ['severity', 'rule', 'valueThreshold', 'status', 'firedAt', 'context', 'runbook'],
    {
      rules: ['window', 'condition', 'ackVsResolve', 'apiOnlyContext', 'prunedTraces', 'parkedJobs'],
      lifecycle: ['Firing', 'Acknowledged', 'Resolved'],
      notes: true
    }),

  notifications: topic('notifications',
    ['inbox', 'ruleName', 'trigger', 'channel', 'filter', 'targets'],
    { rules: ['triggerFilter', 'throttle'] }),

  registry: topic('registry',
    ['schemaVersion', 'latest', 'driftStatus', 'modelCount', 'assemblyError', 'syncState'],
    { rules: ['driftMeaning', 'schemaVsAssembly'], notes: true }),

  workers: topic('workers',
    ['name', 'status', 'interval', 'heartbeat', 'lastRun', 'lastError', 'owner'],
    {
      rules: ['pauseVsStale', 'resetLoop', 'criticalWorkers', 'intervalOverride'],
      lifecycle: ['Running', 'Disabled', 'Stale', 'Error'],
      notes: true
    }),

  migrations: topic('migrations',
    ['status', 'trigger', 'total', 'succeeded', 'failed', 'skipped', 'startedAt', 'waves', 'stoppedReason'],
    {
      rules: ['waveOrder', 'idempotency', 'stopOnFirstFailure', 'preBackup', 'asyncRun', 'schedule'],
      lifecycle: ['Queued', 'Running', 'Completed', 'Stopped', 'Failed'],
      notes: true
    }),

  // ── Gözlemlenebilirlik ─────────────────────────────────────────────────────
  apiMonitor: topic('apiMonitor',
    ['route', 'count', 'errorRate', 'p95', 'liveStream', 'correlation'],
    { notes: true }),

  performance: topic('performance',
    ['hours', 'slowestEndpoints', 'slowestRequests', 'p95']),

  // ── Ticari ─────────────────────────────────────────────────────────────────
  plans: topic('plans',
    ['code', 'version', 'status', 'isPublic', 'isDefault', 'trialDays', 'features'],
    {
      rules: ['versioning', 'defaultPlan', 'featureCatalog', 'unlimitedLimit', 'deleteVsRetire'],
      lifecycle: ['Draft', 'Active', 'Retired'],
      notes: true
    }),

  subscriptions: topic('subscriptions',
    ['tenant', 'plan', 'status', 'seats', 'trialEnds', 'graceUntil'],
    {
      rules: ['autoAssign', 'entitlement', 'dunning', 'oneActivePerCompany'],
      lifecycle: ['Trial', 'Active', 'PastDue', 'Cancelled'],
      notes: true
    }),

  usage: topic('usage',
    ['tenant', 'metric', 'quantity', 'window']),

  cost: topic('cost',
    ['tenant', 'totalCost', 'metric', 'unitCost', 'breakdown'],
    { notes: true }),

  // ── Ayarlar ────────────────────────────────────────────────────────────────
  config: topic('config',
    ['key', 'value', 'isSecret', 'updated'],
    { notes: true }),

  flags: topic('flags',
    ['key', 'state', 'percentage', 'overrides', 'isStale'],
    { rules: ['percentageRollout', 'overridePrecedence', 'staleFlag'], notes: true }),

  integration: topic('integration',
    ['webhookName', 'url', 'events', 'failureCount', 'deliveries', 'apiKeys', 'secretOnce'],
    { rules: ['eventFilter', 'autoDisable', 'secretShownOnce'], notes: true }),

  announcements: topic('announcements',
    ['severity', 'title', 'body', 'status', 'created', 'servers'],
    {
      rules: ['severityMeaning', 'publishFlow', 'expire', 'serversPanel'],
      lifecycle: ['Draft', 'Published', 'Expired'],
      notes: true
    })
};

/** Eşleşmeyen konu için boş ekran yerine anlamlı bir yedek. */
export const FALLBACK_TOPIC: PageHelpTopic = {
  titleKey: 'pc.help.fallback.title',
  summaryKey: 'pc.help.fallback.summary',
  fields: []
};

export function resolvePageHelp(id: PageHelpId): PageHelpTopic {
  return PAGE_HELP[id] ?? FALLBACK_TOPIC;
}
