import { Translations } from './translations.model';

/**
 * Page help contents (`pc.help.*`).
 *
 * The schema lives in `shared/ui/page-help/page-help.data.ts`; only the text lives
 * here. Key convention:
 *   pc.help.<topic>.title / .summary / .notes
 *   pc.help.<topic>.field.<name>.label / .desc
 *   pc.help.<topic>.rule.<name>.label / .desc
 *
 * The reason for a separate file is volume: platform.i18n.ts carries the short labels
 * of the operator UI, whereas the texts here are explanatory paragraphs.
 */
export const HELP_I18N: Translations = {
  // ── Dialog frame ───────────────────────────────────────────────────────────
  'pc.help.howItWorks': { tr: 'Nasıl çalışır?', en: 'How does this work?' },
  'pc.help.sectionSummary': { tr: 'Bu sayfa ne gösterir?', en: 'What does this page show?' },
  'pc.help.sectionLifecycle': { tr: 'Yaşam döngüsü', en: 'Lifecycle' },
  'pc.help.sectionFields': { tr: 'Alanlar ve kolonlar', en: 'Fields and columns' },
  'pc.help.sectionRules': { tr: 'İş kuralları', en: 'Business rules' },
  'pc.help.fallback.title': { tr: 'Bu ekran hakkında', en: 'About this screen' },
  'pc.help.fallback.summary': {
    tr: 'Bu ekran için henüz ayrıntılı açıklama yazılmadı.',
    en: 'Detailed documentation for this screen has not been written yet.'
  },

  // ══ OVERVIEW ══════════════════════════════════════════════════════════════
  'pc.help.overview.title': { tr: 'Genel Bakış', en: 'Overview' },
  'pc.help.overview.summary': {
    tr: 'Platformun "altın sinyalleri": sağlık, trafik, hata oranı ve gecikme tek ekranda. Sayılar son 24 saatlik API metrik rollup\'larından, sağlık ise bileşen kontrollerinden gelir.',
    en: 'The platform\'s "golden signals": health, traffic, error rate and latency on one screen. Numbers come from the last 24 hours of API metric rollups; health comes from component checks.'
  },
  'pc.help.overview.field.health.label': { tr: 'Platform sağlığı', en: 'Platform health' },
  'pc.help.overview.field.health.desc': {
    tr: 'Bileşen sağlık kontrollerinin en kötüsü. Bir bileşen bile Unhealthy ise genel durum Unhealthy olur. Ayrıntı için Operasyon → Sağlık.',
    en: 'The worst of the component health checks. If even one component is Unhealthy the overall state is Unhealthy. See Operations → Health for detail.'
  },
  'pc.help.overview.field.requests.label': { tr: 'İstek (24s)', en: 'Requests (24h)' },
  'pc.help.overview.field.requests.desc': {
    tr: 'Son 24 saatte işlenen toplam API isteği. Dakikalık rollup toplamıdır, canlı sayaç değildir.',
    en: 'Total API requests served in the last 24 hours. It is a sum of per-minute rollups, not a live counter.'
  },
  'pc.help.overview.field.errorRate.label': { tr: 'Hata oranı (24s)', en: 'Error rate (24h)' },
  'pc.help.overview.field.errorRate.desc': {
    tr: '5xx yanıtların toplam isteğe oranı. %1 üzerinde sarı, %5 üzerinde kırmızı gösterilir.',
    en: 'Ratio of 5xx responses to total requests. Shown amber above 1% and red above 5%.'
  },
  'pc.help.overview.field.p95.label': { tr: 'En kötü p95', en: 'Worst p95' },
  'pc.help.overview.field.p95.desc': {
    tr: 'Tüm uçlar arasındaki en yüksek 95. yüzdelik yanıt süresi (ms). Ortalama değil yüzdeliktir: isteklerin %95\'i bu süreden hızlı tamamlanmıştır.',
    en: 'The highest 95th-percentile response time (ms) across all endpoints. It is a percentile, not an average: 95% of requests completed faster than this.'
  },
  'pc.help.overview.field.openAlerts.label': { tr: 'Açık uyarılar', en: 'Open alerts' },
  'pc.help.overview.field.openAlerts.desc': {
    tr: 'Henüz çözümlenmemiş (Tetiklendi veya Üstlenildi) uyarılar. Kural adı, ölçülen değer ve eşik birlikte gösterilir.',
    en: 'Alerts not yet resolved (Firing or Acknowledged). Rule name, measured value and threshold are shown together.'
  },
  'pc.help.overview.field.roles.label': { tr: 'Rolleriniz', en: 'Your roles' },
  'pc.help.overview.field.roles.desc': {
    tr: 'Oturum token\'ınızdaki platform rolleri. Rol atamaları yeni oturumda etkinleşir.',
    en: 'The platform roles in your session token. Role changes take effect on your next sign-in.'
  },
  'pc.help.overview.field.caps.label': { tr: 'Yetkileriniz', en: 'Your capabilities' },
  'pc.help.overview.field.caps.desc': {
    tr: 'Rollerinizin verdiği yeteneklerin birleşimi. Sol menü de bu listeye göre çizilir — göremediğiniz bir sayfa yetkiniz olmadığı içindir.',
    en: 'The union of capabilities granted by your roles. The sidebar is drawn from this list too — a page you cannot see is one you lack the capability for.'
  },
  'pc.help.overview.notes': {
    tr: 'Metrikler dakikalık rollup üzerinden hesaplanır; son bir dakikanın verisi burada henüz görünmeyebilir. Anlık trafik için Gözlemlenebilirlik → Canlı akış kullanın.',
    en: 'Metrics are computed from per-minute rollups; the most recent minute may not appear here yet. Use Observability → Live stream for real-time traffic.'
  },

  // ══ TENANT LIST ═══════════════════════════════════════════════════════════
  'pc.help.tenants.title': { tr: 'Tenant Dizini', en: 'Tenant Directory' },
  'pc.help.tenants.summary': {
    tr: 'Platformdaki tüm müşteri kurulumları. Her tenant\'ın kendi veritabanı vardır; buradaki satırlar master veritabanındaki Tenant + Company kayıtlarından gelir.',
    en: 'Every customer installation on the platform. Each tenant has its own database; the rows here come from the Tenant + Company records in the master database.'
  },
  'pc.help.tenants.field.code.label': { tr: 'Kod', en: 'Code' },
  'pc.help.tenants.field.code.desc': {
    tr: 'Tenant\'ın değişmez kimliği. Şirket kaydında verilen koddan türetilir, veritabanı adında ve tüm API çağrılarında kullanılır.',
    en: 'The tenant\'s immutable identifier. Derived from the code given at company registration; used in the database name and in every API call.'
  },
  'pc.help.tenants.field.name.label': { tr: 'Ad', en: 'Name' },
  'pc.help.tenants.field.name.desc': { tr: 'Şirketin görünen adı. Değiştirilebilir, kimlik değildir.', en: 'The company\'s display name. Editable; it is not the identity.' },
  'pc.help.tenants.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.tenants.field.status.desc': {
    tr: 'Kurulum/yaşam döngüsü durumu: Kuruluyor, Aktif, Askıya alındı, Arşivlendi veya Silinmeyi bekliyor.',
    en: 'Provisioning/lifecycle state: Provisioning, Active, Suspended, Archived or PendingPurge.'
  },
  'pc.help.tenants.field.health.label': { tr: 'Sağlık', en: 'Health' },
  'pc.help.tenants.field.health.desc': {
    tr: 'Tenant veritabanına yapılan son erişim kontrolünün sonucu; durum (Active/Suspended) ile karıştırılmamalıdır.',
    en: 'Result of the last reachability check against the tenant database; not to be confused with status (Active/Suspended).'
  },
  'pc.help.tenants.field.database.label': { tr: 'Veritabanı', en: 'Database' },
  'pc.help.tenants.field.database.desc': { tr: 'Tenant\'a ayrılmış fiziksel veritabanının adı.', en: 'Name of the physical database allocated to the tenant.' },
  'pc.help.tenants.field.version.label': { tr: 'Sürüm', en: 'Version' },
  'pc.help.tenants.field.version.desc': {
    tr: 'Tenant veritabanına uygulanmış son şema migrasyonunun numarası. Platformun en güncel sürümünün gerisindeyse Operasyon → Model Kayıt Defteri\'nde "Geride" görünür.',
    en: 'Number of the last schema migration applied to the tenant database. If it lags the platform\'s latest, it shows as "Behind" in Operations → Model Registry.'
  },
  'pc.help.tenants.field.created.label': { tr: 'Oluşturma', en: 'Created' },
  'pc.help.tenants.field.created.desc': { tr: 'Şirket kaydının açıldığı an (UTC saklanır, yerel saatinizde gösterilir).', en: 'When the company record was created (stored in UTC, displayed in your local time).' },

  // ══ TENANT DETAIL ═════════════════════════════════════════════════════════
  'pc.help.tenantDetail.title': { tr: 'Tenant Detayı', en: 'Tenant Detail' },
  'pc.help.tenantDetail.summary': {
    tr: 'Tek bir tenant\'ın kurulumu, geçmişi, lisansı, yedekleri, modelleri ve fiziksel tabloları. Buradaki yaşam döngüsü eylemleri müşterinin erişimini doğrudan etkiler ve tamamı audit\'lenir.',
    en: 'A single tenant\'s provisioning, history, licensing, backups, models and physical tables. The lifecycle actions here directly affect customer access and are all audited.'
  },
  'pc.help.tenantDetail.field.provisioned.label': { tr: 'Kurulum tamam', en: 'Provisioned' },
  'pc.help.tenantDetail.field.provisioned.desc': {
    tr: 'Kurulum hattının tüm adımları (veritabanı → şema → tohum veri → admin kullanıcı → aktifleştirme) başarıyla tamamlandı mı?',
    en: 'Did every step of the provisioning pipeline (database → schema → seed data → admin user → activation) complete successfully?'
  },
  'pc.help.tenantDetail.field.steps.label': { tr: 'Kurulum adımları', en: 'Provisioning steps' },
  'pc.help.tenantDetail.field.steps.desc': {
    tr: 'Her adımın durumu ve süresi. Bir adım patlarsa yalnız o kuruluma ait değişiklikler geri alınır (LIFO kompanzasyon) ve hata mesajı burada görünür.',
    en: 'Status and duration of each step. If a step fails, only that provisioning\'s changes are rolled back (LIFO compensation) and the error appears here.'
  },
  'pc.help.tenantDetail.field.timeline.label': { tr: 'Zaman çizelgesi', en: 'Timeline' },
  'pc.help.tenantDetail.field.timeline.desc': {
    tr: 'Durum geçişlerinin geçmişi: ne zaman, hangi durumdan hangisine ve hangi gerekçeyle.',
    en: 'History of status transitions: when, from which state to which, and with what reason.'
  },
  'pc.help.tenantDetail.field.licensing.label': { tr: 'Lisans', en: 'Licensing' },
  'pc.help.tenantDetail.field.licensing.desc': {
    tr: 'Tenant\'ın aktif planı ve hak (entitlement) anlık görüntüsü. "Erişim hakkı" yoksa abonelik ya hiç yok ya da Cancelled/Expired durumdadır.',
    en: 'The tenant\'s active plan and entitlement snapshot. If "Entitled" is false the subscription is either missing or Cancelled/Expired.'
  },
  'pc.help.tenantDetail.field.backups.label': { tr: 'Yedekler', en: 'Backups' },
  'pc.help.tenantDetail.field.backups.desc': {
    tr: 'Alınan yedekler ve doğrulama durumları. "Doğrula" yalnız tamamlanmış yedeklerde çalışır ve RESTORE VERIFYONLY koşar — yedeği geri yüklemez.',
    en: 'Backups taken and their verification state. "Verify" only works on completed backups and runs RESTORE VERIFYONLY — it does not restore the backup.'
  },
  'pc.help.tenantDetail.field.models.label': { tr: 'Modeller', en: 'Models' },
  'pc.help.tenantDetail.field.models.desc': {
    tr: 'Tenant\'ın yayınladığı dinamik modeller, ana model → alt model ağacı olarak. Girinti derinliği gösterir; "Yol" kolonu ata zincirini verir.',
    en: 'The tenant\'s published dynamic models as a root → sub-model tree. Indentation shows depth; the "Path" column gives the ancestor chain.'
  },
  'pc.help.tenantDetail.field.tables.label': { tr: 'Tablolar', en: 'Tables' },
  'pc.help.tenantDetail.field.tables.desc': {
    tr: 'Veritabanındaki fiziksel tablo envanteri, satır sayısı ve boyutuyla. Her tablo türüne göre sınıflandırılır: Yayınlanmış, Silinmiş model, Öksüz, Sistem.',
    en: 'Physical table inventory in the database with row counts and sizes. Each table is classified by kind: Published, Deleted model, Orphan, System.'
  },
  'pc.help.tenantDetail.rule.suspend.label': { tr: 'Askıya alma', en: 'Suspend' },
  'pc.help.tenantDetail.rule.suspend.desc': {
    tr: 'Tenant kullanıcıları en geç 5 saniye içinde erişimini kaybeder. Veri yerinde durur, kurulum bozulmaz. Geri almak için "Devam ettir".',
    en: 'Tenant users lose access within 5 seconds. Data stays in place and the installation is untouched. Use "Resume" to reverse it.'
  },
  'pc.help.tenantDetail.rule.archive.label': { tr: 'Arşivleme', en: 'Archive' },
  'pc.help.tenantDetail.rule.archive.desc': {
    tr: 'Giriş kalıcı olarak kapatılır ama veritabanı ve tüm veri yerinde kalır. Askıya almadan farkı, geçici değil kalıcı bir kapatma niyeti taşımasıdır.',
    en: 'Sign-in is closed permanently but the database and all data remain in place. Unlike suspension, this signals a permanent rather than temporary closure.'
  },
  'pc.help.tenantDetail.rule.purge.label': { tr: 'Kalıcı silme', en: 'Purge' },
  'pc.help.tenantDetail.rule.purge.desc': {
    tr: 'Bekleme penceresi başlatır; süre dolunca veritabanı geri dönüşsüz silinir. Onaylamak için tenant kodunu yazmanız gerekir. Süre dolmadan "Silmeyi iptal et" ile durdurulabilir.',
    en: 'Starts a waiting window; when it elapses the database is deleted irreversibly. You must type the tenant code to confirm. It can be stopped with "Cancel purge" before the window closes.'
  },
  'pc.help.tenantDetail.rule.orphanTable.label': { tr: 'Öksüz tablo', en: 'Orphan table' },
  'pc.help.tenantDetail.rule.orphanTable.desc': {
    tr: 'Diskte duran ama karşılığında model kaydı bulunmayan tablo. Genelde yarım kalmış bir yayınlama ya da elle yapılmış müdahalenin izidir; veri kaybı riski nedeniyle otomatik silinmez.',
    en: 'A table that exists on disk but has no corresponding model record. Usually the trace of an interrupted publish or a manual intervention; it is never dropped automatically because of the data-loss risk.'
  },
  'pc.help.tenantDetail.rule.subModelDepth.label': { tr: 'Alt model derinliği', en: 'Sub-model depth' },
  'pc.help.tenantDetail.rule.subModelDepth.desc': {
    tr: 'Modeller kök = 1 olacak şekilde numaralanır. Derinlik, alt-model FK zincirinin uzunluğudur; "ana model" etiketi derinlik 1\'i gösterir.',
    en: 'Models are numbered with root = 1. Depth is the length of the sub-model FK chain; the "root model" label marks depth 1.'
  },
  'pc.help.tenantDetail.notes': {
    tr: 'Askıya alma, arşivleme ve kalıcı silme müşteriyi doğrudan etkiler ve hepsi Critical seviyede audit kaydına düşer — kim, ne zaman, hangi gerekçeyle yaptığı kalıcı olarak saklanır.',
    en: 'Suspend, archive and purge directly affect the customer and all are written to the audit log at Critical severity — who did it, when, and with what reason is retained permanently.'
  },

  // ══ PLATFORM USERS ════════════════════════════════════════════════════════
  'pc.help.platformUsers.title': { tr: 'Platform Kullanıcıları', en: 'Platform Users' },
  'pc.help.platformUsers.summary': {
    tr: 'Konsolu kullanan platform personeli. Bunlar tenant (müşteri) kullanıcıları DEĞİLDİR — tamamen ayrı bir kimlik ve yetki sistemidir.',
    en: 'The platform staff who use this console. These are NOT tenant (customer) users — it is an entirely separate identity and permission system.'
  },
  'pc.help.platformUsers.field.email.label': { tr: 'E-posta', en: 'Email' },
  'pc.help.platformUsers.field.email.desc': { tr: 'Giriş kimliği; benzersizdir ve iki kullanıcıda aynı olamaz.', en: 'The sign-in identity; it is unique and cannot be shared by two users.' },
  'pc.help.platformUsers.field.roles.label': { tr: 'Roller', en: 'Roles' },
  'pc.help.platformUsers.field.roles.desc': {
    tr: 'Kullanıcıya atanmış platform rolleri. Yetki doğrudan verilmez; her rol bir yetenek kümesi taşır ve kullanıcının yetkisi rollerinin birleşimidir.',
    en: 'Platform roles assigned to the user. Permissions are never granted directly; each role carries a capability set and the user\'s access is the union of their roles.'
  },
  'pc.help.platformUsers.field.mfa.label': { tr: 'MFA', en: 'MFA' },
  'pc.help.platformUsers.field.mfa.desc': {
    tr: 'Kullanıcının authenticator (TOTP) kaydını tamamlayıp tamamlamadığı. "Kurulu değil" ilk girişini henüz yapmadığı anlamına gelir.',
    en: 'Whether the user has completed their authenticator (TOTP) enrollment. "Not enrolled" means they have not signed in for the first time yet.'
  },
  'pc.help.platformUsers.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.platformUsers.field.status.desc': { tr: 'Pasif kullanıcı giriş yapamaz ve açık oturumları anında sonlandırılmıştır.', en: 'An inactive user cannot sign in and their open sessions have been revoked.' },
  'pc.help.platformUsers.field.lastLogin.label': { tr: 'Son giriş', en: 'Last login' },
  'pc.help.platformUsers.field.lastLogin.desc': { tr: 'Son başarılı girişin zamanı. "Hiç" ise hesap oluşturulmuş ama kullanılmamıştır.', en: 'Time of the last successful sign-in. "Never" means the account was created but never used.' },
  'pc.help.platformUsers.rule.roleModel.label': { tr: 'Rol → yetenek', en: 'Role → capability' },
  'pc.help.platformUsers.rule.roleModel.desc': {
    tr: 'Rol adları veritabanında, rolün hangi yetenekleri verdiği ise sunucu kodunda tanımlıdır. Kullanıcı formunda rol seçtikçe görünen yetenek listesi bu matristen okunur; matrisin kendisi konsoldan değiştirilemez.',
    en: 'Role names live in the database; which capabilities a role grants is defined in server code. The capability list shown as you pick roles is read from that matrix; the matrix itself cannot be edited from the console.'
  },
  'pc.help.platformUsers.rule.mfaLazyEnroll.label': { tr: 'MFA kurulumu', en: 'MFA enrollment' },
  'pc.help.platformUsers.rule.mfaLazyEnroll.desc': {
    tr: 'Kullanıcı oluştururken TOTP adımı yoktur. Kullanıcı ilk girişinde kendi sırrını üretir ve authenticator uygulamasına kaydeder. Authenticator kaybolursa "MFA sıfırla" ile bu akış yeniden başlatılır.',
    en: 'There is no TOTP step when creating a user. The user generates their own secret at first sign-in and registers it in their authenticator app. If the authenticator is lost, "Reset MFA" restarts that flow.'
  },
  'pc.help.platformUsers.rule.lockout.label': { tr: 'Kilitlenme koruması', en: 'Lockout protection' },
  'pc.help.platformUsers.rule.lockout.desc': {
    tr: 'Kendi hesabınızı pasifleştiremez ve kendi PlatformOwner rolünüzü kaldıramazsınız; ayrıca platformun son PlatformOwner\'ı yetkisiz ya da pasif bırakılamaz. Bu kurallar sunucuda uygulanır.',
    en: 'You cannot deactivate your own account or remove your own PlatformOwner role, and the platform\'s last PlatformOwner cannot be stripped of the role or deactivated. These rules are enforced server-side.'
  },
  'pc.help.platformUsers.rule.deactivateVsDelete.label': { tr: 'Pasifleştirme', en: 'Deactivation' },
  'pc.help.platformUsers.rule.deactivateVsDelete.desc': {
    tr: 'Platform kullanıcıları silinmez, pasifleştirilir. Sebebi denetim izidir: kullanıcının geçmişte yaptığı işlemler audit kayıtlarında aktör olarak durur ve kimliğin çözülebilir kalması gerekir.',
    en: 'Platform users are deactivated, never deleted. The reason is the audit trail: their past actions remain in the audit log as the actor, and that identity must stay resolvable.'
  },
  'pc.help.platformUsers.notes': {
    tr: 'Rol ve durum değişiklikleri kullanıcının MEVCUT oturumunu etkilemez; yetkiler token\'a yazıldığı için ancak yeni girişte geçerli olur. Anında etki gerekiyorsa kullanıcıyı pasifleştirin (oturumları da iptal edilir).',
    en: 'Role and status changes do not affect the user\'s CURRENT session; capabilities are baked into the token and only apply at next sign-in. If you need immediate effect, deactivate the user (their sessions are revoked too).'
  },

  // ══ IMPERSONATION ═════════════════════════════════════════════════════════
  'pc.help.impersonation.title': { tr: 'Destek Erişimi (Impersonation)', en: 'Support Access (Impersonation)' },
  'pc.help.impersonation.summary': {
    tr: 'Bir destek mühendisinin, müşteri kullanıcısı kimliğiyle tenant uygulamasına geçici olarak girmesini sağlayan talep/onay akışı. Her adım audit\'lenir ve erişim süreye bağlıdır.',
    en: 'A request/approval workflow that lets a support engineer temporarily enter the tenant application as a customer user. Every step is audited and access is time-bound.'
  },
  'pc.help.impersonation.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.impersonation.field.tenant.desc': { tr: 'Erişilecek müşteri kurulumunun kodu.', en: 'Code of the customer installation to be accessed.' },
  'pc.help.impersonation.field.target.label': { tr: 'Hedef kullanıcı', en: 'Target user' },
  'pc.help.impersonation.field.target.desc': { tr: 'Kimliğine girilecek tenant kullanıcısının kimliği. Erişim yalnız o kullanıcının yetkileriyle sınırlıdır.', en: 'The tenant user whose identity will be assumed. Access is limited to exactly that user\'s permissions.' },
  'pc.help.impersonation.field.reason.label': { tr: 'Gerekçe', en: 'Reason' },
  'pc.help.impersonation.field.reason.desc': { tr: 'Zorunludur ve audit kaydına yazılır — sonradan "neden girildi?" sorusunun cevabıdır.', en: 'Mandatory and written into the audit record — it is the answer to "why was this access needed?" later on.' },
  'pc.help.impersonation.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.impersonation.field.status.desc': { tr: 'Talebin akıştaki yeri: Talep edildi → Onaylandı → Kullanımda → Süresi doldu; ya da Reddedildi/Geri çekildi ile sonlanır.', en: 'Where the request sits in the flow: Requested → Approved → ActiveUse → Expired; or it ends in Denied/Revoked.' },
  'pc.help.impersonation.field.expires.label': { tr: 'Bitiş', en: 'Expires' },
  'pc.help.impersonation.field.expires.desc': { tr: 'Erişim penceresinin kapanacağı an. Süre dolduğunda token otomatik geçersizleşir.', en: 'When the access window closes. The token becomes invalid automatically at that point.' },
  'pc.help.impersonation.field.token.label': { tr: 'Basılan token', en: 'Issued token' },
  'pc.help.impersonation.field.token.desc': { tr: 'Yalnız basıldığı anda gösterilir. Tenant uygulamasına bu token ile girilir.', en: 'Shown only at the moment it is minted. It is used to enter the tenant application.' },
  'pc.help.impersonation.rule.separationOfDuties.label': { tr: 'Görev ayrılığı', en: 'Separation of duties' },
  'pc.help.impersonation.rule.separationOfDuties.desc': {
    tr: 'Talep eden kendi talebini onaylayamaz. Talep etme (Impersonation.Request) ve onaylama (Impersonation.Approve) ayrı yeteneklerdir ve genelde farklı rollere verilir.',
    en: 'A requester cannot approve their own request. Requesting (Impersonation.Request) and approving (Impersonation.Approve) are separate capabilities, usually held by different roles.'
  },
  'pc.help.impersonation.rule.maxHours.label': { tr: 'Süre sınırı', en: 'Time limit' },
  'pc.help.impersonation.rule.maxHours.desc': { tr: 'Erişim penceresi en fazla 4 saat olabilir. Daha uzun bir ihtiyaç için yeni talep açılır.', en: 'The access window can be at most 4 hours. Longer needs require a new request.' },
  'pc.help.impersonation.rule.tokenMinting.label': { tr: 'Token basımı', en: 'Token minting' },
  'pc.help.impersonation.rule.tokenMinting.desc': { tr: 'Yalnız Approved durumdaki talepte ve yalnız talebi açan kişi token basabilir.', en: 'Only a request in Approved state can mint a token, and only the person who opened the request may do so.' },
  'pc.help.impersonation.rule.revoke.label': { tr: 'İptal', en: 'Revoke' },
  'pc.help.impersonation.rule.revoke.desc': { tr: 'Approved veya ActiveUse durumdaki erişim süresi dolmadan iptal edilebilir; token anında geçersizleşir.', en: 'Access in Approved or ActiveUse state can be revoked before it expires; the token becomes invalid immediately.' },
  'pc.help.impersonation.notes': {
    tr: 'Impersonation ile yapılan her işlem tenant tarafındaki denetim kayıtlarında gerçek personel kimliğiyle birlikte görünür — müşteri kim olarak giriş yapıldığını sonradan görebilir.',
    en: 'Every action taken through impersonation appears in the tenant-side audit records together with the real staff identity — the customer can see afterwards who signed in as them.'
  },

  // ══ AUDIT LOGS ════════════════════════════════════════════════════════════
  'pc.help.auditLogs.title': { tr: 'Denetim Kayıtları', en: 'Audit Logs' },
  'pc.help.auditLogs.summary': {
    tr: 'Platformda yapılan her yazma işleminin kalıcı izi: kim, ne zaman, neyi, hangi sonuçla. Kayıtlar değiştirilemez; yalnız okunur ve CSV olarak dışa aktarılabilir.',
    en: 'A permanent trace of every write action on the platform: who, when, what, and with what outcome. Records are immutable; they can only be read and exported as CSV.'
  },
  'pc.help.auditLogs.field.occurredAt.label': { tr: 'Zaman', en: 'Time' },
  'pc.help.auditLogs.field.occurredAt.desc': { tr: 'İşlemin gerçekleştiği an (UTC saklanır, yerel saatinizde gösterilir).', en: 'When the action occurred (stored in UTC, displayed in your local time).' },
  'pc.help.auditLogs.field.actor.label': { tr: 'Aktör', en: 'Actor' },
  'pc.help.auditLogs.field.actor.desc': { tr: 'İşlemi yapan kimlik: bir platform kullanıcısı ya da sistemin kendisi (zamanlanmış iş, arka plan hattı).', en: 'The identity that performed the action: a platform user, or the system itself (scheduled job, background pipeline).' },
  'pc.help.auditLogs.field.action.label': { tr: 'Aksiyon', en: 'Action' },
  'pc.help.auditLogs.field.action.desc': { tr: 'Nokta ile ayrılmış işlem adı, ör. `plan.create`, `iam.role.grant`, `tenant.suspend`.', en: 'Dot-separated action name, e.g. `plan.create`, `iam.role.grant`, `tenant.suspend`.' },
  'pc.help.auditLogs.field.category.label': { tr: 'Kategori', en: 'Category' },
  'pc.help.auditLogs.field.category.desc': { tr: 'İşlemin alanı: Identity, Iam, TenantLifecycle, Configuration, Commercial, Security, Operations, Support, Data.', en: 'The domain of the action: Identity, Iam, TenantLifecycle, Configuration, Commercial, Security, Operations, Support, Data.' },
  'pc.help.auditLogs.field.result.label': { tr: 'Sonuç', en: 'Result' },
  'pc.help.auditLogs.field.result.desc': { tr: 'Success, Denied (yetki reddi) veya Failed (hata). Başarısız denemeler de kaydedilir — asıl değerli olan çoğu zaman onlardır.', en: 'Success, Denied (permission refused) or Failed (error). Failed attempts are recorded too — often they are the valuable ones.' },
  'pc.help.auditLogs.field.severity.label': { tr: 'Önem', en: 'Severity' },
  'pc.help.auditLogs.field.severity.desc': { tr: 'Info, Notice veya Critical. Kimlik/yetki işlemleri ve geri dönüşsüz eylemler Critical\'dır.', en: 'Info, Notice or Critical. Identity/permission actions and irreversible operations are Critical.' },
  'pc.help.auditLogs.field.correlation.label': { tr: 'Correlation', en: 'Correlation' },
  'pc.help.auditLogs.field.correlation.desc': { tr: 'Tek bir iş akışına ait tüm kayıtları birbirine bağlayan kimlik. Üzerine tıklayınca o akışın tamamı zincir olarak listelenir.', en: 'The id that ties together every record belonging to one workflow. Clicking it lists that entire flow as a chain.' },
  'pc.help.auditLogs.rule.correlationChain.label': { tr: 'Zincir görünümü', en: 'Chain view' },
  'pc.help.auditLogs.rule.correlationChain.desc': {
    tr: 'Bir istek birden çok yazma işlemi tetikleyebilir (ör. tenant kurulumu: şirket → veritabanı → şema → kullanıcı). Zincir görünümü bunları tek akış olarak gösterir.',
    en: 'One request can trigger several writes (e.g. tenant provisioning: company → database → schema → user). The chain view shows them as a single flow.'
  },
  'pc.help.auditLogs.rule.severityLevels.label': { tr: 'Önem seçimi', en: 'Choosing severity' },
  'pc.help.auditLogs.rule.severityLevels.desc': { tr: 'Önem, işlemin geri alınabilirliğine göre verilir: geri dönüşsüz veya yetki değiştiren her şey Critical\'dır.', en: 'Severity is assigned by reversibility: anything irreversible or permission-changing is Critical.' },
  'pc.help.auditLogs.rule.retention.label': { tr: 'Saklama', en: 'Retention' },
  'pc.help.auditLogs.rule.retention.desc': { tr: 'Denetim kayıtları silinmez ve düzenlenemez. Liste varsayılan olarak son N kaydı gösterir; sayıyı filtreden artırabilirsiniz.', en: 'Audit records are never deleted or edited. The list shows the most recent N records by default; you can raise the count from the filter.' },
  'pc.help.auditLogs.notes': {
    tr: 'CSV dışa aktarma yalnız EKRANDA GÖRÜNEN kayıtları indirir — tüm geçmişi değil. Daha geniş bir aralık için önce satır limitini yükseltin.',
    en: 'CSV export downloads only the records CURRENTLY SHOWN — not the entire history. Raise the row limit first if you need a wider range.'
  },

  // ══ SECURITY CENTER ═══════════════════════════════════════════════════════
  'pc.help.securityCenter.title': { tr: 'Güvenlik Merkezi', en: 'Security Center' },
  'pc.help.securityCenter.summary': {
    tr: 'Tehdit olayları, giriş denemeleri ve IP erişim kuralları. Olaylar otomatik tespit edilir; buradaki iş, onları değerlendirip kapatmaktır.',
    en: 'Threat events, login attempts and IP access rules. Events are detected automatically; the work here is triaging and closing them.'
  },
  'pc.help.securityCenter.field.threatEvents.label': { tr: 'Tehdit olayları', en: 'Threat events' },
  'pc.help.securityCenter.field.threatEvents.desc': { tr: 'Şüpheli davranış tespitleri (ör. arka arkaya başarısız giriş, alışılmadık IP). Özne, olayın hangi kaynağa ait olduğunu `tip:kimlik` biçiminde verir.', en: 'Detections of suspicious behaviour (e.g. repeated failed sign-ins, unusual IP). The subject identifies the resource involved as `type:id`.' },
  'pc.help.securityCenter.field.loginAttempts.label': { tr: 'Giriş denemeleri', en: 'Login attempts' },
  'pc.help.securityCenter.field.loginAttempts.desc': { tr: 'Başarılı ve başarısız tüm giriş denemeleri, e-posta ve IP ile filtrelenebilir. Başarısız olanlarda gerekçe kolonu nedeni verir.', en: 'All sign-in attempts, successful and failed, filterable by email and IP. For failures the reason column gives the cause.' },
  'pc.help.securityCenter.field.ipRules.label': { tr: 'IP kuralları', en: 'IP rules' },
  'pc.help.securityCenter.field.ipRules.desc': { tr: 'Tek IP veya CIDR bloğu için izin/engel kuralları. Gerekçe zorunludur ve kural audit\'e düşer.', en: 'Allow/deny rules for a single IP or a CIDR block. A reason is required and the rule is audited.' },
  'pc.help.securityCenter.rule.eventTriage.label': { tr: 'Olay değerlendirme', en: 'Event triage' },
  'pc.help.securityCenter.rule.eventTriage.desc': {
    tr: 'Eylemler yalnız Open durumdaki olaylarda görünür. "İncelendi" zararsız bulunduğunu, "Yok say" gürültü olduğunu, "Yükselt" ise ele alınması gerektiğini belirtir.',
    en: 'Actions appear only on events in Open state. "Reviewed" means examined and benign, "Dismiss" means noise, "Escalate" means it needs handling.'
  },
  'pc.help.securityCenter.rule.ipRuleOrder.label': { tr: 'Kural önceliği', en: 'Rule precedence' },
  'pc.help.securityCenter.rule.ipRuleOrder.desc': { tr: 'Engel (Deny) kuralları izin (Allow) kurallarına göre önceliklidir; bir IP her ikisine de uyuyorsa engellenir.', en: 'Deny rules take precedence over Allow rules; if an IP matches both, it is blocked.' },

  // ══ COMPLIANCE ════════════════════════════════════════════════════════════
  'pc.help.compliance.title': { tr: 'Uyumluluk ve Veri Talepleri', en: 'Compliance and Data Requests' },
  'pc.help.compliance.summary': {
    tr: 'KVKK/GDPR kapsamındaki veri sahibi taleplerinin takibi. Her talep bir durum makinesinde ilerler ve tamamlanana kadar açık kalır.',
    en: 'Tracking of data-subject requests under GDPR/KVKK. Each request advances through a state machine and stays open until completed.'
  },
  'pc.help.compliance.field.type.label': { tr: 'Tip', en: 'Type' },
  'pc.help.compliance.field.type.desc': { tr: 'DSAR (veriye erişim talebi), Erasure (silme talebi) veya Offboarding (müşteri ayrılışı).', en: 'DSAR (data access request), Erasure (deletion request) or Offboarding (customer departure).' },
  'pc.help.compliance.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.compliance.field.tenant.desc': { tr: 'Talebin ilgili olduğu müşteri kurulumu.', en: 'The customer installation the request relates to.' },
  'pc.help.compliance.field.subject.label': { tr: 'Veri sahibi', en: 'Data subject' },
  'pc.help.compliance.field.subject.desc': { tr: 'Talebi yapan gerçek kişinin tanımlayıcısı (genelde e-posta).', en: 'Identifier of the individual making the request (usually an email address).' },
  'pc.help.compliance.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.compliance.field.status.desc': { tr: 'Açık → İşlemde → Tamamlandı; ya da gerekçeyle Reddedildi.', en: 'Open → InProgress → Completed; or Rejected with a reason.' },
  'pc.help.compliance.field.requested.label': { tr: 'Talep tarihi', en: 'Requested' },
  'pc.help.compliance.field.requested.desc': { tr: 'Talebin açıldığı an — yasal yanıt süresi bu tarihten işlemeye başlar.', en: 'When the request was opened — the statutory response clock starts here.' },
  'pc.help.compliance.rule.dsar.label': { tr: 'DSAR', en: 'DSAR' },
  'pc.help.compliance.rule.dsar.desc': { tr: 'Veri sahibinin kendisiyle ilgili saklanan verinin bir kopyasını istemesi. Sonuç, veriyi dışa aktarıp sahibine iletmektir.', en: 'The data subject asks for a copy of the data held about them. The outcome is exporting that data and delivering it to them.' },
  'pc.help.compliance.rule.erasure.label': { tr: 'Silme talebi', en: 'Erasure' },
  'pc.help.compliance.rule.erasure.desc': { tr: 'Veri sahibinin verisinin silinmesini istemesi. Yasal saklama yükümlülüğü olan kayıtlar (ör. fatura, denetim izi) kapsam dışıdır.', en: 'The data subject asks for their data to be deleted. Records under a legal retention obligation (e.g. invoices, audit trail) are out of scope.' },
  'pc.help.compliance.rule.offboarding.label': { tr: 'Müşteri ayrılışı', en: 'Offboarding' },
  'pc.help.compliance.rule.offboarding.desc': { tr: 'Bir müşterinin platformdan tamamen ayrılması. Genelde veri dışa aktarımı + tenant arşivleme/silme ile birlikte yürür.', en: 'A customer leaving the platform entirely. Usually runs together with a data export plus tenant archival/purge.' },
  'pc.help.compliance.rule.legalClock.label': { tr: 'Yanıt süresi', en: 'Response clock' },
  'pc.help.compliance.rule.legalClock.desc': { tr: 'Talep tarihinden itibaren işleyen yasal bir yanıt süresi vardır; talebin açık kalması bu süreyi durdurmaz.', en: 'A statutory response deadline runs from the request date; leaving the request open does not pause it.' },
  'pc.help.compliance.notes': {
    tr: 'Reddedilen talepler de kayıtta kalır — gerekçesiyle birlikte. "Neden reddedildi?" sorusuna verilebilecek tek kanıt budur.',
    en: 'Rejected requests remain on record too, along with their reason. That record is the only evidence available if you are later asked why it was rejected.'
  },

  // ══ JOBS ══════════════════════════════════════════════════════════════════
  'pc.help.jobs.title': { tr: 'İş Kuyruğu', en: 'Job Queue' },
  'pc.help.jobs.summary': {
    tr: 'Arka planda çalışan dayanıklı işler: yedekleme, migrasyon, e-posta gönderimi, webhook teslimi. Kuyruk kalıcıdır — sunucu yeniden başlasa da işler kaybolmaz.',
    en: 'Durable background jobs: backups, migrations, email delivery, webhook dispatch. The queue is persistent — jobs survive a server restart.'
  },
  'pc.help.jobs.field.type.label': { tr: 'Tip', en: 'Type' },
  'pc.help.jobs.field.type.desc': { tr: 'İşin ne yaptığı. Her tip kendi işleyicisine sahiptir.', en: 'What the job does. Each type has its own handler.' },
  'pc.help.jobs.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.jobs.field.status.desc': { tr: 'Beklemede, Çalışıyor, Başarılı, Başarısız, Askıya alındı veya İptal edildi. Hata alan iş deneme hakkı kaldıkça tekrar "Beklemede"ye döner; hakkı biterse "Askıya alındı" olur.', en: 'Pending, Running, Succeeded, Failed, Parked or Cancelled. A job that errors goes back to "Pending" while attempts remain; once they run out it becomes "Parked".' },
  'pc.help.jobs.field.attempts.label': { tr: 'Deneme', en: 'Attempts' },
  'pc.help.jobs.field.attempts.desc': { tr: '`yapılan / izin verilen` biçiminde. Üst sınıra ulaşan iş bir daha denenmez.', en: 'Shown as `made / allowed`. A job that reaches the limit is not retried again.' },
  'pc.help.jobs.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.jobs.field.tenant.desc': { tr: 'İş bir tenant\'a aitse kodu; platform geneli işlerde boştur.', en: 'The tenant code if the job belongs to one; empty for platform-wide jobs.' },
  'pc.help.jobs.field.created.label': { tr: 'Oluşturma', en: 'Created' },
  'pc.help.jobs.field.created.desc': { tr: 'İşin kuyruğa alındığı an.', en: 'When the job was enqueued.' },
  'pc.help.jobs.field.error.label': { tr: 'Hata', en: 'Error' },
  'pc.help.jobs.field.error.desc': { tr: 'Son başarısız denemenin hata mesajı.', en: 'Error message from the most recent failed attempt.' },
  'pc.help.jobs.rule.retryBackoff.label': { tr: 'Yeniden deneme', en: 'Retry' },
  'pc.help.jobs.rule.retryBackoff.desc': { tr: 'Başarısız işler artan bekleme süreleriyle yeniden denenir; anlık bir arıza kendiliğinden toparlanır.', en: 'Failed jobs are retried with increasing delays, so a transient failure recovers on its own.' },
  'pc.help.jobs.rule.poison.label': { tr: 'Askıya alınmış iş', en: 'Parked job' },
  'pc.help.jobs.rule.poison.desc': { tr: 'Deneme hakkı tükenen iş "Askıya alındı" durumuna geçer: kuyrukta kalır ama bir daha kendiliğinden denenmez. Nedeni Hata kolonunda yazar. Satırdaki "Yeniden dene" işi deneme hakkı sıfırlanmış olarak kuyruğa geri koyar; "Askıya alındı" filtresindeyken "Tümünü yeniden dene" hepsini birden alır. Hatanın nedeni giderilmediyse iş denemeler bitince yine askıya alınır. Askıya alınmış iş kaldıkça Uyarılar\'daki "Askıya alınmış iş var" uyarısı çözümlense bile soğuma süresi (30 dk) dolunca yeniden açılır.', en: 'A job that runs out of attempts becomes "Parked": it stays in the queue but is never retried automatically. The Error column says why. "Retry" on the row puts the job back in the queue with its attempts reset; with the "Parked" filter on, "Retry all" takes them all at once. If the cause of the error has not been fixed the job is parked again once attempts run out. While parked jobs remain, the "Parked job exists" alert reopens after its 30-minute cooldown even if resolved.' },

  // ══ HEALTH ════════════════════════════════════════════════════════════════
  'pc.help.health.title': { tr: 'Sağlık Merkezi', en: 'Health Center' },
  'pc.help.health.summary': {
    tr: 'Platformun bağımlı olduğu bileşenlerin canlılık kontrolleri: veritabanları, disk, şirket veritabanları ve canary test şirketi. Kontroller arka planda düzenli aralıklarla koşar; "Yenile" son sonucu okur.',
    en: 'Liveness checks for the components the platform depends on: databases, disk, tenant databases and the canary test company. Checks run in the background at regular intervals; "Refresh" reads the latest result.'
  },
  'pc.help.health.field.component.label': { tr: 'Bileşen', en: 'Component' },
  'pc.help.health.field.component.desc': { tr: 'Kontrol edilen alt sistemin adı.', en: 'Name of the subsystem being checked.' },
  'pc.help.health.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.health.field.status.desc': { tr: 'Sağlıklı, Yavaş / kısmi (çalışıyor ama yavaş ya da eksik), Erişilemiyor, Bilinmiyor (sonuç alınamadı) veya Yapılandırılmamış (kontrol edilecek bir şey yok).', en: 'Healthy, Degraded (working but slow or partial), Unhealthy (unreachable), Unknown (no result) or Not configured (nothing to check).' },
  'pc.help.health.field.latency.label': { tr: 'Gecikme', en: 'Latency' },
  'pc.help.health.field.latency.desc': { tr: 'Kontrolün tamamlanma süresi (ms). Ani artış, kesinti öncesi ilk sinyaldir.', en: 'How long the check took (ms). A sudden rise is usually the first signal before an outage.' },
  'pc.help.health.field.detail.label': { tr: 'Ayrıntı', en: 'Detail' },
  'pc.help.health.field.detail.desc': { tr: 'Bileşenin döndürdüğü açıklama; Unhealthy durumda hata nedeni burada yazar.', en: 'The description returned by the component; when Unhealthy, the failure cause appears here.' },
  'pc.help.health.field.checkedAt.label': { tr: 'Kontrol zamanı', en: 'Checked at' },
  'pc.help.health.field.checkedAt.desc': { tr: 'Bu sonucun üretildiği an. Eski bir zaman, kontrolün koşmadığını gösterir.', en: 'When this result was produced. An old timestamp means the check is not running.' },
  'pc.help.health.rule.overall.label': { tr: 'Genel durum', en: 'Overall status' },
  'pc.help.health.rule.overall.desc': { tr: 'Bileşenlerin en kötüsüdür: biri erişilemiyorsa genel durum da öyledir. "Yapılandırılmamış" bileşenler hesaba katılmaz.', en: 'The worst of the components: if one is unhealthy, so is the overall status. "Not configured" components are left out.' },
  'pc.help.health.rule.canary.label': { tr: 'Canary nedir?', en: 'What is canary?' },
  'pc.help.health.rule.canary.desc': { tr: 'Bir modül değil, bir kontroldür. Platform kendini denetlemek için gerçek müşteri olmayan bir test şirketi (kod: canary) tutar; sorunlar müşteriden önce onda görülür. Migrasyonlar da önce bu şirkete uygulanır. Böyle bir şirket kurulmamışsa satır "Yapılandırılmamış" görünür.', en: 'Not a module but a check. The platform keeps a test company that is not a real customer (code: canary) to monitor itself, so problems show up there before customers see them. Migrations are applied to it first, too. If no such company exists the row shows "Not configured".' },

  // ══ ALERTS ════════════════════════════════════════════════════════════════
  'pc.help.alerts.title': { tr: 'Uyarı Merkezi', en: 'Alert Center' },
  'pc.help.alerts.summary': {
    tr: 'Kurallar metrikleri belirli aralıklarla değerlendirir; eşik aşılınca uyarı üretilir. Uyarılar kendiliğinden kapanmaz — üstlenilir ve çözümlenir.',
    en: 'Rules evaluate metrics at intervals; when a threshold is crossed an alert fires. Alerts do not close themselves — they are acknowledged and resolved.'
  },
  'pc.help.alerts.field.severity.label': { tr: 'Önem', en: 'Severity' },
  'pc.help.alerts.field.severity.desc': { tr: 'Kural tanımında belirlenir; hangi uyarının önce ele alınacağını söyler.', en: 'Set in the rule definition; it tells you which alert to handle first.' },
  'pc.help.alerts.field.rule.label': { tr: 'Kural', en: 'Rule' },
  'pc.help.alerts.field.rule.desc': { tr: 'Uyarıyı üreten kuralın adı. Kural sekmesinden metriği, koşulu ve penceresi görülebilir.', en: 'Name of the rule that produced the alert. The Rules tab shows its metric, condition and window.' },
  'pc.help.alerts.field.valueThreshold.label': { tr: 'Değer / eşik', en: 'Value / threshold' },
  'pc.help.alerts.field.valueThreshold.desc': { tr: 'Uyarı tetiklendiği andaki ölçüm ve onu aşan eşik. Aradaki fark sorunun büyüklüğünü verir.', en: 'The measurement at the moment the alert fired and the threshold it crossed. The gap indicates the size of the problem.' },
  'pc.help.alerts.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.alerts.field.status.desc': { tr: 'Tetiklendi (yeni), Üstlenildi (biri ilgileniyor) veya Çözümlendi (kapandı).', en: 'Firing (new), Acknowledged (someone is on it) or Resolved (closed).' },
  'pc.help.alerts.field.firedAt.label': { tr: 'Tetiklenme', en: 'Fired at' },
  'pc.help.alerts.field.firedAt.desc': { tr: 'Uyarının üretildiği an.', en: 'When the alert was produced.' },
  'pc.help.alerts.field.context.label': { tr: 'Bağlam paneli', en: 'Context panel' },
  'pc.help.alerts.field.context.desc': { tr: 'Satırı açınca görünen ayrıntı: pencere aralığı, toplam/hatalı istek, uç bazında hata oranı ve p95, durum kodları ve örnek correlation kimlikleri.', en: 'The detail revealed by expanding a row: window range, total/failed requests, per-endpoint error rate and p95, status codes and sample correlation ids.' },
  'pc.help.alerts.field.runbook.label': { tr: 'Runbook', en: 'Runbook' },
  'pc.help.alerts.field.runbook.desc': { tr: 'Kurala bağlanmış müdahale talimatının bağlantısı; tanımlıysa kural satırında görünür.', en: 'Link to the remediation instructions attached to the rule; shown on the rule row when defined.' },
  'pc.help.alerts.rule.window.label': { tr: 'Pencere', en: 'Window' },
  'pc.help.alerts.rule.window.desc': { tr: 'Kuralın kaç dakikalık veriye baktığı. Kısa pencere hızlı tepki verir ama gürültülüdür; uzun pencere daha kararlıdır ama geç uyarır.', en: 'How many minutes of data the rule looks at. A short window reacts fast but is noisy; a long window is steadier but warns later.' },
  'pc.help.alerts.rule.condition.label': { tr: 'Koşul', en: 'Condition' },
  'pc.help.alerts.rule.condition.desc': { tr: 'Metriğin eşikle nasıl karşılaştırıldığı (büyüktür/küçüktür). Koşul ve eşik birlikte kuralın tanımını oluşturur.', en: 'How the metric is compared to the threshold (greater/less than). Condition and threshold together define the rule.' },
  'pc.help.alerts.rule.ackVsResolve.label': { tr: 'Üstlen ≠ Çözümle', en: 'Acknowledge ≠ Resolve' },
  'pc.help.alerts.rule.ackVsResolve.desc': { tr: '"Üstlen" yalnız Tetiklendi durumunda kullanılabilir ve "bu benim üzerimde" demektir; sorunu kapatmaz. "Çözümle" uyarıyı kapatır.', en: '"Acknowledge" is only available while Firing and means "I am on this"; it does not close the problem. "Resolve" closes the alert.' },
  'pc.help.alerts.rule.apiOnlyContext.label': { tr: 'Bağlam sınırı', en: 'Context limits' },
  'pc.help.alerts.rule.apiOnlyContext.desc': { tr: 'Ayrıntılı bağlam paneli yalnız `api.*` metriklerine dayanan uyarılarda üretilir; diğer kurallarda bu bölüm boş kalır.', en: 'The detailed context panel is produced only for alerts based on `api.*` metrics; for other rules the section stays empty.' },
  'pc.help.alerts.rule.prunedTraces.label': { tr: 'Budanmış izler', en: 'Pruned traces' },
  'pc.help.alerts.rule.prunedTraces.desc': { tr: 'Ham istek izleri belirli bir süre sonra silinir. Eski bir uyarının bağlamı bu yüzden boş görünebilir — uyarı geçerlidir, yalnız ayrıntısı artık yoktur.', en: 'Raw request traces are pruned after a retention period. An old alert\'s context can therefore look empty — the alert is still valid, only its detail is gone.' },
  'pc.help.alerts.rule.parkedJobs.label': { tr: '"Askıya alınmış iş var"', en: '"Parked job exists"' },
  'pc.help.alerts.rule.parkedJobs.desc': { tr: 'Bir arka plan işi (yedekleme, e-posta, bildirim…) tüm denemelerinde hata aldı ve askıya alındı demektir. Uyarı satırındaki bağlantı İşler ekranını bu işlerle açar; Hata kolonu nedeni söyler, "Yeniden dene" işi tekrar kuyruğa alır. Askıya alınmış iş kaldıkça uyarı çözümlense de 30 dk sonra yeniden açılır.', en: 'A background job (backup, email, notification…) failed on every attempt and was parked. The link on the alert row opens the Jobs screen filtered to these jobs; the Error column says why and "Retry" re-queues the job. While parked jobs remain, the alert reopens 30 minutes after being resolved.' },
  'pc.help.alerts.notes': {
    tr: 'Durum filtresindeki "Açık", Tetiklendi ve Üstlenildi uyarıları birlikte gösteren sentetik bir seçenektir; veritabanında böyle bir durum yoktur.',
    en: '"Open" in the status filter is a synthetic option showing Firing and Acknowledged alerts together; no such state exists in the database.'
  },

  // ══ NOTIFICATIONS ═════════════════════════════════════════════════════════
  'pc.help.notifications.title': { tr: 'Bildirim Merkezi', en: 'Notification Center' },
  'pc.help.notifications.summary': {
    tr: 'Uyarı ve olayların kime, hangi kanaldan iletileceğini belirleyen kurallar ile konsol içi gelen kutusu.',
    en: 'The in-console inbox plus the rules that decide who gets notified about which alerts and events, and through which channel.'
  },
  'pc.help.notifications.field.inbox.label': { tr: 'Gelen kutusu', en: 'Inbox' },
  'pc.help.notifications.field.inbox.desc': { tr: 'Size ulaşan konsol içi (InApp) bildirimler. Okundu işaretlemek yalnız sizin görünümünüzü etkiler.', en: 'In-console (InApp) notifications delivered to you. Marking as read affects only your own view.' },
  'pc.help.notifications.field.ruleName.label': { tr: 'Kural adı', en: 'Rule name' },
  'pc.help.notifications.field.ruleName.desc': { tr: 'Kuralı tanımlayan serbest ad; yalnız insan okuması içindir.', en: 'A free-form name identifying the rule; for human reading only.' },
  'pc.help.notifications.field.trigger.label': { tr: 'Tetikleyici', en: 'Trigger' },
  'pc.help.notifications.field.trigger.desc': { tr: 'Kuralı çalıştıran olay türü (ör. Alert).', en: 'The kind of event that runs the rule (e.g. Alert).' },
  'pc.help.notifications.field.channel.label': { tr: 'Kanal', en: 'Channel' },
  'pc.help.notifications.field.channel.desc': { tr: 'InApp (konsol içi) veya Email. E-posta gönderimi kuyruğa alınır; SMTP yapılandırılmamışsa sessizce atlanır.', en: 'InApp (in-console) or Email. Email delivery is queued; if SMTP is not configured it is silently skipped.' },
  'pc.help.notifications.field.filter.label': { tr: 'Filtre', en: 'Filter' },
  'pc.help.notifications.field.filter.desc': { tr: 'Hangi önem seviyelerinin bildirileceği, JSON dizi olarak, ör. `["Critical","Warning"]`.', en: 'Which severities to notify about, as a JSON array, e.g. `["Critical","Warning"]`.' },
  'pc.help.notifications.field.targets.label': { tr: 'Hedefler', en: 'Targets' },
  'pc.help.notifications.field.targets.desc': { tr: 'E-posta kanalında alıcı adresleri (JSON dizi). InApp kanalında boş bırakılır.', en: 'Recipient addresses for the email channel (JSON array). Left empty for the InApp channel.' },
  'pc.help.notifications.rule.triggerFilter.label': { tr: 'Filtre yazımı', en: 'Writing the filter' },
  'pc.help.notifications.rule.triggerFilter.desc': { tr: 'Filtre geçerli bir JSON dizi olmalıdır. Boş bırakılırsa tüm önem seviyeleri bildirilir.', en: 'The filter must be a valid JSON array. Leaving it empty notifies on every severity.' },
  'pc.help.notifications.rule.throttle.label': { tr: 'Kısıtlama', en: 'Throttling' },
  'pc.help.notifications.rule.throttle.desc': { tr: 'Aynı kuralın belirlenen dakika içinde tekrar bildirim göndermesi engellenir — bir arıza yüzlerce bildirim üretmez.', en: 'A rule is prevented from notifying again within the configured minutes — one incident does not produce hundreds of notifications.' },

  // ══ MODEL REGISTRY ════════════════════════════════════════════════════════
  'pc.help.registry.title': { tr: 'Model Kayıt Defteri', en: 'Model Registry' },
  'pc.help.registry.summary': {
    tr: 'Tenant\'ların şema ve derlenmiş model sürümlerinin platformun güncel sürümüyle karşılaştırılması. Amaç, geride kalmış kurulumları görünür kılmaktır.',
    en: 'Comparison of tenants\' schema and compiled model versions against the platform\'s current version. The point is to make lagging installations visible.'
  },
  'pc.help.registry.field.schemaVersion.label': { tr: 'Şema sürümü', en: 'Schema version' },
  'pc.help.registry.field.schemaVersion.desc': { tr: 'Tenant veritabanına uygulanmış son migrasyon numarası.', en: 'The last migration number applied to the tenant database.' },
  'pc.help.registry.field.latest.label': { tr: 'En güncel', en: 'Latest' },
  'pc.help.registry.field.latest.desc': { tr: 'Platformun sunduğu en yüksek migrasyon numarası — hedef sürüm budur.', en: 'The highest migration number the platform ships — this is the target version.' },
  'pc.help.registry.field.driftStatus.label': { tr: 'Sapma durumu', en: 'Drift status' },
  'pc.help.registry.field.driftStatus.desc': { tr: '"Güncel" iki sürümün eşit olduğunu, "Geride" tenant\'ın migrasyon beklediğini gösterir.', en: '"Current" means the two versions match; "Behind" means the tenant is awaiting migration.' },
  'pc.help.registry.field.modelCount.label': { tr: 'Model sayısı', en: 'Model count' },
  'pc.help.registry.field.modelCount.desc': { tr: 'Tenant\'ın yayınladığı dinamik model sayısı.', en: 'Number of dynamic models the tenant has published.' },
  'pc.help.registry.field.assemblyError.label': { tr: 'Assembly hatası', en: 'Assembly error' },
  'pc.help.registry.field.assemblyError.desc': { tr: 'Derlenemeyen model sayısı. Sıfırdan büyükse o modeller çalışma zamanında kullanılamaz.', en: 'Number of models that failed to compile. If greater than zero those models are unusable at runtime.' },
  'pc.help.registry.field.syncState.label': { tr: 'Senkron', en: 'Sync' },
  'pc.help.registry.field.syncState.desc': { tr: 'Model tanımı ile derlenmiş assembly\'nin aynı sürümde olup olmadığı.', en: 'Whether the model definition and the compiled assembly are at the same version.' },
  'pc.help.registry.rule.driftMeaning.label': { tr: 'Sapma ne demek?', en: 'What drift means' },
  'pc.help.registry.rule.driftMeaning.desc': { tr: '"Geride" bir arıza değildir; migrasyonun henüz uygulanmadığını söyler. Uygulamak için Operasyon → Migrasyonlar kullanılır.', en: '"Behind" is not a failure; it says the migration has not been applied yet. Use Operations → Migrations to apply it.' },
  'pc.help.registry.rule.schemaVsAssembly.label': { tr: 'Şema ≠ Assembly', en: 'Schema ≠ Assembly' },
  'pc.help.registry.rule.schemaVsAssembly.desc': { tr: 'Şema sürümü veritabanı tablolarını, assembly sürümü ise modelden derlenen kodu anlatır. İkisi ayrı ayrı geride kalabilir.', en: 'Schema version describes the database tables; assembly version describes the code compiled from the model. The two can lag independently.' },
  'pc.help.registry.notes': {
    tr: 'Assembly hatası olan bir tenant\'ta ilgili modelin CRUD uçları çalışmaz. Bu satırlar migrasyondan önce ele alınmalıdır.',
    en: 'On a tenant with assembly errors the affected model\'s CRUD endpoints do not work. Those rows should be handled before migrating.'
  },

  // ══ MIGRATIONS ════════════════════════════════════════════════════════════
  'pc.help.migrations.title': { tr: 'Migrasyonlar', en: 'Migrations' },
  'pc.help.migrations.summary': {
    tr: 'Şema migrasyonlarının tenant\'lara kademeli olarak uygulanması. Tüm kuruluma aynı anda değil, dalgalar hâlinde yayılır.',
    en: 'Rolling out schema migrations to tenants gradually. They spread in waves rather than hitting every installation at once.'
  },
  'pc.help.migrations.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.migrations.field.status.desc': { tr: 'Koşunun genel durumu: çalışıyor, tamamlandı ya da durduruldu.', en: 'Overall state of the run: running, completed or stopped.' },
  'pc.help.migrations.field.total.label': { tr: 'Toplam', en: 'Total' },
  'pc.help.migrations.field.total.desc': { tr: 'Koşuya dahil edilen tenant sayısı.', en: 'Number of tenants included in the run.' },
  'pc.help.migrations.field.succeeded.label': { tr: 'Başarılı', en: 'Succeeded' },
  'pc.help.migrations.field.succeeded.desc': { tr: 'Migrasyonu sorunsuz uygulanan tenant sayısı.', en: 'Number of tenants where the migration applied cleanly.' },
  'pc.help.migrations.field.failed.label': { tr: 'Hata', en: 'Failed' },
  'pc.help.migrations.field.failed.desc': { tr: 'Migrasyonu patlayan tenant sayısı; ayrıntı panelinde her biri hata mesajıyla listelenir.', en: 'Number of tenants where the migration failed; the detail panel lists each with its error message.' },
  'pc.help.migrations.field.startedAt.label': { tr: 'Başlangıç', en: 'Started' },
  'pc.help.migrations.field.startedAt.desc': { tr: 'Koşunun başladığı an.', en: 'When the run started.' },
  'pc.help.migrations.field.waves.label': { tr: 'Dalgalar', en: 'Waves' },
  'pc.help.migrations.field.waves.desc': { tr: 'Her tenant\'ın hangi dalgada işlendiği. Dalga, yayılımın kademesini gösterir.', en: 'Which wave each tenant was processed in. The wave shows the rollout stage.' },
  'pc.help.migrations.field.stoppedReason.label': { tr: 'Durma nedeni', en: 'Stop reason' },
  'pc.help.migrations.field.stoppedReason.desc': { tr: 'Koşu erken durduysa nedeni; genelde "ilk hatada dur" ayarının devreye girmesidir.', en: 'Why the run stopped early if it did; usually the "stop on first failure" setting kicking in.' },
  'pc.help.migrations.rule.waveOrder.label': { tr: 'Dalga sırası', en: 'Wave order' },
  'pc.help.migrations.rule.waveOrder.desc': { tr: 'Yayılım canary (gerçek müşteri olmayan test şirketi) → %10 → tümü sırasıyla ilerler. Amaç, bir sorunu tüm müşterilere yaymadan önce küçük bir kümede yakalamaktır.', en: 'Rollout goes canary (a test company, not a real customer) → 10% → all. The point is to catch a problem on a small set before it reaches every customer.' },
  'pc.help.migrations.rule.idempotency.label': { tr: 'Idempotency', en: 'Idempotency' },
  'pc.help.migrations.rule.idempotency.desc': { tr: 'Migrasyon script\'leri idempotenttir: aynı script ikinci kez koşarsa hata vermez, zaten uygulanmış adımları atlar. Bu yüzden başarısız bir koşu güvenle tekrarlanabilir.', en: 'Migration scripts are idempotent: running the same script twice does not fail, it skips already-applied steps. A failed run can therefore be safely repeated.' },
  'pc.help.migrations.rule.stopOnFirstFailure.label': { tr: 'İlk hatada dur', en: 'Stop on first failure' },
  'pc.help.migrations.rule.stopOnFirstFailure.desc': { tr: 'Açıkken bir tenant patladığı anda koşu durur ve kalan tenant\'lara dokunulmaz. Bilinmeyen bir migrasyonu ilk kez yayarken açık tutun.', en: 'When enabled, the run halts the moment one tenant fails and the remaining tenants are untouched. Keep it on when rolling out an unproven migration for the first time.' },
  'pc.help.migrations.rule.preBackup.label': { tr: 'Öncesinde yedek', en: 'Pre-backup' },
  'pc.help.migrations.rule.preBackup.desc': { tr: 'Açıkken her tenant için migrasyondan hemen önce yedek alınır. Koşuyu yavaşlatır ama geri dönüş imkânı verir.', en: 'When enabled, a backup is taken for each tenant immediately before migrating. It slows the run but gives you a way back.' },
  'pc.help.migrations.field.trigger.label': { tr: 'Tetikleyici', en: 'Trigger' },
  'pc.help.migrations.field.trigger.desc': { tr: 'Koşuyu kimin başlattığı: "Elle" bir operatör düğmeye bastı demek, "Zamanlanmış" ise otomatik yükseltmenin saati geldi demek. Otomatik koşularda kullanıcı bilgisi olmadığı için ayrımı yapan tek alan budur.', en: 'Who started the run: "Manual" means an operator pressed the button, "Scheduled" means the automatic upgrade time came due. Automatic runs carry no user, so this is the only field that tells them apart.' },
  'pc.help.migrations.field.skipped.label': { tr: 'Atlanan', en: 'Skipped' },
  'pc.help.migrations.field.skipped.desc': { tr: 'Sürümü zaten güncel olduğu için dokunulmayan tenant sayısı. Bunlar hata değildir — yapılacak iş yoktu. Toplam = başarılı + hata + atlanan.', en: 'Number of tenants left untouched because their version was already current. These are not failures — there was nothing to do. Total = succeeded + failed + skipped.' },

  'pc.help.migrations.rule.asyncRun.label': { tr: 'Koşu arka planda yürür', en: 'The run executes in the background' },
  'pc.help.migrations.rule.asyncRun.desc': { tr: '"Başlat" isteği koşuyu kuyruğa alır ve hemen döner; asıl iş JobWorker üzerinde sürer. Bu yüzden koşu önce "Kuyrukta" görünür, bir worker sahiplenince "Çalışıyor" olur. Aktif bir koşu varken sayfa kendini yeniler. Aynı anda yalnız TEK koşu olabilir — sürerken ikinci bir koşu başlatılamaz.', en: 'The "Start" request queues the run and returns immediately; the actual work continues on JobWorker. That is why a run first shows as "Queued" and turns "Running" once a worker claims it. The page refreshes itself while a run is active. Only ONE run can exist at a time — a second cannot be started while one is in progress.' },
  'pc.help.migrations.rule.schedule.label': { tr: 'Otomatik yükseltme', en: 'Automatic upgrade' },
  'pc.help.migrations.rule.schedule.desc': { tr: 'Açıldığında sürümü geride kalan tenant\'lar seçtiğiniz sıklıkta (ör. her Pazar 03:00) gözetimsiz yükseltilir. Cron bilmek gerekmez; ham ifade yalnız "Özel" seçeneğindedir. Varsayılan KAPALIDIR ve açıldığında "öncesinde yedek al" + "ilk hatada dur" açık gelir: gece koşusunu izleyen kimse olmayacağı için patlama yarıçapı küçük tutulur. Sonraki koşu zamanlarını sunucu hesaplar ve kaydettiğinizde gösterir.', en: 'When on, tenants that fell behind are upgraded unattended at the frequency you pick (e.g. every Sunday 03:00). No cron knowledge is needed; the raw expression only appears under "Custom". It is OFF by default, and when enabled it arrives with "take a backup first" and "stop on first failure" on: nobody will be watching the night run, so the blast radius is kept small. The server computes the next run times and shows them after you save.' },

  'pc.help.migrations.notes': {
    tr: 'Migrasyon tenant veritabanlarını değiştirir ve geri alınamaz — yalnız yedekten dönülebilir. Üretimde "öncesinde yedek al" ve "ilk hatada dur" seçeneklerini açık tutun. Bir koşu uzun sürerse İşler ekranında askıya alınmış bir iş görebilirsiniz; koşunun kendi durumu bu sayfada doğrudur.',
    en: 'Migrations modify tenant databases and cannot be undone — only restored from backup. Keep "take a backup first" and "stop on first failure" enabled in production. If a run takes a long time you may see a parked job on the Jobs screen; the run\'s own status on this page is the authoritative one.'
  },

  // ══ WORKERS ═══════════════════════════════════════════════════════════════
  'pc.help.workers.title': { tr: 'Worker\'lar', en: 'Workers' },
  'pc.help.workers.summary': {
    tr: 'Platformun periyodik arka plan worker\'ları: iş kuyruğu, zamanlayıcı, sağlık probları, uyarı değerlendirici ve diğerleri. Buradan her birini duraklatabilir, çalışma aralığını değiştirebilir ve döngüsünü yenileyebilirsiniz. Ayarlar veritabanında durur; uygulamayı yeniden derlemek gerekmez.',
    en: 'The platform\'s periodic background workers: the job queue, the scheduler, health probes, the alert evaluator and others. From here you can pause each one, change its interval and reset its loop. Settings live in the database; no rebuild is needed.'
  },
  'pc.help.workers.field.name.label': { tr: 'Ad', en: 'Name' },
  'pc.help.workers.field.name.desc': { tr: 'Worker sınıfının adı. Altında son sinyali yazan prosesin kimliği görünür (makine adı ve süreç numarası).', en: 'The worker class name. Underneath it shows the identity of the process that wrote the last signal (machine name and process id).' },
  'pc.help.workers.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.workers.field.status.desc': { tr: 'Sunucu tarafından türetilir: Çalışıyor, Duraklatıldı (operatör kapattı), Yanıt yok (sinyal beklenen süreden uzun süredir gelmiyor) veya Hata (son turda hata alındı).', en: 'Derived on the server: Running, Paused (an operator turned it off), Not responding (no signal for longer than expected) or Error (the last cycle raised an error).' },
  'pc.help.workers.field.interval.label': { tr: 'Aralık', en: 'Interval' },
  'pc.help.workers.field.interval.desc': { tr: 'İki koşu arasındaki bekleme (saniye). Boş bırakılırsa koddaki varsayılan kullanılır — yanındaki ipucu o değeri gösterir. Kabul edilen aralık 5 saniye ile 24 saat arasıdır.', en: 'The wait between two cycles, in seconds. Leave it blank to use the code default — the hint beside it shows that value. Accepted range is 5 seconds to 24 hours.' },
  'pc.help.workers.field.heartbeat.label': { tr: 'Son sinyal', en: 'Last heartbeat' },
  'pc.help.workers.field.heartbeat.desc': { tr: 'Döngünün en son "ayaktayım" dediği an. En fazla 30 saniyede bir yazılır, dolayısıyla saniye saniye ilerlemez.', en: 'When the loop last said "I am alive". It is written at most once every 30 seconds, so it does not advance second by second.' },
  'pc.help.workers.field.lastRun.label': { tr: 'Son koşu', en: 'Last run' },
  'pc.help.workers.field.lastRun.desc': { tr: 'Worker\'ın en son tamamladığı tur. Son sinyalden farklıdır: duraklatılmış ya da hata alan bir worker sinyal yazmaya devam eder ama son koşusu ilerlemez — "ne zamandır iş yapmıyor" sorusunun cevabı budur.', en: 'The last cycle the worker completed. This differs from the heartbeat: a paused or erroring worker keeps writing signals but its last run stops advancing — that is what answers "how long has it not been working".' },
  'pc.help.workers.field.lastError.label': { tr: 'Son hata', en: 'Last error' },
  'pc.help.workers.field.lastError.desc': { tr: 'Son turda alınan hata mesajı. Worker bir sonraki başarılı turda bu alanı kendisi temizler; kalıcı bir hata kaydı değildir.', en: 'The error message from the last cycle. The worker clears this itself on the next successful cycle; it is not a permanent error log.' },
  'pc.help.workers.field.owner.label': { tr: 'Sahip proses', en: 'Owning process' },
  'pc.help.workers.field.owner.desc': { tr: 'Sinyali yazan sürecin kimliği (makine adı ve süreç numarası). Birden fazla sunucu çalıştırıyorsanız hangisinin aktif olduğunu buradan görürsünüz.', en: 'The identity of the process that wrote the signal (machine name and process id). If you run more than one server, this tells you which one is active.' },

  'pc.help.workers.rule.pauseVsStale.label': { tr: 'Duraklatıldı ile Yanıt yok farkı', en: 'Paused vs Not responding' },
  'pc.help.workers.rule.pauseVsStale.desc': { tr: '"Duraklatıldı" kasıtlıdır: worker ayakta, döngüsü dönüyor ama iş yapmıyor ve sinyal yazmaya devam ediyor. "Yanıt yok" ise beklenmedik durumdur: sinyal gelmiyor, süreç ölmüş ya da takılmış olabilir. Duraklatılmış bir worker asla "yanıt yok" gösterilmez.', en: '"Paused" is deliberate: the worker is up, its loop is turning, it does no work but keeps writing signals. "Not responding" is unexpected: no signal is arriving, the process may have died or hung. A paused worker is never shown as not responding.' },
  'pc.help.workers.rule.resetLoop.label': { tr: 'Döngüyü yenile', en: 'Reset loop' },
  'pc.help.workers.rule.resetLoop.desc': { tr: 'Uygulama sürecini YENİDEN BAŞLATMAZ. Worker\'a bir sonraki turda kapanış ve başlangıç adımlarını tekrar koşmasını söyler. İş kuyruğu worker\'ında bunun somut karşılığı, sahipsiz kalmış işlerin yeniden beklemeye alınmasıdır. Takılmış görünen bir worker\'da prosesi yeniden başlatmadan önce denenecek ilk şeydir.', en: 'It does NOT restart the application process. It tells the worker to re-run its shutdown and startup steps on the next cycle. On the job queue worker this concretely means abandoned jobs are put back in the queue. It is the first thing to try on a stuck worker, before restarting the process.' },
  'pc.help.workers.rule.criticalWorkers.label': { tr: 'Kritik worker\'lar', en: 'Critical workers' },
  'pc.help.workers.rule.criticalWorkers.desc': { tr: 'İş kuyruğu, olay dağıtıcısı ve zamanlayıcı kapatılırsa platformun tamamı etkilenir: tenant kurulumu, yedekleme, e-posta ve zamanlanmış görevler durur. Kapatma engellenmez — kaçak bir işi durdurmak meşru bir müdahaledir — ama açık onay ister ve kapalı kaldığı sürece satırda uyarı durur.', en: 'Turning off the job queue, the event dispatcher or the scheduler affects the entire platform: tenant provisioning, backups, email and scheduled tasks all stop. Disabling is not blocked — stopping a runaway job is a legitimate intervention — but it requires explicit confirmation and the row keeps a warning while it stays off.' },
  'pc.help.workers.rule.intervalOverride.label': { tr: 'Aralık değişikliği', en: 'Changing the interval' },
  'pc.help.workers.rule.intervalOverride.desc': { tr: 'Değişiklik en geç bir tur içinde etkili olur; uygulamayı yeniden başlatmak gerekmez. Alanı boşaltıp kaydederseniz override kalkar ve worker koddaki varsayılana döner — böylece ileride varsayılan değişirse elle dokunulmamış worker\'lar yeni değeri alır.', en: 'A change takes effect within one cycle at most; no restart is needed. Clearing the field and saving removes the override and the worker returns to the code default — so if that default changes later, untouched workers pick up the new value.' },
  'pc.help.workers.notes': {
    tr: 'Telemetri boşaltıcısı bu listede yoktur: o, sabit aralıkla değil gelen veri oldukça çalışır, dolayısıyla duraklatma ve aralık kavramları ona uymaz. Ayrıca burada yapılan değişiklikler tüm sunucular için geçerlidir — ayar veritabanında durur, tek bir sürecin belleğinde değil.',
    en: 'The telemetry flusher is not in this list: it runs as data arrives rather than on a fixed interval, so pausing and intervals do not apply to it. Also, changes made here apply to every server — the setting lives in the database, not in one process\'s memory.'
  },

  // ══ API MONITORING ════════════════════════════════════════════════════════
  'pc.help.apiMonitor.title': { tr: 'API İzleme', en: 'API Monitoring' },
  'pc.help.apiMonitor.summary': {
    tr: 'Uç bazında trafik, hata oranı ve gecikme; ayrıca isteklerin canlı akışı. Metrikler dakikalık rollup\'tan, canlı akış ise ham isteklerden gelir.',
    en: 'Per-endpoint traffic, error rate and latency, plus a live stream of requests. Metrics come from per-minute rollups; the live stream comes from raw requests.'
  },
  'pc.help.apiMonitor.field.route.label': { tr: 'Route', en: 'Route' },
  'pc.help.apiMonitor.field.route.desc': { tr: 'Uç şablonu (parametreler ayrıştırılmış hâliyle) — böylece aynı ucun tüm istekleri tek satırda toplanır.', en: 'The endpoint template (with parameters normalized) so all requests to one endpoint aggregate into a single row.' },
  'pc.help.apiMonitor.field.count.label': { tr: 'Adet', en: 'Count' },
  'pc.help.apiMonitor.field.count.desc': { tr: 'Seçili aralıkta o uca gelen istek sayısı.', en: 'Number of requests to that endpoint in the selected range.' },
  'pc.help.apiMonitor.field.errorRate.label': { tr: 'Hata %', en: 'Error %' },
  'pc.help.apiMonitor.field.errorRate.desc': { tr: 'O uçtaki 5xx oranı. Tek bir ucun yüksek olması genelde o kod yolundaki bir soruna işaret eder.', en: 'The 5xx ratio for that endpoint. A single endpoint standing out usually points to a problem in that code path.' },
  'pc.help.apiMonitor.field.p95.label': { tr: 'p95', en: 'p95' },
  'pc.help.apiMonitor.field.p95.desc': { tr: 'İsteklerin %95\'inin altında kaldığı yanıt süresi. Ortalamadan farklı olarak yavaş kuyruk burada görünür.', en: 'The response time 95% of requests stay under. Unlike an average, the slow tail shows up here.' },
  'pc.help.apiMonitor.field.liveStream.label': { tr: 'Canlı akış', en: 'Live stream' },
  'pc.help.apiMonitor.field.liveStream.desc': { tr: 'Ham isteklerin akışı, 5 saniyede bir tazelenir. Bir sorunu anlık izlerken kullanılır.', en: 'A stream of raw requests refreshed every 5 seconds. Use it while watching a problem unfold.' },
  'pc.help.apiMonitor.field.correlation.label': { tr: 'Correlation', en: 'Correlation' },
  'pc.help.apiMonitor.field.correlation.desc': { tr: 'İsteğin izleme kimliği (kısaltılmış gösterilir). Aynı kimlik Denetim Kayıtları\'nda o isteğin yazma işlemlerini bulmayı sağlar.', en: 'The request\'s trace id (shown truncated). The same id lets you find that request\'s writes in the Audit Logs.' },
  'pc.help.apiMonitor.notes': {
    tr: 'Metrik tablosu dakikada bir üretilen rollup\'a dayanır; yeni açılmış bir uç ya da son bir dakikanın trafiği burada hemen görünmez. Anlık ihtiyaç için Canlı akış sekmesini kullanın.',
    en: 'The metrics table is based on rollups produced once a minute; a newly added endpoint or the last minute of traffic will not appear immediately. Use the Live stream tab when you need real time.'
  },

  // ══ PERFORMANCE ═══════════════════════════════════════════════════════════
  'pc.help.performance.title': { tr: 'Performans', en: 'Performance' },
  'pc.help.performance.summary': {
    tr: 'Seçilen saat aralığındaki en yavaş uçlar ve en yavaş tekil istekler. Optimizasyon çalışmasına nereden başlanacağını gösterir.',
    en: 'The slowest endpoints and slowest individual requests in the chosen hour range. It shows where to start optimization work.'
  },
  'pc.help.performance.field.hours.label': { tr: 'Saat aralığı', en: 'Hour range' },
  'pc.help.performance.field.hours.desc': { tr: 'Geriye dönük kaç saatlik veriye bakılacağı (1–168, yani en fazla bir hafta).', en: 'How many hours of history to analyze (1–168, i.e. at most one week).' },
  'pc.help.performance.field.slowestEndpoints.label': { tr: 'En yavaş uçlar', en: 'Slowest endpoints' },
  'pc.help.performance.field.slowestEndpoints.desc': { tr: 'p95\'e göre sıralı uçlar, adet ve hata oranıyla birlikte. Yüksek p95 + yüksek adet, en çok kazanç getirecek yerdir.', en: 'Endpoints ranked by p95, with count and error rate. High p95 combined with high count is where optimization pays off most.' },
  'pc.help.performance.field.slowestRequests.label': { tr: 'En yavaş istekler', en: 'Slowest requests' },
  'pc.help.performance.field.slowestRequests.desc': { tr: 'Tekil en yavaş istekler. Bir ucun neden yavaş olduğunu anlamak için tek tek örneklere bakmayı sağlar.', en: 'The slowest individual requests. They let you inspect concrete examples to understand why an endpoint is slow.' },
  'pc.help.performance.field.p95.label': { tr: 'p95', en: 'p95' },
  'pc.help.performance.field.p95.desc': { tr: 'İsteklerin %95\'inin altında kaldığı süre; kullanıcıların hissettiği yavaşlığın ölçüsü budur.', en: 'The duration 95% of requests stay under; this is the measure of slowness users actually feel.' },

  // ══ PLANS ═════════════════════════════════════════════════════════════════
  'pc.help.plans.title': { tr: 'Plan Kataloğu', en: 'Plan Catalog' },
  'pc.help.plans.summary': {
    tr: 'Müşterilere sunulan abonelik modelleri ve her birinin verdiği özellik/kota hakları. Bir tenant\'ın neye erişebildiği, bağlı olduğu planın özelliklerinden hesaplanır.',
    en: 'The subscription models offered to customers and the feature/quota entitlements each grants. What a tenant can access is computed from the features of the plan they are on.'
  },
  'pc.help.plans.field.code.label': { tr: 'Kod', en: 'Code' },
  'pc.help.plans.field.code.desc': { tr: 'Planın değişmez kimliği (free/pro/enterprise gibi). Oluşturulduktan sonra düzenlenemez.', en: 'The plan\'s immutable identifier (such as free/pro/enterprise). It cannot be edited after creation.' },
  'pc.help.plans.field.version.label': { tr: 'Sürüm', en: 'Version' },
  'pc.help.plans.field.version.desc': { tr: 'Aynı kodun kaçıncı sürümü olduğu. Kod + sürüm birlikte benzersizdir.', en: 'Which revision of the same code this is. Code + version together are unique.' },
  'pc.help.plans.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.plans.field.status.desc': { tr: 'Taslak (hazırlanıyor, atanamaz), Aktif (kullanımda) veya Kullanımdan kaldırıldı (yeni atama yapılamaz, mevcut aboneler devam eder).', en: 'Draft (being prepared, cannot be assigned), Active (in use) or Retired (no new assignments; existing subscribers continue).' },
  'pc.help.plans.field.isPublic.label': { tr: 'Herkese açık', en: 'Public' },
  'pc.help.plans.field.isPublic.desc': { tr: 'Planın müşteriye gösterilen listede yer alıp almayacağı. Kapalı planlar yalnız operatör tarafından atanır.', en: 'Whether the plan appears in the customer-facing list. Non-public plans can only be assigned by an operator.' },
  'pc.help.plans.field.isDefault.label': { tr: 'Varsayılan', en: 'Default' },
  'pc.help.plans.field.isDefault.desc': { tr: 'Yeni kaydolan şirketlerin kurulum sırasında otomatik bağlanacağı plan. Aynı anda yalnız bir plan varsayılan olabilir.', en: 'The plan newly registered companies are automatically attached to during provisioning. Only one plan can be the default at a time.' },
  'pc.help.plans.field.trialDays.label': { tr: 'Trial gün', en: 'Trial days' },
  'pc.help.plans.field.trialDays.desc': { tr: 'Bu plan atandığında deneme penceresinin kaç gün süreceği.', en: 'How many days the trial window lasts when this plan is assigned.' },
  'pc.help.plans.field.features.label': { tr: 'Özellikler / kotalar', en: 'Features / quotas' },
  'pc.help.plans.field.features.desc': { tr: 'Planın verdiği haklar. Limit dolu ise sayısal kota (ör. 25 kullanıcı), boş ise özellik sınırsız/açık demektir.', en: 'The entitlements the plan grants. A filled limit is a numeric quota (e.g. 25 users); an empty one means the feature is unlimited/on.' },
  'pc.help.plans.rule.versioning.label': { tr: 'Sürümleme', en: 'Versioning' },
  'pc.help.plans.rule.versioning.desc': { tr: 'Fiyat veya limit değişimi mevcut planı düzenleyerek değil, yeni bir sürüm satırı açarak yapılır. Böylece eski aboneler bulundukları koşullarda kalabilir.', en: 'Price or limit changes are made by opening a new version row, not by editing the existing plan. That way existing subscribers can stay on the terms they signed up for.' },
  'pc.help.plans.rule.defaultPlan.label': { tr: 'Varsayılan plan', en: 'Default plan' },
  'pc.help.plans.rule.defaultPlan.desc': { tr: 'Bir planı varsayılan yapmak, yeni tenant\'ların kurulum sırasında otomatik olarak o plana Trial abonelikle bağlanmasını sağlar. Varsayılan plan Aktif durumdan çıkarılamaz; önce başka bir plan varsayılan yapılmalıdır.', en: 'Making a plan the default causes new tenants to be attached to it with a trial subscription during provisioning. The default plan cannot leave Active; another plan must be made default first.' },
  'pc.help.plans.rule.featureCatalog.label': { tr: 'Özellik kataloğu', en: 'Feature catalog' },
  'pc.help.plans.rule.featureCatalog.desc': { tr: 'Özellik anahtarları kapalı bir katalogdan seçilir; serbest metin kabul edilmez. Sebebi, hak değerlendiricisinin tanımadığı bir anahtarı sessizce yok saymasıdır — yanlış yazılan anahtar fark edilmeyen bir hak kaybına dönerdi.', en: 'Feature keys are chosen from a closed catalog; free text is rejected. The reason is that the entitlement evaluator silently ignores keys it does not recognize — a typo would become an unnoticed loss of entitlement.' },
  'pc.help.plans.rule.unlimitedLimit.label': { tr: 'Boş limit', en: 'Empty limit' },
  'pc.help.plans.rule.unlimitedLimit.desc': { tr: 'Limit boş bırakılan özellik sınırsızdır (varlığı "açık" demektir). Sıfır yazmak sınırsız değil, gerçekten sıfır kota anlamına gelir.', en: 'A feature with an empty limit is unlimited (its presence means "on"). Writing zero means an actual zero quota, not unlimited.' },
  'pc.help.plans.rule.deleteVsRetire.label': { tr: 'Silme ≠ Emekliye ayırma', en: 'Delete ≠ Retire' },
  'pc.help.plans.rule.deleteVsRetire.desc': { tr: 'Kalıcı silme yalnız hiç abonesi olmamış taslak planlarda mümkündür. Yayına çıkmış bir plan "Emekliye ayır" ile kapatılır; geçmiş aboneliklerin plan referansı korunur.', en: 'Permanent deletion is only possible for draft plans that never had a subscriber. A published plan is closed with "Retire", preserving the plan reference on historical subscriptions.' },
  'pc.help.plans.notes': {
    tr: 'Plan özelliklerinde yapılan değişiklik tenant\'lara anında yansımaz — hak anlık görüntüleri önbelleklenir ve kısa bir süre sonra tazelenir.',
    en: 'Changes to plan features do not reach tenants instantly — entitlement snapshots are cached and refresh after a short delay.'
  },

  // ══ SUBSCRIPTIONS ═════════════════════════════════════════════════════════
  'pc.help.subscriptions.title': { tr: 'Abonelikler', en: 'Subscriptions' },
  'pc.help.subscriptions.summary': {
    tr: 'Hangi tenant\'ın hangi plana, hangi koşullarla bağlı olduğu. Bir tenant\'ın platformu kullanabilmesi buradaki kaydın varlığına ve durumuna bağlıdır.',
    en: 'Which tenant is on which plan and under what terms. A tenant\'s ability to use the platform depends on the existence and state of this record.'
  },
  'pc.help.subscriptions.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.subscriptions.field.tenant.desc': { tr: 'Aboneliğin ait olduğu müşteri kurulumu.', en: 'The customer installation the subscription belongs to.' },
  'pc.help.subscriptions.field.plan.label': { tr: 'Plan', en: 'Plan' },
  'pc.help.subscriptions.field.plan.desc': { tr: 'Bağlı olunan plan kodu. Tenant\'ın hakları bu planın özelliklerinden hesaplanır.', en: 'The plan code in force. The tenant\'s entitlements are computed from this plan\'s features.' },
  'pc.help.subscriptions.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.subscriptions.field.status.desc': { tr: 'Deneme, Aktif, Ödemesi gecikmiş, Askıya alındı, İptal edildi veya Süresi doldu. İlk üçünde erişim vardır, kalanlarda yoktur.', en: 'Trial, Active, PastDue, Suspended, Cancelled or Expired. The first three grant access; the rest do not.' },
  'pc.help.subscriptions.field.seats.label': { tr: 'Koltuk', en: 'Seats' },
  'pc.help.subscriptions.field.seats.desc': { tr: 'Abonelikle satın alınan kullanıcı sayısı.', en: 'Number of users purchased with the subscription.' },
  'pc.help.subscriptions.field.trialEnds.label': { tr: 'Trial bitiş', en: 'Trial ends' },
  'pc.help.subscriptions.field.trialEnds.desc': { tr: 'Deneme penceresinin kapanacağı an. "Uzat" yalnız Trial durumdaki aboneliklerde çalışır.', en: 'When the trial window closes. "Extend" only works on subscriptions in Trial state.' },
  'pc.help.subscriptions.field.graceUntil.label': { tr: 'Ek süre', en: 'Grace until' },
  'pc.help.subscriptions.field.graceUntil.desc': { tr: 'Ödeme gecikince erişimin kesilmeden önce tanınan ek süre. Bu tarih geçince abonelik askıya alınır.', en: 'The extra period granted after a missed payment before access is cut. Once this date passes the subscription is suspended.' },
  'pc.help.subscriptions.rule.autoAssign.label': { tr: 'Otomatik atama', en: 'Automatic assignment' },
  'pc.help.subscriptions.rule.autoAssign.desc': { tr: 'Yeni kaydolan şirketler kurulum sırasında varsayılan plana Trial abonelikle otomatik bağlanır. Varsayılan plan tanımlı değilse abonelik oluşmaz ve tenant hak alamaz.', en: 'Newly registered companies are automatically given a trial subscription to the default plan during provisioning. If no default plan is defined, no subscription is created and the tenant gets no entitlements.' },
  'pc.help.subscriptions.rule.entitlement.label': { tr: 'Hak hesabı', en: 'Entitlement' },
  'pc.help.subscriptions.rule.entitlement.desc': { tr: 'Hak deny-by-default çalışır: abonelik kaydı yoksa tenant hiçbir şeye erişemez. Erişim yalnız Deneme, Aktif ve Ödemesi gecikmiş durumlarında verilir.', en: 'Entitlement is deny-by-default: with no subscription record the tenant can access nothing. Access is granted only in Trial, Active and PastDue states.' },
  'pc.help.subscriptions.rule.dunning.label': { tr: 'Ödeme takibi', en: 'Dunning' },
  'pc.help.subscriptions.rule.dunning.desc': { tr: 'Ödeme alınamayınca abonelik "Ödemesi gecikmiş" durumuna düşer ve ek süre başlar. "Ödeme al" ile "Aktif"e döner; ek süre dolarsa askıya alınır.', en: 'A missed payment moves the subscription to PastDue and starts the grace period. "Record payment" returns it to Active; if grace elapses it is suspended.' },
  'pc.help.subscriptions.rule.oneActivePerCompany.label': { tr: 'Tek aktif abonelik', en: 'One active subscription' },
  'pc.help.subscriptions.rule.oneActivePerCompany.desc': { tr: 'Bir şirketin aynı anda yalnız bir aktif aboneliği olabilir. Plan değişimi, yeni bir abonelik açmak yerine mevcut kaydın güncellenmesiyle yapılır.', en: 'A company can have only one active subscription at a time. A plan change updates the existing record rather than opening a second one.' },
  'pc.help.subscriptions.notes': {
    tr: 'Abonelik iptali tenant\'ı teknik olarak kapatmaz; yalnız hakkını düşürür. Kurulumu da kapatmak gerekiyorsa Tenant detayından askıya alma/arşivleme yapılmalıdır.',
    en: 'Cancelling a subscription does not technically shut the tenant down; it only drops their entitlement. To close the installation too, suspend or archive it from the tenant detail page.'
  },

  // ══ USAGE ═════════════════════════════════════════════════════════════════
  'pc.help.usage.title': { tr: 'Kullanım', en: 'Usage' },
  'pc.help.usage.summary': {
    tr: 'Tenant başına ölçülen kullanım miktarları. Kota denetimi ve maliyet hesabı bu kayıtlardan beslenir.',
    en: 'Measured usage quantities per tenant. Quota enforcement and cost calculation are fed from these records.'
  },
  'pc.help.usage.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.usage.field.tenant.desc': { tr: 'Kullanımın ait olduğu müşteri kurulumu.', en: 'The customer installation the usage belongs to.' },
  'pc.help.usage.field.metric.label': { tr: 'Metrik', en: 'Metric' },
  'pc.help.usage.field.metric.desc': { tr: 'Ne ölçüldüğü (ör. API isteği, depolama, AI token).', en: 'What is being measured (e.g. API requests, storage, AI tokens).' },
  'pc.help.usage.field.quantity.label': { tr: 'Miktar', en: 'Quantity' },
  'pc.help.usage.field.quantity.desc': { tr: 'Ölçülen değer. Negatif olamaz.', en: 'The measured value. It cannot be negative.' },
  'pc.help.usage.field.window.label': { tr: 'Dönem', en: 'Window' },
  'pc.help.usage.field.window.desc': { tr: 'Özet tablosu son 30 günü toplar; tek tek kayıtlar girildikleri anla saklanır.', en: 'The summary table aggregates the last 30 days; individual records are stored with the moment they were entered.' },

  // ══ COST ══════════════════════════════════════════════════════════════════
  'pc.help.cost.title': { tr: 'Maliyet', en: 'Cost' },
  'pc.help.cost.summary': {
    tr: 'Tenant başına tahmini altyapı maliyeti — kullanım miktarlarının birim maliyetle çarpımı. Faturalama değil, iç maliyet görünürlüğü içindir.',
    en: 'Estimated infrastructure cost per tenant — usage quantities multiplied by unit cost. It is for internal cost visibility, not billing.'
  },
  'pc.help.cost.field.tenant.label': { tr: 'Tenant', en: 'Tenant' },
  'pc.help.cost.field.tenant.desc': { tr: 'Maliyetin ait olduğu müşteri kurulumu.', en: 'The customer installation the cost belongs to.' },
  'pc.help.cost.field.totalCost.label': { tr: 'Toplam', en: 'Total' },
  'pc.help.cost.field.totalCost.desc': { tr: 'Tenant\'ın tüm metriklerinden gelen maliyetin toplamı.', en: 'Sum of the cost from all of the tenant\'s metrics.' },
  'pc.help.cost.field.metric.label': { tr: 'Metrik', en: 'Metric' },
  'pc.help.cost.field.metric.desc': { tr: 'Maliyeti oluşturan kullanım kalemi.', en: 'The usage line item that produces the cost.' },
  'pc.help.cost.field.unitCost.label': { tr: 'Birim maliyet', en: 'Unit cost' },
  'pc.help.cost.field.unitCost.desc': { tr: 'Metriğin birim başına maliyeti. Çok küçük değerler olabildiği için sekiz ondalık basamağa kadar gösterilir.', en: 'Cost per unit of the metric. Shown to eight decimal places because the values can be very small.' },
  'pc.help.cost.field.breakdown.label': { tr: 'Döküm', en: 'Breakdown' },
  'pc.help.cost.field.breakdown.desc': { tr: 'Satırı açınca görünen metrik bazlı ayrıntı: miktar, birim ve hesaplanan maliyet.', en: 'The per-metric detail revealed by expanding a row: quantity, unit and computed cost.' },
  'pc.help.cost.notes': {
    tr: 'Rakamlar tahmindir ve girilen birim maliyetlere dayanır; gerçek sağlayıcı faturasıyla birebir örtüşmesi beklenmez.',
    en: 'The figures are estimates based on the unit costs you entered; they are not expected to match the actual provider invoice exactly.'
  },

  // ══ CONFIGURATION ═════════════════════════════════════════════════════════
  'pc.help.config.title': { tr: 'Platform Yapılandırması', en: 'Platform Configuration' },
  'pc.help.config.summary': {
    tr: 'Platformun ayarları: SMTP, yapay zeka sağlayıcısı ve birim maliyetler. Her satır kendi Kaydet düğmesiyle yazılır.',
    en: 'The platform\'s settings: SMTP, the AI provider and unit costs. Each row is written with its own Save button.'
  },
  'pc.help.config.field.key.label': { tr: 'Anahtar', en: 'Key' },
  'pc.help.config.field.key.desc': { tr: 'Yapılandırma anahtarının tam yolu.', en: 'The full path of the configuration key.' },
  'pc.help.config.field.value.label': { tr: 'Değer', en: 'Value' },
  'pc.help.config.field.value.desc': { tr: 'Kayıtlı değer. Boşsa varsa varsayılan geçer; gizli alanı boş bırakmak mevcut değeri korur.', en: 'The stored value. If blank, the default applies when there is one; leaving a secret field blank keeps the current value.' },
  'pc.help.config.field.isSecret.label': { tr: 'Gizli', en: 'Secret' },
  'pc.help.config.field.isSecret.desc': { tr: 'Gizli işaretli anahtarların değeri maskelenir; bağlantı dizesi, parola ve API anahtarları burada açık gösterilmez.', en: 'Values of keys marked secret are masked; connection strings, passwords and API keys are never shown in the clear here.' },
  'pc.help.config.field.updated.label': { tr: 'Güncelleme', en: 'Updated' },
  'pc.help.config.field.updated.desc': { tr: 'Değerin en son ne zaman kaydedildiği.', en: 'When the value was last saved.' },
  'pc.help.config.notes': {
    tr: 'Değişiklik yeniden başlatma gerektirmez, sonraki işlemde geçerli olur. Yeni anahtar buradan eklenmez: liste kodun okuduğu ayarlardan oluşur.',
    en: 'Changes need no restart and apply from the next operation. New keys are not added here: the list consists of the settings the code reads.'
  },

  // ══ FEATURE FLAG ══════════════════════════════════════════════════════════
  'pc.help.flags.title': { tr: 'Feature Flag\'ler', en: 'Feature Flags' },
  'pc.help.flags.summary': {
    tr: 'Kod dağıtımından bağımsız olarak özellik açıp kapatma. Bir özelliği herkese açabilir, kademeli yayabilir ya da tek bir tenant için ayrı davranış tanımlayabilirsiniz.',
    en: 'Turning features on and off independently of code deployment. You can enable a feature for everyone, roll it out gradually, or define different behaviour for a single tenant.'
  },
  'pc.help.flags.field.key.label': { tr: 'Anahtar', en: 'Key' },
  'pc.help.flags.field.key.desc': { tr: 'Flag\'in kod içinde sorgulandığı ad.', en: 'The name the flag is queried by in code.' },
  'pc.help.flags.field.state.label': { tr: 'Durum', en: 'State' },
  'pc.help.flags.field.state.desc': { tr: 'On (herkese açık), Off (herkese kapalı) veya Percentage (kademeli yayılım).', en: 'On (enabled for everyone), Off (disabled for everyone) or Percentage (gradual rollout).' },
  'pc.help.flags.field.percentage.label': { tr: 'Yüzde', en: 'Percentage' },
  'pc.help.flags.field.percentage.desc': { tr: 'Percentage durumunda özelliğin açık olacağı tenant oranı.', en: 'In Percentage state, the share of tenants for which the feature is on.' },
  'pc.help.flags.field.overrides.label': { tr: 'Override\'lar', en: 'Overrides' },
  'pc.help.flags.field.overrides.desc': { tr: 'Belirli tenant\'lar için genel durumu ezen kurallar. Çip üzerindeki × ile kaldırılır.', en: 'Rules that override the global state for specific tenants. Remove one with the × on its chip.' },
  'pc.help.flags.field.isStale.label': { tr: 'Ölü flag', en: 'Stale flag' },
  'pc.help.flags.field.isStale.desc': { tr: 'Uzun süredir durumu değişmemiş ve muhtemelen artık gereksiz olan flag. Temizlik için işaretlenir.', en: 'A flag whose state has not changed for a long time and is probably no longer needed. It is marked for cleanup.' },
  'pc.help.flags.rule.percentageRollout.label': { tr: 'Kademeli yayılım', en: 'Percentage rollout' },
  'pc.help.flags.rule.percentageRollout.desc': { tr: 'Yüzde, tenant kimliğinden türetilen kararlı bir dağılıma göre uygulanır: aynı tenant her seferinde aynı sonucu alır, yüzde artırılmadıkça özellik açılıp kapanmaz.', en: 'The percentage is applied via a stable distribution derived from the tenant id: the same tenant always gets the same answer, so the feature does not flicker on and off unless you change the percentage.' },
  'pc.help.flags.rule.overridePrecedence.label': { tr: 'Override önceliği', en: 'Override precedence' },
  'pc.help.flags.rule.overridePrecedence.desc': { tr: 'Tenant override\'ı genel durumu her zaman ezer — flag Off olsa bile override\'lı tenant için açık olabilir.', en: 'A tenant override always beats the global state — a tenant with an override can have the feature on even while the flag is Off.' },
  'pc.help.flags.rule.staleFlag.label': { tr: 'Flag temizliği', en: 'Flag cleanup' },
  'pc.help.flags.rule.staleFlag.desc': { tr: 'Kalıcı hâle gelmiş bir flag kod karmaşıklığı yaratır. Ölü işaretli flag\'ler koddan kaldırılıp buradan silinmelidir.', en: 'A flag that has become permanent adds code complexity. Flags marked stale should be removed from the code and deleted here.' },
  'pc.help.flags.notes': {
    tr: 'Flag durumu önbelleklenir; bir değişiklik tüm sunucularda anında geçerli olmayabilir. Kritik bir kapatma için değişikliği doğruladıktan sonra kısa bir süre bekleyin.',
    en: 'Flag state is cached, so a change may not take effect on every server instantly. For a critical kill-switch, verify the change and allow a short delay.'
  },

  // ══ INTEGRATION ═══════════════════════════════════════════════════════════
  'pc.help.integration.title': { tr: 'Entegrasyon', en: 'Integration' },
  'pc.help.integration.summary': {
    tr: 'Dış sistemlerle bağlantı: platform olaylarını dışarı ileten webhook\'lar ve dışarıdan erişim için API anahtarları.',
    en: 'Connections to external systems: webhooks that push platform events out, and API keys for inbound access.'
  },
  'pc.help.integration.field.webhookName.label': { tr: 'Webhook adı', en: 'Webhook name' },
  'pc.help.integration.field.webhookName.desc': { tr: 'Bağlantıyı tanımlayan serbest ad.', en: 'A free-form name identifying the connection.' },
  'pc.help.integration.field.url.label': { tr: 'URL', en: 'URL' },
  'pc.help.integration.field.url.desc': { tr: 'Olayların POST edileceği adres; HTTPS olmalıdır.', en: 'The address events are POSTed to; it must be HTTPS.' },
  'pc.help.integration.field.events.label': { tr: 'Olay tipleri', en: 'Event types' },
  'pc.help.integration.field.events.desc': { tr: 'Hangi olayların gönderileceği. Boş bırakılırsa tümü gönderilir ve listede `*` görünür.', en: 'Which events are sent. Leaving it empty sends all of them and shows `*` in the list.' },
  'pc.help.integration.field.failureCount.label': { tr: 'Hata sayısı', en: 'Failure count' },
  'pc.help.integration.field.failureCount.desc': { tr: 'Arka arkaya başarısız teslim sayısı. Yükseldiğinde hedef adresin erişilebilirliği kontrol edilmelidir.', en: 'Number of consecutive failed deliveries. When it climbs, check whether the target address is reachable.' },
  'pc.help.integration.field.deliveries.label': { tr: 'Teslimatlar', en: 'Deliveries' },
  'pc.help.integration.field.deliveries.desc': { tr: 'Gönderim geçmişi: olay, durum, kaçıncı deneme, dönen HTTP kodu ve zaman.', en: 'Delivery history: event, status, attempt number, returned HTTP code and timestamp.' },
  'pc.help.integration.field.apiKeys.label': { tr: 'API anahtarları', en: 'API keys' },
  'pc.help.integration.field.apiKeys.desc': { tr: 'Dış sistemlerin platforma erişmesi için üretilen anahtarlar. Listede yalnız öneki görünür.', en: 'Keys minted for external systems to access the platform. Only the prefix is shown in the list.' },
  'pc.help.integration.field.secretOnce.label': { tr: 'Gizli değer', en: 'Secret value' },
  'pc.help.integration.field.secretOnce.desc': { tr: 'Anahtarın tam değeri yalnız oluşturulduğu anda gösterilir ve bir daha görüntülenemez.', en: 'The key\'s full value is shown only at creation and can never be retrieved again.' },
  'pc.help.integration.rule.eventFilter.label': { tr: 'Olay filtresi', en: 'Event filter' },
  'pc.help.integration.rule.eventFilter.desc': { tr: 'Filtre virgülle ayrılmış olay tipi listesidir. Dar tutmak hem trafiği hem de hedef sistemdeki gürültüyü azaltır.', en: 'The filter is a comma-separated list of event types. Keeping it narrow reduces both traffic and noise in the target system.' },
  'pc.help.integration.rule.autoDisable.label': { tr: 'Teslim hataları', en: 'Delivery failures' },
  'pc.help.integration.rule.autoDisable.desc': { tr: 'Başarısız teslimler yeniden denenir ve sayaç artar. Kalıcı olarak erişilemeyen bir webhook elle devre dışı bırakılmalıdır.', en: 'Failed deliveries are retried and the counter climbs. A webhook that is permanently unreachable should be disabled manually.' },
  'pc.help.integration.rule.secretShownOnce.label': { tr: 'Tek gösterim', en: 'Shown once' },
  'pc.help.integration.rule.secretShownOnce.desc': { tr: 'Anahtarın gizli değeri sunucuda yalnız özet olarak saklanır; kaybedilirse kurtarılamaz, iptal edilip yenisi üretilir.', en: 'Only a hash of the secret is stored server-side; if lost it cannot be recovered — revoke it and mint a new one.' },
  'pc.help.integration.notes': {
    tr: 'API anahtarı iptal edilince o anahtarla yapılan çağrılar anında reddedilir. İptalden önce anahtarı kullanan sistemlerin güncellendiğinden emin olun.',
    en: 'Revoking an API key rejects calls using it immediately. Make sure the systems using the key have been updated before you revoke it.'
  },

  // ══ ANNOUNCEMENTS ═════════════════════════════════════════════════════════
  'pc.help.announcements.title': { tr: 'Duyurular', en: 'Announcements' },
  'pc.help.announcements.summary': {
    tr: 'Tüm tenant kullanıcılarına gösterilecek platform duyuruları: planlı bakım, devam eden arıza veya bilgilendirme. Duyuru oluşturmak onu yayınlamaz — yayınlama ayrı bir adımdır.',
    en: 'Platform-wide announcements shown to all tenant users: planned maintenance, an ongoing incident, or general information. Creating an announcement does not publish it — publishing is a separate step.'
  },
  'pc.help.announcements.field.severity.label': { tr: 'Önem', en: 'Severity' },
  'pc.help.announcements.field.severity.desc': { tr: 'Info, Maintenance veya Incident. Duyurunun kullanıcı arayüzünde hangi renk ve vurguyla görüneceğini belirler.', en: 'Info, Maintenance or Incident. It determines the colour and emphasis the announcement gets in the user interface.' },
  'pc.help.announcements.field.title.label': { tr: 'Başlık', en: 'Title' },
  'pc.help.announcements.field.title.desc': { tr: 'Kısa özet — kullanıcının ilk gördüğü satır budur. Zorunludur.', en: 'A short summary — this is the first line the user sees. It is required.' },
  'pc.help.announcements.field.body.label': { tr: 'İçerik', en: 'Body' },
  'pc.help.announcements.field.body.desc': { tr: 'Ayrıntılı açıklama. Bakım duyurularında pencerenin başlangıç ve bitiş saatini burada belirtin.', en: 'The detailed description. For maintenance announcements, state the window\'s start and end time here.' },
  'pc.help.announcements.field.status.label': { tr: 'Durum', en: 'Status' },
  'pc.help.announcements.field.status.desc': { tr: 'Taslak (yalnız burada görünür), Yayında (kullanıcılara gösteriliyor) veya Süresi doldu (sonlandırılmış, artık gösterilmiyor).', en: 'Draft (visible only here), Published (shown to users) or Expired (ended, no longer shown).' },
  'pc.help.announcements.field.created.label': { tr: 'Oluşturma', en: 'Created' },
  'pc.help.announcements.field.created.desc': { tr: 'Duyurunun yazıldığı an — yayınlandığı an değil.', en: 'When the announcement was written — not when it was published.' },
  'pc.help.announcements.field.servers.label': { tr: 'DB sunucuları', en: 'DB servers' },
  'pc.help.announcements.field.servers.desc': { tr: 'Sayfanın alt bölümündeki ayrı tablo: tenant veritabanlarının dağıtıldığı sunucular, bölgeleri ve doluluk oranları (`mevcut / azami`).', en: 'The separate table at the bottom of the page: the servers tenant databases are distributed across, their regions and occupancy (`current / max`).' },
  'pc.help.announcements.rule.severityMeaning.label': { tr: 'Önem seçimi', en: 'Choosing severity' },
  'pc.help.announcements.rule.severityMeaning.desc': { tr: 'Info genel bilgilendirme, Maintenance planlı ve önceden duyurulan kesinti, Incident ise devam eden beklenmedik bir arıza içindir.', en: 'Info is for general information, Maintenance for planned and pre-announced downtime, and Incident for an ongoing unexpected failure.' },
  'pc.help.announcements.rule.publishFlow.label': { tr: 'Yayınlama', en: 'Publishing' },
  'pc.help.announcements.rule.publishFlow.desc': { tr: 'Yeni duyuru Draft olarak oluşur ve kimseye görünmez. Kullanıcılara ulaşması için "Yayınla" demek gerekir — böylece duyuru hazırlanıp gözden geçirilebilir.', en: 'A new announcement is created as a Draft and is visible to no one. It reaches users only when you click "Publish" — which lets you draft and review it first.' },
  'pc.help.announcements.rule.expire.label': { tr: 'Sonlandırma', en: 'Expiring' },
  'pc.help.announcements.rule.expire.desc': { tr: '"Sonlandır" duyuruyu kullanıcı arayüzünden kaldırır. Kayıt silinmez, Expired olarak listede kalır ve geçmiş kaydı korunur.', en: '"Expire" removes the announcement from the user interface. The record is not deleted; it stays in the list as Expired, preserving the history.' },
  'pc.help.announcements.rule.serversPanel.label': { tr: 'Sunucu paneli', en: 'Server panel' },
  'pc.help.announcements.rule.serversPanel.desc': { tr: 'Alttaki DB sunucu tablosu duyurularla ilgili değildir; çok bölgeli dağıtım altyapısının envanteridir ve şimdilik yalnız görüntülenir.', en: 'The DB server table at the bottom is unrelated to announcements; it is the inventory of the multi-region deployment infrastructure and is display-only for now.' },
  'pc.help.announcements.notes': {
    tr: 'Yayınlanan duyuru tüm tenant\'lardaki tüm kullanıcılara gösterilir — tek bir müşteriye özel duyuru yapılamaz. Metni buna göre yazın.',
    en: 'A published announcement is shown to every user in every tenant — there is no way to target a single customer. Write the text accordingly.'
  }
};
