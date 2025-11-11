import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CashOutlookSummary,
  CashOutlookWeek,
} from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-projection-card',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
  template: `
    <div class="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm text-muted-foreground">Cash Projection</p>
          <h2 class="text-lg font-semibold">{{ title }}</h2>
        </div>
        <div class="flex items-center gap-3 text-xs text-muted-foreground">
          <span>As of {{ asOf | date: 'mediumDate' }}</span>
          <button
            type="button"
            class="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:bg-muted"
            (click)="expandToggle.emit()"
          >
            {{ expanded ? 'Collapse' : 'Expand' }}
          </button>
        </div>
      </div>
      @if (loading) {
        <p class="mt-4 text-sm text-muted-foreground">Loading...</p>
      } @else {
        <div
          class="mt-4 flex-1 space-y-2 overflow-y-auto text-sm"
          [ngClass]="expanded ? 'max-h-none' : 'max-h-[26rem]'"
        >
          @for (week of weeks; track week.label) {
            <div
              class="flex items-center justify-between rounded border border-dashed border-border px-3 py-2"
            >
              <div>
                <p class="font-medium">{{ week.label }}</p>
                <p class="text-xs text-muted-foreground">
                  Ends {{ week.week_end | date: 'mediumDate' }}
                </p>
              </div>
              <div class="text-right">
                <p
                  class="font-semibold"
                  [ngClass]="{
                    'text-red-600': week.value <= 0
                  }"
                >
                  {{ formatValue(week.value) }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ week.kind === 'actual' ? 'Actual' : 'Projected' }}
                </p>
              </div>
            </div>
          }
        </div>
        @if (summary.length) {
          <div
            class="mt-4 rounded-lg p-3 text-xs"
            [ngClass]="
              summary[0].will_breach_zero
                ? 'bg-amber-50 text-amber-800'
                : 'bg-muted text-muted-foreground'
            "
          >
            <p>
              Min balance (13w):
              <span class="font-semibold">{{
                formatValue(summary[0].min_balance_13w)
              }}</span>
            </p>
            <p class="mt-1">
              Breach zero:
              <span class="font-semibold">
                {{ summary[0].will_breach_zero ? 'Yes' : 'No' }}
              </span>
            </p>
          </div>
        }
        @if (error) {
          <p class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {{ error }}
          </p>
        }
      }
    </div>
  `,
})
export class OverviewProjectionCardComponent {
  @Input() weeks: CashOutlookWeek[] = [];
  @Input() summary: CashOutlookSummary[] = [];
  @Input() title = '13-Week Outlook';
  @Input() asOf = '';
  @Input() currency = 'USD';
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() expanded = false;
  @Output() expandToggle = new EventEmitter<void>();

  formatValue(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '--';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency || 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
