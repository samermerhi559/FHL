import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import {
  CashOutlookSummary,
  CashOutlookWeek,
} from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-projection-graph',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Cash Projection</p>
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          @if (asOf) {
            <p class="text-xs text-muted-foreground">
              As of {{ asOf | date: 'mediumDate' }}
            </p>
          }
        </div>
        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <div class="flex items-center gap-1">
            <span class="h-2 w-6 rounded bg-emerald-500"></span> Actual
          </div>
          <div class="flex items-center gap-1">
            <span class="h-2 w-6 rounded bg-primary"></span> Projected
          </div>
        </div>
      </div>

      @if (loading) {
        <p class="mt-4 text-sm text-muted-foreground">Loading...</p>
      } @else {
        <div class="mt-4 h-72 rounded-lg border border-dashed border-border/70 bg-gradient-to-b from-background via-background to-muted/50">
          <div
            echarts
            class="h-full w-full"
            [options]="chartOptions"
          ></div>
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
              <span class="font-semibold">
                {{ formatValue(summary[0].min_balance_13w) }}
              </span>
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
export class OverviewProjectionGraphComponent {
  @Input() weeks: CashOutlookWeek[] = [];
  @Input() summary: CashOutlookSummary[] = [];
  @Input() title = '13-Week Outlook';
  @Input() asOf = '';
  @Input() currency = 'USD';
  @Input() loading = false;
  @Input() error: string | null = null;

  get chartOptions(): EChartsOption {
    const labels = this.weeks?.map((week) => week.label) ?? [];
    const actualSeries = this.weeks
      ?.map((week) => (week.kind === 'actual' ? week.value : null)) ?? [];
    const projectedSeries = this.weeks
      ?.map((week) => (week.kind === 'projected' ? week.value : null)) ?? [];

    return {
      grid: {
        left: 40,
        right: 20,
        top: 20,
        bottom: 40,
      },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value) => this.formatValue(value as number),
      },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'var(--muted-foreground)' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => this.formatValue(value),
        },
        axisLine: { lineStyle: { color: 'var(--muted-foreground)' } },
        splitLine: { lineStyle: { color: 'var(--border)' } },
      },
      series: [
        {
          name: 'Actual',
          type: 'line',
          smooth: true,
          data: actualSeries,
          connectNulls: false,
          showSymbol: false,
          lineStyle: { color: 'rgb(16,185,129)', width: 3 },
          areaStyle: {
            color: 'rgba(16,185,129,0.15)',
          },
        },
        {
          name: 'Projected',
          type: 'line',
          smooth: true,
          data: projectedSeries,
          showSymbol: false,
          lineStyle: { color: 'rgb(59,130,246)', width: 3, type: 'dashed' },
        },
      ],
    };
  }

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
