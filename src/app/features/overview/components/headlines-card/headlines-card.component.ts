import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';
import { HeadlineSignal, HeadlinesResponse } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-headlines-card',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Signals</p>
          <h2 class="text-lg font-semibold">
            {{ headlines?.title ?? 'Headlines' }}
          </h2>
          @if (headlines?.asof_month) {
            <p class="text-xs text-muted-foreground">
              As of {{ headlines?.asof_month | date: 'MMMM yyyy' }}
            </p>
          }
        </div>
        <lucide-icon name="Bell" class="h-5 w-5 text-primary" />
      </div>
      @if (loading) {
        <p class="mt-4 text-sm text-muted-foreground">Loading...</p>
      } @else {
        <ul class="mt-4 space-y-3 text-sm">
          @for (headline of visibleHeadlines(); track headline.label) {
            <li
              class="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2"
            >
              <div>
                <p class="text-muted-foreground">{{ headline.label }}</p>
                <p class="font-semibold">
                  {{ headline.metric }} • {{ headline.value }}
                </p>
              </div>
              <lucide-icon
                [name]="headline.direction === 'down' ? 'ArrowDown' : 'ArrowUp'"
                class="h-4 w-4"
                [class.text-emerald-500]="headline.direction === 'up'"
                [class.text-red-500]="headline.direction === 'down'"
              />
            </li>
          } @empty {
            <li
              class="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground"
            >
              No headline signals available.
            </li>
          }
        </ul>
        @if (error) {
          <p class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {{ error }}
          </p>
        }
      }
    </div>
  `,
})
export class OverviewHeadlinesCardComponent {
  @Input() headlines: HeadlinesResponse | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;

  visibleHeadlines() {
    if (!this.headlines) {
      return [];
    }
    const entries: Array<{
      label: string;
      metric: string;
      value: string;
      direction: 'up' | 'down';
    }> = [];
    const mom = this.normalizeSignal(this.headlines.biggest_mom);
    if (mom) {
      entries.push({
        label: 'Biggest MoM Change',
        metric: mom.metric,
        value: this.formatPercent(mom.pct),
        direction: mom.direction,
      });
    }
    const yoy = this.normalizeSignal(this.headlines.biggest_yoy);
    if (yoy) {
      entries.push({
        label: 'Biggest YoY Change',
        metric: yoy.metric,
        value: this.formatPercent(yoy.pct),
        direction: yoy.direction,
      });
    }
    return entries;
  }

  private normalizeSignal(
    signal?: HeadlineSignal | null
  ): { metric: string; pct: number; direction: 'up' | 'down' } | null {
    if (!signal || signal.pct === null || !signal.direction) {
      return null;
    }
    return {
      metric: signal.metric ?? signal.code ?? 'Metric',
      pct: signal.pct,
      direction: signal.direction,
    };
  }

  private formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }
}
