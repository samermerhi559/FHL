import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-overview-alerts-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Open Alerts</p>
          <h2 class="text-lg font-semibold">
            {{ unreadCount }} awaiting review
          </h2>
        </div>
        <button
          type="button"
          class="rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:bg-muted"
          (click)="navigate.emit('alerts')"
        >
          View all
        </button>
      </div>
      <ul class="mt-4 space-y-3 text-sm">
        @for (alert of alerts; track alert.id) {
          <li
            class="cursor-pointer rounded-lg border border-border/60 p-3 hover:border-border"
            (click)="navigate.emit(alert.section)"
          >
            <div class="flex items-center justify-between">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                [class.bg-red-50]="alert.severity === 'high'"
                [class.text-red-600]="alert.severity === 'high'"
                [class.bg-amber-50]="alert.severity === 'medium'"
                [class.text-amber-600]="alert.severity === 'medium'"
                [class.bg-blue-50]="alert.severity === 'low'"
                [class.text-blue-600]="alert.severity === 'low'"
              >
                {{ alert.severity | titlecase }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ alert.timestamp | date: 'shortTime' }}
              </span>
            </div>
            <p class="mt-2 font-medium">{{ alert.title }}</p>
            <p class="text-xs text-muted-foreground">
              {{ alert.description }}
            </p>
          </li>
        }
      </ul>
    </div>
  `,
})
export class OverviewAlertsCardComponent {
  @Input() alerts: Alert[] = [];
  @Input() unreadCount = 0;
  @Output() navigate = new EventEmitter<string>();
}
