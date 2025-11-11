import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';
import { KPI } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-collection-widget',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Accounts Receivable</p>
          <h2 class="text-lg font-semibold">Collection Efficiency</h2>
        </div>
        <span class="text-xs text-muted-foreground">
          {{ statusLabel }}
        </span>
      </div>

      <div class="mt-4 flex flex-wrap gap-2 text-xs">
        <span class="rounded-full border px-3 py-1 font-medium" [ngClass]="statusClass">
          {{ statusDisplay | titlecase }}
        </span>
        @if (statusReason) {
          <span class="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {{ statusReason }}
          </span>
        }
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        @for (kpi of kpis; track kpi.label) {
          <div class="rounded-xl border border-border/70 p-3">
            <p class="text-xs text-muted-foreground">{{ kpi.label }}</p>
            <p class="text-xl font-semibold">{{ kpi.value }}</p>
            @if (kpi.change !== undefined) {
              <p
                class="mt-1 text-xs"
                [class.text-emerald-600]="kpi.trend === 'up'"
                [class.text-red-600]="kpi.trend === 'down'"
              >
                <lucide-icon
                  [name]="kpi.trend === 'down' ? 'ArrowDown' : 'ArrowUp'"
                  class="mr-1 inline h-3 w-3"
                />
                {{ kpi.change }}%
              </p>
            }
          </div>
        }
      </div>

      @if (error) {
        <p class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ error }}
        </p>
      }
    </div>
  `,
})
export class OverviewCollectionWidgetComponent {
  @Input() statusLabel = '';
  @Input() statusDisplay = '';
  @Input() statusClass = '';
  @Input() statusReason: string | undefined;
  @Input() kpis: KPI[] = [];
  @Input() error: string | null = null;
}
