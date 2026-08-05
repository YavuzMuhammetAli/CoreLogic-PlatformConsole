# CoreLogic Platform Console — Kullanım ve Test Rehberi

> Port **4300**'de çalışan control plane (PYS) yönetim arayüzü.
> Bu doküman koddan ve canlı veritabanından çıkarıldı — 2026-07-26 tarihli duruma göre.

---

## 1. Bu uygulama ne?

CoreLogic'in **iki ayrı arayüzü** var ve birbirine karıştırılmamalı:

| | Tenant UI | **Platform Console (bu)** |
|---|---|---|
| Yol | `C:\CoreLogic\CoreLogicUI` | `C:\CoreLogic\CoreLogicPlatformConsole` |
| Port | 4200 | **4300** |
| Kime hitap eder | Müşteri kullanıcıları | Platform personeli (siz) |
| Ne yapar | Dinamik model/rapor/dashboard | Tenant yönetimi, faturalama, güvenlik, operasyon |
| API tabanı | `https://localhost:7254` | `https://localhost:7254/api/platform/v1` |
| Auth | JWT (`corelogic.client`) | Ayrı JWT (`corelogic.platform`) + **zorunlu MFA** |

İki token birbirinin alanında **kriptografik olarak geçersizdir** — ayrı imza anahtarı ve ayrı audience kullanılır. Tenant token'ıyla platform ucuna gidemezsiniz.

---

## 2. Çalıştırma

### Ön koşullar

| Bileşen | Nasıl başlatılır | Beklenen |
|---|---|---|
| SQL Server | — | `localhost` üzerinde `CoreLogicMaster`, `CoreLogicTelemetry`, `CoreLogic_test` DB'leri |
| Backend | Visual Studio'dan **F5** (`CoreLogic.sln` → `WebAPI`) | `https://localhost:7254` + `http://localhost:5245` |
| Console | `cd C:\CoreLogic\CoreLogicPlatformConsole && npm start` | `http://localhost:4300` |

> ⚠️ **Backend'i `WebAPI.exe`'yi çift tıklayarak başlatmayın.** O zaman `launchSettings.json` devreye girmez ve uygulama **5000** portuna düşer; console 7254'e baktığı için hiçbir şey çalışmaz. Visual Studio'dan başlatın.

### Giriş bilgileri

```
E-posta : owner@corelogic.local
Parola  : ChangeMe_Platform!123
```

Bunlar `CreateDLL\appsettings.json` → `PlatformBootstrap` bölümünden gelir ve ilk açılışta `PlatformIdentitySeeder` tarafından oluşturulur. **Veritabanındaki tek platform kullanıcısı budur** — "admin" diye bir hesap yoktur.

### MFA adımı

Giriş üç adımlıdır: **parola → MFA**. Geliştirme ortamında TOTP doğrulaması atlanmıştır:

```
Doğrulama kodu: 000000   (herhangi bir 6 hane olur)
```

Bunu sağlayan bayrak `CreateDLL\appsettings.Development.json` içinde:

```json
"PlatformDev": { "MfaBypass": true }
```

- Bayrak `Program.cs`'te `IsDevelopment()` ile AND'lenir → **prod'da hiçbir koşulda çalışmaz.**
- Açıkken backend başlangıç log'una `GELİŞTİRME: Platform MFA kod doğrulaması DEVRE DIŞI` satırı düşer. Bu satırı görmüyorsanız bayrak okunmamıştır.
- Her kullanımda `PlatformAuditLog`'a `security.mfa.bypass.dev` / `Critical` kaydı yazılır.
- Gerçek MFA'yı test etmek isterseniz bayrağı `false` yapın; `MfaEnrollment` tablosundaki base32 sırrı bir authenticator uygulamasına ekleyip gerçek kodu kullanın.

---

## 3. Oturum modeli (hata ayıklarken bilmeniz gerekenler)

