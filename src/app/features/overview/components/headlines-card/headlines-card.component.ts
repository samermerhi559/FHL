import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideIconsModule } from '../../../../shared/lucide-icons.module';
import { HeadlineEntry, HeadlinesResponse } from '../../../../core/models/dashboard.models';

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
          @if (headlines?.filters?.asof_month) {
            <p class="text-xs text-muted-foreground">
              As of {{ headlines?.filters?.asof_month | date: 'MMMM yyyy' }}
            </p>
          }
        </div>
        <lucide-icon name="Bell" class="h-5 w-5 text-primary" />
      </div>
      @if (loading) {
        <p class="mt-4 text-sm text-muted-foreground">Loading...</p>
      } @else {
        <ul class="mt-4 space-y-3 text-sm">
          @for (headline of headlineItems(); track headline.code) {
            <li class="rounded-lg border border-dashed border-border px-3 py-2">
              <div class="flex items-start gap-3">
                <span
                  class="mt-0.5 inline-flex rounded-full px-2 text-xs font-medium capitalize"
                  [class.bg-emerald-50]="headline.level === 'success'"
                  [class.text-emerald-700]="headline.level === 'success'"
                  [class.bg-amber-50]="headline.level === 'warning'"
                  [class.text-amber-700]="headline.level === 'warning'"
                  [class.bg-blue-50]="headline.level === 'info'"
                  [class.text-blue-700]="headline.level === 'info'"
                  [class.bg-red-50]="headline.level === 'critical'"
                  [class.text-red-700]="headline.level === 'critical'"
                >
                  {{ headline.level || 'info' }}
                </span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {{ headline.code }}
                  </p>
                  <p class="font-semibold">
                    {{ headline.message }}
                  </p>
                </div>
              </div>
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

  headlineItems(): HeadlineEntry[] {
    return this.headlines?.headlines ?? [];
  }
}
