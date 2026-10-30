import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IntegrationService, deliveryTone } from './integration.service';
import { WebhookItem, WebhookDeliveryItem, ApiKeyItem } from '../../core/models/integration.models';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';
import { HelpButtonComponent } from '../../shared/ui/page-help/help-button.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';

type Tab = 'webhooks' | 'apikeys';

/** Integration Center (M40) — webhook + teslimatlar + API key yönetimi. */
@Component({
    selector: 'app-integration',
    imports: [DatePipe, FormsModule, RouterLink, RouterLinkActive, StatusBadgeComponent, HelpButtonComponent, TranslatePipe, IconComponent],
    templateUrl: './integration.component.html',
    styleUrl: './integration.component.scss'
})
export class IntegrationComponent implements OnInit {
  private readonly service = inject(IntegrationService);
  private readonly language = inject(LanguageService);

  readonly tab = signal<Tab>('webhooks');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly webhooks = signal<WebhookItem[]>([]);
  readonly deliveries = signal<WebhookDeliveryItem[]>([]);
  readonly apiKeys = signal<ApiKeyItem[]>([]);
  readonly busyId = signal<number | null>(null);
  readonly secretOnce = signal<string | null>(null);
  readonly selectedWebhook = signal<number | null>(null);

  readonly delTone = deliveryTone;

  whForm = { name: '', url: '', eventTypes: '' };
  keyForm = { name: '', scopes: '' };

  ngOnInit(): void { this.loadWebhooks(); }

  /** Teslimat tablosu için — olay tipi sunucudan ham gelir (ör. TenantSuspended). */
  enumLabel(value: string): string {
    return this.language.enumLabel(value);
  }

  selectTab(t: Tab): void { this.tab.set(t); this.secretOnce.set(null); t === 'webhooks' ? this.loadWebhooks() : this.loadApiKeys(); }

  loadWebhooks(): void {
    this.loading.set(true); this.error.set(null);
    this.service.webhooks().subscribe({
      next: r => { this.loading.set(false); if (r.success) this.webhooks.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  loadApiKeys(): void {
    this.loading.set(true); this.error.set(null);
    this.service.apiKeys().subscribe({
      next: r => { this.loading.set(false); if (r.success) this.apiKeys.set(r.data ?? []); else this.error.set(r.message); },
      error: e => { this.loading.set(false); this.error.set(e?.error?.message ?? 'Yüklenemedi'); }
    });
  }

  createWebhook(): void {
    if (!this.whForm.name || !this.whForm.url) return;
    this.busyId.set(-1);
    this.service.createWebhook({ ...this.whForm }).subscribe({
      next: r => {
        this.busyId.set(null);
        if (r.success) { this.secretOnce.set('Webhook secret: ' + r.data.secret); this.whForm = { name: '', url: '', eventTypes: '' }; this.loadWebhooks(); }
        else this.error.set(r.message);
      },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  toggleWebhook(w: WebhookItem): void {
    this.busyId.set(w.id);
    this.service.toggleWebhook(w.id, !w.enabled).subscribe({
      next: () => { this.busyId.set(null); this.loadWebhooks(); },
      error: () => this.busyId.set(null)
    });
  }

  deleteWebhook(w: WebhookItem): void {
    this.busyId.set(w.id);
    this.service.deleteWebhook(w.id).subscribe({
      next: () => { this.busyId.set(null); if (this.selectedWebhook() === w.id) this.selectedWebhook.set(null); this.loadWebhooks(); },
      error: () => this.busyId.set(null)
    });
  }

  showDeliveries(w: WebhookItem): void {
    this.selectedWebhook.set(w.id);
    this.service.deliveries(w.id).subscribe({ next: r => { if (r.success) this.deliveries.set(r.data ?? []); } });
  }

  createApiKey(): void {
    if (!this.keyForm.name) return;
    this.busyId.set(-1);
    this.service.createApiKey({ ...this.keyForm }).subscribe({
      next: r => {
        this.busyId.set(null);
        if (r.success) { this.secretOnce.set('API key: ' + r.data.rawKey); this.keyForm = { name: '', scopes: '' }; this.loadApiKeys(); }
        else this.error.set(r.message);
      },
      error: e => { this.busyId.set(null); this.error.set(e?.error?.message ?? 'Oluşturulamadı'); }
    });
  }

  revokeApiKey(k: ApiKeyItem): void {
    this.busyId.set(k.id);
    this.service.revokeApiKey(k.id).subscribe({
      next: () => { this.busyId.set(null); this.loadApiKeys(); },
      error: () => this.busyId.set(null)
    });
  }
}