- **Access token bellekte tutulur**, `localStorage`'a yazılmaz (XSS'te sızmasın). Ömrü **15 dakika**.
- **Refresh token** `localStorage` → `pc_refresh` anahtarında. Ömrü 30 gün.
- Sayfayı yenilediğinizde access token uçar; `APP_INITIALIZER` refresh token ile sessizce yeni oturum alır.
- 401 gelirse `error.interceptor` önce refresh dener; o da başarısızsa oturumu temizleyip `/login?reason=session_expired`'a atar.
- 403 gelirse (yetki yok) `/overview`'a geri atar — oturum geçerli sayılır.
- Refresh token **rotasyonludur**: her kullanımda eskisi iptal edilir. İptal edilmiş bir token yeniden kullanılırsa backend çalıntı sayar ve **kullanıcının tüm oturumlarını kapatır**.

**Takıldığınızda:** DevTools → Application → Local Storage → `pc_refresh` anahtarını silip sayfayı yenileyin.

---

## 4. Yetki modeli

Menü ve route'lar **capability** bazlıdır (rol bazlı değil). 14 capability var, roller bunların paketidir.

Veritabanındaki 6 sistem rolü: `PlatformOwner`, `PlatformAdmin`, `Operator`, `SupportEngineer`, `SecurityAuditor`, `BillingAdmin`.

`owner@corelogic.local` → **PlatformOwner** → **14 capability'nin hepsi**. Yani test ederken hiçbir sayfa yetki nedeniyle kapalı olmayacak.

| Capability | Neyi açar |
|---|---|
| `Platform.Tenants.Read/Write/Purge` | Tenants menüsü ve tenant aksiyonları |
| `Platform.Users.Read`, `Platform.Iam.Manage` | Access menüsü |
| `Platform.Impersonation.Request/Approve` | Impersonation sayfası |
| `Platform.Security.Read/Manage` | Security menüsü |
| `Platform.Ops.Read/Manage` | Operations + Observability menüleri |
| `Platform.Billing.Read/Write` | Billing menüsü |
| `Platform.Config.Manage` | Settings menüsü |

Sol menüde bir başlık **görünmüyorsa** capability yoktur; URL'yi elle yazarsanız `capabilityGuard` sizi `/login`'e atar.

---

## 5. Navigasyon

Sol menüde **8 üst başlık** var. Alt sayfalara sol menüden gidilmez — üst başlığa tıklayınca varsayılan alt sayfa açılır, **sayfanın kendi içindeki sekme şeridinden** kardeş sayfalara geçilir.

```
Overview          → /overview
Tenants           → /tenants                    → /tenants/:code
Access            → /access/platform-users      | impersonation
Security          → /security/audit-logs        | center | compliance
Operations        → /operations/jobs            | health | alerts | notifications | registry | migrations
Observability     → /observability/api          | performance
Billing           → /billing/plans              | subscriptions | usage | cost
Settings          → /settings/config            | flags | integration | announcements
```

Toplam **24 sayfa**. Hepsi lazy-load edilir.

---

## 6. Veri nereden geliyor?

Üç ayrı veritabanı var:

| DB | İçerik | Hangi sayfalar |
|---|---|---|
| **CoreLogicMaster** | Platform kontrol düzlemi — tenant dizini, kullanıcılar, roller, faturalama, uyarılar, audit | Çoğu sayfa |
| **CoreLogicTelemetry** | İstek izleri ve saatlik rollup'lar | Overview, Observability |
| **CoreLogic_test** | Tenant'ın kendi verisi | Console doğrudan okumaz |

Akış her sayfada aynı:

```
Angular component
  → domains/<alan>/<ad>.service.ts
    → https://localhost:7254/api/platform/v1/<kaynak>
      → CreateDLL/Controllers/Platform/<X>Controller.cs
        → Business/Platform/Concrete/<X>Manager.cs
          → DataAccess EF DAL → CoreLogicMaster / CoreLogicTelemetry
```

Tüm yanıtlar `{ success, message, data }` zarfındadır (`ResponseModel` / `ListResponseModel<T>` / `DataResponseModel<T>`). Sayfalı uçlar `data.items` + `data.total` döner.

