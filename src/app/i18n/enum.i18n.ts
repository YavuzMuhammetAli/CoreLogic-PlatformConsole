import { Translations } from './translations.model';

/**
 * Sunucudan sabit İngilizce gelen değerlerin görünen adları.
 *
 * Backend durum/tür sabitlerini (Entities.Concrete.* ve AuditConstants) olduğu gibi
 * döndürür; konsol onları burada çevirir. Tek sözlük, çünkü aynı değer birden çok
 * ekranda geçer ('Active' tenant, plan ve abonelikte) ve her yerde aynı okunmalı.
 *
 *   pc.enum.<Değer>      → LanguageService.enumLabel()  (StatusBadge bunu otomatik kullanır)
 *   pc.feature.<anahtar> → LanguageService.featureLabel() (plan özellik/kota anahtarları)
 *   pc.unit.<birim>      → LanguageService.unitLabel()
 *   pc.jobType.<tip>     → İş kuyruğu tipleri
 *
 * Model sabitlerindeki her değerin burada karşılığı olduğunu scripts/check-i18n.js denetler.
 */
export const ENUM_I18N: Translations = {
  // ── Tenant yaşam döngüsü + kurulum adımları ────────────────────────────────
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

  // ── Sağlık ─────────────────────────────────────────────────────────────────
  'pc.enum.Healthy': { tr: 'Sağlıklı', en: 'Healthy' },
  'pc.enum.Degraded': { tr: 'Yavaş / kısmi', en: 'Degraded' },
  'pc.enum.Unhealthy': { tr: 'Erişilemiyor', en: 'Unhealthy' },
  'pc.enum.Unknown': { tr: 'Bilinmiyor', en: 'Unknown' },
  'pc.enum.NotConfigured': { tr: 'Yapılandırılmamış', en: 'Not configured' },

  // ── İş kuyruğu / outbox / bildirim teslimi ─────────────────────────────────
  'pc.enum.Pending': { tr: 'Beklemede', en: 'Pending' },
  'pc.enum.Succeeded': { tr: 'Başarılı', en: 'Succeeded' },
  'pc.enum.Parked': { tr: 'Askıya alındı', en: 'Parked' },
  'pc.enum.Cancelled': { tr: 'İptal edildi', en: 'Cancelled' },
  'pc.enum.Dispatched': { tr: 'İletildi', en: 'Dispatched' },
  'pc.enum.Delivered': { tr: 'Teslim edildi', en: 'Delivered' },
  'pc.enum.Sent': { tr: 'Gönderildi', en: 'Sent' },

  // ── Uyarı durumu ───────────────────────────────────────────────────────────
  'pc.enum.Firing': { tr: 'Tetiklendi', en: 'Firing' },
  'pc.enum.Acknowledged': { tr: 'Üstlenildi', en: 'Acknowledged' },
  'pc.enum.Resolved': { tr: 'Çözümlendi', en: 'Resolved' },

  // ── Önem seviyeleri (uyarı, denetim, duyuru) ───────────────────────────────
  'pc.enum.Info': { tr: 'Bilgi', en: 'Info' },
  'pc.enum.Notice': { tr: 'Dikkat', en: 'Notice' },
  'pc.enum.Warning': { tr: 'Uyarı', en: 'Warning' },
  'pc.enum.Critical': { tr: 'Kritik', en: 'Critical' },
  'pc.enum.Maintenance': { tr: 'Bakım', en: 'Maintenance' },
  'pc.enum.Incident': { tr: 'Kesinti', en: 'Incident' },

  // ── Denetim sonucu + kategorisi ────────────────────────────────────────────
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

  // ── Destek erişimi (impersonation) ─────────────────────────────────────────
  'pc.enum.Requested': { tr: 'Talep edildi', en: 'Requested' },
  'pc.enum.Approved': { tr: 'Onaylandı', en: 'Approved' },
  'pc.enum.ActiveUse': { tr: 'Kullanımda', en: 'In use' },
  'pc.enum.Expired': { tr: 'Süresi doldu', en: 'Expired' },
  'pc.enum.Revoked': { tr: 'Geri çekildi', en: 'Revoked' },

  // ── Uyumluluk talepleri ────────────────────────────────────────────────────
  'pc.enum.Open': { tr: 'Açık', en: 'Open' },
  'pc.enum.InProgress': { tr: 'İşlemde', en: 'In progress' },
  'pc.enum.Rejected': { tr: 'Reddedildi', en: 'Rejected' },
  'pc.enum.DSAR': { tr: 'Veri erişim talebi (DSAR)', en: 'Data access request (DSAR)' },
  'pc.enum.Erasure': { tr: 'Silme talebi', en: 'Erasure' },
  'pc.enum.Offboarding': { tr: 'Müşteri ayrılışı', en: 'Offboarding' },
  'pc.enum.RetentionReview': { tr: 'Saklama incelemesi', en: 'Retention review' },

  // ── Güvenlik olayları + IP kuralları ───────────────────────────────────────
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

  // ── Bildirim kuralları ─────────────────────────────────────────────────────
  'pc.enum.Event': { tr: 'Olay', en: 'Event' },
  'pc.enum.Alert': { tr: 'Uyarı', en: 'Alert' },
  'pc.enum.Email': { tr: 'E-posta', en: 'Email' },
  'pc.enum.InApp': { tr: 'Konsol içi', en: 'In-app' },
  'pc.enum.Webhook': { tr: 'Webhook', en: 'Webhook' },

  // ── Webhook olay tipleri ───────────────────────────────────────────────────
  'pc.enum.TenantSuspended': { tr: 'Tenant askıya alındı', en: 'Tenant suspended' },
  'pc.enum.TenantResumed': { tr: 'Tenant yeniden açıldı', en: 'Tenant resumed' },
  'pc.enum.TenantArchived': { tr: 'Tenant arşivlendi', en: 'Tenant archived' },
  'pc.enum.TenantPurgeScheduled': { tr: 'Tenant silme planlandı', en: 'Tenant purge scheduled' },

  // ── Plan + abonelik ────────────────────────────────────────────────────────
  'pc.enum.Draft': { tr: 'Taslak', en: 'Draft' },
  'pc.enum.Retired': { tr: 'Kullanımdan kaldırıldı', en: 'Retired' },
  'pc.enum.Trial': { tr: 'Deneme', en: 'Trial' },
  'pc.enum.PastDue': { tr: 'Ödemesi gecikmiş', en: 'Past due' },

  // ── Duyuru + veritabanı sunucusu ───────────────────────────────────────────
  'pc.enum.Published': { tr: 'Yayında', en: 'Published' },
  'pc.enum.Draining': { tr: 'Boşaltılıyor', en: 'Draining' },
  'pc.enum.Offline': { tr: 'Çevrimdışı', en: 'Offline' },

  // ── Özellik bayrakları ─────────────────────────────────────────────────────
  'pc.enum.On': { tr: 'Açık', en: 'On' },
  'pc.enum.Off': { tr: 'Kapalı', en: 'Off' },
  'pc.enum.Percentage': { tr: 'Yüzdelik', en: 'Percentage' },

  // ── Migrasyon + yedek türleri ──────────────────────────────────────────────
  'pc.enum.Queued': { tr: 'Kuyrukta', en: 'Queued' },
  'pc.enum.Stopped': { tr: 'Durduruldu', en: 'Stopped' },
  'pc.enum.Skipped': { tr: 'Atlandı', en: 'Skipped' },
  'pc.enum.Manual': { tr: 'Elle', en: 'Manual' },
  'pc.enum.Scheduled': { tr: 'Zamanlanmış', en: 'Scheduled' },
  'pc.enum.PreMigration': { tr: 'Migrasyon öncesi', en: 'Pre-migration' },
  'pc.enum.PrePurge': { tr: 'Silme öncesi', en: 'Pre-purge' },

  // ── Worker ─────────────────────────────────────────────────────────────────
  'pc.enum.Disabled': { tr: 'Duraklatıldı', en: 'Paused' },
  'pc.enum.Stale': { tr: 'Yanıt yok', en: 'Not responding' },
  'pc.enum.Error': { tr: 'Hata', en: 'Error' },

  // ── İş kuyruğu tipleri ─────────────────────────────────────────────────────
  'pc.jobType.tenant.provision': { tr: 'Şirket kurulumu', en: 'Tenant provisioning' },
  'pc.jobType.tenant.backup': { tr: 'Şirket yedeği', en: 'Tenant backup' },
  'pc.jobType.platform.migration-upgrade': { tr: 'Migrasyon koşusu', en: 'Migration run' },
  'pc.jobType.notification.email': { tr: 'E-posta gönderimi', en: 'Email delivery' },
  'pc.jobType.workflow.notify': { tr: 'İş akışı bildirimi', en: 'Workflow notification' },
  'pc.jobType.workflow.notify.email': { tr: 'İş akışı e-postası', en: 'Workflow email' },

  // ── Plan özellik / kota anahtarları ────────────────────────────────────────
  'pc.feature.max_users': { tr: 'Kullanıcı sayısı', en: 'Users' },
  'pc.feature.max_models': { tr: 'Model sayısı', en: 'Models' },
  'pc.feature.max_storage_gb': { tr: 'Depolama alanı', en: 'Storage' },
  'pc.feature.storage_gb': { tr: 'Kullanılan depolama', en: 'Storage used' },
  'pc.feature.api_requests_per_day': { tr: 'Günlük API isteği', en: 'API requests per day' },
  'pc.feature.ai_tokens_per_month': { tr: 'Aylık AI token', en: 'AI tokens per month' },
  'pc.feature.feature_reports': { tr: 'Raporlar modülü', en: 'Reports module' },
  'pc.feature.feature_api_access': { tr: 'API erişimi', en: 'API access' },
  'pc.feature.workflow_definitions': { tr: 'İş akışı tanımı sayısı', en: 'Workflow definitions' },
  'pc.feature.workflow_runs_per_month': { tr: 'Aylık süreç başlatma', en: 'Workflow runs per month' },

  // ── Kota birimleri ─────────────────────────────────────────────────────────
  'pc.unit.tokens': { tr: 'token', en: 'tokens' },
  'pc.unit.requests': { tr: 'istek', en: 'requests' },
  'pc.unit.models': { tr: 'model', en: 'models' },
  'pc.unit.GB': { tr: 'GB', en: 'GB' },
  'pc.unit.users': { tr: 'kullanıcı', en: 'users' },
  'pc.unit.workflows': { tr: 'akış', en: 'workflows' },
  'pc.unit.runs': { tr: 'süreç', en: 'runs' }
};
