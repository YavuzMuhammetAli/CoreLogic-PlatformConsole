import { Translations } from './translations.model';

/**
 * Display names of values that come from the server as fixed English constants.
 *
 * The backend returns status/type constants (Entities.Concrete.* and AuditConstants) as
 * is; the console translates them here. A single dictionary, because the same value appears on
 * multiple screens ('Active' for tenant, plan and subscription) and must read the same everywhere.
 *
 *   pc.enum.<Value>      → LanguageService.enumLabel()  (StatusBadge uses this automatically)
 *   pc.jobType.<type>    → Job queue types
 *
 * Plan feature / metric names and units are NOT KEPT here — the server sends them in the
 * request's language from the backend MetricCatalog (see MetricCatalogService).
 *
 * scripts/check-i18n.js verifies that every value in the model constants has a match here.
 */
export const ENUM_I18N: Translations = {
  // ── Tenant lifecycle + provisioning steps ──────────────────────────────────
  'pc.enum.Provisioning': { tr: 'Kuruluyor', en: 'Provisioning' },
  'pc.enum.Active': { tr: 'Aktif', en: 'Active' },
  'pc.enum.Failed': { tr: 'Başarısız', en: 'Failed' },
  'pc.enum.Suspended': { tr: 'Askıya alındı', en: 'Suspended' },
  'pc.enum.Archived': { tr: 'Arşivlendi', en: 'Archived' },
  'pc.enum.PendingPurge': { tr: 'Silinmeyi bekliyor', en: 'Pending purge' },
  'pc.enum.Purged': { tr: 'Kalıcı silindi', en: 'Purged' },
  'pc.enum.Running': { tr: 'Çalışıyor', en: 'Running' },
  'pc.enum.Completed': { tr: 'Tamamlandı', en: 'Completed' },
  'pc.enum.RolledBack': { tr: 'Geri alındı', en: 'Rolled back' },

  // ── Health ─────────────────────────────────────────────────────────────────
  'pc.enum.Healthy': { tr: 'Sağlıklı', en: 'Healthy' },
  'pc.enum.Degraded': { tr: 'Yavaş / kısmi', en: 'Degraded' },
  'pc.enum.Unhealthy': { tr: 'Erişilemiyor', en: 'Unhealthy' },
  'pc.enum.Unknown': { tr: 'Bilinmiyor', en: 'Unknown' },
  'pc.enum.NotConfigured': { tr: 'Yapılandırılmamış', en: 'Not configured' },

  // ── Job queue / outbox / notification delivery ─────────────────────────────
  'pc.enum.Pending': { tr: 'Beklemede', en: 'Pending' },
  'pc.enum.Succeeded': { tr: 'Başarılı', en: 'Succeeded' },
  'pc.enum.Parked': { tr: 'Askıya alındı', en: 'Parked' },
  'pc.enum.Cancelled': { tr: 'İptal edildi', en: 'Cancelled' },
  'pc.enum.Dispatched': { tr: 'İletildi', en: 'Dispatched' },
  'pc.enum.Delivered': { tr: 'Teslim edildi', en: 'Delivered' },
  'pc.enum.Sent': { tr: 'Gönderildi', en: 'Sent' },

  // ── Alert status ───────────────────────────────────────────────────────────
  'pc.enum.Firing': { tr: 'Tetiklendi', en: 'Firing' },
  'pc.enum.Acknowledged': { tr: 'Üstlenildi', en: 'Acknowledged' },
  'pc.enum.Resolved': { tr: 'Çözümlendi', en: 'Resolved' },

  // ── Severity levels (alert, audit, announcement) ───────────────────────────
  'pc.enum.Info': { tr: 'Bilgi', en: 'Info' },
  'pc.enum.Notice': { tr: 'Dikkat', en: 'Notice' },
  'pc.enum.Warning': { tr: 'Uyarı', en: 'Warning' },
  'pc.enum.Critical': { tr: 'Kritik', en: 'Critical' },
  'pc.enum.Maintenance': { tr: 'Bakım', en: 'Maintenance' },
  'pc.enum.Incident': { tr: 'Kesinti', en: 'Incident' },

  // ── Audit result + category ────────────────────────────────────────────────
  'pc.enum.Success': { tr: 'Başarılı', en: 'Success' },
  'pc.enum.Denied': { tr: 'Reddedildi', en: 'Denied' },
  'pc.enum.Identity': { tr: 'Kimlik', en: 'Identity' },
  'pc.enum.Iam': { tr: 'Yetkilendirme', en: 'Access (IAM)' },
  'pc.enum.TenantLifecycle': { tr: 'Tenant yaşam döngüsü', en: 'Tenant lifecycle' },
  'pc.enum.Configuration': { tr: 'Yapılandırma', en: 'Configuration' },
  'pc.enum.Commercial': { tr: 'Ticari', en: 'Commercial' },
  'pc.enum.Security': { tr: 'Güvenlik', en: 'Security' },
  'pc.enum.Operations': { tr: 'Operasyon', en: 'Operations' },
  'pc.enum.Support': { tr: 'Destek', en: 'Support' },
  'pc.enum.Data': { tr: 'Veri', en: 'Data' },

  // ── Support access (impersonation) ─────────────────────────────────────────
  'pc.enum.Requested': { tr: 'Talep edildi', en: 'Requested' },
  'pc.enum.Approved': { tr: 'Onaylandı', en: 'Approved' },
  'pc.enum.ActiveUse': { tr: 'Kullanımda', en: 'In use' },
  'pc.enum.Expired': { tr: 'Süresi doldu', en: 'Expired' },
  'pc.enum.Revoked': { tr: 'Geri çekildi', en: 'Revoked' },

  // ── Compliance requests ────────────────────────────────────────────────────
  'pc.enum.Open': { tr: 'Açık', en: 'Open' },
  'pc.enum.InProgress': { tr: 'İşlemde', en: 'In progress' },
  'pc.enum.Rejected': { tr: 'Reddedildi', en: 'Rejected' },
  'pc.enum.DSAR': { tr: 'Veri erişim talebi (DSAR)', en: 'Data access request (DSAR)' },
  'pc.enum.Erasure': { tr: 'Silme talebi', en: 'Erasure' },
  'pc.enum.Offboarding': { tr: 'Müşteri ayrılışı', en: 'Offboarding' },
  'pc.enum.RetentionReview': { tr: 'Saklama incelemesi', en: 'Retention review' },

  // ── Security events + IP rules ─────────────────────────────────────────────
  'pc.enum.Reviewed': { tr: 'İncelendi', en: 'Reviewed' },
  'pc.enum.Dismissed': { tr: 'Kapatıldı', en: 'Dismissed' },
  'pc.enum.Escalated': { tr: 'Üst kademeye iletildi', en: 'Escalated' },
  'pc.enum.BruteForce': { tr: 'Kaba kuvvet denemesi', en: 'Brute force' },
  'pc.enum.IpBlocked': { tr: 'IP engellendi', en: 'IP blocked' },
  'pc.enum.SessionReuse': { tr: 'Oturum yeniden kullanımı', en: 'Session reuse' },
  'pc.enum.PermissionDeniedSpike': { tr: 'Yetki reddi artışı', en: 'Permission-denied spike' },
  'pc.enum.BreakGlassActivated': { tr: 'Acil erişim açıldı', en: 'Break-glass activated' },
  'pc.enum.Allow': { tr: 'İzin ver', en: 'Allow' },
  'pc.enum.Deny': { tr: 'Engelle', en: 'Deny' },

  // ── Notification rules ─────────────────────────────────────────────────────
  'pc.enum.Event': { tr: 'Olay', en: 'Event' },
  'pc.enum.Alert': { tr: 'Uyarı', en: 'Alert' },
  'pc.enum.Email': { tr: 'E-posta', en: 'Email' },
  'pc.enum.InApp': { tr: 'Konsol içi', en: 'In-app' },
  'pc.enum.Webhook': { tr: 'Webhook', en: 'Webhook' },

  // ── Webhook event types ────────────────────────────────────────────────────
  'pc.enum.TenantSuspended': { tr: 'Tenant askıya alındı', en: 'Tenant suspended' },
  'pc.enum.TenantResumed': { tr: 'Tenant yeniden açıldı', en: 'Tenant resumed' },
  'pc.enum.TenantArchived': { tr: 'Tenant arşivlendi', en: 'Tenant archived' },
  'pc.enum.TenantPurgeScheduled': { tr: 'Tenant silme planlandı', en: 'Tenant purge scheduled' },

  // ── Plan + subscription ────────────────────────────────────────────────────
  'pc.enum.Draft': { tr: 'Taslak', en: 'Draft' },
  'pc.enum.Retired': { tr: 'Kullanımdan kaldırıldı', en: 'Retired' },
  'pc.enum.Trial': { tr: 'Deneme', en: 'Trial' },
  'pc.enum.PastDue': { tr: 'Ödemesi gecikmiş', en: 'Past due' },

  // ── Announcement + database server ─────────────────────────────────────────
  'pc.enum.Published': { tr: 'Yayında', en: 'Published' },
  'pc.enum.Draining': { tr: 'Boşaltılıyor', en: 'Draining' },
  'pc.enum.Offline': { tr: 'Çevrimdışı', en: 'Offline' },

  // ── Feature flags ──────────────────────────────────────────────────────────
  'pc.enum.On': { tr: 'Açık', en: 'On' },
  'pc.enum.Off': { tr: 'Kapalı', en: 'Off' },
  'pc.enum.Percentage': { tr: 'Yüzdelik', en: 'Percentage' },

  // ── Migration + backup types ───────────────────────────────────────────────
  'pc.enum.Queued': { tr: 'Kuyrukta', en: 'Queued' },
  'pc.enum.Stopped': { tr: 'Durduruldu', en: 'Stopped' },
  'pc.enum.Skipped': { tr: 'Atlandı', en: 'Skipped' },
  'pc.enum.Manual': { tr: 'Elle', en: 'Manual' },
  'pc.enum.Scheduled': { tr: 'Zamanlanmış', en: 'Scheduled' },
  'pc.enum.PreMigration': { tr: 'Migrasyon öncesi', en: 'Pre-migration' },
  'pc.enum.PrePurge': { tr: 'Silme öncesi', en: 'Pre-purge' },
  'pc.enum.PreRestore': { tr: 'Geri yükleme öncesi', en: 'Pre-restore' },

  // ── Worker ─────────────────────────────────────────────────────────────────
  'pc.enum.Disabled': { tr: 'Duraklatıldı', en: 'Paused' },
  'pc.enum.Stale': { tr: 'Yanıt yok', en: 'Not responding' },
  'pc.enum.Error': { tr: 'Hata', en: 'Error' },

  // ── Job queue types ────────────────────────────────────────────────────────
  'pc.jobType.tenant.provision': { tr: 'Şirket kurulumu', en: 'Tenant provisioning' },
  'pc.jobType.tenant.backup': { tr: 'Şirket yedeği', en: 'Tenant backup' },
  'pc.jobType.tenant.restore': { tr: 'Şirket geri yükleme', en: 'Tenant restore' },
  'pc.jobType.platform.migration-upgrade': { tr: 'Migrasyon koşusu', en: 'Migration run' },
  'pc.jobType.notification.email': { tr: 'E-posta gönderimi', en: 'Email delivery' },
  'pc.jobType.workflow.notify': { tr: 'İş akışı bildirimi', en: 'Workflow notification' },
  'pc.jobType.workflow.notify.email': { tr: 'İş akışı e-postası', en: 'Workflow email' }
};