Her istek üç interceptor'dan geçer: `correlation` (izleme kimliği), `platformAuth` (Bearer başlığı), `error` (401/403 yönetimi).

---

## 7. Sayfa sayfa referans

**Veri sütunu:** ✅ dolu · ⚠️ kısmen dolu · ⭕ boş (arayüz boş-durum gösterir)

### Overview — `/overview`

| | |
|---|---|
| Ne yapar | Golden signals (istek, hata oranı, en kötü p95), sağlık ağacı özeti, açık uyarılar |
| Endpoint | `GET /health/tree` + `GET /alerts?status=open` + `GET /telemetry/metrics?hours=24` |
| Kaynak | Health canlı hesaplanır (tablo değil); Alert → `Alert`; metrikler → `RequestRollupHourly` |
| Veri | ✅ 94 rollup satırı, 5 uyarı kuralı |

Üç kaynağı `forkJoin` ile paralel çeker; biri düşerse diğerleri gösterilmeye devam eder.

---

### Tenants — `/tenants`, `/tenants/:code`

| | |
|---|---|
| Ne yapar | Tenant dizini (sayfalı); detayda özet, durum geçmişi, entitlement, yedekler |
| Endpoint | `GET /tenants`, `GET /tenants/{code}`, `GET /tenants/{code}/state-history`, `GET /subscriptions/entitlement`, `GET /backups` |
| Aksiyonlar | `suspend` · `resume` · `archive` · `unarchive` · `schedule-purge` · `cancel-purge` (hepsi POST, gerekçe ister) · yedek al · yedek doğrula |
| Kaynak | `Company` + `Tenant` + `TenantStateHistory` + `TenantBackup` |
| Veri | ⚠️ 1 tenant var: **`test`** (Test şirketi, DB `CoreLogic_test`). Durum geçmişi ve yedekler ⭕ boş |

**Test için:** `/tenants` → `test` satırına tıklayın. Suspend edip sonra Resume ederseniz `TenantStateHistory` dolar ve geçmiş sekmesi anlam kazanır. Purge aksiyonu geri alınamaz sonuçlar doğurabilir — `schedule-purge` sonrası mutlaka `cancel-purge` deneyin.

---

### Access → Platform Users — `/access/platform-users`

| | |
|---|---|
| Ne yapar | Platform personeli listesi; rol ve MFA kayıt durumu |
| Endpoint | `GET /platform-users` |
| Kaynak | `PlatformUser` + `PlatformUserRole` + `MfaEnrollment` |
| Veri | ⚠️ Tek kullanıcı: `owner@corelogic.local`, rol `PlatformOwner`, MFA sütunu **Kayıtlı** |

---

### Access → Impersonation — `/access/impersonation`

| | |
|---|---|
| Ne yapar | Bir tenant kullanıcısı adına oturum açma talebi — dört gözle onay akışı |
| Endpoint | `GET /impersonation`, `POST /request`, `POST /{id}/approve`, `/deny`, `/issue`, `/revoke` |
| Kaynak | `ImpersonationGrant` |
| Veri | ⭕ Boş |

**Test için:** Talep oluşturun → onaylayın → token üretin → iptal edin. Tek kullanıcı olduğu için talep eden ve onaylayan aynı kişi olacak; backend buna izin veriyorsa akış tamamlanır, vermiyorsa bu bir bulgudur.

---

### Security → Audit Logs — `/security/audit-logs`

| | |
|---|---|
| Ne yapar | Platform denetim kayıtları — kim, ne zaman, ne yaptı. Kategori/aksiyon/tarih filtreli, sayfalı |
| Endpoint | `GET /audit-logs` |
| Kaynak | `PlatformAuditLog` |
| Veri | ✅ 10 kayıt |

**Test için:** En güvenilir sayfa — her giriş yaptığınızda yeni satır ekleniyor. `security.mfa.bypass.dev` / `Critical` kayıtlarını burada görmelisiniz. Kategori filtresinde `Identity` ve `Security` dolu.

