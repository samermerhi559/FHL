import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';

interface Headline {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'flat';
}

@Component({
  selector: 'app-overview-headlines-card',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Signals</p>
          <h2 class="text-lg font-semibold">Headlines</h2>
        </div>
        <lucide-icon name="Bell" class="h-5 w-5 text-primary" />
      </div>
      <ul class="mt-4 space-y-3 text-sm">
        @for (headline of headlines; track headline.label) {
          <li
            class="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2"
          >
            <div>
              <p class="text-muted-foreground">{{ headline.label }}</p>
              <p class="font-semibold">{{ headline.value }}</p>
            </div>
            <lucide-icon
              [name]="headline.trend === 'down' ? 'ArrowDown' : 'ArrowUp'"
              class="h-4 w-4"
              [class.text-emerald-500]="headline.trend === 'up'"
              [class.text-red-500]="headline.trend === 'down'"
            />
          </li>
        }
      </ul>
    </div>
  `,
})
export class OverviewHeadlinesCardComponent {
  @Input() headlines: Headline[] = [];
}
