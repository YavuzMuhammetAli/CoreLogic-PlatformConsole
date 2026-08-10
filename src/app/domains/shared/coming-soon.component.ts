import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

/** Henüz uygulanmamış domain'ler için yer tutucu. Başlık route data.titleKey'den. */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="stack page">
      <header>
        <span class="eyebrow">{{ titleKey | t }}</span>
        <h1>{{ titleKey | t }}</h1>
      </header>
      <div class="panel">
        <div class="empty-state stack" style="gap: var(--space-2)">
          <strong>{{ 'pc.comingSoon' | t }}</strong>
          <span>{{ 'pc.comingSoonDesc' | t }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: var(--text-2xl); }
  `]
})
export class ComingSoonComponent {
  private readonly route = inject(ActivatedRoute);
  readonly titleKey: string = this.route.snapshot.data['titleKey'] ?? 'pc.comingSoon';
}