---

### Security → Security Center — `/security/center`

| | |
|---|---|
| Ne yapar | Giriş denemeleri, güvenlik olayları, IP erişim kuralları |
| Endpoint | `GET /security/login-attempts`, `/events`, `/ip-rules`; `POST /events/{id}/review`, `POST /ip-rules`, `DELETE /ip-rules/{id}` |
| Kaynak | `LoginAttempt` · `SecurityEvent` · `IpAccessRule` |
| Veri | ⚠️ Giriş denemeleri ✅ 14 kayıt; olaylar ⭕ boş; IP kuralları ⭕ boş |

**Test için:** Kasten yanlış parolayla birkaç kez giriş deneyin — `LoginAttempt` büyür. **Dikkat:** 5 başarısız denemede hesap 15 dakika kilitlenir (`MaxFailedLogins=5`, `LockMinutes=15`). Kilitlenirseniz `PlatformUser` tablosunda `LockedUntil = NULL, FailedLoginCount = 0` yapın.

IP kuralı eklerken kendi adresinizi (`::1` / `127.0.0.1`) **engellemeyin** — kendinizi dışarıda bırakırsınız.

---

### Security → Compliance — `/security/compliance`

| | |
|---|---|
| Ne yapar | KVKK/GDPR veri talepleri (erişim, silme) ve durum ilerletme |
| Endpoint | `GET /compliance`, `POST /compliance`, `POST /{id}/advance` |
| Kaynak | `ComplianceRequest` |
| Veri | ⭕ Boş |

**Test için:** Yeni talep oluşturup `advance` ile durumları sırayla ilerletin.

---

### Operations → Jobs — `/operations/jobs`

| | |
|---|---|
| Ne yapar | Dayanıklı arka plan işleri ve çalışma geçmişi (sayfalı, duruma göre filtreli) |
| Endpoint | `GET /jobs` |
| Kaynak | `PlatformJob` + `PlatformJobRun` |
| Veri | ⚠️ 1 iş: `tenant.provision`, durum **Succeeded** |

**Test için:** Yeni tenant provision ederseniz burada yeni iş belirir. Salt-okur bir sayfadır.

---

### Operations → Health — `/operations/health`

| | |
|---|---|
| Ne yapar | Bileşen bazlı sağlık ağacı (DB'ler, worker'lar, outbox) |
| Endpoint | `GET /health/tree` |
| Kaynak | **Tablo yok** — her istekte canlı hesaplanır |
| Veri | ✅ Her zaman dolu |

**Test için:** SQL Server'ı durdurup sayfayı yenileyin; bileşenler `Unhealthy`'ye dönmeli. (Sonra geri açmayı unutmayın.)

---

### Operations → Alerts — `/operations/alerts`

| | |
|---|---|
| Ne yapar | Tetiklenmiş uyarılar + uyarı kuralları |
| Endpoint | `GET /alerts`, `GET /alerts/rules`, `POST /{id}/ack`, `/resolve`, `POST /rules/{id}/toggle` |
| Kaynak | `Alert` + `AlertRule` |
| Veri | ✅ 5 kural (hepsi etkin), 2 uyarı (ikisi de **Resolved**) |

Seed kurallar: API hata oranı yüksek (Critical), API p95 gecikme yüksek, Park edilmiş iş var, Outbox park edilmiş olay, Sağlıksız tenant var.

**Test için:** Açık uyarı olmadığı için ack/resolve butonlarını denemek zor. Bir kuralın eşiğini düşürüp trafik üretirseniz yeni uyarı tetiklenebilir. Kural aç/kapa (`toggle`) hemen denenebilir.

---

### Operations → Notifications — `/operations/notifications`

| | |
|---|---|
| Ne yapar | Platform bildirimleri, okundu işaretleme, bildirim kuralları |
| Endpoint | `GET /notifications`, `/unread-count`, `POST /{id}/read`, `/read-all`, `GET /rules`, `POST /rules`, `/rules/{id}/toggle` |
| Kaynak | `Notification` + `NotificationRule` |
| Veri | ✅ 2 bildirim, 1 kural |

**Test için:** Okundu işaretleyin, okunmamış sayacının düştüğünü doğrulayın, `read-all` deneyin.

---

### Operations → Model Registry — `/operations/registry`

| | |
|---|---|
| Ne yapar | Tenant'lardaki dinamik model envanteri ve sürüm sapması (drift) |
| Endpoint | `GET /registry/models`, `GET /registry/drift` |
| Kaynak | `TenantModelSummary` |
| Veri | ⭕ Boş — tablo hiç doldurulmamış |

**Test için:** Tenant UI'da (4200) model yayınlayıp bu tablonun dolup dolmadığına bakın. Dolmazsa besleyen mekanizma çalışmıyordur — bu rapora değer bir bulgudur.

---

### Operations → Migrations — `/operations/migrations`

| | |
|---|---|
| Ne yapar | Tenant DB şema migration çalışmaları ve adım adım sonuçları |
| Endpoint | `GET /migrations/runs`, `GET /runs/{id}`, `POST /runs` |
| Kaynak | `MigrationRun` + `MigrationRunItem` |
| Veri | ⭕ Boş |

---

### Observability → API Monitor — `/observability/api`

| | |
|---|---|
| Ne yapar | Ham istek izleri — yol, durum kodu, süre, tenant, correlation id |
| Endpoint | `GET /telemetry/requests` |
| Kaynak | `CoreLogicTelemetry.RequestTrace` |
| Veri | ✅ 287 iz |

**Test için:** En canlı sayfa. Console'da gezinip bu sayfayı yenileyin — kendi isteklerinizi listede görürsünüz. Correlation id ile audit kayıtlarını eşleştirebilirsiniz.

---

### Observability → Performance — `/observability/performance`

| | |
|---|---|
| Ne yapar | Route bazlı toplu metrikler — istek sayısı, hata sayısı, p95 |
| Endpoint | `GET /telemetry/metrics?hours=N` |
| Kaynak | `CoreLogicTelemetry.RequestRollupHourly` |
| Veri | ✅ 94 saatlik rollup |

Rollup'lar bir arka plan worker'ı tarafından üretilir — yeni trafik anında değil, rollup periyodundan sonra yansır.

---

### Billing → Plans — `/billing/plans`

| | |
|---|---|
| Ne yapar | Plan kataloğu ve plan başına özellik limitleri |
| Endpoint | `GET /plans`, `POST /plans`, `POST /plans/{id}/status` |
| Kaynak | `Plan` + `PlanFeature` |
| Veri | ✅ 3 plan: **free**, **pro**, **enterprise** (hepsi Active) · 18 özellik satırı |

---

### Billing → Subscriptions — `/billing/subscriptions`

| | |
|---|---|
| Ne yapar | Tenant abonelikleri; ödeme kaydı, iptal, deneme uzatma |
| Endpoint | `GET /subscriptions`, `POST /subscriptions`, `POST /{id}/record-payment`, `/cancel`, `/extend-trial` |
| Kaynak | `Subscription` |
| Veri | ⚠️ 1 abonelik (plan `free`, durum Active) |

**Test için:** Deneme uzatma ve ödeme kaydı en güvenli aksiyonlar. İptal ederseniz tenant'ın entitlement'ı değişir — tenant detay sayfasından etkisini doğrulayabilirsiniz.

---

### Billing → Usage — `/billing/usage`

| | |
|---|---|
| Ne yapar | Ölçülen kullanım (istek, depolama vb.) ve limite yakınlık |
| Endpoint | `GET /subscriptions/entitlement` + usage uçları |
| Kaynak | `UsageRecord` |
| Veri | ⭕ Boş |

---

### Billing → Cost — `/billing/cost`

| | |
|---|---|
| Ne yapar | Tenant başına maliyet dağılımı |
| Endpoint | `GET /cost/by-tenant` |
| Kaynak | `UsageRecord` üzerinden hesaplanır |
| Veri | ⭕ Boş (kullanım verisi olmadığı için sıfırlar) |

---

### Settings → Config — `/settings/config`

| | |
|---|---|
| Ne yapar | Platform yapılandırma anahtarları (salt-okur) |
| Endpoint | `GET /config` |
| Kaynak | `PlatformConfig` |
| Veri | ⭕ Boş |

---

### Settings → Feature Flags — `/settings/flags`

| | |
|---|---|
| Ne yapar | Özellik bayrakları, yüzdelik açılım, tenant bazlı override |
| Endpoint | `GET /feature-flags`, `POST`, `PATCH /{key}`, `PUT` (override), `DELETE` |
| Kaynak | `FeatureFlag` + `FeatureFlagOverride` |
| Veri | ⚠️ 1 bayrak: **`feature_reports`** (varsayılan **On**) · override ⭕ boş |

**Test için:** En iyi CRUD test sayfası. Yeni bayrak ekleyin, yüzdeliği değiştirin, `test` tenant'ı için override tanımlayıp silin.

---

### Settings → Integration — `/settings/integration`

| | |
|---|---|
| Ne yapar | Webhook tanımları, teslimat geçmişi, API anahtarları |
| Endpoint | `GET/POST /integration/webhooks`, `POST /{id}/toggle`, `DELETE`, `GET /deliveries`, `GET/POST /api-keys`, `POST /{id}/revoke` |
| Kaynak | `Webhook` + `WebhookDelivery` + `ApiKey` |
| Veri | ⭕ Hepsi boş |

**Test için:** Webhook ve API anahtarı oluşturma akışları test edilebilir. **Not:** Webhook secret'ı ve API anahtarının ham değeri **yalnızca oluşturma yanıtında bir kez** döner — kaçırırsanız yenisini üretmeniz gerekir.

---

### Settings → Announcements — `/settings/announcements`

| | |
|---|---|
| Ne yapar | Tenant'lara duyuru yayınlama; ayrıca veritabanı sunucu listesi |
| Endpoint | `GET/POST /announcements`, `POST /{id}/publish`, `/{id}/expire`, `GET /announcements/servers` |
| Kaynak | `Announcement` + `DatabaseServer` |
| Veri | ⭕ Duyuru boş · ⚠️ 1 veritabanı sunucusu kayıtlı |

**Test için:** Duyuru oluştur → yayınla → süresini doldur. Tam bir yaşam döngüsü testi.

---

## 8. Test önceliği

Mevcut veri durumuna göre önerilen sıra:

**Hemen anlamlı sonuç verenler (veri dolu):**
1. Audit Logs — her girişte büyüyor, filtreleri denemek kolay
2. API Monitor — kendi isteklerinizi canlı görürsünüz
3. Overview — üç kaynağı birden doğrular
4. Alerts — 5 kural, toggle denenebilir
5. Plans / Subscriptions — 3 plan, 1 abonelik
6. Platform Users — tek kullanıcı ama sayfa çalışır
7. Performance — 94 rollup

**Veri üreterek test edilecekler (şu an boş):**
8. Feature Flags — CRUD için en uygun sayfa
9. Announcements — tam yaşam döngüsü
10. Integration — webhook + API anahtarı oluşturma
11. Compliance — talep oluştur → ilerlet
12. Impersonation — talep → onay → token
13. Tenants — suspend/resume ile durum geçmişi oluşturma

**Muhtemelen eksik altyapı (boş kalması bulgu olabilir):**
14. Model Registry — tenant model yayınlansa da dolmuyorsa besleyici çalışmıyor
15. Usage / Cost — kullanım ölçümü hiç kayıt üretmemiş
16. Platform Config — hiç anahtar tanımlanmamış
17. Migrations — hiç migration çalışması yok

---

## 9. Tuzaklar ve bilinen sorunlar

**Hesap kilidi.** 5 başarısız parola denemesi → 15 dakika kilit. Açmak için:
```sql
UPDATE PlatformUser SET LockedUntil = NULL, FailedLoginCount = 0 WHERE Email = 'owner@corelogic.local';
```

**MFA challenge süresi.** Parola ile kod arasında sınırlı süre var. Development'ta 30 dakikaya çekildi (`appsettings.Development.json` → `PlatformTokenOptions:ChallengeTokenExpiration`); prod değeri 2 dakikadır. Süre dolarsa baştan giriş yapın — MFA sırrı aynı kalır.

**Yanlış port.** Backend 5000'de açılmışsa console hiçbir veri çekemez, tüm sayfalar boş/hatalı görünür. Backend log'unda `Now listening on: https://localhost:7254` satırını doğrulayın.

**Bağlantı dizesi tutarsızlığı.** `appsettings.json` içinde `Server=localhost`, `appsettings.Development.json` içinde `CoreLogic` için `Server=.\SQLEXPRESS` yazıyor. İkisi farklı SQL örneğine işaret ediyorsa tenant verisi ile platform verisi ayrı yerlerden okunur. Test öncesi hizalayın.

**Düzeltilmiş hata (2026-07-26).** Login ekranındaki MFA ve enroll formlarında `[formGroup]` eksikti; `(ngSubmit)` hiç tetiklenmiyor, tarayıcı native form submit yapıp sayfayı yeniliyordu — kod girildiğinde kullanıcı login ekranına atılmış gibi görünüyordu. `codeForm` FormGroup'u eklenerek düzeltildi, ayrıca 6 haneden kısa kod için görünür hata mesajı eklendi. Eski bir sürüme dönerseniz bu davranış geri gelir.

**QR kod yok.** Backend enroll yanıtında `otpAuthUri` gönderiyor (`otpauth://totp/CoreLogic:...`) ve alan frontend modelinde de tanımlı, ancak login ekranı bunu hiç kullanmıyor — yalnızca base32 sır düz metin basılıyor. Gerçek MFA kurulumu yapılacaksa buraya QR eklenmesi gerekir.

---

## 10. Hızlı referans — endpoint haritası

Taban: `https://localhost:7254/api/platform/v1`

| Kaynak | Controller | Ana tablo(lar) |
|---|---|---|
| `/auth/*` | PlatformAuthController | PlatformUser, MfaEnrollment, PlatformSession |
| `/tenants/*` | TenantsController | Company, Tenant, TenantStateHistory |
| `/platform-users` | PlatformUsersController | PlatformUser, PlatformUserRole |
| `/impersonation/*` | ImpersonationController | ImpersonationGrant |
| `/audit-logs` | AuditLogController | PlatformAuditLog |
| `/security/*` | SecurityController | LoginAttempt, SecurityEvent, IpAccessRule |
| `/compliance/*` | ComplianceController | ComplianceRequest |
| `/jobs` | JobsController | PlatformJob, PlatformJobRun |
| `/health/tree` | HealthController | — (canlı hesaplanır) |
| `/alerts/*` | AlertController | Alert, AlertRule |
| `/notifications/*` | NotificationController | Notification, NotificationRule |
| `/registry/*` | RegistryController | TenantModelSummary |
| `/migrations/*` | MigrationController | MigrationRun, MigrationRunItem |
| `/telemetry/*` | TelemetryController | RequestTrace, RequestRollupHourly *(telemetri DB)* |
| `/plans/*` | PlansController | Plan, PlanFeature |
| `/subscriptions/*` | SubscriptionsController | Subscription |
| `/usage/*` | UsageController | UsageRecord |
| `/cost/by-tenant` | CostController | UsageRecord *(hesaplanır)* |
| `/config` | ConfigController | PlatformConfig |
| `/feature-flags/*` | FeatureFlagsController | FeatureFlag, FeatureFlagOverride |
| `/integration/*` | IntegrationController | Webhook, WebhookDelivery, ApiKey |
| `/announcements/*` | AnnouncementController | Announcement, DatabaseServer |
| `/backups/*` | BackupController | TenantBackup |

Swagger: `http://localhost:5245/swagger` (yalnızca Development).
